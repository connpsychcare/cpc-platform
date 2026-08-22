import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, CheckCheck } from "lucide-react-native";

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
import { SectionCard } from "@/components/shared/section-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { InternalScreen } from "@/components/internal/internal-screen";
import {
  useAppointment,
  useConversationByAppointment,
  useMarkChatMessageRead,
  useMessages,
  useMyClinicalForms,
  useSendMessage,
  useUpdateAppointmentStatus,
} from "@/hooks/use-healthcare";
import useUser from "@/hooks/use-user";
import { formatDate } from "@workspace/shared/utils";
import {
  formatStatusLabel,
  getAppointmentStatusMeta,
} from "@/lib/patient-status";
import { useToast } from "@/providers/toast";
import { getChatSocket } from "@/lib/socket";
import { useThemeColor } from "@/lib/theme";

type AppointmentStatus =
  | "booked"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "noShow";

const VALID_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  booked: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled", "noShow"],
  completed: [],
  cancelled: [],
  noShow: [],
};

const STATUS_ACTION_LABELS: Record<AppointmentStatus, string> = {
  confirmed: "Confirm",
  completed: "Mark Complete",
  cancelled: "Cancel",
  noShow: "Mark No-Show",
  booked: "Set Booked",
};

function DetailSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-10 w-40 rounded-full" />
        <Skeleton className="h-72 w-full rounded-[28px]" />
        <Skeleton className="h-96 w-full rounded-[28px]" />
      </View>
    </InternalScreen>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View className="flex-row gap-3 py-2">
      <Text className="w-28 font-secondary text-sm text-muted-foreground">{label}</Text>
      <Text className="flex-1 font-secondary text-sm text-foreground">{value}</Text>
    </View>
  );
}

