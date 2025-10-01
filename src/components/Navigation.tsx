
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", ariaLabel: "Navigate to homepage" },
    { name: "Blog", path: "/blog", ariaLabel: "View blog articles and insights" },
    { name: "Admin", path: "/admin", ariaLabel: "Access admin dashboard" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full glass-card border-b border-glass-border" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover-lift" aria-label="Yadav Singh Dhami - Homepage">
            <img 
              src="/lovable-uploads/41416594-3d23-4786-856d-ccf87d42c4d6.png" 
              alt="Yadav Singh Dhami profile picture" 
              className="w-8 h-8 rounded-lg object-cover shadow-soft"
              width="32"
              height="32"
              loading="eager"
            />
            <span className="font-medium text-foreground">Yadav Singh Dhami</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                role="menuitem"
                aria-label={item.ariaLabel}
                className={`text-sm font-medium transition-all duration-300 hover-lift px-3 py-2 rounded-xl ${
                  isActive(item.path)
                    ? "text-forest bg-forest/10 shadow-soft"
                    : "text-muted-foreground hover:text-forest hover:bg-forest/5"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 rounded-xl glass-button hover-lift"
                  aria-label="Open mobile navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 glass-card" role="dialog" aria-label="Mobile navigation menu">
                <nav className="flex flex-col space-y-4 mt-8" role="menubar">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      role="menuitem"
                      aria-label={item.ariaLabel}
                      className={`text-sm font-medium p-3 rounded-xl transition-all duration-300 hover-lift ${
                        isActive(item.path)
                          ? "bg-forest text-white shadow-soft"
                          : "text-muted-foreground hover:text-forest hover:bg-forest/10"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
