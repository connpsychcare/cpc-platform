import Image from "next/image";

/** Small circular provider thumbnail, falling back to initials when there is no photo. */
export default function ProviderAvatar({
  name,
  photo,
}: {
  name?: string;
  photo?: string;
}) {
  const initials = (name ?? "CPC")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (photo) {
    return (
      <span className="relative size-12 shrink-0 overflow-hidden rounded-xl">
        <Image src={photo} alt={name ?? "Provider"} fill className="object-cover object-top" />
      </span>
    );
  }

  return (
    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary font-primary text-sm font-extrabold text-brand-ink">
      {initials}
    </span>
  );
}
