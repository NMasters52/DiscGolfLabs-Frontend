import { useEffect } from "react";

import { usePuttingLadderGame } from "../../game/puttingLadder/usePuttingLadderGame";
import { useCreateGameSession } from "../../queries/useCreateGameSession";
import { Button } from "../ui/button";

export function PuttingLadderGame({ courseId, dayNumber }) {
  const {
    currentDistance,
    puttsRemaining,
    make,
    miss,
    isCompleted,
    getPayload,
    reset,
  } = usePuttingLadderGame({ puttsPerRound: 5 });

  const createSession = useCreateGameSession("putting-course");

  useEffect(() => {
    if (!isCompleted) return;

    alert("Game Session Complete");

    const basePayload = getPayload();
    if (!basePayload) return;

    const payload = {
      ...basePayload,
      courseId,
      dayNumber,
    };

    createSession.mutate(payload, {
      onSuccess: (data) => {
        console.log("Game Session Saved:", data);
        reset();
      },
      onError: (err) => {
        console.error("Failed to save session:", err);
      },
    });
  }, [isCompleted]);

  return (
    <div className="flex w-full flex-col items-center gap-5">
      {/* Readouts: label + value tiles, so the "Current Distance:" pin from
          the mobile-nav spec stays findable as its own text. */}
      <dl className="grid w-full max-w-sm grid-cols-2 gap-3">
        <div className="rounded-lg border bg-muted/40 px-3 py-2.5 text-center">
          <dt className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
            Current Distance:
          </dt>
          <dd
            className="mt-1 text-xl font-semibold tabular-nums text-foreground"
            data-testid="current-distance-value"
          >
            {currentDistance}ft
          </dd>
        </div>
        <div className="rounded-lg border bg-muted/40 px-3 py-2.5 text-center">
          <dt className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
            Putts Remaining:
          </dt>
          <dd
            className="mt-1 text-xl font-semibold tabular-nums text-foreground"
            data-testid="putts-remaining-value"
          >
            {puttsRemaining}
          </dd>
        </div>
      </dl>

      {/* Button copy carries the emoji: existing specs pin "❌ Miss" exact
          names and /Make/ //Miss/ role lookups. */}
      <div className="flex w-full max-w-sm gap-3">
        <Button className="min-h-11 flex-1" onClick={make}>
          ✅ Make
        </Button>
        <Button variant="destructive" className="min-h-11 flex-1" onClick={miss}>
          ❌ Miss
        </Button>
      </div>
    </div>
  );
}
