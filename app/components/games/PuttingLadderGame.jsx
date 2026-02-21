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
    <div className="flex flex-col items-center gap-4">
      <h3>Current Distance: {currentDistance}</h3>
      <h3>Putts Remaining: {puttsRemaining}</h3>
      <div className="flex gap-2">
        <Button onClick={make}>✅ Make</Button>
        <Button variant="destructive" onClick={miss}>
          ❌ Miss
        </Button>
      </div>
    </div>
  );
}
