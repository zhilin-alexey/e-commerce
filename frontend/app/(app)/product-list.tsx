"use client";
import axios from "@/lib/axios";
import {Product} from "@/index";
import useSWR from "swr";
import {ProductCard} from "@/app/(app)/product-card";

export default function ProductList({update}: { update: () => void }) {
    const {data: products, error} =
        useSWR<Product[]>("/api/products", (url: string) => axios.get(url).then((res) => res.data));
    return (
        <div className="flex flex-wrap justify-center gap-4 mt-5">
            {products?.map((product) => (
                    <ProductCard key={product.id} product={product} update={update}/>
                )
            )
            }

        </div>
    )
}