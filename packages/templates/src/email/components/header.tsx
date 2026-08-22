import { Heading, Text } from "@react-email/components";
import { emailTheme } from "./theme";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => (
  <>
    <Heading
      className="mb-1 mt-0 text-[22px] font-bold leading-tight"
      style={{ color: emailTheme.foreground }}
    >
      {title}
    </Heading>
    {subtitle && (
      <Text
        className="mb-5 mt-1 text-sm"
        style={{ color: emailTheme.mutedForeground }}
      >
        {subtitle}
      </Text>
    )}
  </>
);
