import CartList from "@/app/(app)/cart/cart-list";

export default function Cart() {


    return (
        <main className="mb-5 px-6 py-5">
            <h1 className="text-3xl font-bold">Корзина</h1>

            <CartList/>

        </main>
    )
}