import { Text, View } from "react-native";
import {
  legalLastUpdated,
  publicPractice,
  termsOfServiceSections,
} from "@workspace/shared/constants";

import { PublicPageHeader } from "@/components/shared/public-page-header";
import { PublicPageLayout } from "@/components/shared/public-page-layout";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsRoute() {
  return (
    <PublicPageLayout>
      <PublicPageHeader
        eyebrow="Legal"
        title="Terms of Service"
        description={`Last updated ${legalLastUpdated}. These terms govern use of the ${publicPractice.brandName} website, patient portal, messaging tools, online store, and mobile app.`}
        align="center"
      />

      <View className="section-wrapper mt-12 gap-4">
        {termsOfServiceSections.map((section) => (
          <Card key={section.title} className="shadow-soft">
            <CardContent className="gap-3 py-1">
              <Text className="font-primary text-2xl text-foreground">
                {section.title}
              </Text>
              {section.paragraphs.map((paragraph) => (
                <Text
                  key={paragraph}
                  className="font-secondary text-sm leading-7 text-muted-foreground"
                >
                  {paragraph}
                </Text>
              ))}
              {section.bullets?.map((item) => (
                <Text
                  key={item}
                  className="font-secondary text-sm leading-7 text-muted-foreground"
                >
                  {`• ${item}`}
                </Text>
              ))}
            </CardContent>
          </Card>
        ))}
      </View>
    </PublicPageLayout>
  );
}