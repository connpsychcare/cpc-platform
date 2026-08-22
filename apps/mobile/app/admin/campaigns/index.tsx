import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Alert, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  CampaignAudienceEnum,
  NotificationChannelEnum,
} from "@workspace/contracts";
import {
  notificationCampaignSchema,
  type NotificationCampaignType,
} from "@workspace/contracts/campaign";

import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Form, FormSection } from "@/components/ui/form";
import { GradientCard } from "@/components/shared/gradient-card";
import { InputField } from "@/components/ui/input-field";
import { InternalScreen } from "@/components/internal/internal-screen";
import { SectionCard } from "@/components/shared/section-card";
import { SelectField } from "@/components/ui/select-field";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCampaigns,
  useCreateCampaign,
  useUpdateCampaignStatus,
  useSendCampaign,
} from "@/hooks/use-healthcare";
import { useToast } from "@/providers/toast";

const STATUS_VARIANTS: Record<string, AppUIVariant> = {
  draft: "secondary",
  scheduled: "warning",
  sent: "success",
  failed: "destructive",
};

const AUDIENCE_LABELS: Record<string, string> = {
  allUsers: "All Users",
  patients: "Patients",
  providers: "Providers",
  staff: "Staff",
  custom: "Custom",
};

const CHANNEL_LABELS: Record<string, string> = {
  push: "Push",
  email: "Email",
  sms: "SMS",
  whatsapp: "WhatsApp",
};

function CampaignsSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-4 pt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </View>
    </InternalScreen>
  );
}

const AUDIENCE_OPTIONS = CampaignAudienceEnum.options.map((v) => ({
  label: AUDIENCE_LABELS[v] ?? v,
  value: v,
}));

const CHANNEL_OPTIONS = NotificationChannelEnum.options.map((v) => ({
  label: CHANNEL_LABELS[v] ?? v,
  value: v,
}));

const CREATE_DEFAULTS: NotificationCampaignType = {
  audience: "patients",
  channel: "email",
  title: "",
  subject: undefined,
  message: "",
  scheduledAt: undefined,
};

function CreateCampaignPanel({ onDone }: { onDone: () => void }) {
  const { createAsync, isPending } = useCreateCampaign();
  const { error, success } = useToast();

  const form = useForm({
    defaultValues: CREATE_DEFAULTS,
    validators: { onSubmit: notificationCampaignSchema },
    onSubmit: async ({ value }) => {
      try {
        await createAsync(value);
        success("Campaign created successfully.");
        onDone();
      } catch (cause: any) {
        error("Failed to create campaign.", { description: cause?.message });
      }
    },
  });

  return (
    <Form form={form} className="gap-4">
      <FormSection title="Campaign Setup">
        <SelectField
          form={form}
          name="audience"
          label="Audience"
          options={AUDIENCE_OPTIONS}
        />
        <SelectField
          form={form}
          name="channel"
          label="Channel"
          options={CHANNEL_OPTIONS}
        />
        <InputField form={form} name="title" label="Title" />
        <InputField
          form={form}
          name="subject"
          label="Subject (optional)"
          placeholder="Email subject line"
        />
        <InputField
          form={form}
          name="message"
          label="Message"
          type="textarea"
          rows={4}
        />
        <InputField
          form={form}
          name="scheduledAt"
          label="Scheduled At (optional)"
          placeholder="e.g. 2026-07-01T09:00:00Z"
        />
      </FormSection>

      <View className="flex-row gap-3">
        <Button variant="outline" className="flex-1" onPress={onDone}>
          Cancel
        </Button>
        <Button
          className="flex-1"
          onPress={() => form.handleSubmit()}
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Campaign"}
        </Button>
      </View>
    </Form>
  );
}

