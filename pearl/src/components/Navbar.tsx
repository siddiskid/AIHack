
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-white/80 backdrop-blur-md shadow-sm"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span className="text-xl font-bold gradient-text">Prescripto</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Home
          </a>
          <a
            href="#about"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            About
          </a>
          <a
            href="#services"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Services
          </a>
          <a
            href="#features"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Features
          </a>
        </nav>

        <div className="hidden md:block">
          <Button className="gradient-indigo hover:opacity-90 transition-opacity rounded-full">
            Get Started
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 space-y-4 animate-fade-in-up">
          <a
            href="#"
            className="block text-foreground hover:text-primary py-2 transition-colors"
            onClick={toggleMenu}
          >
            Home
          </a>
          <a
            href="#about"
            className="block text-foreground hover:text-primary py-2 transition-colors"
            onClick={toggleMenu}
          >
            About
          </a>
          <a
            href="#services"
            className="block text-foreground hover:text-primary py-2 transition-colors"
            onClick={toggleMenu}
          >
            Services
          </a>
          <a
            href="#features"
            className="block text-foreground hover:text-primary py-2 transition-colors"
            onClick={toggleMenu}
          >
            Features
          </a>
          <Button className="w-full gradient-indigo hover:opacity-90 transition-opacity rounded-full">
            Get Started
          </Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
