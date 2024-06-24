"use client";

import {useAuth} from "@/lib/hooks/auth";
import Link from "next/link";
import {useEffect, useState} from "react";
import useSWR, {preload} from "swr";
import axios from "@/lib/axios";
import {CartItem} from "@/index";
import {useRouter} from "next/navigation";

const fetcher = (url: string) => axios.get(url, {refresh: true}).then(res => res.data);
export default function Header({hideRight}: { hideRight?: boolean } = {hideRight: false}) {
    const {user, logout} = useAuth();
    preload("/api/cart", fetcher);
    const { data, mutate } = useSWR<CartItem[]>('/api/cart', fetcher, {refreshInterval: 10});
    const router = useRouter();


    return <nav className="navbar sticky top-0 z-50 bg-black">
        <div className="flex-auto">
            <Link href="/" className="btn btn-ghost text-xl">E-Commerce</Link>
        </div>
        {!hideRight &&
            <div className="flex-none gap-2">
                <div className="form-control w-full">
                </div>{data?.length ?
                <div className="dropdown dropdown-end">

                    <div tabIndex={0} role="button" className="btn btn-ghost">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                             <span className="badge badge-sm indicator-item">{data?.length}</span>
                        </div>
                    </div>
                    <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
                        <div className="card-body">
                            <span className="font-bold text-lg">{data?.length} товара</span>
                            <span className="text-info">Стоимость: {
                                Array.isArray(data) && Math.floor(Number(data?.reduce((a, b) => a + b.price * b.quantity, 0) || 0))
                            }р</span>
                            <div className="card-actions">
                                <button className="btn btn-primary btn-block" onClick={() => router.push("/cart")}>Перейти в корзину</button>
                            </div>
                        </div>
                    </div>
                </div> : null}
                {user ? <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 bg-[#ccc] rounded-full"/>
                    </div>
                    <ul tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">


                        <li>
                            <button onClick={logout}>Выйти</button>
                        </li>
                    </ul>
                </div> : <Link href="/login" className="btn btn-ghost">Войти</Link>}
            </div>
        }
    </nav>
}