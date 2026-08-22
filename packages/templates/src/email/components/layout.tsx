import {
  Html,
  Body,
  Container,
  Hr,
  Text,
  Preview,
  Tailwind,
  Section,
  Link,
  Row,
  Column,
} from "@react-email/components";
import { appName, publicPractice } from "@workspace/shared/constants";
import { emailTheme } from "./theme";

interface LayoutProps {
  children: React.ReactNode;
  previewText?: string;
}

export const Layout = ({ children, previewText }: LayoutProps) => (
  <Html lang="en">
    {previewText && <Preview>{previewText}</Preview>}
    <Tailwind>
      <Body className="font-sans" style={{ backgroundColor: emailTheme.background }}>
        <Container
          className="mx-auto my-8 max-w-[600px] overflow-hidden rounded-2xl border p-0"
          style={{ backgroundColor: emailTheme.surface, borderColor: emailTheme.border }}
        >
          {/* Brand header strip */}
          <Section
            className="px-8 py-6"
            style={{
              background: `linear-gradient(135deg, ${emailTheme.primary} 0%, ${emailTheme.primaryLight} 100%)`,
            }}
          >
            <Text
              className="m-0 text-xs font-bold uppercase tracking-[0.22em]"
              style={{ color: emailTheme.primaryForeground }}
            >
              {appName.short}
            </Text>
            <Text
              className="m-0 mt-1 text-[13px]"
              style={{ color: "rgba(255,255,255,0.82)" }}
            >
              Evidence-based psychiatric care for adults and adolescents
            </Text>
          </Section>

          {/* Main content */}
          <Section className="px-8 py-8">{children}</Section>

          {/* Divider */}
          <Hr className="my-0" style={{ borderColor: emailTheme.border }} />

          {/* Footer */}
          <Section className="px-8 py-6">
            <Row>
              <Column>
                <Text
                  className="m-0 text-xs font-semibold"
                  style={{ color: emailTheme.foreground }}
                >
                  {appName.default}
                </Text>
                <Text
                  className="m-0 mt-1 text-[11px] leading-5"
                  style={{ color: emailTheme.mutedForeground }}
                >
                  {publicPractice.address.line1}
                  {"\n"}
                  {publicPractice.address.line2}, {publicPractice.address.cityStateZip}
                </Text>
              </Column>
              <Column align="right">
                <Text
                  className="m-0 text-[11px] leading-5"
                  style={{ color: emailTheme.mutedForeground }}
                >
                  <Link
                    href={publicPractice.primaryPhone.href}
                    style={{ color: emailTheme.primary, textDecoration: "none" }}
                  >
                    {publicPractice.primaryPhone.display}
                  </Link>
                  {"\n"}
                  <Link
                    href={`mailto:${publicPractice.supportEmail}`}
                    style={{ color: emailTheme.primary, textDecoration: "none" }}
                  >
                    {publicPractice.supportEmail}
                  </Link>
                </Text>
              </Column>
            </Row>
            <Hr className="my-4" style={{ borderColor: emailTheme.border }} />
            <Text
              className="m-0 text-[11px] leading-5"
              style={{ color: emailTheme.mutedForeground }}
            >
              This email was sent by <strong>{appName.default}</strong>. If you have
              questions, reply to this email or contact us at the number above.
            </Text>
            <Text
              className="m-0 mt-2 text-[11px]"
              style={{ color: emailTheme.mutedForeground }}
            >
              © {new Date().getFullYear()} {publicPractice.legalName}. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
