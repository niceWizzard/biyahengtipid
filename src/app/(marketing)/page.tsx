import Link from 'next/link';
import {
  ArrowRight,
  MapPin,
  Route,
  Navigation,
  ShieldCheck,
} from 'lucide-react';

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
      <div className="bg-background relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_2px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        <div className="bg-background absolute inset-0 mask-[radial-gradient(circle_at_center,transparent_0%,black_80%)]"></div>

        <div className="bg-primary/20 pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 mix-blend-screen blur-[80px] md:h-[600px] md:w-[600px] md:blur-[120px] dark:mix-blend-color-dodge"></div>

        <section className="relative z-10 container mx-auto flex flex-col items-center justify-center space-y-10 px-4 pt-8 pb-16 text-center md:pt-0">
          <div className="flex flex-col items-center justify-center gap-x-8 gap-y-2 md:flex-row md:gap-y-4">
            <h1 className="from-primary-300 via-primary-500 to-primary-700 -mr-12 shrink-0 bg-linear-to-br bg-clip-text pr-12 text-[10rem] leading-none font-black tracking-tighter text-transparent italic drop-shadow-sm select-none md:-mr-16 md:pr-16 md:text-[14rem]">
              GO
            </h1>

            <div className="mt-2 flex flex-col justify-center text-center md:mt-0 md:text-left">
              <h2 className="text-foreground origin-center animate-[textFocus1_4s_infinite_ease-in-out] text-6xl leading-[0.85] font-black tracking-tight italic md:origin-left md:text-8xl">
                FURTHER
              </h2>
              <div className="my-4 flex items-center justify-center md:my-5 md:justify-start">
                <div className="bg-primary h-2 w-16 rounded-full md:w-24"></div>
                <div className="bg-primary ml-2 h-2 w-2 rounded-full"></div>
              </div>
              <h2 className="text-foreground origin-center animate-[textFocus2_4s_infinite_ease-in-out] text-6xl leading-[0.85] font-black tracking-tight italic md:origin-left md:text-8xl">
                FOR LESS
              </h2>
            </div>
          </div>

          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed md:text-xl">
            Optimize your local commutes, deliveries, or road trips perfectly.
            Discover smarter driving routes, efficient waypoint ordering, and
            save massively on fuel and time.
          </p>

          <div className="flex flex-col items-center gap-4 pt-6 sm:flex-row">
            <Link
              href="/register"
              className="group bg-primary text-primary-foreground shadow-primary/20 hover:shadow-primary/40 inline-flex h-14 items-center justify-center rounded-full px-8 text-lg font-medium shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#features"
              className="border-input hover:bg-accent hover:text-accent-foreground bg-background/50 inline-flex h-14 items-center justify-center rounded-full border px-8 text-lg font-medium backdrop-blur-sm transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </section>
      </div>

      <section
        className="bg-accent/5 overflow-hidden border-t py-24"
        id="features"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            {/* Left side: Animated Map Nodes */}
            <div className="relative mx-auto w-full max-w-md px-2 md:px-0 lg:mx-0">
              <div className="grid grid-cols-[3rem_1fr] gap-x-6 gap-y-10">
                {/* Connecting vertical line */}
                <div className="pointer-events-none relative z-0 col-start-1 row-start-1 row-end-3 flex justify-center">
                  {/* Spans exactly row 1 and row 2. Gap is gap-y-10 (40px). 
                      To reach the center of row 3's icon (24px down), we extend the bottom by 40+24 = 64px = bottom-16! */}
                  <div className="bg-border absolute top-[24px] -bottom-16 w-0.5 overflow-hidden rounded-full">
                    <div className="bg-primary absolute left-0 h-1/3 w-full animate-[travelDrop_2.5s_linear_infinite] rounded-full"></div>
                  </div>
                </div>

                {/* Node 1 */}
                <div className="bg-background border-primary relative z-10 col-start-1 row-start-1 flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-sm transition-transform hover:scale-110">
                  <span className="bg-primary/20 absolute h-full w-full animate-ping rounded-full"></span>
                  <MapPin className="text-primary h-5 w-5" />
                </div>
                <div className="col-start-2 row-start-1 pt-2">
                  <div className="mb-1 flex items-center gap-2">
                    <h4 className="text-xl font-bold">Your Origin</h4>
                  </div>
                  <div className="bg-background rounded-xl border p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Start your journey with flexible dates to find the best
                      departure window.
                    </p>
                  </div>
                </div>

                {/* Node 2 */}
                <div className="bg-background border-muted-foreground/30 relative z-10 col-start-1 row-start-2 flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-sm transition-transform hover:scale-110">
                  <Route className="text-muted-foreground h-5 w-5" />
                </div>
                <div className="col-start-2 row-start-2 pt-2">
                  <div className="mb-1 flex items-center gap-2">
                    <h4 className="text-xl font-bold">
                      Smart Waypoint Priority
                    </h4>
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-green-500 uppercase">
                      Optimized
                    </span>
                  </div>
                  <div className="bg-background rounded-xl border p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      We re-order your stops using Open Route Service to
                      minimize driving time and distance.
                    </p>
                  </div>
                </div>

                {/* Node 3 */}
                <div className="bg-primary relative z-10 col-start-1 row-start-3 flex h-12 w-12 items-center justify-center rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-transform hover:scale-110">
                  <Navigation className="text-primary-foreground h-5 w-5 animate-bounce" />
                </div>
                <div className="col-start-2 row-start-3 pt-2">
                  <div className="mb-1 flex items-center gap-2">
                    <h4 className="text-primary text-xl font-bold">
                      Destination Reached
                    </h4>
                  </div>
                  <div className="bg-primary/5 border-primary/20 rounded-xl border p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
                    <p className="text-foreground text-sm leading-relaxed font-medium">
                      Arrive at your final destination, having saved up to 40%
                      on travel time and fuel costs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Text details */}
            <div className="flex flex-col justify-center space-y-8 lg:pl-10">
              <h2 className="text-foreground text-4xl leading-[1.1] font-black tracking-tight md:text-5xl lg:text-6xl">
                Optimize the Route,
                <br />
                <span className="from-primary-400 to-primary-700 bg-linear-to-r bg-clip-text text-transparent">
                  Maximize Efficiency.
                </span>
              </h2>

              <p className="text-muted-foreground text-lg leading-relaxed md:text-xl">
                Powered by Open Route Service. Our advanced algorithm
                doesn&apos;t just draw a straight line; it evaluates road
                networks, turn restrictions, and optimal waypoint sequencing to
                build the ultimate efficient road trip itinerary.
              </p>

              <div className="grid gap-6 pt-4 sm:grid-cols-2">
                <div className="bg-background hover:border-primary/50 flex items-start gap-4 rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="bg-primary/10 mt-0.5 shrink-0 rounded-xl p-2.5">
                    <Route className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="mb-1.5 font-bold">Waypoint Optimization</h5>
                    <p className="text-muted-foreground text-sm">
                      Automatically sequence multiple stops to minimize total
                      travel time.
                    </p>
                  </div>
                </div>

                <div className="bg-background hover:border-primary/50 flex items-start gap-4 rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="bg-primary/10 mt-0.5 shrink-0 rounded-xl p-2.5">
                    <ShieldCheck className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="mb-1.5 font-bold">Reliable Data</h5>
                    <p className="text-muted-foreground text-sm">
                      Backed by real-world road networks and highly accurate
                      routing engines.
                    </p>
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
