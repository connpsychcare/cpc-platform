import { Text, View } from "react-native";
import { usePublicStats } from "@/hooks/use-public-content";
import { AppIcon } from "../ui/app-icon";
import { publicHomeStats } from "@workspace/shared/constants";

function StatsSection() {
  const { data } = usePublicStats();

  const stats = data
    ? [
        {
          value: `${data.patientsServed}+`,
          label: publicHomeStats[0].label,
          icon: publicHomeStats[0].icon,
        },
        {
          value: `${data.staffCount}+`,
          label: publicHomeStats[1].label,
          icon: publicHomeStats[1].icon,
        },
        {
          value: `${data.yearsInOperation}+`,
          label: publicHomeStats[2].label,
          icon: publicHomeStats[2].icon,
        },
        {
          value: `${data.satisfactionRate}%`,
          label: publicHomeStats[3].label,
          icon: publicHomeStats[3].icon,
        },
      ]
    : publicHomeStats;

  return (
    <View className="mt-10 bg-secondary py-12">
      <View className="section-wrapper flex-row flex-wrap gap-y-8">
        {stats.map((stat) => (
          <View key={stat.label} className="w-1/2 items-center px-2">
            <View className="size-14 items-center justify-center rounded-2xl bg-primary/10">
              <AppIcon name={stat.icon} />
            </View>
            <Text className="mt-3 font-primary text-3xl text-foreground">
              {stat.value}
            </Text>
            <Text className="mt-1 text-center font-secondary text-sm leading-5 text-muted-foreground">
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default StatsSection;
