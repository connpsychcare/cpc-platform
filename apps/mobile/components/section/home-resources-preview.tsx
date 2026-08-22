import { Text, View } from "react-native";

import { SectionHeader } from "@/components/shared/section-header";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  publicResourceArticles,
  publicResourceFaqs,
  publicResourcesPageContent,
} from "@workspace/shared/constants";

function HomeResourcesPreview() {
  const [featuredArticle, ...moreArticles] = publicResourceArticles.slice(0, 4);
  const faqs = publicResourceFaqs.slice(0, 3);

  return (
    <View className="section-wrapper mt-12 gap-6">
      <SectionHeader
        title="Helpful Answers Before Families Begin"
        description={publicResourcesPageContent.pageDescription}
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button href="/resources" variant="outline" fullWidth>
            Browse Resources
          </Button>
        </View>
        <View className="flex-1">
          <Button href="/faq" fullWidth>
            View FAQ
          </Button>
        </View>
      </View>

      <Button
        href="/resources#blog"
        variant="ghost"
        className="min-h-0 items-stretch rounded-[28px] bg-dark-section p-6"
        contentClassName="w-full flex-col items-start gap-0"
      >
        <View className="flex-row flex-wrap items-center gap-3">
          <Badge variant="secondary" appearance="solid">
            {featuredArticle.category}
          </Badge>
          <View className="flex-row items-center gap-1">
            <AppIcon name="IconBooks" size="sm" color="rgba(255,255,255,0.6)" />
            <Text className="font-secondary text-sm text-white/60">
              {featuredArticle.readTime}
            </Text>
          </View>
        </View>
        <Text className="mt-8 font-primary text-4xl leading-tight text-white">
          {featuredArticle.title}
        </Text>
        <Text className="mt-5 font-secondary text-base leading-7 text-white/70">
          {featuredArticle.description}
        </Text>
        <Text className="mt-10 font-body-semibold text-sm text-white">
          Read family guides
        </Text>
      </Button>

      <View className="rounded-[28px] border border-border bg-card p-5 shadow-soft">
        <Text className="font-body-semibold text-xs uppercase tracking-[2px] text-primary">
          More Guides
        </Text>
        <View className="mt-4 gap-1">
          {moreArticles.map((article) => (
            <Button
              key={article.title}
              href="/resources#blog"
              variant="ghost"
              className="min-h-0 items-stretch rounded-2xl px-0 py-3"
              contentClassName="w-full justify-between gap-4"
            >
              <View className="min-w-0 flex-1">
                <Text className="font-secondary text-xs text-muted-foreground">
                  {article.category} - {article.readTime}
                </Text>
                <Text className="mt-1 font-body-semibold text-sm leading-6 text-foreground">
                  {article.title}
                </Text>
              </View>
              <AppIcon name="ChevronRightIcon" size="sm" />
            </Button>
          ))}
        </View>
      </View>

      <View className="rounded-[28px] border border-primary/10 bg-primary/5 p-5">
        <View className="mb-4 flex-row items-center gap-3">
          <View className="size-11 items-center justify-center rounded-2xl bg-primary/10">
            <AppIcon name="IconHelpCircle" />
          </View>
          <View className="flex-1">
            <Text className="font-primary text-2xl text-foreground">
              Common Questions
            </Text>
            <Text className="font-secondary text-sm text-muted-foreground">
              Quick answers, deeper FAQ one tap away.
            </Text>
          </View>
        </View>
        <View className="gap-3">
          {faqs.map((faq) => (
            <Button
              key={faq.question}
              href="/resources#faq"
              variant="ghost"
              className="min-h-0 items-stretch rounded-2xl bg-background/70 p-4"
              contentClassName="w-full flex-col items-start gap-0"
            >
              <Text className="font-body-semibold text-sm text-foreground">
                {faq.question}
              </Text>
              <Text
                numberOfLines={2}
                className="mt-1 font-secondary text-xs leading-5 text-muted-foreground"
              >
                {faq.answer}
              </Text>
            </Button>
          ))}
        </View>
      </View>
    </View>
  );
}

export default HomeResourcesPreview;
