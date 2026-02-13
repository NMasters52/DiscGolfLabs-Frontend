import { useEffect } from "react";
import { usePuttingLadderGame } from "../../game/puttingLadder/usePuttingLadderGame";
import { useCreateGameSession } from "../../queries/useCreateGameSession";

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
    <>
      <h3>Current Distance: {currentDistance}</h3>
      <h3>Putts Remaining: {puttsRemaining}</h3>
      <button onClick={make}>✅ Make</button>
      <button onClick={miss}>❌ Miss</button>
    </>
  );
}
