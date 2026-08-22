import { Text, View } from "react-native";
import {
  cookiePolicyCookies,
  cookiePolicySections,
  legalLastUpdated,
  publicPractice,
} from "@workspace/shared/constants";

import { PublicPageHeader } from "@/components/shared/public-page-header";
import { PublicPageLayout } from "@/components/shared/public-page-layout";
import { Card, CardContent } from "@/components/ui/card";

export default function CookiesRoute() {
  return (
    <PublicPageLayout>
      <PublicPageHeader
        eyebrow="Legal"
        title="Cookie Policy"
        description={`Last updated ${legalLastUpdated}. This page explains the cookies and secure device storage used by ${publicPractice.brandName}.`}
        align="center"
      />

      <View className="section-wrapper mt-12 gap-4">
        <Card className="shadow-soft">
          <CardContent className="gap-3 py-1">
            <Text className="font-primary text-2xl text-foreground">
              Cookies We Use
            </Text>
            {cookiePolicyCookies.map((item) => (
              <View key={item.name} className="gap-1 rounded-2xl border border-border px-4 py-3">
                <Text className="font-body-semibold text-sm text-foreground">
                  {item.name} · {item.type}
                </Text>
                <Text className="font-secondary text-sm leading-7 text-muted-foreground">
                  {item.purpose}
                </Text>
                <Text className="font-secondary text-xs text-muted-foreground">
                  Duration: {item.duration}
                </Text>
              </View>
            ))}
          </CardContent>
        </Card>

        {cookiePolicySections.map((section) => (
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
            </CardContent>
          </Card>
        ))}
      </View>
    </PublicPageLayout>
  );
}