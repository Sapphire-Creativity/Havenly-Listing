import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiArrowUpRight, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

/* ------------------------------------------------------------------
   EDIT THESE: all footer content lives here, not in the markup.
------------------------------------------------------------------- */
const LIST_PROPERTY_HREF = "/list-property"; 

const CONTACT = {
  phone: "+234 800 000 0000", 
  email: "info@havenlylistings.com", 
  address: "Nigeria",
};

// Icons only appear once you add a real URL
const SOCIALS = [
  { label: "Facebook", href: "", icon: FaFacebookF },
  { label: "X (Twitter)", href: "", icon: FaXTwitter },
  { label: "Instagram", href: "", icon: FaInstagram },
  { label: "LinkedIn", href: "", icon: FaLinkedinIn },
];

const EXPLORE = [
  { label: "Browse listings", href: "/listings" },
  { label: "Buy a property", href: "/buy" },
  { label: "Rent a property", href: "/rent" },
  { label: "Book a shortlet", href: "/shortlet" },
  { label: "Blog", href: "/blog" },
];

// Uses the same ?location= pattern as the Explore section
const LOCATIONS = [
  { label: "Lagos", slug: "lagos" },
  { label: "Abuja", slug: "abuja" },
  { label: "Port Harcourt", slug: "port-harcourt" },
  { label: "Enugu", slug: "enugu" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
  { label: "Sitemap", href: "#" },
];

/* ------------------------------------------------------------------
   PIECES
------------------------------------------------------------------- */
// Link with an underline that slides in on hover
function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="relative inline-block text-white/70 transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white/70 after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      {children}
    </Link>
  );
}

function ContactRow({ icon: Icon, href, children }) {
  const inner = (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-foreground">
        <Icon size={16} />
      </span>
      <span className="text-white/70 transition-colors duration-300 group-hover:text-white">
        {children}
      </span>
    </>
  );

  return href ? (
    <a
      href={href}
      className="group flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      {inner}
    </a>
  ) : (
    <div className="flex items-center gap-3">{inner}</div>
  );
}

/* ------------------------------------------------------------------
   FOOTER
------------------------------------------------------------------- */
const Footer = () => {
  const year = new Date().getFullYear();
  const socials = SOCIALS.filter((s) => s.href);

  return (
    <footer className="rounded-t-[2.5rem] bg-[#12362a] px-4 pb-8 pt-12 text-sm sm:px-6 lg:px-12 lg:pt-16">
      <div className="mx-auto max-w-7xl">
        {/* ---------- Call to action for property owners ---------- */}
        <div className="relative isolate overflow-hidden rounded-3xl bg-primary px-6 py-10 sm:px-10 md:px-14 md:py-14">
          {/* Decorative rings */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-16 -top-28 size-80 rounded-full border border-white/15" />
            <div className="absolute -right-32 -top-44 size-[30rem] rounded-full border border-white/10" />
            <div className="absolute -right-48 -top-60 size-[40rem] rounded-full border border-white/5" />
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl leading-tight tracking-tight text-white md:text-4xl">
                Have a property to list?
              </h2>
              <p className="mt-3 text-base text-white/75">
                Reach renters, buyers and shortlet guests across Nigeria.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={LIST_PROPERTY_HREF}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-foreground transition-colors duration-300 hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                List your property
                <FiArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/listings"
                className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Browse listings
              </Link>
            </div>
          </div>
        </div>

        {/* ---------- Main columns ---------- */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-14 lg:grid-cols-12 lg:gap-x-8 lg:py-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <Link
              href="/"
              aria-label="Havenly Listings home"
              className="group inline-flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <span className="relative block size-9">
                <span className="absolute inset-0 rotate-45 rounded-xl bg-linear-to-br from-primary-accent to-primary transition-transform duration-500 group-hover:rotate-90" />
                <span className="absolute inset-2 rounded-md bg-[#12362a]" />
              </span>
              <span className="font-heading text-lg font-bold text-white">
                Havenly Listings
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-base leading-relaxed text-white/70">
              Find homes, shortlets and commercial spaces across Nigeria, or
              list your own for people who are looking.
            </p>

            {socials.length > 0 && (
              <ul className="mt-6 flex gap-3">
                {socials.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors duration-300 hover:border-white hover:bg-white hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <Icon size={16} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Explore */}
          <nav aria-label="Explore" className="lg:col-span-2">
            <h3 className="mb-5 text-sm font-semibold text-white">Explore</h3>
            <ul className="space-y-3">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Popular locations */}
          <nav aria-label="Popular locations" className="lg:col-span-2">
            <h3 className="mb-5 text-sm font-semibold text-white">
              Popular locations
            </h3>
            <ul className="space-y-3">
              {LOCATIONS.map((l) => (
                <li key={l.slug}>
                  <FooterLink href={`/listings?location=${l.slug}`}>
                    {l.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-4 lg:pl-8">
            <h3 className="mb-5 text-sm font-semibold text-white">
              Contact us
            </h3>
            <ul className="space-y-4">
              <li>
                <ContactRow
                  icon={FiPhone}
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                >
                  {CONTACT.phone}
                </ContactRow>
              </li>
              <li>
                <ContactRow icon={FiMail} href={`mailto:${CONTACT.email}`}>
                  {CONTACT.email}
                </ContactRow>
              </li>
              <li>
                <ContactRow icon={FiMapPin}>{CONTACT.address}</ContactRow>
              </li>
            </ul>
          </div>
        </div>

        {/* ---------- Bottom bar ---------- */}
        <div className="flex flex-col-reverse gap-5 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-white/50">
            © {year} Havenly Listings. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-white/50 transition-colors duration-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;