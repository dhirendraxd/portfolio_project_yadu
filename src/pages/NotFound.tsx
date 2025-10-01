import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative">
      {/* Overlay removed to keep page crisp; using global background only */}
      <div className="relative flex items-center justify-center min-h-screen">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="glass-card rounded-4xl p-12 shadow-glass">
            <h1 className="text-6xl font-bold text-charcoal mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">Page Not Found</h2>
            <p className="text-charcoal/70 mb-8 text-lg leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-forest hover:bg-forest/90 text-white">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-charcoal/30 text-charcoal hover:bg-charcoal/10">
                <button onClick={() => window.history.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </button>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
