'use client';

import Brand from '@/components/ui/Brand';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SquareArrowRightExit, User } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  return (
    <header className="border-border h-16 w-full border-b">
      <div className="flex items-center justify-between px-4 py-4">
        <Brand href="/dashboard" />
        <nav>
          <ul className="flex flex-row items-center gap-4">
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="outline"></Button>}
                >
                  <User />
                  Profile
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer">
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Billing
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      variant="destructive"
                      onClick={() => {
                        authClient.signOut({
                          fetchOptions: {
                            onSuccess: () => {
                              router.push('/login');
                            },
                          },
                        });
                      }}
                    >
                      <SquareArrowRightExit />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
