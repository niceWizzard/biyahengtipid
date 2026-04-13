
export default function Footer() {
    return (
        <footer className="border-t bg-muted/20">
            <div className="container mx-auto px-4 sm:px-8 py-12 md:py-16 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-0">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <h2 className="text-2xl font-extrabold tracking-tighter">
                        Biyaheng<span className="text-primary">Tipid</span>
                    </h2>
                    <p className="text-sm text-muted-foreground text-center md:text-left max-w-sm">
                        Your ultimate platform for discovering the best travel paths and saving money on your next trip.
                    </p>
                </div>
                <div className="flex gap-12 sm:gap-24">
                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold text-sm">Product</h3>
                        <div className="flex flex-col gap-2">
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold text-sm">Company</h3>
                        <div className="flex flex-col gap-2">
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 sm:px-8 py-6 border-t border-border/50 text-center text-sm text-muted-foreground">
                {new Date().getFullYear()} Biyaheng Tipid. Made by RMM
            </div>
        </footer>
    )
}