export default function AdminCampaignsRoute() {
  const { data, isLoading } = useCampaigns({ limit: 50 });
  const insets = useSafeAreaInsets();
  const [showCreate, setShowCreate] = useState(false);

  if (isLoading) return <CampaignsSkeleton />;

  const campaigns = (data as any)?.campaigns ?? [];

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="section-wrapper gap-6 pt-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-primary text-3xl text-foreground">
                Campaigns
              </Text>
              <Text className="font-secondary text-sm text-muted-foreground">
                {campaigns.length} notification campaign
                {campaigns.length !== 1 ? "s" : ""}
              </Text>
            </View>
            <Button
              size="sm"
              onPress={() => setShowCreate((v) => !v)}
            >
              <AppIcon name="PlusIcon" size="sm" variant="accent" />
              New
            </Button>
          </View>

          {showCreate ? (
            <SectionCard
              title="New Campaign"
              className="shadow-soft"
              contentClassName="gap-4"
            >
              <CreateCampaignPanel onDone={() => setShowCreate(false)} />
            </SectionCard>
          ) : null}

          <SectionCard
            title="All Campaigns"
            className="shadow-soft"
            contentClassName="gap-3"
          >
            {campaigns.length ? (
              campaigns.map((c: any) => (
                <CampaignCard key={c.id} campaign={c} />
              ))
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="BellIcon" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No campaigns</EmptyTitle>
                  <EmptyDescription>
                    Create your first notification campaign above.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </SectionCard>
        </View>
      </ScrollView>
    </InternalScreen>
  );
}

function CampaignCard({ campaign: c }: { campaign: any }) {
  const { updateStatusAsync, isPending: isUpdating } = useUpdateCampaignStatus(c.id);
  const { sendAsync, isPending: isSending } = useSendCampaign(c.id);

  const handleSend = () => {
    Alert.alert(
      "Send Campaign",
      `Send "${c.title}" to ${AUDIENCE_LABELS[c.audience] ?? c.audience}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Now",
          onPress: async () => {
            await sendAsync();
          },
        },
      ],
    );
  };

  const handleScheduleToggle = async () => {
    if (c.status === "scheduled") {
      await updateStatusAsync({ campaignId: c.id, status: "draft" });
    } else if (c.status === "draft") {
      await updateStatusAsync({ campaignId: c.id, status: "scheduled" });
    }
  };

  return (
    <GradientCard variant={STATUS_VARIANTS[c.status] ?? "secondary"}>
      <View className="gap-2">
        <View className="flex-row items-start justify-between gap-2">
          <Text className="flex-1 font-body-semibold text-sm text-foreground">
            {c.title}
          </Text>
          <Badge
            variant={STATUS_VARIANTS[c.status] ?? "secondary"}
            className="capitalize"
          >
            {c.status}
          </Badge>
        </View>
        {c.subject ? (
          <Text className="font-secondary text-xs text-muted-foreground">
            Subject: {c.subject}
          </Text>
        ) : null}
        <Text
          className="font-secondary text-xs text-muted-foreground"
          numberOfLines={2}
        >
          {c.message}
        </Text>
        <Text className="font-secondary text-xs text-muted-foreground">
          {AUDIENCE_LABELS[c.audience] ?? c.audience} ·{" "}
          {CHANNEL_LABELS[c.channel] ?? c.channel}
        </Text>
        {c.scheduledAt ? (
          <Text className="font-secondary text-xs text-muted-foreground">
            Scheduled: {new Date(c.scheduledAt).toLocaleString()}
          </Text>
        ) : null}
        {c.status === "draft" || c.status === "scheduled" ? (
          <View className="mt-1 flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onPress={handleScheduleToggle}
              disabled={isUpdating}
            >
              {c.status === "scheduled" ? "Unschedule" : "Mark Scheduled"}
            </Button>
            <Button
              size="sm"
              onPress={handleSend}
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send Now"}
            </Button>
          </View>
        ) : null}
        {c.recipients?.length ? (
          <Text className="font-secondary text-xs text-muted-foreground">
            {c.recipients.length} recipient
            {c.recipients.length !== 1 ? "s" : ""}
          </Text>
        ) : null}
      </View>
    </GradientCard>
  );
}
