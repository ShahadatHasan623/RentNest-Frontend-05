"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";


import type { AuthUser } from "@/types/auth";
import { logoutAction } from "@/app/auth/_actions/logout";

interface NavbarProps {
  user: AuthUser | null;
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About" },
];

const DASHBOARD_ROUTES: Record<string, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// "TENANT" -> "Tenant"
const getRoleLabel = (role: string) =>
  role.charAt(0) + role.slice(1).toLowerCase();

// "/" exact match, বাকি সব nested route-এও active
const isActivePath = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

// "www.youtube.com" এর মতো protocol-ছাড়া URL ঠিক করে
const normalizeImage = (url?: string | null) =>
  !url ? "" : url.startsWith("http") ? url : `https://${url}`;

const Navbar = ({ user }: NavbarProps) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);


  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const dashboardHref = user
    ? (DASHBOARD_ROUTES[user.role] ?? "/dashboard")
    : "/dashboard";

  const handleLogout = async () => {
    setMobileOpen(false);
    setLoggingOut(true);
    try {
      await logoutAction();
    } catch {
      // redirect() internally throw করে
    } finally {
      setLoggingOut(false);
    }
  };

  // root image না থাকলে profile image fallback
  const avatarSrc = normalizeImage(user?.image || user?.profile?.image);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          Rent<span className="text-primary">Nest</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActivePath(pathname, href) ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActivePath(pathname, href)
                  ? "bg-accent text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth / Profile */}
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Open profile menu"
                  className="rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage src={avatarSrc} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                {/* User info — API data থেকে */}
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                  <span className="mt-1.5 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    {getRoleLabel(user.role)}
                  </span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href={dashboardHref}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  {/* LANDLORD only */}
                  {user.role === "LANDLORD" && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/landlord/properties">
                        <Building2 className="mr-2 h-4 w-4" />
                        My Properties
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* TENANT only */}
                  {user.role === "TENANT" && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/tenant/favorites">
                        <Heart className="mr-2 h-4 w-4" />
                        Favorites
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* ADMIN only */}
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/admin/users">
                        <Users className="mr-2 h-4 w-4" />
                        Manage Users
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  disabled={loggingOut}
                  onClick={handleLogout}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {loggingOut ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <nav className="border-t px-4 py-3 md:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block rounded-md px-3 py-2 text-sm font-medium ${
                isActivePath(pathname, href)
                  ? "bg-accent text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}

          {user && (
            <Link
              href={dashboardHref}
              className="mt-1 block rounded-md border-t px-3 pt-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Dashboard
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
