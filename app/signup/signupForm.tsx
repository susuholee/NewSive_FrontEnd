'use client';

import { useState } from 'react';
import type { AxiosError } from 'axios';
import type { SignupFormData } from '@/shared/types/auth';
import { useSignupMutation } from '@/shared/queries/useSignupMutation';
import { checkUsernameAvailability } from '../../shared/api/users.api';

type SignupFormProps = {
  onSuccess: () => void;
};

type UsernameStatus = 'idle' | 'checking' | 'available' | 'unavailable';

const PASSWORD_RULES = {
  minLength: 8,
  regex: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
};

const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] =
    useState<UsernameStatus>('idle');
  const { mutate, isPending } = useSignupMutation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [signupValues, setSignupValues] = useState<SignupFormData>({
    username: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    birthday: '',
    gender: undefined,
  });

  const inputClass =
    'w-full border border-gray-300 rounded-md px-3 py-2 ' +
    'focus:outline-none focus:ring-2 focus:ring-black';

  const normalizedPassword = signupValues.password.trim();
  const normalizedPasswordConfirm = signupValues.passwordConfirm.trim();

  const isPasswordLengthValid = normalizedPassword.length >= PASSWORD_RULES.minLength;

  const isPasswordRegexValid = PASSWORD_RULES.regex.test(normalizedPassword);

  const isPasswordValid = isPasswordLengthValid && isPasswordRegexValid;

  return (
    <>
      <form className="w-full max-w-sm space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">아이디</label>

          <div className="flex gap-2">
            <input
              type="text"
              value={signupValues.username}
              onChange={(e) => {
                setSignupValues((prev) => ({
                  ...prev,
                  username: e.target.value,
                }));
                setUsernameStatus('idle');
              }}
              className={`${inputClass} flex-1`}
            />

            <button
              type="button"
              className="px-3 py-2 text-sm rounded-md border"
              disabled={
                !signupValues.username ||
                usernameStatus === 'checking'
              }
              onClick={async () => {
                try {
                  setUsernameStatus('checking');
                  await checkUsernameAvailability(
                    signupValues.username
                  );
                  setUsernameStatus('available');
                } catch {
                  setUsernameStatus('unavailable');
                }
              }}
            >
              확인
            </button>
          </div>

          {usernameStatus === 'checking' && (
            <p className="text-xs text-gray-500">확인 중...</p>
          )}
          {usernameStatus === 'available' && (
            <p className="text-xs text-green-600">
              사용 가능한 아이디입니다
            </p>
          )}
          {usernameStatus === 'unavailable' && (
            <p className="text-xs text-red-500">
              이미 사용 중인 아이디입니다
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">비밀번호</label>
          <input
            type="password"
            value={signupValues.password}
            onChange={(e) => {
              setSignupValues((prev) => ({
                ...prev,
                password: e.target.value,
              }));
              setErrorMsg(null);
            }}
            className={inputClass}
          />

          <ul className="text-xs space-y-1">
            <li
              className={
                isPasswordLengthValid
                  ? 'text-green-600'
                  : 'text-gray-400'
              }
            >
              8자 이상
            </li>
            <li
              className={
                isPasswordRegexValid
                  ? 'text-green-600'
                  : 'text-gray-400'
              }
            >
              영문 + 숫자 포함
            </li>
          </ul>
        </div>

        {/* 비밀번호 확인 */}
        <div className="space-y-1">
          <label className="text-sm font-medium">
            비밀번호 확인
          </label>
          <input
            type="password"
            value={signupValues.passwordConfirm}
            onChange={(e) => {
              setSignupValues((prev) => ({
                ...prev,
                passwordConfirm: e.target.value,
              }));
              setErrorMsg(null);
            }}
            className={inputClass}
          />

          {signupValues.passwordConfirm &&
            normalizedPassword !==
              normalizedPasswordConfirm && (
              <p className="text-xs text-red-500">
                비밀번호가 일치하지 않습니다
              </p>
            )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">닉네임</label>
          <input
            type="text"
            value={signupValues.nickname}
            onChange={(e) =>
              setSignupValues((prev) => ({
                ...prev,
                nickname: e.target.value,
              }))
            }
            className={inputClass}
          />
        </div>

      
        <div className="space-y-1">
          <label className="text-sm font-medium">생년월일</label>
          <input
            type="date"
            value={signupValues.birthday}
            onChange={(e) =>
              setSignupValues((prev) => ({
                ...prev,
                birthday: e.target.value,
              }))
            }
            className={inputClass}
          />
        </div>

        
        <div className="space-y-2">
          <label className="text-sm font-medium">성별</label>
          <div className="flex gap-4">
            {(['male', 'female', 'other'] as const).map(
              (value) => (
                <label
                  key={value}
                  className="flex items-center gap-1 text-sm"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={value}
                    checked={signupValues.gender === value}
                    onChange={() =>
                      setSignupValues((prev) => ({
                        ...prev,
                        gender: value,
                      }))
                    }
                  />
                  {value === 'male'
                    ? '남성'
                    : value === 'female'
                    ? '여성'
                    : '기타'}
                </label>
              )
            )}
          </div>
        </div>

        {errorMsg && (
          <p className="text-sm text-red-500">{errorMsg}</p>
        )}

      
        <button
          type="button"
          disabled={isPending}
          className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50"
          onClick={() => {
            if (usernameStatus !== 'available') {
              setErrorMsg(
                '아이디 중복 확인을 완료해주세요'
              );
              return;
            }

            if (!isPasswordValid) {
              setErrorMsg(
                '비밀번호 규칙을 만족해주세요'
              );
              return;
            }

            if (
              normalizedPassword !==
              normalizedPasswordConfirm
            ) {
              setErrorMsg(
                '비밀번호가 일치하지 않습니다'
              );
              return;
            }

            if (
              !signupValues.gender ||
              !signupValues.birthday
            ) {
              setErrorMsg(
                '생년월일과 성별을 입력해주세요'
              );
              return;
            }

            setErrorMsg(null);

            mutate(
              {
                username: signupValues.username,
                password: normalizedPassword,
                passwordConfirm: normalizedPasswordConfirm,
                nickname: signupValues.nickname,
                birthday: signupValues.birthday!,
                gender: signupValues.gender!,
              },
              {
                onSuccess: () => {
                  setShowSuccessModal(true);
                },
                onError: (
                  error: AxiosError<{ message?: string }>
                ) => {
                  setErrorMsg(
                    error.response?.data?.message ??
                      '회원가입에 실패했습니다'
                  );
                },
              }
            );
          }}
        >
          {isPending ? '가입 중...' : '가입하기'}
        </button>
      </form>

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded-lg bg-white p-6 text-center space-y-4">
            <h2 className="text-lg font-semibold">
              New Sive 가입을 축하드립니다 !!
            </h2>
            <p className="text-sm text-gray-600">
              회원가입이 완료되었습니다.
            </p>

            <button
              className="w-full rounded-md bg-black py-2 text-white"
              onClick={() => {
                setShowSuccessModal(false);
                onSuccess();
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupForm;
