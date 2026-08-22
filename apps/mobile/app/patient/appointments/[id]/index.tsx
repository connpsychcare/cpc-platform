import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { Check, CheckCheck } from "lucide-react-native";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { PatientScreen } from "@/components/shared/patient-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { AppIcon } from "@/components/ui/app-icon";
import {
  useAppointment,
  useConversationByAppointment,
  useMarkChatMessageRead,
  useMessages,
  useSendMessage,
} from "@/hooks/use-healthcare";
import useUser from "@/hooks/use-user";
import { formatDate } from "@workspace/shared/utils";
import {
  formatStatusLabel,
  getAppointmentStatusMeta,
  getPaymentStatusMeta,
} from "@/lib/patient-status";
import { useToast } from "@/providers/toast";
import { getChatSocket } from "@/lib/socket";

const ROLE_LABEL: Record<string, string> = {
  provider: "Provider",
  staff: "Staff",
  admin: "Admin",
  patient: "Patient",
};

function AppointmentDetailSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-10 w-40 rounded-full" />
        <Skeleton className="h-72 w-full rounded-[28px]" />
        <Skeleton className="h-96 w-full rounded-[28px]" />
      </View>
    </PatientScreen>
  );
}

export default function PatientAppointmentDetailRoute() {
  const { error } = useToast();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const resolvedId = Array.isArray(id) ? id[0] : id;
  const { currentUser } = useUser();
  const { data: appointment, isLoading } = useAppointment(resolvedId);
  const { data: conversation } = useConversationByAppointment(resolvedId);
  const { data: messages, deliveredIds, isLoading: isMessagesLoading } = useMessages(
    conversation?.id,
  );
  const { sendMessage, isPending: isSending } = useSendMessage(
    conversation?.id,
  );
  const { mutate: markRead } = useMarkChatMessageRead();
  const [messageText, setMessageText] = useState("");
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!messages.length || !currentUser?.id) return;
    const unread = messages.filter(
      (m: any) => m.senderId !== currentUser.id && !m.readAt,
    );
    for (const msg of unread) {
      markRead(msg.id);
    }
  }, [messages, currentUser?.id]);

  useEffect(() => {
    if (!conversation?.id) return;
    const conversationId = conversation.id;
    let active = true;
    let registeredSock: Awaited<ReturnType<typeof getChatSocket>> | null = null;
    let onTyping: ((data: { conversationId: string }) => void) | null = null;

    getChatSocket().then((sock) => {
      if (!active) return;
      registeredSock = sock;
      onTyping = (data: { conversationId: string }) => {
        if (data.conversationId !== conversationId) return;
        setIsOtherTyping(true);
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => setIsOtherTyping(false), 3000);
      };
      sock.on("typing", onTyping);
    }).catch(() => {});

    return () => {
      active = false;
      if (onTyping && registeredSock) registeredSock.off("typing", onTyping);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [conversation?.id]);

  const typingCooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notifyTyping = useCallback(() => {
    if (!conversation?.id || typingCooldownRef.current) return;
    getChatSocket().then((sock) => sock.emit("typing", conversation.id)).catch(() => {});
    typingCooldownRef.current = setTimeout(() => {
      typingCooldownRef.current = null;
    }, 2000);
  }, [conversation?.id]);

  if (isLoading) {
    return <AppointmentDetailSkeleton />;
  }

  if (!appointment) {
    return (
      <PatientScreen>
        <View className="section-wrapper pt-6">
          <Empty>
            <EmptyMedia variant="icon">
              <AppIcon name="IconCalendarTime" size="md" variant="primary" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Appointment not found</EmptyTitle>
              <EmptyDescription>
                We could not find the appointment you were looking for.
              </EmptyDescription>
            </EmptyHeader>
            <Button href="/patient/appointments" variant="outline" fullWidth>
              <AppIcon name="ArrowLeftIcon" size="sm" variant="primary" /> Back
              to appointments
            </Button>
          </Empty>
        </View>
      </PatientScreen>
    );
  }

  const appointmentStatus = getAppointmentStatusMeta(appointment.status);
  const paymentStatus = getPaymentStatusMeta(
    (appointment as any).paymentStatus,
  );
  const providerName = appointment.provider?.user?.displayName;
  const isConversationAvailable = Boolean(conversation?.id);
  const canSendMessages =
    isConversationAvailable &&
    ["booked", "confirmed"].includes(appointment.status);

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Button href="/patient/appointments" variant="ghost" size="sm">
          <AppIcon name="ArrowLeftIcon" size="sm" variant="primary" /> Back to
          appointments
        </Button>

        <SectionCard
          title="Appointment details"
          description="Review the visit summary, status, and notes."
          className="bg-info/10 shadow-soft"
          contentClassName="gap-4"
        >
          <View className="flex-row flex-wrap gap-2">
            <Badge variant={appointmentStatus.variant}>
              {appointmentStatus.label}
            </Badge>
            <Badge variant={paymentStatus.variant}>{paymentStatus.label}</Badge>
            <Badge variant="outline">
              {formatStatusLabel(appointment.channel)}
            </Badge>
          </View>

          <Separator />

          <View className="gap-4">
            <View className="gap-1">
              <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                Provider / Therapist
              </Text>
              <Text className="font-body-semibold text-base text-foreground">
                {providerName}
              </Text>
              {appointment.provider?.title ? (
                <Text className="font-secondary text-sm text-muted-foreground">
                  {appointment.provider.title}
                </Text>
              ) : null}
            </View>

            <View className="gap-1">
              <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                Date & Time
              </Text>
              <Text className="font-body-semibold text-base text-foreground">
                {formatDate(appointment.scheduledStartAt, { mode: "date" })}
              </Text>
              <Text className="font-secondary text-sm text-muted-foreground">
                {formatDate(appointment.scheduledStartAt, { mode: "time" })} -{" "}
                {formatDate(appointment.scheduledEndAt, { mode: "time" })}
              </Text>
            </View>

            <View className="gap-1">
              <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                Location
              </Text>
              <Text className="font-body-semibold text-base text-foreground">
                {appointment.branch?.name ?? "Branch pending"}
              </Text>
              {appointment.branch ? (
                <Text className="font-secondary text-sm text-muted-foreground">
                  {[
                    appointment.branch.city,
                    appointment.branch.state,
                    appointment.branch.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              ) : null}
            </View>
          </View>

          {appointment.patientNotes ? (
            <>
              <Separator />
              <View className="gap-1">
                <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                  Your Notes
                </Text>
                <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                  {appointment.patientNotes}
                </Text>
              </View>
            </>
          ) : null}

          {(appointment as any).providerNotes ? (
            <>
              <Separator />
              <View className="gap-1">
                <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                  Therapist Notes
                </Text>
                <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                  {(appointment as any).providerNotes}
                </Text>
              </View>
            </>
          ) : null}
        </SectionCard>

        <SectionCard
          title="Messages"
          description="Chat with your therapist about this appointment."
          className="shadow-soft bg-primary/10"
          contentClassName="gap-4"
        >
          {isMessagesLoading ? (
            <View className="gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-3xl" />
              ))}
            </View>
          ) : messages.length ? (
            <View className="gap-6">
              {messages.map((message) => {
                const isMine = (message as any).senderId === currentUser?.id;
                const senderUser = (message as any).sender;
                const senderName = isMine
                  ? "You"
                  : (senderUser?.displayName ?? "Care Team");
                const senderRole = isMine ? null : (senderUser?.role as string | undefined);

                const isRead = !!(message as any).readAt;
                const isDelivered = isRead || deliveredIds.has(message.id);

                const timeStr = formatDate((message as any).createdAt, { mode: "time" });
                const tickIcon = isRead ? (
                  <CheckCheck size={11} className={isMine ? "text-primary-foreground" : "text-primary"} />
                ) : isDelivered ? (
                  <CheckCheck size={11} className="text-primary-foreground/60" />
                ) : (
                  <Check size={11} className="text-primary-foreground/60" />
                );

                return (
                  <View
                    key={message.id}
                    className={isMine ? "items-end" : "items-start"}
                  >
                    <View className="max-w-[90%] gap-1">
                      <Text className="font-secondary text-xs text-muted-foreground">
                        {senderName}
                        {senderRole ? ` · ${ROLE_LABEL[senderRole] ?? senderRole}` : ""}
                      </Text>
                      <View
                        className={
                          isMine
                            ? "rounded-[22px] rounded-tr-sm bg-primary px-3 pb-1.5 pt-2.5"
                            : "rounded-[22px] rounded-tl-sm bg-secondary px-3 pb-1.5 pt-2.5"
                        }
                      >
                        <View className="relative">
                          <Text
                            className={
                              isMine
                                ? "font-secondary text-sm leading-6 text-primary-foreground"
                                : "font-secondary text-sm leading-6 text-foreground"
                            }
                          >
                            {message.body}
                            {"  "}
                            {/* phantom: same color as bubble bg → invisible, reserves layout space for overlay */}
                            <Text className={isMine ? "text-[10px] text-primary" : "text-[10px] text-secondary"}>
                              {isMine ? `${timeStr} ✓✓` : timeStr}
                            </Text>
                          </Text>
                          <View className="absolute bottom-0 right-0 flex-row items-center gap-0.5">
                            <Text className={isMine ? "font-secondary text-[10px] text-primary-foreground/70" : "font-secondary text-[10px] text-muted-foreground"}>
                              {timeStr}
                            </Text>
                            {isMine && tickIcon}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <AppIcon name="IconMessageCircle" size="md" variant="primary" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No messages yet</EmptyTitle>
                <EmptyDescription>
                  Start the conversation when you need to update your care team.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

          {isOtherTyping && (
            <View className="items-start">
              <View className="rounded-[22px] rounded-tl-sm bg-secondary px-4 py-3">
                <Text className="font-secondary text-sm text-muted-foreground animate-pulse">...</Text>
              </View>
            </View>
          )}

          <Separator />

          {isConversationAvailable ? (
            <View className="gap-3">
              <Textarea
                value={messageText}
                onChangeText={(t) => { setMessageText(t); notifyTyping(); }}
                placeholder="Type a message..."
                numberOfLines={3}
                editable={canSendMessages}
              />
              <Button
                disabled={isSending || !messageText.trim() || !canSendMessages}
                fullWidth
                onPress={() => {
                  if (!canSendMessages) {
                    return;
                  }

                  const nextMessage = messageText.trim();
                  if (!nextMessage) {
                    return;
                  }

                  void sendMessage({ body: nextMessage })
                    .then(() => {
                      setMessageText("");
                    })
                    .catch((cause: any) => {
                      error("Could not send message.", {
                        description: cause?.message,
                      });
                    });
                }}
              >
                Send message
              </Button>
              {!canSendMessages ? (
                <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                  Messaging is only available while the appointment is booked or
                  confirmed.
                </Text>
              ) : null}
            </View>
          ) : (
            <Text className="font-secondary text-sm leading-6 text-muted-foreground">
              Messaging becomes available once your appointment conversation is
              ready.
            </Text>
          )}
        </SectionCard>
      </View>
    </PatientScreen>
  );
}
