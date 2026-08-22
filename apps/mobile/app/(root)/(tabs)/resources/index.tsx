import { Text, View } from "react-native";
import {
  publicResourceArticles,
  publicResourceFaqs,
  publicResourcesPageContent,
} from "@workspace/shared/constants";

import { PublicCtaSection } from "@/components/shared/public-cta-section";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { PublicPageLayout } from "@/components/shared/public-page-layout";
import { SectionHeader } from "@/components/shared/section-header";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ResourcesRoute() {
  return (
    <PublicPageLayout>
      <PublicPageHeader
        eyebrow="Resources"
        title={publicResourcesPageContent.pageTitle}
        description={publicResourcesPageContent.pageDescription}
      />

      {/* ── Articles ─────────────────────────────────────── */}
      <View className="section-wrapper mt-12">
        <SectionHeader
          title={publicResourcesPageContent.articlesTitle}
          description={publicResourcesPageContent.articlesDescription}
        />

        <View className="mt-6 gap-4">
          {publicResourceArticles.map((article) => (
            <Button
              key={article.slug}
              href={`/resources/${article.slug}`}
              variant="ghost"
              className="h-auto p-0"
            >
              <Card className="w-full bg-card shadow-soft">
                <CardContent className="py-1">
                  <View className="flex-row items-center justify-between gap-3">
                    <Badge variant="secondary" appearance="soft">
                      {article.category}
                    </Badge>
                    <View className="flex-row items-center gap-1">
                      <AppIcon name="IconBooks" size="sm" color="var(--muted-foreground)" />
                      <Text className="font-secondary text-xs text-muted-foreground">
                        {article.readTime}
                      </Text>
                    </View>
                  </View>
                  <Text className="mt-4 font-primary text-2xl leading-8 text-foreground">
                    {article.title}
                  </Text>
                  <Text className="mt-3 font-secondary text-sm leading-7 text-muted-foreground">
                    {article.description}
                  </Text>
                </CardContent>
              </Card>
            </Button>
          ))}
        </View>
      </View>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <View className="mt-12 bg-secondary py-12">
        <View className="section-wrapper">
          <SectionHeader
            title={publicResourcesPageContent.faqTitle}
            description={publicResourcesPageContent.faqDescription}
            centered
          />

          <View className="mt-6 gap-4">
            {publicResourceFaqs.map((faq) => (
              <Card key={faq.question} className="bg-card shadow-soft">
                <CardContent className="py-1">
                  <View className="flex-row items-start gap-3">
                    <AppIcon name="IconHelpCircle" mode="wrap" size="md" variant="primary" />
                    <View className="flex-1">
                      <Text className="font-body-semibold text-sm text-foreground">
                        {faq.question}
                      </Text>
                      <Text className="mt-3 font-secondary text-sm leading-7 text-muted-foreground">
                        {faq.answer}
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>

          <Text className="mt-6 text-center font-secondary text-sm text-muted-foreground">
            {publicResourcesPageContent.askTeamPrompt}
          </Text>
          <Button href="/contact" className="mt-4" fullWidth>
            {publicResourcesPageContent.askTeamLabel}
          </Button>
        </View>
      </View>

      <PublicCtaSection
        eyebrow="Resources"
        title={publicResourcesPageContent.ctaTitle}
        description={publicResourcesPageContent.ctaDescription}
        primaryLabel={publicResourcesPageContent.ctaPrimaryLabel}
        primaryHref="/contact"
        secondaryLabel={publicResourcesPageContent.ctaSecondaryLabel}
        secondaryHref="/services"
      />
    </PublicPageLayout>
  );
}
