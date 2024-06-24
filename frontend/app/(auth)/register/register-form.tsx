"use client"

import React, {useState} from "react";
import {useAuth} from "@/lib/hooks/auth";
import {twMerge} from "tailwind-merge";

export default function RegisterForm() {
    const {register} = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/',
    })

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [errors, setErrors] = useState([])

    const submitForm = (event: { preventDefault: () => void; }) => {
        event.preventDefault()

        register({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            phone,
            address,
            // @ts-ignore
            setErrors,
        })
    }

    return (
        <div className="hero-content text-center flex-col">
            <form onSubmit={submitForm}>
                <h1 className="text-5xl font-bold pb-6">Регистрация</h1>
                <div className="space-y-2">
                    <input value={name} autoComplete="name"
                           onChange={event => setName(event.target.value)} type="text"
                           placeholder="Имя" required autoFocus
                           className={twMerge("input input-bordered flex items-center gap-2 bg-transparent grow w-full", (errors as any).name && 'input-error')}/>
                    {(errors as any).name && <div className="label">
                        <span className="label-text-alt text-error">{(errors as any).name}</span>
                    </div>}
                    <input value={email} autoComplete="email"
                           onChange={event => setEmail(event.target.value)} type="email"
                           placeholder="Email" required autoFocus
                           className={twMerge("input input-bordered flex items-center gap-2 bg-transparent grow w-full", (errors as any).email && 'input-error')}/>
                    {(errors as any).email && <div className="label">
                        <span className="label-text-alt text-error">{(errors as any).email}</span>
                    </div>}
                    <input value={password} autoComplete="new-password"
                           onChange={event => setPassword(event.target.value)} type="password"
                           placeholder="Пароль"
                           className={twMerge("input input-bordered flex items-center gap-2 bg-transparent grow w-full", (errors as any).password && 'input-error')}/>
                    {(errors as any).password && <div className="label">
                        <a className="label-text-alt text-error">{(errors as any).password}</a>
                    </div>}
                    <input value={passwordConfirmation} autoComplete="new-password"
                           onChange={event => setPasswordConfirmation(event.target.value)} type="password"
                           placeholder="Повторите пароль"
                           className={twMerge("input input-bordered flex items-center gap-2 bg-transparent grow w-full", (errors as any).password_confirmation && 'input-error')}/>
                    {(errors as any).password_confirmation && <div className="label">
                        <a className="label-text-alt text-error">{(errors as any).password_confirmation}</a>
                    </div>}
                    <input value={phone} autoComplete="tel"
                           onChange={event => setPhone(event.target.value)} type="tel"
                           placeholder="Телефон"
                           className={twMerge("input input-bordered flex items-center gap-2 bg-transparent grow w-full", (errors as any).phone && 'input-error')}/>
                    {(errors as any).phone && <div className="label">
                        <a className="label-text-alt text-error">{(errors as any).phone}</a>
                    </div>}
                    <input value={address} autoComplete="address-level1"
                           onChange={event => setAddress(event.target.value)} type="text"
                           placeholder="Адрес"
                           className={twMerge("input input-bordered flex items-center gap-2 bg-transparent grow w-full", (errors as any).address && 'input-error')}/>
                    {(errors as any).address && <div className="label">
                        <a className="label-text-alt text-error">{(errors as any).address}</a>
                    </div>}
                </div>
                <div className="w-full">
                    <button type="submit" className="btn btn-primary w-full mt-6">Зарегистрироваться</button>
                </div>
            </form>
        </div>
    )
}