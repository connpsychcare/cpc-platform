import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import UserCard from "@workspace/ui/shared/UserCard";
import { IconLogout, IconLayoutDashboard } from "@tabler/icons-react";
import { patientDropdownMenu } from "@workspace/shared/constants";
import { reactAppIconMap } from "@workspace/ui/lib/icons";
import Link from "next/link";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "/dashboard";
const INTERNAL_ROLES = new Set(["admin", "provider", "staff"]);

const AccountDropdown = () => {
  const { currentUser, isLoading, logoutUser, isLogoutPending } =
    useCurrentUser();

  const isInternalUser = INTERNAL_ROLES.has(currentUser?.role ?? "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserCard
          variant="avatar"
          currentUser={currentUser}
          isLoading={isLoading}
          avatarSize="size-12"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 rounded-lg" align="end" sideOffset={4}>
        <DropdownMenuLabel className="p-0 font-normal">
          <UserCard currentUser={currentUser} isLoading={isLoading} />
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {isInternalUser ? (
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={DASHBOARD_URL}>
                <IconLayoutDashboard />
                Go to Dashboard
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          patientDropdownMenu.map(({ items }, groupIndex) => (
            <div key={groupIndex}>
              <DropdownMenuGroup>
                {items.map((item) => {
                  const Icon = reactAppIconMap[item.icon];
                  return (
                    <DropdownMenuItem key={item.label} asChild className="cursor-pointer">
                      <Link href={item.href}>
                        {Icon && <Icon />}
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
              {groupIndex !== patientDropdownMenu.length - 1 && (
                <DropdownMenuSeparator />
              )}
            </div>
          ))
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isLogoutPending}
          onClick={logoutUser}
          className="cursor-pointer"
        >
          <IconLogout />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountDropdown;
