import { evaluateRoundOutcome, MIN_DISTANCE } from "./rules";

export function createInitialState(puttsPerRound) {
  return {
    status: "playing",

    puttsPerRound,
    currentDistance: MIN_DISTANCE,

    puttsTakenInRound: 0,
    puttsMadeInRound: 0,

    madeByDistance: {},

    startedAt: Date.now(),
  };
}

export function onMake(state) {
  const distance = state.currentDistance.toString();

  return {
    ...state,
    puttsTakenInRound: state.puttsTakenInRound + 1,
    puttsMadeInRound: state.puttsMadeInRound + 1,
    madeByDistance: {
      ...state.madeByDistance,
      [distance]: {
        made: (state.madeByDistance[distance]?.made || 0) + 1,
        attempted: (state.madeByDistance[distance]?.attempted || 0) + 1,
      },
    },
  };
}

export function onMiss(state) {
  const distance = state.currentDistance.toString();
  return {
    ...state,
    puttsTakenInRound: state.puttsTakenInRound + 1,

    madeByDistance: {
      ...state.madeByDistance,
      [distance]: {
        made: state.madeByDistance[distance]?.made || 0, // Don't increment
        attempted: (state.madeByDistance[distance]?.attempted || 0) + 1, // Increment
      },
    },
  };
}

export function buildGameSessionPayload(state) {
  const totalPutts = Object.values(state.madeByDistance).reduce(
    (sum, stats) => sum + stats.attempted,
    0,
  );

  return {
    totalPutts,
    maxDistanceFt: state.currentDistance,
    durationSeconds: Math.floor((Date.now() - state.startedAt) / 1000),
    madeByDistance: state.madeByDistance,
  };
}

export function endRound(state) {
  const { nextDistance, gameComplete } = evaluateRoundOutcome({
    currentDistance: state.currentDistance,
    makes: state.puttsMadeInRound,
    puttsPerRound: state.puttsPerRound,
  });

  if (gameComplete) {
    return {
      ...state,
      status: "completed",
      puttsTakenInRound: 0,
      puttsMadeInRound: 0,
    };
  }

  return {
    ...state,
    currentDistance: nextDistance,
    puttsTakenInRound: 0,
    puttsMadeInRound: 0,
  };
}
