import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: "Pricing Plans | BiyahengTipid",
    description: "Choose the perfect BiyahengTipid plan for your travel needs. Explore our Free tier for casual travelers and our Pro plan for unlimited route optimization.",
    keywords: [
        "BiyahengTipid pricing",
        "route optimization pricing",
        "trip planner cost",
        "travel app Philippines",
        "navigation app subscription"
    ],
    openGraph: {
        title: "Pricing Plans | BiyahengTipid",
        description: "Find the perfect route optimization plan to save fuel and time on your road trips.",
        type: "website",
        locale: "en_PH",
        siteName: "BiyahengTipid",
        images: [
            {
                url: "/img/biyaheng_tipid_brand.png",
                width: 1200,
                height: 630,
                alt: "BiyahengTipid - Pricing Plans",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Pricing Plans | BiyahengTipid",
        description: "Choose the perfect plan for your travel and route optimization needs.",
        images: ["/img/biyaheng_tipid_brand.png"],
    },
};

export default function PricingPage() {
    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center overflow-hidden bg-background py-24">
            {/* Background Effects */}
            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_2px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
            <div className="absolute inset-0 bg-background mask-[radial-gradient(ellipse_at_top,transparent_20%,black_80%)]"></div>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[100px] opacity-50 pointer-events-none mix-blend-screen dark:mix-blend-color-dodge"></div>

            <section className="container relative z-10 mx-auto px-4 flex flex-col items-center">
                <div className="flex flex-col items-center justify-center gap-6 mb-16 text-center">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-b from-foreground to-foreground/70">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Whether you are a casual traveler or a heavy road tripper, we have a plan to optimize your journey and save you fuel.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full mx-auto items-start">
                    {/* Basic Plan */}
                    <Card className="relative flex flex-col w-full h-full bg-background/50 backdrop-blur-sm border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <CardHeader className="pb-8">
                            <CardTitle className="text-3xl font-bold">Basic</CardTitle>
                            <CardDescription className="text-base">Perfect for casual travellers</CardDescription>
                            <div className="mt-6 flex items-baseline text-6xl font-black tracking-tighter">
                                Free
                                <span className="text-xl font-medium text-muted-foreground ml-2 tracking-normal">/forever</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col gap-6">
                            <ul className="flex flex-col gap-4">
                                <li className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-1 rounded-full"><Check className="w-4 h-4 text-primary" /></div>
                                    <span className="font-medium text-foreground/80">Unlimited Trips</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-1 rounded-full"><Check className="w-4 h-4 text-primary" /></div>
                                    <span className="font-medium text-foreground/80">Unlimited Navigation</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-1 rounded-full"><Check className="w-4 h-4 text-primary" /></div>
                                    <span className="font-medium text-foreground/80">3 Optimize per Day</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter className="p-6 bg-muted/20">
                            <Button className="w-full h-12 text-lg" variant="outline">
                                Continue with Free
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Plan */}
                    <div className="relative group h-full transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-primary-400 via-primary-500 to-primary-600 opacity-30 group-hover:opacity-60 blur-xl transition-all duration-500 animate-pulse"></div>
                        <div className="absolute top-0 right-8 -translate-y-1/2 z-10">
                            <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1.5 px-3.5 rounded-full shadow-lg">
                                Best Value
                            </span>
                        </div>
                        <Card className="relative h-full flex flex-col w-full bg-background border-primary/50 shadow-2xl shadow-primary/10">
                            <CardHeader className="pb-8">
                                <CardTitle className="text-3xl font-bold text-primary">Pro</CardTitle>
                                <CardDescription className="text-base text-foreground/70">For the ultimate road trippers</CardDescription>
                                <div className="mt-6 flex items-baseline text-6xl font-black tracking-tighter">
                                    <span className="text-3xl font-bold align-top text-muted-foreground mr-1">₱</span>
                                    99
                                    <span className="text-xl font-medium text-muted-foreground ml-2 tracking-normal">/month</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col gap-6">
                                <ul className="flex flex-col gap-4">
                                    <li className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-1 rounded-full"><Check className="w-4 h-4 text-primary" /></div>
                                        <span className="font-medium text-foreground/80">Unlimited Trips</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-1 rounded-full"><Check className="w-4 h-4 text-primary" /></div>
                                        <span className="font-medium text-foreground/80">Unlimited Navigation</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-1 rounded-full"><Check className="w-4 h-4 text-primary" /></div>
                                        <span className="font-medium text-foreground/80">Unlimited Route Optimization</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-1 rounded-full"><Check className="w-4 h-4 text-primary" /></div>
                                        <span className="font-medium text-foreground/80">Priority Support</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter className="p-6 bg-primary/5">
                                <Button
                                    className="w-full h-12 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all border-none"
                                    variant="default" >
                                    Start 7-Day Free Trial
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}