export function InternalAppointmentDetail({
  appointmentId,
  rolePrefix,
}: {
  appointmentId: string;
  rolePrefix: string;
}) {
  const insets = useSafeAreaInsets();
  const { success, error } = useToast();
  const { currentUser } = useUser();
  const { data: appt, isLoading } = useAppointment(appointmentId);
  const patientProfileId: string | undefined = (appt as any)?.patient?.id;
  const { data: clinicalForms } = useMyClinicalForms(
    patientProfileId ? { patientId: patientProfileId, limit: 10, sortOrder: "desc" } : {},
  );
  const { data: conversation } = useConversationByAppointment(appointmentId);
  const {
    data: messages,
    deliveredIds,
    isLoading: isMessagesLoading,
  } = useMessages(conversation?.id);
  const { sendMessage, isPending: isSending } = useSendMessage(conversation?.id);
  const { mutate: markRead } = useMarkChatMessageRead();
  const { updateStatus: updateAsync, isPending: isStatusPending } = useUpdateAppointmentStatus(appointmentId);
  const [messageText, setMessageText] = useState("");
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);
  const msgColor = useThemeColor("muted", "foreground");

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Mark unread messages as read on mount.
  useEffect(() => {
    if (!messages.length || !currentUser?.id) return;
    const unread = messages.filter(
      (m: any) => m.senderId !== currentUser.id && !m.readAt,
    );
    for (const msg of unread) markRead(msg.id);
  }, [currentUser?.id, markRead, messages]);

  // Typing indicator via socket.
  useEffect(() => {
    if (!conversation?.id) return;
    let active = true;
    void getChatSocket().then((sock) => {
      if (!active) return;
      sock.on("typing", (data: { conversationId: string; userId: string }) => {
        if (data.conversationId !== conversation.id) return;
        if (data.userId === currentUser?.id) return;
        if (isMountedRef.current) setIsOtherTyping(true);
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => {
          if (isMountedRef.current) setIsOtherTyping(false);
        }, 2000);
      });
    });
    return () => {
      active = false;
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [conversation?.id, currentUser?.id]);

  const handleSend = useCallback(async () => {
    const body = messageText.trim();
    if (!body) return;
    try {
      await sendMessage({ body });
      setMessageText("");
    } catch (e: any) {
      error("Could not send message.", { description: e?.message });
    }
  }, [error, messageText, sendMessage]);

  const handleStatusUpdate = async (newStatus: AppointmentStatus) => {
    try {
      await updateAsync({ status: newStatus });
      success(`Appointment ${STATUS_ACTION_LABELS[newStatus].toLowerCase()}ed.`);
    } catch (e: any) {
      error("Status update failed.", { description: e?.message });
    }
  };

  if (isLoading) return <DetailSkeleton />;
  if (!appt) return null;

  const status = getAppointmentStatusMeta(appt.status);
  const patientName = (appt as any).patient?.user?.displayName ?? "Patient";
  const providerName = (appt as any).provider?.user?.displayName ?? "Provider";
  const canMessage =
    appt.status === "booked" || appt.status === "confirmed";
  const transitions =
    VALID_TRANSITIONS[appt.status as AppointmentStatus] ?? [];

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="section-wrapper gap-6 pt-6">
          <Button
            variant="ghost"
            size="sm"
            className="self-start"
            onPress={() => router.back()}
          >
            <AppIcon name="ArrowLeftIcon" size="sm" variant="secondary" />
            <Text className="font-secondary text-sm text-muted-foreground">Back</Text>
          </Button>

          {/* ── Appointment info ──────────────────────────────── */}
          <SectionCard title="Appointment Details" className="shadow-soft">
            <View className="gap-0">
              <View className="flex-row items-center gap-2 pb-4">
                <Badge variant={status.variant}>{status.label}</Badge>
                <Badge variant="secondary">{formatStatusLabel(appt.channel)}</Badge>
              </View>

              <Separator className="mb-3" />

              <DetailRow label="Patient" value={patientName} />
              <DetailRow label="Provider" value={providerName} />
              <DetailRow
                label="Date"
                value={formatDate(appt.scheduledStartAt, { mode: "date" })}
              />
              <DetailRow
                label="Time"
                value={`${formatDate(appt.scheduledStartAt, { mode: "time" })} – ${formatDate(appt.scheduledEndAt, { mode: "time" })}`}
              />
              {(appt as any).location ? (
                <DetailRow label="Location" value={(appt as any).location} />
              ) : null}
              {(appt as any).patientNotes ? (
                <DetailRow label="Patient notes" value={(appt as any).patientNotes} />
              ) : null}
              {(appt as any).therapistNotes ? (
                <DetailRow label="Therapist notes" value={(appt as any).therapistNotes} />
              ) : null}
            </View>
          </SectionCard>

          {/* ── Patient clinical brief ────────────────────────── */}
          {patientProfileId && (() => {
            const forms = clinicalForms?.forms ?? [];
            const phq9 = forms.find((f: any) => f.formType === "phq9");
            const gad7 = forms.find((f: any) => f.formType === "gad7");
            const asrs = forms.find((f: any) => f.formType === "asrsAdult");
            if (!phq9 && !gad7 && !asrs) return null;
            return (
              <SectionCard title="Patient Screening Brief" description="Latest validated screening scores.">
                <View className="gap-2">
                  {phq9?.totalScore != null && (
                    <View className="flex-row items-center justify-between py-1">
                      <Text className="font-secondary text-sm text-muted-foreground">PHQ-9 (Depression)</Text>
                      <View className="flex-row items-center gap-2">
                        <Text className="font-secondary text-sm font-semibold text-foreground">{phq9.totalScore}</Text>
                        {phq9.interpretation ? (
                          <Text className="font-secondary text-xs text-muted-foreground capitalize">· {phq9.interpretation}</Text>
                        ) : null}
                      </View>
                    </View>
                  )}
                  {gad7?.totalScore != null && (
                    <View className="flex-row items-center justify-between py-1">
                      <Text className="font-secondary text-sm text-muted-foreground">GAD-7 (Anxiety)</Text>
                      <View className="flex-row items-center gap-2">
                        <Text className="font-secondary text-sm font-semibold text-foreground">{gad7.totalScore}</Text>
                        {gad7.interpretation ? (
                          <Text className="font-secondary text-xs text-muted-foreground capitalize">· {gad7.interpretation}</Text>
                        ) : null}
                      </View>
                    </View>
                  )}
                  {asrs && (
                    <View className="flex-row items-center justify-between py-1">
                      <Text className="font-secondary text-sm text-muted-foreground">ASRS (ADHD)</Text>
                      <View className="flex-row items-center gap-2">
                        {asrs.totalScore != null && (
                          <Text className="font-secondary text-sm font-semibold text-foreground">{asrs.totalScore}</Text>
                        )}
                        {asrs.interpretation ? (
                          <Text className="font-secondary text-xs text-muted-foreground capitalize">· {asrs.interpretation}</Text>
                        ) : null}
                      </View>
                    </View>
                  )}
                </View>
              </SectionCard>
            );
          })()}

          {/* ── Status update ─────────────────────────────────── */}
          {transitions.length > 0 ? (
            <SectionCard title="Update Status" description="Move this appointment to the next stage.">
              <View className="flex-row flex-wrap gap-2">
                {transitions.map((s) => (
                  <Button
                    key={s}
                    variant="outline"
                    size="sm"
                    disabled={isStatusPending}
                    onPress={() => handleStatusUpdate(s)}
                  >
                    {STATUS_ACTION_LABELS[s]}
                  </Button>
                ))}
              </View>
            </SectionCard>
          ) : null}

          {/* ── Messaging ─────────────────────────────────────── */}
          <SectionCard
            title="Appointment Chat"
            description={
              canMessage
                ? "Send a message to the patient or care team."
                : "Messaging is only available while the appointment is booked or confirmed."
            }
            className="shadow-soft"
          >
            {isMessagesLoading ? (
              <View className="gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-3/4 rounded-2xl" />
                ))}
              </View>
            ) : messages.length === 0 ? (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="IconMessageCircle" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No messages yet</EmptyTitle>
                  <EmptyDescription>
                    {canMessage
                      ? "Send the first message below."
                      : "No messages were sent during this appointment."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <View className="gap-2">
                {messages.map((msg: any) => {
                  const isOwn = msg.senderId === currentUser?.id;
                  const isDelivered = deliveredIds.has(msg.id);
                  return (
                    <View
                      key={msg.id}
                      className={`max-w-[80%] rounded-2xl px-3 py-2 ${isOwn ? "ml-auto bg-primary" : "bg-muted"}`}
                    >
                      {!isOwn && (
                        <Text className="mb-0.5 font-secondary text-[10px] text-muted-foreground">
                          {msg.sender?.displayName ?? "Them"}
                        </Text>
                      )}
                      <Text
                        className={`font-secondary text-sm ${isOwn ? "text-primary-foreground" : "text-foreground"}`}
                      >
                        {msg.body}
                      </Text>
                      <View className="mt-1 flex-row items-center justify-end gap-1">
                        <Text
                          className={`font-secondary text-[10px] ${isOwn ? "text-primary-foreground/60" : "text-muted-foreground"}`}
                        >
                          {formatDate(msg.createdAt, { mode: "time" })}
                        </Text>
                        {isOwn && (
                          msg.readAt ? (
                            <CheckCheck size={12} color={msgColor} />
                          ) : isDelivered ? (
                            <CheckCheck size={12} color={msgColor} />
                          ) : (
                            <Check size={12} color={msgColor} />
                          )
                        )}
                      </View>
                    </View>
                  );
                })}
                {isOtherTyping && (
                  <Text className="font-secondary text-xs italic text-muted-foreground">
                    Typing…
                  </Text>
                )}
              </View>
            )}

            {canMessage ? (
              <View className="mt-4 gap-2">
                <Textarea
                  value={messageText}
                  onChangeText={setMessageText}
                  placeholder="Type a message…"
                  maxLength={2000}
                />
                <Button
                  onPress={handleSend}
                  disabled={!messageText.trim() || isSending}
                  fullWidth
                >
                  Send
                </Button>
              </View>
            ) : null}
          </SectionCard>
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
