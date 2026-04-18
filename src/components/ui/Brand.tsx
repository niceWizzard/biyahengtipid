import Link from 'next/link';
import React from 'react';

export default function Brand({
  href = '/',
}: {
  href?: React.ComponentProps<typeof Link>['href'];
}) {
  return (
    <h1 className="text-2xl font-extrabold tracking-tighter">
      <Link href={href}>
        Biyaheng<span className="text-primary">Tipid</span>
      </Link>
    </h1>
  );
}
