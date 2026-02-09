import { evaluateRoundOutcome } from "./rules";

const INITIAL_DISTANCE = 10;

export function createInitialState(puttsPerRound) {
  return {
    status: "playing",

    puttsPerRound,
    currentDistance: INITIAL_DISTANCE,

    puttsTakenInRound: 0,
    makesInRound: 0,

    totalPutts: 0,
    maxDistanceReached: INITIAL_DISTANCE,

    madeByDistance: {},

    startedAt: Date.now(),
    endedAt: null,
  };
}

export function onMake(state) {
  const distance = state.currentDistance;

  return {
    ...state,
    puttsTakenInRound: state.puttsTakenInRound + 1,
    makesInRound: state.makesInRound + 1,
    totalPutts: state.totalPutts + 1,
    madeByDistance: {
      ...state.madeByDistance,
      [distance]: (state.madeByDistance[distance] || 0) + 1,
    },
  };
}

export function onMiss(state) {
  return {
    ...state,
    puttsTakenInRound: state.puttsTakenInRound + 1,
    totalPutts: state.totalPutts + 1,
  };
}

export function buildGameSessionPayload(state) {
  return {
    totalPutts: state.totalPutts,
    maxDistanceFt: state.maxDistanceReached,
    durationSeconds: Math.floor((state.endedAt - state.startedAt) / 1000),
    madeByDistance: state.madeByDistance,
  };
}

export function endRound(state) {
  const outcome = evaluateRoundOutcome({
    currentDistance: state.currentDistance,
    makes: state.makesInRound,
    puttsPerRound: state.puttsPerRound,
  });

  if (outcome.gameComplete) {
    return {
      ...state,
      status: "completed",
      endedAt: Date.now(),
      maxDistanceReached: Math.max(
        state.maxDistanceReached,
        state.currentDistance,
      ),
    };
  }

  const nextDistance = outcome.nextDistance;

  return {
    ...state,
    currentDistance: nextDistance,
    puttsTakenInRound: 0,
    makesInRound: 0,
    maxDistanceReached: Math.max(state.maxDistanceReached, nextDistance),
  };
}
