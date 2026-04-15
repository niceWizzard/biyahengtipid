import { buttonVariants } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold tracking-tighter">
            <Link href="/">
              Biyaheng<span className="text-primary">Tipid</span>
            </Link>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden sm:block">
          <ul className="flex items-center gap-4">
            <li>
              <Link
                href="/login"
                className={buttonVariants({ variant: 'ghost' })}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className={buttonVariants({ variant: 'ghost' })}
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className={`${buttonVariants({ variant: 'default' })} rounded-full shadow-sm`}
              >
                Get Started for Free
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Navigation Drawer */}
        <div className="flex items-center sm:hidden">
          <Drawer direction="right">
            <DrawerTrigger
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
            >
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
              <div className="flex flex-col gap-4 px-4 py-8">
                <DrawerClose asChild>
                  <Link
                    href="/login"
                    className={buttonVariants({
                      variant: 'ghost',
                      className: 'w-full justify-start text-lg',
                    })}
                  >
                    Login
                  </Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <Link
                    href="/pricing"
                    className={buttonVariants({
                      variant: 'ghost',
                      className: 'w-full justify-start text-lg',
                    })}
                  >
                    Pricing
                  </Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <Link
                    href="/register"
                    className={`${buttonVariants({ variant: 'default', className: 'w-full text-lg' })} rounded-full shadow-sm`}
                  >
                    Get Started for Free
                  </Link>
                </DrawerClose>
              </div>
              <DrawerFooter className="pt-2">
                <DrawerClose
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'w-full',
                  })}
                >
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
