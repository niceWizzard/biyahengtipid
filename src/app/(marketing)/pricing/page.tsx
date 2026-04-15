import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing Plans | BiyahengTipid',
  description:
    'Choose the perfect BiyahengTipid plan for your travel needs. Explore our Free tier for casual travelers and our Pro plan for unlimited route optimization.',
  keywords: [
    'BiyahengTipid pricing',
    'route optimization pricing',
    'trip planner cost',
    'travel app Philippines',
    'navigation app subscription',
  ],
  openGraph: {
    title: 'Pricing Plans | BiyahengTipid',
    description:
      'Find the perfect route optimization plan to save fuel and time on your road trips.',
    type: 'website',
    locale: 'en_PH',
    siteName: 'BiyahengTipid',
    images: [
      {
        url: '/img/biyaheng_tipid_brand.png',
        width: 1200,
        height: 630,
        alt: 'BiyahengTipid - Pricing Plans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing Plans | BiyahengTipid',
    description:
      'Choose the perfect plan for your travel and route optimization needs.',
    images: ['/img/biyaheng_tipid_brand.png'],
  },
};

export default function PricingPage() {
  return (
    <div className="bg-background relative flex min-h-[calc(100vh-4rem)] flex-col items-center overflow-hidden py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_2px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
      <div className="bg-background absolute inset-0 mask-[radial-gradient(ellipse_at_top,transparent_20%,black_80%)]"></div>

      <div className="bg-primary/20 pointer-events-none absolute top-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full opacity-50 mix-blend-screen blur-[100px] dark:mix-blend-color-dodge"></div>

      <section className="relative z-10 container mx-auto flex flex-col items-center px-4">
        <div className="mb-16 flex flex-col items-center justify-center gap-6 text-center">
          <h1 className="from-foreground to-foreground/70 bg-linear-to-b bg-clip-text text-5xl font-black tracking-tight text-transparent md:text-7xl">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground max-w-2xl text-xl">
            Whether you are a casual traveler or a heavy road tripper, we have a
            plan to optimize your journey and save you fuel.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-4xl items-start gap-8 md:grid-cols-2">
          {/* Basic Plan */}
          <Card className="bg-background/50 border-border hover:border-primary/30 relative flex h-full w-full flex-col backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl font-bold">Basic</CardTitle>
              <CardDescription className="text-base">
                Perfect for casual travellers
              </CardDescription>
              <div className="mt-6 flex items-baseline text-6xl font-black tracking-tighter">
                Free
                <span className="text-muted-foreground ml-2 text-xl font-medium tracking-normal">
                  /forever
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-6">
              <ul className="flex flex-col gap-4">
                <li className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-1">
                    <Check className="text-primary h-4 w-4" />
                  </div>
                  <span className="text-foreground/80 font-medium">
                    Unlimited Trips
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-1">
                    <Check className="text-primary h-4 w-4" />
                  </div>
                  <span className="text-foreground/80 font-medium">
                    Unlimited Navigation
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-1">
                    <Check className="text-primary h-4 w-4" />
                  </div>
                  <span className="text-foreground/80 font-medium">
                    Up to 10 Stops per Trip
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-1">
                    <Check className="text-primary h-4 w-4" />
                  </div>
                  <span className="text-foreground/80 font-medium">
                    3 Optimize per Day
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="bg-muted/20 p-6">
              <Button className="h-12 w-full text-lg" variant="outline">
                Continue with Free
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <div className="group relative h-full transition-all duration-300 hover:-translate-y-1">
            <div className="from-primary-400 via-primary-500 to-primary-600 absolute -inset-1 animate-pulse rounded-3xl bg-linear-to-r opacity-30 blur-xl transition-all duration-500 group-hover:opacity-60"></div>
            <div className="absolute top-0 right-8 z-10 -translate-y-1/2">
              <span className="bg-primary text-primary-foreground rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase shadow-lg">
                Best Value
              </span>
            </div>
            <Card className="bg-background border-primary/50 shadow-primary/10 relative flex h-full w-full flex-col shadow-2xl">
              <CardHeader className="pb-8">
                <CardTitle className="text-primary text-3xl font-bold">
                  Pro
                </CardTitle>
                <CardDescription className="text-foreground/70 text-base">
                  For the ultimate road trippers
                </CardDescription>
                <div className="mt-6 flex items-baseline text-6xl font-black tracking-tighter">
                  <span className="text-muted-foreground mr-1 align-top text-3xl font-bold">
                    ₱
                  </span>
                  99
                  <span className="text-muted-foreground ml-2 text-xl font-medium tracking-normal">
                    /month
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-6">
                <ul className="flex flex-col gap-4">
                  <li className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-1">
                      <Check className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-foreground/80 font-medium">
                      Unlimited Trips
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-1">
                      <Check className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-foreground/80 font-medium">
                      Unlimited Navigation
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-1">
                      <Check className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-foreground/80 font-medium">
                      Up to 50 Stops per Trip
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-1">
                      <Check className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-foreground/80 font-medium">
                      Unlimited Route Optimization
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-1">
                      <Check className="text-primary h-4 w-4" />
                    </div>
                    <span className="text-foreground/80 font-medium">
                      Priority Support
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="bg-primary/5 p-6">
                <Button
                  className="shadow-primary/20 hover:shadow-primary/40 h-12 w-full border-none text-lg shadow-lg transition-all"
                  variant="default"
                >
                  Start 7-Day Free Trial
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
