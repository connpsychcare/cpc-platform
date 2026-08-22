import { ulid } from "ulid";

export const REFERENCE_PREFIX = {
  appointment: "APT",
  order: "ORD",
  payment: "PAY",
  shipment: "TRK",
  authorization: "AUTH",
  aba: "aba",
} as const;

export type ReferenceEntity = keyof typeof REFERENCE_PREFIX;

export const createReference = (entity: ReferenceEntity) => {
  const refId = ulid().slice(-6).toUpperCase();
  return `${REFERENCE_PREFIX[entity]}-${refId}`;
};

export const slugify = (str: string, slug?: string) => {
  const base = slug && slug.trim().length > 0 ? slug : str;

  return base
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);

  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";

  return last ? `${first}${last}`.toUpperCase() : first.toUpperCase();
};
