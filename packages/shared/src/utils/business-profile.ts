import { publicPractice } from "../constants/app";

type PublicBranchLike = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

type PublicBusinessProfileLike = {
  name?: string | null;
  legalName?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  branches?: PublicBranchLike[] | null;
};

const digitsOnly = (value: string) => value.replace(/\D/g, "");

export const toPhoneHref = (value: string) => {
  const normalized = value.trim().replace(/[^\d+]/g, "");
  return normalized.startsWith("+")
    ? `tel:${normalized}`
    : `tel:+${digitsOnly(normalized)}`;
};

export const formatUsPhone = (value: string) => {
  const digits = digitsOnly(value);
  const national =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (national.length !== 10) return value;

  return `(${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
};

export const formatInternationalUsPhone = (value: string) => {
  const digits = digitsOnly(value);
  const national =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (national.length !== 10) return value;

  return `+1 (${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
};

export function resolvePublicBusinessProfile(
  profile?: PublicBusinessProfileLike | null,
) {
  const branch =
    profile?.branches?.find((item) => item?.street) ?? profile?.branches?.[0];
  const primaryPhone =
    profile?.phone ?? branch?.phone ?? publicPractice.primaryPhone.display;
  const secondaryPhone =
    profile?.whatsapp ??
    branch?.whatsapp ??
    branch?.phone ??
    publicPractice.secondaryPhone.display;
  const email = profile?.email ?? branch?.email ?? publicPractice.supportEmail;
  const addressParts = branch
    ? [
        branch.name,
        branch.street,
        [branch.city, branch.state, branch.postalCode]
          .filter(Boolean)
          .join(" "),
      ].filter(Boolean)
    : [publicPractice.address.full];
  const addressFull = addressParts.join(", ");
  const addressLine1 = branch?.name ?? publicPractice.address.line1;
  const addressLine2 = branch?.street ?? publicPractice.address.line2;
  const cityStateZip = branch
    ? [branch.city, branch.state, branch.postalCode].filter(Boolean).join(" ")
    : publicPractice.address.cityStateZip;
  const mapsHref =
    addressFull === publicPractice.address.full
      ? publicPractice.address.href
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressFull)}`;

  return {
    brandName: profile?.name ?? publicPractice.brandName,
    legalName: profile?.legalName ?? publicPractice.legalName,
    supportEmail: email,
    primaryPhone: {
      display: formatInternationalUsPhone(primaryPhone),
      short: formatUsPhone(primaryPhone),
      href: toPhoneHref(primaryPhone),
    },
    secondaryPhone: {
      display: formatInternationalUsPhone(secondaryPhone),
      short: formatUsPhone(secondaryPhone),
      href: toPhoneHref(secondaryPhone),
    },
    address: {
      line1: addressLine1,
      line2: addressLine2,
      cityStateZip,
      full: addressFull,
      href: mapsHref,
    },
    officeHours: publicPractice.officeHours,
    socials: {
      facebook: profile?.facebook ?? undefined,
      instagram: profile?.instagram ?? undefined,
      tiktok: profile?.tiktok ?? undefined,
      twitter: profile?.twitter ?? undefined,
      linkedin: profile?.linkedin ?? undefined,
    },
    website: profile?.website ?? undefined,
  };
}

export type ResolvedPublicBusinessProfile = ReturnType<
  typeof resolvePublicBusinessProfile
>;
