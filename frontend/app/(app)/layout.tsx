import Header from "@/components/header";
import {ReactNode} from "react";
import {Toaster} from "sonner";

export default function AppLayout({children}: { children: ReactNode }) {
    return (
        <div className="min-h-screen">
            <Toaster/>

            <Header/>
            {children}
        </div>
    )
}