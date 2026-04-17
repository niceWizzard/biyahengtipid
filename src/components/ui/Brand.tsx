import Link from 'next/link';

export default function Brand() {
  return (
    <h1 className="text-2xl font-extrabold tracking-tighter">
      <Link href="/">
        Biyaheng<span className="text-primary">Tipid</span>
      </Link>
    </h1>
  );
}
