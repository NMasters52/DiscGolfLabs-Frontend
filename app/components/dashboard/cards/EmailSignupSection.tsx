import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Mail } from "lucide-react";
import type { HTMLAttributes } from "react";

interface EmailSignupSectionProps extends HTMLAttributes<HTMLDivElement> {}

export function EmailSignupSection({
  className,
  ...props
}: EmailSignupSectionProps) {
  return (
    <Card className={className} {...props}>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Stay Updated</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          New courses launching soon. Stay updated.
        </p>
        <div className="flex gap-2">
          <Input placeholder="Enter email" className="flex-1" />
          <Button size="sm">Join</Button>
        </div>
      </CardContent>
    </Card>
  );
}
