import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";

const UserHeader = () => {
  const { user, signOut } = useAuth();
  if (!user) return null;

  const meta = user.user_metadata;
  const name = meta?.full_name || meta?.name || user.email || "사용자";
  const avatar = meta?.avatar_url || meta?.picture;

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary text-xs">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
        {name}
      </span>
      <button
        onClick={signOut}
        className="ml-auto rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        title="로그아웃"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
};

export default UserHeader;
