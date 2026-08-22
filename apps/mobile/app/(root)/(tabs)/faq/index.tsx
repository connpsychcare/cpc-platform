import { Text, View } from "react-native";
import { publicFaqPageContent, publicResourceFaqs } from "@workspace/shared/constants";

import { PublicCtaSection } from "@/components/shared/public-cta-section";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { PublicPageLayout } from "@/components/shared/public-page-layout";
import { SectionHeader } from "@/components/shared/section-header";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function FaqRoute() {
  return (
    <PublicPageLayout>
      <PublicPageHeader
        eyebrow="FAQ"
        title={publicFaqPageContent.title}
        description={publicFaqPageContent.description}
        align="center"
      />

      <View className="section-wrapper mt-12 gap-6">
        <SectionHeader
          title={publicFaqPageContent.sectionTitle}
          description={publicFaqPageContent.sectionDescription}
          centered
        />

        <View className="gap-4">
          {publicResourceFaqs.map((faq) => (
            <Card key={faq.question} className="bg-card shadow-soft">
              <CardContent className="py-1">
                <View className="flex-row items-start gap-3">
                  <AppIcon name="IconHelpCircle" mode="wrap" size="md" variant="primary" />
                  <View className="flex-1">
                    <Text className="font-primary text-lg text-foreground">
                      {faq.question}
                    </Text>
                    <Text className="mt-2 font-secondary text-sm leading-7 text-muted-foreground">
                      {faq.answer}
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>

        <Button href="/contact" fullWidth>
          {publicFaqPageContent.ctaLabel}
        </Button>
      </View>

      <PublicCtaSection
        eyebrow="Need Guidance?"
        title={publicFaqPageContent.ctaTitle}
        primaryLabel={publicFaqPageContent.ctaPrimaryLabel}
        primaryHref="/contact"
        secondaryLabel={publicFaqPageContent.ctaSecondaryLabel}
        secondaryHref="/services"
      />
    </PublicPageLayout>
  );
}
