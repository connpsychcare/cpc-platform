import { Text, View } from "react-native";
import { useRouter } from "expo-router";

import { AppIcon } from "@/components/ui/app-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserResponse } from "@workspace/contracts/user";
import { getInitials } from "@workspace/shared/utils";
import { patientDropdownMenu } from "@workspace/shared/constants";

function AccountAvatar({ user }: { user?: UserResponse | null }) {
  const initials = user?.displayName ? getInitials(user?.displayName) : "";

  return (
    <Avatar className="size-12 border border-border bg-primary/10">
      {user?.avatar?.url ? (
        <AvatarImage
          source={{ uri: user.avatar.url }}
          contentFit="cover"
          transition={150}
        />
      ) : (
        <View className="absolute inset-0 items-center justify-center">
          {initials ? (
            <AvatarFallback className="text-primary">{initials}</AvatarFallback>
          ) : (
            <AppIcon name="IconUserCircle" size="sm" variant="primary" />
          )}
        </View>
      )}
    </Avatar>
  );
}

export function AccountDropdown({
  user,
  hasSession,
  onSignOut,
}: {
  user?: UserResponse;
  hasSession?: boolean;
  onSignOut?: () => void;
}) {
  const router = useRouter();
  const displayName = user?.displayName;
  const email = user?.email || user?.phone;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <View className="flex-center">
          <AccountAvatar user={user} />
        </View>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 rounded-3xl border border-border/70 bg-popover/98 p-2">
        <DropdownMenuLabel>
          <View className="flex-row items-center gap-3 rounded-2xl bg-muted/40 p-2">
            <AccountAvatar user={user} />
            <View className="flex-1">
              <Text className="font-body-semibold text-sm text-popover-foreground">
                {displayName}
              </Text>
              <Text className="mt-1 font-secondary text-xs text-muted-foreground">
                {email}
              </Text>
            </View>
          </View>
        </DropdownMenuLabel>

        {patientDropdownMenu.map((group, index) => (
          <View key={index}>
            {index > 0 ? <DropdownMenuSeparator /> : null}
            {group.items.map((item) => (
              <DropdownMenuItem
                key={item.label}
                onSelect={() => router.push(item.href)}
                className="rounded-2xl"
              >
                <AppIcon name={item.icon} size="sm" />
                <Text className="font-body-medium text-sm text-popover-foreground">
                  {item.label}
                </Text>
              </DropdownMenuItem>
            ))}
          </View>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          destructive
          onSelect={onSignOut}
          className="rounded-2xl"
        >
          <AppIcon name="IconLogout" size="sm" variant="destructive" />
          <Text className="font-body-medium text-sm text-destructive">
            Log out
          </Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
