import { buttonVariants } from "@/components/ui/button";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-extrabold tracking-tighter">
                        Biyaheng<span className="text-primary">Tipid</span>
                    </h1>
                </div>
                <nav>
                    <ul className="flex items-center gap-2 sm:gap-4">
                        <li>
                            <a href="#" className={`${buttonVariants({ variant: "ghost" })} hidden sm:inline-flex`}>Login</a>
                        </li>
                        <li>
                            <a href="#" className={`${buttonVariants({ variant: "default" })} rounded-full shadow-sm`}>Get Started for Free</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}
