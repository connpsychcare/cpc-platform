import { cn } from "@workspace/ui/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import type { UserResponse } from "@workspace/contracts/user";

interface UserAvatarProps {
  user: UserResponse;
  className?: string;
}

const UserAvatar = ({ className, user }: UserAvatarProps) => {
  return (
    <Avatar
      className={cn(
        "flex-center! rounded-full",
        user.avatar?.url ? "size-10!" : "size-12!",
        className,
      )}
    >
      <AvatarImage src={user.avatar?.url} alt={user.displayName} />
      <AvatarFallback
        className={cn(
          "uppercase rounded-full bg-accent bg-linear-to-br from-primary/20 via-accent/5 to-primary/10",
          className,
        )}
      >
        {user.firstName.charAt(0)}
        {user.lastName?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
