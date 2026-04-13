import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { MenuIcon } from "lucide-react";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-extrabold tracking-tighter">
                        Biyaheng<span className="text-primary">Tipid</span>
                    </h1>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden sm:block">
                    <ul className="flex items-center gap-4">
                        <li>
                            <a href="#" className={buttonVariants({ variant: "ghost" })}>
                                Login
                            </a>
                        </li>
                        <li>
                            <a href="#" className={`${buttonVariants({ variant: "default" })} rounded-full shadow-sm`}>
                                Get Started for Free
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* Mobile Navigation Drawer */}
                <div className="sm:hidden flex items-center">
                    <Drawer direction="right">
                        <DrawerTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
                            <span className="sr-only">Open menu</span>
                            <MenuIcon className="size-lg" />
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle className="text-left text-2xl font-extrabold tracking-tighter">
                                    Biyaheng<span className="text-primary">Tipid</span>
                                </DrawerTitle>
                                <DrawerDescription className="text-left">
                                    Your ultimate travel planner.
                                </DrawerDescription>
                            </DrawerHeader>
                            <div className="px-4 py-8 flex flex-col gap-4">
                                <a href="#" className={buttonVariants({ variant: "ghost", className: "w-full justify-start text-lg" })}>
                                    Login
                                </a>
                                <a href="#" className={`${buttonVariants({ variant: "default", className: "w-full text-lg" })} rounded-full shadow-sm`}>
                                    Get Started for Free
                                </a>
                            </div>
                            <DrawerFooter className="pt-2">
                                <DrawerClose className={buttonVariants({ variant: "outline", className: "w-full" })}>
                                    Close
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>
        </header>
    );
}
