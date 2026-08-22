import { Text } from "@react-email/components";
import { emailTheme } from "./theme";

interface GreetingProps {
  name?: string | null;
}

export const Greeting = ({ name }: GreetingProps) => (
  <Text className="text-[15px] leading-relaxed" style={{ color: emailTheme.foreground }}>
    Hello <strong>{name ?? "there"}</strong>,
  </Text>
);
