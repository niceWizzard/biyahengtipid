import { Metadata } from "next"
import LoginClient from "./login-client"

export const metadata: Metadata = {
    title: "Login - BiyahengTipid",
    description: "Sign in to your BiyahengTipid account to continue your journey.",
    openGraph: {
        title: "Login - BiyahengTipid",
        description: "Sign in to your BiyahengTipid account to continue your journey.",
    }
}

export default function LoginPage() {
    return <LoginClient />
}
