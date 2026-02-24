import { useState } from "react";
import { Button } from "../ui/button";
import { useWaitlistCount, useJoinWaitlist } from "../../queries/useWaitlist";

interface WaitlistFormProps {
  source: "hero" | "cta" | "footer";
  showCount?: boolean;
}

export function WaitlistForm({ source, showCount = true }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { data: countData } = useWaitlistCount();
  const joinWaitlist = useJoinWaitlist();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    joinWaitlist.mutate(
      { email, source },
      {
        onSuccess: (data: { alreadyJoined: boolean }) => {
          if (!data.alreadyJoined) {
            setShowSuccess(true);
          }
        },
      },
    );
  };

  if (showSuccess) {
    return (
      <div className="font-mono text-sm text-accent">
        <p className="mb-2">STATUS: JOINED</p>
        <p className="text-muted-foreground">We'll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {showCount && countData && countData.count > 0 && (
        <p className="font-mono text-xs text-accent tracking-wide">
          Join {countData.count} {countData.count === 1 ? "other" : "others"} on
          the waitlist
        </p>
      )}
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="flex-1 h-10 px-3 rounded-md bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50 font-mono"
          required
        />
        <Button type="submit" disabled={joinWaitlist.isPending}>
          {joinWaitlist.isPending ? "..." : "Join"}
        </Button>
      </div>
      {joinWaitlist.error && (
        <p className="font-mono text-xs text-destructive">
          ERROR: {joinWaitlist.error.message}
        </p>
      )}
      {joinWaitlist.isSuccess && joinWaitlist.data?.alreadyJoined && (
        <p className="font-mono text-xs text-muted-foreground">
          Already on waitlist
        </p>
      )}
    </form>
  );
}
