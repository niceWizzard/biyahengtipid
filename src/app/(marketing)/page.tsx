
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

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
      `}</style>
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center overflow-hidden bg-background">

        <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_2px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-background mask-[radial-gradient(circle_at_center,transparent_0%,black_80%)]"></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-primary/20 rounded-full blur-[80px] md:blur-[120px] opacity-60 pointer-events-none mix-blend-screen dark:mix-blend-color-dodge"></div>

        <section className="container relative z-10 mx-auto px-4 flex flex-col items-center justify-center space-y-10 text-center pb-16 pt-8 md:pt-0">



          <div className="flex flex-col md:flex-row items-center justify-center gap-x-8 gap-y-2 md:gap-y-4">
            <h1 className="text-[10rem] md:text-[14rem] leading-none font-black italic tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-primary-300 via-primary-500 to-primary-700 drop-shadow-sm select-none pr-4 md:pr-8">
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
            Unlock the world's most beautiful destinations without breaking the bank. Discover smarter routes, hidden deals, and powerful travel hacks.
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
    </>
  );
}
