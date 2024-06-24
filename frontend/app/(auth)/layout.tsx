import React, {ReactNode} from "react";
import Header from "@/components/header";

export default function AuthLayout({children}: { children: ReactNode }) {
    return (
        <div><Header hideRight={true}/>
            <div className="hero min-h-screen">
                {children}
            </div>
        </div>

    )
}