import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-muted/20 border-t">
      <div className="container mx-auto flex flex-col items-center justify-between gap-8 px-4 py-12 sm:px-8 md:flex-row md:items-start md:gap-0 md:py-16">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <h2 className="text-2xl font-extrabold tracking-tighter">
            Biyaheng<span className="text-primary">Tipid</span>
          </h2>
          <p className="text-muted-foreground max-w-sm text-center text-sm md:text-left">
            Your ultimate platform for discovering the best travel paths and
            saving money on your next trip.
          </p>
        </div>
        <div className="flex gap-12 sm:gap-24">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Product</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Features
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Testimonials
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Company</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                About Us
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-border/50 text-muted-foreground container mx-auto border-t px-4 py-6 text-center text-sm sm:px-8">
        {new Date().getFullYear()} Biyaheng Tipid. Made by RMM
      </div>
    </footer>
  );
}
