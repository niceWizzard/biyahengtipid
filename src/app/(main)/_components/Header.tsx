'use client';

import Brand from '@/components/ui/Brand';
import Link from 'next/link';
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

export default function Header() {
  return (
    <header className="border-border h-16 w-full border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
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
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive">
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
