import Header from "@/components/header";
import ProductList from "@/app/(app)/product-list";

export default function Home({update}: { update: () => void }) {
    return (
        <main className="flex flex-col items-center justify-between">
            <ProductList update={update}/>
        </main>
    );
}
