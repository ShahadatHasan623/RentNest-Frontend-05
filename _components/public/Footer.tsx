import Link from "next/link";


import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Linkedin, Twitter } from "@hugeicons/core-free-icons";
import { AdIcon, Home, Mail, MapPin, Phone } from "lucide-react";

/* ---------- data ---------- */

const FOOTER_LINKS = [
  {
    title: "Explore",
    links: [
      { label: "Browse Properties", href: "/properties" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "For Tenants",
    links: [
      { label: "Find a Home", href: "/properties" },
      { label: "My Requests", href: "/dashboard/tenant/requests" },
      { label: "Payments", href: "/dashboard/tenant/payments" },
    ],
  },
  {
    title: "For Landlords",
    links: [
      { label: "List Property", href: "/dashboard/landlord/properties/new" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Rental Requests", href: "/dashboard/landlord/requests" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const SOCIALS = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

const CONTACTS = [
  {
    icon: MapPin,
    value: "Dhaka, Bangladesh",
    href: "#",
  },
  {
    icon: Mail,
    value: "support@rentnest.com",
    href: "mailto:support@rentnest.com",
  },
  {
    icon: Phone,
    value: "+880 1XXX-XXXXXX",
    href: "tel:+8801XXXXXXXXX",
  },
];

/* ---------- main component ---------- */

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        {/* ================= Top: Brand + Links ================= */}
        <div className="grid gap-10 lg:grid-cols-5">
          {/* ---------- brand column ---------- */}
          <div className="space-y-5 lg:col-span-2">
            {/* logo */}
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/75 text-primary-foreground shadow-sm">
                <Home className="size-4.5" />
              </div>

              <span className="text-lg font-bold tracking-tight">
                RentNest
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Bangladesh&apos;s modern rental marketplace — verified listings,
              secure payments and zero broker hassle.
            </p>

            {/* contact info */}
            <ul className="space-y-2.5">
              {CONTACTS.map(({ icon: Icon, value, href }) => (
                <li key={value}>
                  <a
                    href={href}
                    className="group flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="size-4 shrink-0 text-primary" />
                    {value}
                  </a>
                </li>
              ))}
            </ul>

            {/* socials */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                >
                  <AdIcon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ---------- link columns ---------- */}
          {FOOTER_LINKS.map((column) => (
            <div key={column.title} className="space-y-4">
              <p className="text-sm font-semibold">{column.title}</p>

              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* ================= Bottom Bar ================= */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} RentNest. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Made with
            <span className="text-red-500">♥</span>
            in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;