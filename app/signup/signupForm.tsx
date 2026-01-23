'use client';

import { useState, useRef, useEffect } from 'react';
import type { AxiosError } from 'axios';
import type { SignupRequest } from '@/shared/types/auth';
import { useSignupMutation } from '@/shared/queries/useSignupMutation';
import { checkUsernameAvailability } from '../../shared/api/users.api';

type SignupFormProps = {
  onSuccess: () => void;
};

type UsernameStatus = 'idle' | 'checking' | 'available' | 'unavailable';

const PASSWORD_RULES = {minLength: 8, regex: /^(?=.*[a-zA-Z])(?=.*\d).+$/};

const USERNAME_RULE = /^[a-zA-Z0-9]+$/;
const NICKNAME_RULE = /^[가-힣a-zA-Z0-9]{2,10}$/;


const DEFAULT_PROFILE_IMAGE = '/images/basic_profile_img.jpg';

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const { mutate, isPending } = useSignupMutation();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [signupValues, setSignupValues] = useState<SignupRequest>({
    username: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    birthday: '',
    gender: undefined,
  });

  const [profileImage, setProfileImage] = useState<File | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const [checkedUsername, setCheckedUsername] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [stepErrorMessage, setStepErrorMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const birthdayRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSuccessModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [showSuccessModal]);

  const inputClass = `
    w-full rounded-lg
    border border-text-secondary/25
    bg-surface
    px-3 py-2.5
    text-text-primary
    transition
    focus:outline-none
    focus:ring-1 focus:ring-primary/60
  `;

  const labelClass = 'mb-1 block text-sm text-text-secondary';

  const normalizedPassword = signupValues.password.trim();
  const normalizedPasswordConfirm = signupValues.passwordConfirm.trim();

  const isPasswordLengthValid = normalizedPassword.length >= PASSWORD_RULES.minLength;
  const isPasswordRegexValid = PASSWORD_RULES.regex.test(normalizedPassword);
  const isPasswordValid = isPasswordLengthValid && isPasswordRegexValid;
  const isPasswordMatch =
    normalizedPasswordConfirm && normalizedPassword === normalizedPasswordConfirm;

  const passwordStrength = (() => {
    let score = 0;
    if (normalizedPassword.length >= 8) score++;
    if (/[a-z]/i.test(normalizedPassword)) score++;
    if (/\d/.test(normalizedPassword)) score++;
    if (/[^a-zA-Z0-9]/.test(normalizedPassword)) score++;

    if (score <= 1) return { label: '약함', color: 'bg-red-400', width: 'w-1/4' };
    if (score === 2) return { label: '보통', color: 'bg-yellow-400', width: 'w-2/4' };
    if (score === 3) return { label: '강함', color: 'bg-primary-soft', width: 'w-3/4' };
    return { label: '매우 강함', color: 'bg-primary', width: 'w-full' };
  })();

  const isUsernameCheckedAndStillSame =
    usernameStatus === 'available' &&
    checkedUsername === signupValues.username.trim();

  const handleCheckUsername = async () => {
    const username = signupValues.username.trim();

    if (!USERNAME_RULE.test(username)) {
      setUsernameStatus('idle');
      setCheckedUsername('');
      setStepErrorMessage('아이디는 영문과 숫자만 사용할 수 있습니다');
      return;
    }

    try {
      setUsernameStatus('checking');
      await checkUsernameAvailability(username);

      setUsernameStatus('available');
      setCheckedUsername(username);
      setStepErrorMessage(null);
    } catch {
      setUsernameStatus('unavailable');
      setCheckedUsername('');
      setStepErrorMessage('이미 사용 중인 아이디입니다');
    }
  };

  const validateStep1 = () => {
    const errors: Record<string, string> = {};

    const username = signupValues.username.trim();
    const nickname = signupValues.nickname.trim();

    if (!username)
      errors.username = '아이디를 입력해주세요';
    else if (!USERNAME_RULE.test(username))
      errors.username = '아이디는 영문과 숫자만 사용할 수 있습니다';
    else if (!isUsernameCheckedAndStillSame)
      errors.username = '아이디 중복 확인을 해주세요';

    if (!nickname) {
      errors.nickname = '닉네임을 입력해주세요';
    } else if (!NICKNAME_RULE.test(nickname)) {
      errors.nickname = '닉네임은 2~10자, 한글/영문/숫자만 가능합니다';
    } else if (username.toLowerCase() === nickname.toLowerCase()) {
      errors.nickname = '아이디와 닉네임은 같을 수 없습니다';
    }

    setFieldErrors(errors);

    if (errors.username) usernameRef.current?.focus();
    else if (errors.nickname) nicknameRef.current?.focus();

    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors: Record<string, string> = {};

    if (!isPasswordValid)
      errors.password = '8자 이상, 영문+숫자를 포함해야 합니다';

    if (!isPasswordMatch)
      errors.passwordConfirm = '비밀번호가 일치하지 않습니다';

    setFieldErrors(errors);

    if (errors.password) passwordRef.current?.focus();
    else if (errors.passwordConfirm) passwordConfirmRef.current?.focus();

    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors: Record<string, string> = {};

    if (!signupValues.birthday)
      errors.birthday = '생년월일을 선택해주세요';

    if (!signupValues.gender)
      errors.gender = '성별을 선택해주세요';

    setFieldErrors(errors);

    if (errors.birthday) birthdayRef.current?.focus();

    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    let isValid = true;

    if (step === 1) {
      isValid = validateStep1();
      if (!isValid)
        setStepErrorMessage('아이디와 닉네임을 모두 올바르게 입력해주세요');
    }

    if (step === 2) {
      isValid = validateStep2();
      if (!isValid)
        setStepErrorMessage('비밀번호 정보를 올바르게 입력해주세요');
    }

    if (!isValid) return;

    setStepErrorMessage(null);
    setFieldErrors({});
    setStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const handlePrev = () => {
    setStepErrorMessage(null);
    setFieldErrors({});
    setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  const handleSubmit = () => {
    if (!validateStep3()) {
      setStepErrorMessage('필수 프로필 정보를 입력해주세요');
      return;
    }

    const trimmedUsername = signupValues.username.trim();
    const trimmedNickname = signupValues.nickname.trim();

    const formData = new FormData();

    formData.append('username', trimmedUsername);
    formData.append('password', normalizedPassword);
    formData.append('passwordConfirm', normalizedPasswordConfirm);
    formData.append('nickname', trimmedNickname);

    if (signupValues.birthday) formData.append('birthday', signupValues.birthday);
    if (signupValues.gender) formData.append('gender', signupValues.gender);

    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    mutate(formData, {
      onSuccess: () => setShowSuccessModal(true),
      onError: (error: AxiosError<{ message?: string }>) => {
        setStepErrorMessage(
          error.response?.data?.message ??
            '회원가입에 실패했습니다. 다시 시도해주세요.'
        );
      },
    });
  };

  return (
    <>
      <div className="mb-6 space-y-2">
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`h-2 w-2 rounded-full ${
                step >= n ? 'bg-primary' : 'bg-text-secondary/30'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-xs text-text-secondary">
          {step} / 3 단계
        </p>
      </div>

      {stepErrorMessage && (
        <div className="mb-4 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2">
          <p className="text-sm text-danger">{stepErrorMessage}</p>
        </div>
      )}


      <form
        className="space-y-6"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (step < 3) handleNext();
            else handleSubmit();
          }
        }}
      >
      
        {step === 1 && (
          <>
            <p className="text-sm text-text-secondary">
              사용할 아이디와 닉네임을 입력해주세요 (<span className="text-danger">*</span> 필수)
            </p>

            <div>
              <label className={labelClass}>
                아이디 <span className="text-danger">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  ref={usernameRef}
                  value={signupValues.username}
                  onChange={(e) => {
                    setSignupValues((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }));
                    setUsernameStatus('idle');
                    setCheckedUsername('');
                  }}
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  disabled={!signupValues.username || usernameStatus === 'checking'}
                  onClick={handleCheckUsername}
                  className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
                >
                  확인
                </button>
              </div>

              <p className="mt-1 text-xs text-text-secondary">
                영문과 숫자만 사용할 수 있습니다
              </p>

              {usernameStatus === 'available' && (
                <p className="mt-1 text-xs text-primary">사용 가능한 아이디입니다</p>
              )}
              {usernameStatus === 'unavailable' && (
                <p className="mt-1 text-xs text-danger">이미 사용 중인 아이디입니다</p>
              )}
              {fieldErrors.username && (
                <p className="mt-1 text-xs text-danger">{fieldErrors.username}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                닉네임 <span className="text-danger">*</span>
              </label>
              <input
                ref={nicknameRef}
                value={signupValues.nickname}
                onChange={(e) =>
                  setSignupValues((prev) => ({
                    ...prev,
                    nickname: e.target.value,
                  }))
                }
                className={inputClass}
              />
              {fieldErrors.nickname && (
                <p className="mt-1 text-xs text-danger">{fieldErrors.nickname}</p>
              )}
            </div>
          </>
        )}


        {step === 2 && (
          <>
            <p className="text-sm text-text-secondary">
              계정을 보호할 비밀번호를 설정해주세요 (<span className="text-danger">*</span> 필수)
            </p>

            <div>
              <label className={labelClass}>
                비밀번호 <span className="text-danger">*</span>
              </label>
              <input
                ref={passwordRef}
                type="password"
                value={signupValues.password}
                onChange={(e) =>
                  setSignupValues((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className={inputClass}
              />

              {normalizedPassword && (
                <div className="mt-2 space-y-1">
                  <div className="h-2 w-full rounded bg-text-secondary/20 overflow-hidden">
                    <div
                      className={`h-full transition-all ${passwordStrength.color} ${passwordStrength.width}`}
                    />
                  </div>
                  <p className="text-xs text-text-secondary">
                    비밀번호 강도:{' '}
                    <span className="font-medium">{passwordStrength.label}</span>
                  </p>
                </div>
              )}

              <ul className="mt-2 space-y-1 text-xs text-text-secondary">
                <li className={isPasswordLengthValid ? 'text-primary' : ''}>
                  8자 이상
                </li>
                <li className={isPasswordRegexValid ? 'text-primary' : ''}>
                  영문 + 숫자 포함
                </li>
              </ul>

              {fieldErrors.password && (
                <p className="mt-1 text-xs text-danger">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                비밀번호 확인 <span className="text-danger">*</span>
              </label>
              <input
                ref={passwordConfirmRef}
                type="password"
                value={signupValues.passwordConfirm}
                onChange={(e) =>
                  setSignupValues((prev) => ({
                    ...prev,
                    passwordConfirm: e.target.value,
                  }))
                }
                className={inputClass}
              />

              {!isPasswordMatch && signupValues.passwordConfirm && (
                <p className="mt-1 text-xs text-danger">
                  비밀번호가 일치하지 않습니다
                </p>
              )}
            </div>
          </>
        )}


        {step === 3 && (
          <>
            <p className="text-sm text-text-secondary">
              필수 프로필 정보를 입력해주세요 (<span className="text-danger">*</span> 필수 입력)
            </p>

            <div>
              <label className={labelClass}>
                생년월일 <span className="text-danger">*</span>
              </label>
              <input
                ref={birthdayRef}
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
              {fieldErrors.birthday && (
                <p className="mt-1 text-xs text-danger">{fieldErrors.birthday}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                성별 <span className="text-danger">*</span>
              </label>
              <div className="flex gap-4 text-sm">
                {(['male', 'female', 'other'] as const).map((value) => (
                  <label key={value} className="flex items-center gap-1">
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
                ))}
              </div>
              {fieldErrors.gender && (
                <p className="mt-1 text-xs text-danger">{fieldErrors.gender}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                프로필 이미지 <span className="text-text-secondary">(선택)</span>
              </label>
              <p className="mb-3 text-xs text-text-secondary">
                이미지를 선택하지 않으면 기본 프로필 이미지가 자동으로 제공됩니다.
              </p>

              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-text-secondary/20 flex items-center justify-center bg-text-secondary/5">
                  {previewImage ? (
                    <>
                      <img
                        src={previewImage}
                        className="w-full h-full object-cover"
                        alt="선택한 프로필 이미지"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setProfileImage(undefined);
                        }}
                        className="absolute top-1 right-1 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center text-sm hover:bg-black/80"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <img
                      src={DEFAULT_PROFILE_IMAGE}
                      className="w-full h-full object-cover opacity-90"
                      alt="기본 프로필 이미지"
                    />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <label
                    htmlFor="profileImageInput"
                    className="inline-block cursor-pointer rounded-lg border px-4 py-2 text-sm text-text-secondary hover:bg-text-secondary/10"
                  >
                    파일 선택
                  </label>
                  <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const file = e.target.files[0];
                        setProfileImage(file);
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                  />

                  <p className="text-xs text-text-secondary">
                    JPG, PNG 파일을 업로드할 수 있어요.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-text-secondary text-center">
              * 아이디, 닉네임, 생년월일, 성별은 필수 입력 항목입니다.
            </p>
          </>
        )}

     
        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="flex-1 rounded-lg border py-2.5 text-text-secondary hover:bg-text-secondary/5"
            >
              이전
            </button>
          )}

          {step < 3 && (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 rounded-lg bg-primary py-2.5 text-white"
            >
              다음
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleSubmit}
              className="flex-1 rounded-lg bg-primary py-2.5 text-white disabled:opacity-50"
            >
              {isPending ? '가입 중...' : '가입 완료'}
            </button>
          )}
        </div>
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface p-6 rounded-xl text-center space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold">가입을 축하드립니다</h2>
            <p className="text-sm text-text-secondary">
              이제 채팅과 친구 기능을 사용할 수 있어요.
            </p>
            <button
              className="bg-primary px-6 py-2.5 rounded-lg text-white"
              onClick={() => {
                setShowSuccessModal(false);
                onSuccess();
              }}
            >
              시작하기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
