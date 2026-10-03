"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold"
        >
          Rent<span className="text-primary">Nest</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary"
          >
            Home
          </Link>

          <Link
            href="/properties"
            className="text-sm font-medium hover:text-primary"
          >
            Properties
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium hover:text-primary"
          >
            About
          </Link>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            asChild
          >
            <Link href="/auth/login">
              Login
            </Link>
          </Button>

          <Button asChild>
            <Link href="/auth/register">
              Register
            </Link>
          </Button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;