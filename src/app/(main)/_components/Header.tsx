'use client';

import Brand from '@/components/ui/Brand';

import ProfileDropdown from './ProfileDropdown';

export default function Header() {
  return (
    <header className="border-border h-16 w-full border-b">
      <div className="flex items-center justify-between px-4 py-4">
        <Brand href="/dashboard" />
        <nav>
          <ul className="flex flex-row items-center gap-4">
            <li>
              <ProfileDropdown />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
