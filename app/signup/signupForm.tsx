'use client';

import { useState } from "react";
import type { SignupFormData } from "../../shared/types/auth.ts"

type SignupFormProps = {
    onSuccess : () => void
}

const SignupForm = ({ onSuccess } : SignupFormProps) => {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [signupValues, setsignupValues] = useState<SignupFormData>({
        username: '',
        password: '',
        passwordConfirm: '',
        nickname: '',
        birthday: '',
        gender: undefined,
    })
    return (
        <form className="space-y-4">
            <div>
                <label>아이디</label>
                <input type="text" value={signupValues.username} onChange={(e) => 
                    setsignupValues(prev => ({
                        ...prev, username : e.target.value,
                    }))
                }
                />
            </div>

            <div>
                <label>비밀번호</label>
                <input type="password" value={signupValues.password} onChange={(e) => 
                    setsignupValues(prev => ({
                        ...prev, password : e.target.value,
                    }))
                }
                />
            </div>

            <div>
                <label>비밀번호 확인</label>
                <input type="password" value={signupValues.passwordConfirm} onChange={(e) => 
                    setsignupValues(prev => ({
                        ...prev, passwordConfirm : e.target.value,
                    }))
                }
                />
            </div>

            <button type="button" onClick={() => {
                if(signupValues.password !== signupValues.passwordConfirm) {
                    setErrorMsg('패스워드가 일치하지 않습니다');
                    return;
                }
                onSuccess();
            }}>
                회원가입 
            </button>
        </form>
    )
}

export default  SignupForm;