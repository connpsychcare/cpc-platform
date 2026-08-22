import { Text, View } from "react-native";
import { useMemo } from "react";

import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import {
  footerMenu,
  footerMeta,
  publicSocialLinks,
} from "@workspace/shared/constants";
import { resolvePublicBusinessProfile } from "@workspace/shared/utils";
import type { AppIconName } from "@/lib/icons";
import { usePublicBusinessProfile } from "@/hooks/use-public-content";
import { Logo } from "./logo";

function FooterList({
  title,
  items,
}: {
  title: string;
  items: readonly { href: string; label: string; icon?: string }[];
}) {
  return (
    <View className="gap-3">
      <Text className="font-primary text-lg font-semibold text-footer-foreground">
        {title}
      </Text>
      <View className="gap-2.5">
        {items.map((item) => (
          <Button
            key={`${title}-${item.label}`}
            href={item.href}
            variant="link"
            fullWidth
            className="min-h-0 items-start justify-start self-start border-0 px-0 py-0"
            contentClassName="w-full justify-start"
          >
            {item.icon && <AppIcon name={item.icon as AppIconName} size="sm" />}
            <Text className="font-secondary text-sm text-footer-foreground/65">
              {item.label}
            </Text>
          </Button>
        ))}
      </View>
    </View>
  );
}

export function MobileFooter() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const { data: profile } = usePublicBusinessProfile();
  const business = resolvePublicBusinessProfile(profile);
  const contactLinks = [
    {
      label: business.primaryPhone.display,
      href: business.primaryPhone.href,
      icon: "PhoneIcon",
    },
    {
      label: business.supportEmail,
      href: `mailto:${business.supportEmail}`,
      icon: "MailIcon",
    },
    {
      label: business.address.cityStateZip,
      href: business.address.href,
      icon: "MapPinIcon",
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
    <View className="mt-8 bg-footer">
      <View className="section-wrapper gap-10 py-16">
        <View>
          <Logo size="lg" />
          <Text className="mt-5 font-secondary text-sm leading-7 text-footer-foreground/65">
            {footerMeta.description}
          </Text>
          <View className="mt-6 flex-row flex-wrap gap-3">
            {socialLinks.map((link) => (
              <Button
                key={link.label}
                href={link.href}
                variant="ghost"
                className="size-9 rounded-full border border-footer-foreground/10 bg-footer-foreground/5 p-0"
              >
                <AppIcon
                  name={link.icon as AppIconName}
                  size="sm"
                  variant="primary"
                />
              </Button>
            ))}
          </View>
        </View>

        {Object.entries(menu).map(([label, links]) => (
          <FooterList key={label} title={label} items={links} />
        ))}

        <View className="border-t border-footer-foreground/10 pt-6 gap-4">
          <Text className="font-secondary text-sm text-footer-foreground/50">
            © {currentYear}{" "}
            <Text className="text-primary">{footerMeta.brandName}</Text> • Made
            with ❤️ by{" "}
            <Text className="font-semibold">{footerMeta.builder}</Text>
          </Text>
          <View className="flex-row flex-wrap gap-5">
            {footerMeta.legal.map((item) => (
              <Button
                key={item.label}
                href={item.href}
                variant="link"
                className="min-h-0 items-start justify-start self-start border-0 px-0 py-0"
                contentClassName="w-full justify-start"
              >
                <Text className="font-secondary text-xs text-footer-foreground/50">
                  {item.label}
                </Text>
              </Button>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
