import { Section, Text, Button } from "@react-email/components";
import { NumericCode } from "./numericCode";
import { diffInMinutes } from "@workspace/shared/utils";
import type { Otp } from "@workspace/db/browser";
import { emailTheme } from "./theme";

interface ActionBlockProps {
  link: string;
  label: string;
  otp?: Otp;
}

export const ActionBlock = ({ link, label, otp }: ActionBlockProps) => (
  <Section className="my-7 text-center">
    {otp?.type === "numericCode" ? (
      <>
        <Text className="text-sm" style={{ color: emailTheme.mutedForeground }}>
          Use the verification code below
        </Text>
        <NumericCode code={otp.secret} />
        <Text
          className="text-center text-xs"
          style={{ color: emailTheme.mutedForeground }}
        >
          This code expires in {diffInMinutes(otp.expiresAt)} minutes.
        </Text>
        <Button
          href={link}
          className="inline-block rounded-xl px-6 py-3 font-semibold no-underline"
          style={{
            backgroundColor: emailTheme.primary,
            color: emailTheme.primaryForeground,
          }}
        >
          {label}
        </Button>
      </>
    ) : (
      <Button
        href={link}
        className="inline-block rounded-xl px-6 py-3 font-semibold no-underline"
        style={{
          backgroundColor: emailTheme.primary,
          color: emailTheme.primaryForeground,
        }}
      >
        {label}
      </Button>
    )}
  </Section>
);
