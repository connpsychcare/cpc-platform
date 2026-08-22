import { useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { View } from "react-native";

import { AccountDropdown } from "@/components/shared/account-dropdown";
import { Logo } from "@/components/shared/logo";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useAuthSessionState } from "@/hooks/use-auth-session-state";
import useUser from "@/hooks/use-user";

export function PublicHeader() {
  const router = useRouter();
  const navigation =
    useNavigation<DrawerNavigationProp<Record<string, undefined>>>();
  const { hasSession, isLoading: isSessionLoading } = useAuthSessionState();
  const { isSuccess: isAuthValid, isLoading: isAuthLoading } = useAuth({
    enabled: hasSession,
  });
  const { currentUser, logoutUser } = useUser({ enabled: isAuthValid });
  const isLoading = isSessionLoading || isAuthLoading;
  const shouldShowAccount = isAuthValid;

  return (
    <View className="section-wrapper pb-3 pt-4">
      <View className="rounded-full border border-card/70 bg-card/70 px-4 py-4 shadow-soft">
        <View className="flex-row items-center justify-between gap-3">
          <View className="min-w-0 flex-1 flex-row items-center gap-2">
            <Button
              variant="outline"
              appearance="soft"
              size="icon"
              className="shrink-0 border-border/60 bg-card/60"
              onPress={() => navigation.openDrawer()}
            >
              <AppIcon
                name="MenuIcon"
                size="sm"
                variant="secondary"
                appearance="solid"
              />
            </Button>
            <Logo size="sm" />
          </View>

          <View className="shrink-0 flex-row items-center gap-2">
            <View className="items-end">
              {shouldShowAccount ? (
                <AccountDropdown
                  user={currentUser}
                  hasSession={hasSession}
                  onSignOut={async () => {
                    await logoutUser();
                    router.replace("/");
                  }}
                />
              ) : isLoading ? (
                <View className="size-12 rounded-full border border-transparent" />
              ) : (
                <Button
                  href={{
                    pathname: "/auth/[type]",
                    params: { type: "sign-in" },
                  }}
                  variant="outline"
                  size="sm"
                >
                  Sign in
                </Button>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
