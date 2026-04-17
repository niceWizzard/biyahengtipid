import Header from './_components/Header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <Header />
        {children}
      </main>
    </>
  );
}
