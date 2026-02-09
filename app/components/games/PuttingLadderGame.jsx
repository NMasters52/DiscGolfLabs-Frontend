import { usePuttingLadderGame } from "../../game/puttingLadder/usePuttingLadderGame";

export function PuttingLadderGame() {
  const {
    currentDistance,
    puttsRemaining,
    make,
    miss,
    isCompleted,
    getPayload,
  } = usePuttingLadderGame({ puttsPerRound: 5 });

  if (isCompleted) {
    console.log(getPayload());
  }
  return (
    <>
      <h3>Current Distance: {currentDistance}</h3>
      <h3>Putts Remaining: {puttsRemaining}</h3>
      <button onClick={make}>✅ Make</button>
      <button onClick={miss}>❌ Miss</button>
    </>
  );
}
