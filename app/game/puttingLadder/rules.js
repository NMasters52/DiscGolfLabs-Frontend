// src/game/puttingLadder/rules.ts
export const STEP_FT = 5;
export const MIN_DISTANCE = 10;
export const MAX_DISTANCE = 35;

export function evaluateRoundOutcome({
  currentDistance,
  makes,
  puttsPerRound,
}) {
  const requiredMakes = Math.ceil(puttsPerRound / 2);
  const success = makes >= requiredMakes;

  if (success && currentDistance === MAX_DISTANCE) {
    return {
      nextDistance: currentDistance,
      gameComplete: true,
    };
  }

  if (success) {
    return {
      nextDistance: Math.min(currentDistance + STEP_FT, MAX_DISTANCE),
      gameComplete: false,
    };
  }

  return {
    nextDistance: currentDistance,
    gameComplete: false,
  };
}
