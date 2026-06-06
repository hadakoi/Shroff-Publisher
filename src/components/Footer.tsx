import Link from "next/link";
import { IconBrandTwitter, IconBrandLinkedin, IconBrandInstagram } from "@tabler/icons-react";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about-us" },
    { label: "Contact", href: "/contact-us" },
    { label: "Our Retailers", href: "/our-retailers" },
    { label: "Our Distributors", href: "/our-distributors" },
  ],
  browse: [
    { label: "All Books", href: "/books" },
    { label: "Artificial Intelligence", href: "/books?category=artificial-intelligence" },
    { label: "Python Programming", href: "/books?category=python-programming" },
    { label: "Computer Science", href: "/books?category=computer-science" },
  ],
  support: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Returns", href: "/returns" },
    { label: "Track Order", href: "/track-order" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 lg:py-16">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-lg font-bold text-white tracking-tight">Shroff Publishers</span>
            </Link>
            <p className="text-[13px] text-slate-500 leading-relaxed mb-5 max-w-[220px]">
              India's leading distributor of technical books from O'Reilly, Packt, and more. Since 1990.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://twitter.com/shroffpublishers" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors" aria-label="Twitter">
                <IconBrandTwitter stroke={1.5} size={18} />
              </a>
              <a href="https://www.linkedin.com/company/shroff-publishers" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors" aria-label="LinkedIn">
                <IconBrandLinkedin stroke={1.5} size={18} />
              </a>
              <a href="https://www.instagram.com/shroffpublishers" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors" aria-label="Instagram">
                <IconBrandInstagram stroke={1.5} size={18} />
              </a>
            </div>
          </div>

          {/* Browse */}
          <div>
            <h3 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-4">Browse</h3>
            <ul className="space-y-2.5">
              {footerLinks.browse.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-slate-500 hover:text-slate-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-slate-500 hover:text-slate-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[13px] text-slate-500 hover:text-slate-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-slate-600">
            Shroff Publishers & Distributors Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <span className="text-[12px] text-slate-600">Privacy Policy</span>
            <span className="text-[12px] text-slate-600">Terms of Use</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
