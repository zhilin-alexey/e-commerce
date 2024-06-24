"use client";

import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from "next/navigation";
import {useAuth} from "@/lib/hooks/auth";
import {twMerge} from "tailwind-merge";
import Link from "next/link";

export default function LoginForm() {
    const router = useRouter();

    const {login} = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/',
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)


    useEffect(() => {
        // @ts-ignore
        if (router.reset?.length > 0 && errors.length === 0) {
            // @ts-ignore
            setStatus(atob(router.reset))
        } else {
            setStatus(null)
        }
        // @ts-ignore
    }, [router.reset, errors.length])

    const submitForm = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()

        await login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }

    const emailField = useRef(null)
    const passwordField = useRef(null)


    useEffect(() => {
        let interval = setInterval(() => {
            if (emailField.current) {
                setEmail((emailField.current as HTMLInputElement).value)
                //do the same for all autofilled fields
                clearInterval(interval)
            }
            if (passwordField.current) {
                setPassword((passwordField.current as HTMLInputElement).value)
                //do the same for all autofilled fields
                clearInterval(interval)
            }
        }, 100)
    })

    return (
        <div className="hero-content max-w-lg flex-col">
            <form onSubmit={submitForm}
                  className="flex-col content-center justify-self-center justify-center text-center space-y-4">
                <h1 className="text-5xl font-bold pb-3">Вход</h1>
                <p>{status}</p>
                <div className="space-y-2">
                    <input value={email} autoComplete="email" ref={emailField}
                           onChange={event => setEmail(event.target.value)} type="email"
                           placeholder="Email" required autoFocus
                           className={twMerge("input input-bordered flex items-center gap-2 bg-transparent grow w-full", (errors as any).email && 'input-error')}/>
                    {(errors as any).email && <div className="label">
                        <span className="label-text-alt text-error">{(errors as any).email}</span>
                    </div>}
                    <input value={password} autoComplete="current-password" ref={passwordField}
                           onChange={event => setPassword(event.target.value)} type="password"
                           placeholder="Пароль"
                           className={twMerge("input input-bordered flex items-center gap-2 bg-transparent grow w-full", (errors as any).password && 'input-error')}/>
                    {(errors as any).password && <div className="label">
                        <a className="label-text-alt text-error">{(errors as any).password}</a>
                    </div>}
                </div>
                <div className="form-control w-full">
                    <label className="label cursor-pointer">
                        <span className="label-text">Запомнить меня</span>
                        <input onChange={event => setShouldRemember(event.target.checked)} type="checkbox"
                               className="toggle"/>
                    </label>
                </div>
                <button type="submit" className="btn btn-primary w-full">
                    Войти
                </button>
            </form>

            <p className="flex gap-2 text-sm items-center text-center">
                <p>Нет аккаунта?</p>
                <Link href="/register" className="btn btn-ghost btn-sm px-1">Зарегистрироваться</Link>
            </p>
        </div>
    );
}
