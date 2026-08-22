import { Text, View } from "react-native";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  centered = false,
}: SectionHeaderProps) {
  return (
    <View className={centered ? "items-center" : ""}>
      {eyebrow ? (
        <Text className="font-body-semibold text-xs uppercase tracking-[2px] text-primary">
          {eyebrow}
        </Text>
      ) : null}
      <Text
        className={`mt-2 font-primary text-3xl leading-tight tracking-tight text-foreground ${
          centered ? "text-center" : ""
        }`}
      >
        {title}
      </Text>
      {description ? (
        <Text
          className={`mt-3 font-secondary text-base leading-7 text-muted-foreground ${
            centered ? "text-center" : ""
          }`}
        >
          {description}
        </Text>
      ) : null}
    </View>
  );
}
