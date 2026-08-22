"use client";

import {
  footerMenu,
  footerMeta,
  publicSocialLinks,
} from "@workspace/shared/constants";
import { resolvePublicBusinessProfile } from "@workspace/shared/utils";
import Link from "next/link";
import { useMemo } from "react";
import Logo from "@workspace/ui/shared/Logo";
import { appIconMap, type AppIconName } from "@workspace/ui/lib/icons";
import { usePublicBusinessProfile } from "@/hooks/content";

const FooterList = ({
  title,
  items,
}: {
  title: string;
  items: readonly { href: string; label: string; icon?: AppIconName }[];
}) => {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.17em] text-blue-light">
        {title}
      </h3>
      <ul className="mt-5 space-y-3 text-sm text-white/65">
        {items.map((i) => {
          const Icon = i.icon ? appIconMap[i.icon] : null;
          return (
            <li key={i.label}>
              <Link href={i.href} className="flex items-start gap-2">
                {Icon && <Icon className="shrink-0 size-5 text-blue-light" />}
                {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const Footer = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const { data: profile } = usePublicBusinessProfile();
  const business = resolvePublicBusinessProfile(profile);
  const contactLinks = [
    {
      label: business.primaryPhone.display,
      href: business.primaryPhone.href,
      icon: "PhoneIcon" as AppIconName,
    },
    {
      label: business.supportEmail,
      href: `mailto:${business.supportEmail}`,
      icon: "MailIcon" as AppIconName,
    },
    {
      label: business.address.cityStateZip,
      href: business.address.href,
      icon: "MapPinIcon" as AppIconName,
    },
  ] as const;
  const menu = {
    ...footerMenu,
    "Contact Us": contactLinks,
  };
  const socialLinks = publicSocialLinks
    .map((link) => {
      const href =
        link.label === "Facebook"
          ? business.socials.facebook
          : link.label === "Instagram"
            ? business.socials.instagram
            : link.label === "LinkedIn"
              ? business.socials.linkedin
              : undefined;

      return {
        ...link,
        href: href ?? link.href,
      };
    })
    .filter((link) => Boolean(link.href));

  return (
    <footer className="section-wrapper bg-footer py-16 text-footer-foreground sm:py-20">
      <div className="[&_a]:hover:text-blue-light">
        <div className="section-container grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr]">
          <div>
            <Logo variant="dark" size="lg" />
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
              {footerMeta.description}
            </p>
            <div className="mt-6 flex items-center gap-3 text-white/70">
              {socialLinks.map((link) => {
                const Icon = appIconMap[link.icon];

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 active:bg-white/20"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {Object.entries(menu).map(([label, links]) => (
            <FooterList key={label} title={label} items={links} />
          ))}
        </div>

        <div className="section-container mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {currentYear}{" "}
            <span className="text-blue-light">{footerMeta.brandName}</span> •
            Made with ❤️ by{" "}
            <strong className="text-primary">{footerMeta.builder}</strong>
          </p>
          <div className="flex flex-wrap items-center gap-5">
            {footerMeta.legal.map((i) => (
              <Link key={i.label} href={i.href}>
                {i.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
