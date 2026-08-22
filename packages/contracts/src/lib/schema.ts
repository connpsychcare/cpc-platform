import { z, ZodType } from "zod";
import { BaseSortByEnum, SortOrderEnum } from "./enums";

export const idSchema = z.ulid().nonempty("Invalid id");
export const emailSchema = z
  .email("Invalid email address")
  .transform((value) => value.toLowerCase());
export const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{9,14}$/, "Invalid phone number");
export const identifierSchema = z.union([emailSchema, phoneSchema], {
  error: () => ({
    message: "Identifier must be a valid email or phone number",
  }),
});

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Please enter at least 1 character");

export const slugSchema = z
  .string()
  .trim()
  .min(3)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug");

export const passwordSchema = z.string().min(8);
export const numberSchema = z.coerce.number<number>().min(0);
export const positiveNumberSchema = z.coerce.number<number>().min(1);
export const intNumberSchema = numberSchema.int();
export const positiveIntSchema = positiveNumberSchema.int();
export const optionalStringSchema = z.string().trim().optional();
export const booleanSchema = z.preprocess((value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}, z.boolean()) as ZodType<boolean, boolean | undefined>;

export const isoDateSchema = z.iso
  .datetime({ message: "Invalid date" })
  .transform((value) => new Date(value));

export const timeStringSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format");

export const urlSchema = z.url();
export const requiredStringSchema = z.string().trim().min(1);
export const messageSchema = z.string().trim().min(1).max(4000);
export const percentSchema = z.coerce.number().min(0).max(100);

export const currencySchema = z
  .string()
  .length(3)
  .transform((v) => v.toUpperCase());
export const timezoneSchema = z.string().min(2).max(100);

export const mediaArrSchema = z
  .array(idSchema)
  .transform((items) => items.map((id) => ({ id })));

export const baseQuerySchema = <
  TSortBy extends ZodType,
  TSearchBy extends ZodType,
>(
  sortByEnum: TSortBy,
  searchByEnum: TSearchBy,
  /**
   * Sort column used when the caller sends none.
   *
   * Most models carry "createdAt", so it is the default and is also accepted as
   * an explicit value. Models that do not have it (CaregiverAccess, DataPoint,
   * StaffAssignment) must name one of their own columns here, which then also
   * drops "createdAt" from the accepted values. Without that, an unsorted
   * request reaches Prisma with a column the table does not have and fails.
   */
  defaultSortBy?: z.core.util.NoUndefined<z.output<TSortBy>>,
) => {
  const sortBySchema = defaultSortBy
    ? sortByEnum.default(defaultSortBy)
    : BaseSortByEnum.or(sortByEnum).default("createdAt");

  return z.object({
    page: positiveIntSchema.default(1),
    limit: positiveIntSchema.default(10),
    sortBy: sortBySchema,
    sortOrder: SortOrderEnum.default("desc"),
    search: optionalStringSchema,
    searchBy: searchByEnum.optional(),
    includeIds: z.array(idSchema).default([]),
    excludeIds: z.array(idSchema).default([]),
    includeDeleted: booleanSchema.default(false),
  });
};
