import {CartItem as CartData} from "@/index";
import axios from "@/lib/axios";
import {useState} from "react";

export function CartItem({cartItem, deleteFn}: { cartItem: CartData, deleteFn: () => Promise<void> }) {

    const [addedCount, setAddedCount] = useState(cartItem.quantity);

    async function changeQuantity(operation: Operation | null = null, value: number | null = null) {
        const count = value ?? (operation === Operation.ADD ? addedCount + 1 : addedCount - 1);
        if (count <= 0) {
            await axios.delete("/api/cart", {
                data: {
                    productsId: [cartItem.product_id],
                },
            })
                .then(setAddedCount(0));
            await deleteFn();

            return;
        }
        await axios.patch("/api/cart", {
            productsId: [cartItem.product_id], quantity: count,
        }).then(() => {
            if (value === null) {
                setAddedCount(value);
            } else {
                setAddedCount(count);
            }
        }
        );
    }

    return <div className="card bg-base-100 w-96">
        <div className="card-body">
            <h2 className="card-title">
                {cartItem.product_name}
            </h2>
            <p>{cartItem.price.toString().split("").reverse().join("").replace(/([0-9]{3})/g, "$1 ").split("").reverse().join("")}р</p>
            <div className="card-actions">

                <div className="join pt-2">
                    <button className="btn join-item" onClick={async () => await changeQuantity(Operation.SUB)}>-
                    </button>
                    <input className="input input-bordered w-20 join-item text-center" value={addedCount}
                           onChange={(e) => {
                               e.target.value = e.target.value.replace(/[^0-9]/g, "");
                               setAddedCount(Number(e.target.value));
                           }}
                           onBlur={(event) => changeQuantity(null, Number(event.target.value))}/>
                    <button className="btn join-item" onClick={async () => await changeQuantity(Operation.ADD)}>+
                    </button>
                </div>

            </div>
        </div>
    </div>;
}

enum Operation {
    ADD = "add", SUB = "sub"
}