export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Background elements  */}
      <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_2px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
      <div className="bg-background absolute inset-0 mask-[radial-gradient(circle_at_center,transparent_0%,black_80%)]"></div>

      <div className="bg-primary/20 pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 mix-blend-screen blur-[80px] md:h-[600px] md:w-[600px] md:blur-[120px] dark:mix-blend-color-dodge"></div>
      <main className="flex flex-1 flex-col">{children}</main>
    </>
  );
}
