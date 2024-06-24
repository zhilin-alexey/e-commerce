import {CartItem, Product} from "@/index";
import axios from "@/lib/axios";
import {useEffect, useState} from "react";

export function ProductCard({product}: { product: Product }) {

    const [addedCount, setAddedCount] = useState(product.quantity);

    async function addToCart() {
        setAddedCount(1);
        await axios.post("/api/cart", {
            productId: product.id,
            quantity: 1,
        });
    }

    async function changeQuantity(operation: Operation | null = null, value: number | null = null) {
        const count = value ?? (operation === Operation.ADD ? addedCount + 1 : addedCount - 1);
        if (count === 0) {
            await axios.delete("/api/cart", {
                data: {
                    productsId: [product.id],
                },
            });
            setAddedCount(0);
            return;
        }
        await axios.patch("/api/cart", {
            productsId: [product.id],
            quantity: count,
            // signal: abortController.signal
        }).then(() => {
            if (value !== null) {
                setAddedCount(value);
            } else {
                setAddedCount(count);
            }
        });
    }

    return <div className="card bg-base-100 w-96">
        <div className="card-body">
            <h2 className="card-title">
                <p>{product.price.toString().split("").reverse().join("").replace(/([0-9]{3})/g, "$1 ").split("").reverse().join("")}р</p>
            </h2>
            <p>{product.name}</p>
            <div className="card-actions justify pt-3">
                {addedCount < 1 ?
                    <button className="btn btn-primary" onClick={addToCart}>В корзину</button>
                    : <div className="join">
                        <button className="btn join-item" onClick={async () => await changeQuantity(Operation.SUB)}>-</button>
                        <input className="input input-bordered w-20 join-item text-center" value={addedCount}
                               onChange={(e) => {
                                   e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                   setAddedCount(Number(e.target.value));
                               }}
                               onBlur={(event) => changeQuantity(null, Number(event.target.value))}/>
                        <button className="btn join-item" onClick={async () => await changeQuantity(Operation.ADD)}>+</button>
                    </div>
                }
            </div>
        </div>
    </div>;
}

enum Operation {
    ADD = "add",
    SUB = "sub"
}