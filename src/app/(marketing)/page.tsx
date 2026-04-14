
import Link from "next/link";
import { ArrowRight, Sparkles, MapPin, Route, Navigation, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes textFocus1 {
          0%, 40% { transform: scale(1); opacity: 1; }
          50%, 90% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes textFocus2 {
          0%, 40% { transform: scale(0.8); opacity: 0.5; }
          50%, 90% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
        @keyframes travelDrop {
          0% { top: -40%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center overflow-hidden bg-background">

        <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_2px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        <div className="absolute inset-0 bg-background mask-[radial-gradient(circle_at_center,transparent_0%,black_80%)]"></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-primary/20 rounded-full blur-[80px] md:blur-[120px] opacity-60 pointer-events-none mix-blend-screen dark:mix-blend-color-dodge"></div>

        <section className="container relative z-10 mx-auto px-4 flex flex-col items-center justify-center space-y-10 text-center pb-16 pt-8 md:pt-0">



          <div className="flex flex-col md:flex-row items-center justify-center gap-x-8 gap-y-2 md:gap-y-4">
            <h1 className="text-[10rem] md:text-[14rem] leading-none font-black italic tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-primary-300 via-primary-500 to-primary-700 drop-shadow-sm select-none shrink-0 pr-12 md:pr-16 -mr-12 md:-mr-16">
              GO
            </h1>

            <div className="flex flex-col text-center md:text-left justify-center mt-2 md:mt-0">
              <h2 className="text-6xl md:text-8xl font-black italic tracking-tight text-foreground leading-[0.85] origin-center md:origin-left animate-[textFocus1_4s_infinite_ease-in-out]">
                FURTHER
              </h2>
              <div className="flex items-center justify-center md:justify-start my-4 md:my-5">
                <div className="h-2 w-16 md:w-24 bg-primary rounded-full"></div>
                <div className="h-2 w-2 bg-primary rounded-full ml-2"></div>
              </div>
              <h2 className="text-6xl md:text-8xl font-black italic tracking-tight text-foreground leading-[0.85] origin-center md:origin-left animate-[textFocus2_4s_infinite_ease-in-out]">
                FOR LESS
              </h2>
            </div>
          </div>

          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
            Optimize your local commutes, deliveries, or road trips perfectly. Discover smarter driving routes, efficient waypoint ordering, and save massively on fuel and time.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
            <Link href="/auth/login" className="inline-flex items-center justify-center group h-14 rounded-full bg-primary text-primary-foreground px-8 text-lg font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#features" className="inline-flex items-center justify-center h-14 rounded-full px-8 text-lg font-medium border border-input hover:bg-accent hover:text-accent-foreground transition-all duration-300 bg-background/50 backdrop-blur-sm">
              Learn More
            </Link>
          </div>
        </section>
      </div>

      <section className="py-24 bg-accent/5 overflow-hidden border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side: Animated Map Nodes */}
            <div className="relative max-w-md mx-auto lg:mx-0 w-full px-2 md:px-0">
              <div className="grid grid-cols-[3rem_1fr] gap-x-6 gap-y-10">
                {/* Connecting vertical line */}
                <div className="col-start-1 row-start-1 row-end-3 flex justify-center relative pointer-events-none z-0">
                  {/* Spans exactly row 1 and row 2. Gap is gap-y-10 (40px). 
                      To reach the center of row 3's icon (24px down), we extend the bottom by 40+24 = 64px = bottom-16! */}
                  <div className="absolute top-[24px] -bottom-16 w-0.5 bg-border overflow-hidden rounded-full">
                    <div className="w-full h-1/3 bg-primary rounded-full absolute left-0 animate-[travelDrop_2.5s_linear_infinite]"></div>
                  </div>
                </div>

                {/* Node 1 */}
                <div className="relative z-10 col-start-1 row-start-1 w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-sm transition-transform hover:scale-110">
                  <span className="absolute w-full h-full rounded-full bg-primary/20 animate-ping"></span>
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="pt-2 col-start-2 row-start-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-xl">Your Origin</h4>
                  </div>
                  <div className="bg-background border p-4 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
                    <p className="text-sm text-muted-foreground leading-relaxed">Start your journey with flexible dates to find the best departure window.</p>
                  </div>
                </div>

                {/* Node 2 */}
                <div className="relative z-10 col-start-1 row-start-2 w-12 h-12 rounded-full bg-background border-2 border-muted-foreground/30 flex items-center justify-center shadow-sm transition-transform hover:scale-110">
                  <Route className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="pt-2 col-start-2 row-start-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-xl">Smart Waypoint Priority</h4>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider">Optimized</span>
                  </div>
                  <div className="bg-background border p-4 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
                    <p className="text-sm text-muted-foreground leading-relaxed">We re-order your stops using Open Route Service to minimize driving time and distance.</p>
                  </div>
                </div>

                {/* Node 3 */}
                <div className="relative z-10 col-start-1 row-start-3 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-transform hover:scale-110">
                  <Navigation className="w-5 h-5 text-primary-foreground animate-bounce" />
                </div>
                <div className="pt-2 col-start-2 row-start-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-xl text-primary">Destination Reached</h4>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
                    <p className="text-sm text-foreground font-medium leading-relaxed">Arrive at your final destination, having saved up to 40% on travel time and fuel costs.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right side: Text details */}
            <div className="flex flex-col justify-center space-y-8 lg:pl-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
                Optimize the Route,<br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-primary-700">Maximize Efficiency.</span>
              </h2>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Powered by Open Route Service. Our advanced algorithm doesn't just draw a straight line; it evaluates road networks, turn restrictions, and optimal waypoint sequencing to build the ultimate efficient road trip itinerary.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-background border shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                  <div className="mt-0.5 bg-primary/10 p-2.5 rounded-xl shrink-0">
                    <Route className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-bold mb-1.5">Waypoint Optimization</h5>
                    <p className="text-sm text-muted-foreground">Automatically sequence multiple stops to minimize total travel time.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-background border shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                  <div className="mt-0.5 bg-primary/10 p-2.5 rounded-xl shrink-0">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-bold mb-1.5">Reliable Data</h5>
                    <p className="text-sm text-muted-foreground">Backed by real-world road networks and highly accurate routing engines.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
