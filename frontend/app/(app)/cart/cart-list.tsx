"use client";

import useSWR from "swr";
import axios from "@/lib/axios";
import {CartItem as CartData} from "@/index";
import {CartItem} from "@/app/(app)/cart/cart-item";
import {useAuth} from "@/lib/hooks/auth";
import {toast, Toaster} from "sonner";
import {useRouter} from "next/navigation";

export default function CartList() {
    const fetcher = (url: string) => axios.get(url).then(res => res.data);
    const {data: cartItems, mutate} = useSWR<CartData[]>('/api/cart', fetcher);
    const {user} = useAuth();
    const router = useRouter();

    async function sendOrder(form: FormData) {
        const email = form.get("email") as string;
        const phone = form.get("phone") as string;
        const address = form.get("address") as string;

        if (!email || !phone || !address) {
            return;
        }

        const order = {
            cartItems: cartItems?.map((item) => (item.id)),
            email: email,
            phone: phone,
            address: address,
        }
        await axios.post('/api/orders', order).then(
            () => {
                toast.success("Заказ оформлен",
                    {
                        description: "Спасибо за покупку!"
                    });
                router.push('/');
            }
        );
    }

    return <div className="flex pt-8 flex-wrap-reverse justify-between">
        {cartItems && cartItems.length ? <>
            <div className="flex flex-col justify-between gap-4">
                {cartItems?.map((cart, index) => <CartItem key={cart.id} cartItem={cart} deleteFn={async () => {
                    await mutate();
                }}/>)}
            </div>
            <aside className="pt-8 px-8 flex flex-col items-start sm:items-end">
                <h2 className="text-2xl font-bold">Итого</h2>
                <p className="text-base pt-3">{cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0).toString().split("").reverse().join("").replace(/([0-9]{3})/g, "$1 ").split("").reverse().join("").replace(".", ",")}р</p>
                <button className="btn btn-primary mt-6"
                        onClick={() => (document.getElementById('modal') as HTMLDialogElement).showModal()}>Оформить
                    заказ
                </button>
                <dialog id="modal" className="modal">
                    <div className="modal-box modal-bottom sm:modal-middle">
                        <form method="dialog">
                            <button
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕
                            </button>
                        </form>
                        <h3 className="font-bold text-lg">Оформление заказа</h3>
                        <form className="py-4" action={sendOrder}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input name="email" defaultValue={user?.email} type="email" placeholder="Введите email"
                                       className="input input-bordered" required/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Телефон</span>
                                </label>
                                <input name="phone"
                                       onChange={(e) => e.target.value = e.target.value.replace(/[^0-9+]/g, "")}
                                       type="tel"
                                       autoComplete="tel" placeholder="Введите телефон"
                                       className="input input-bordered" required defaultValue={user?.phone}/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Адрес</span>
                                </label>
                                <input name="address" type="text" defaultValue={user?.address}
                                       placeholder="Введите адрес"
                                       className="input input-bordered" required/>
                            </div>
                            <div className="form-control mt-8">
                                <button className="btn btn-primary">Оформить</button>
                            </div>
                        </form>
                    </div>
                </dialog>


            </aside>
        </>: <p className="text-info font-bold">Корзина пуста</p>}
    </div>

}