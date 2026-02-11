// app/game/puttingLadder/usePuttingLadderGame.js

import { useState, useCallback } from "react";
import {
  createInitialState,
  onMake,
  onMiss,
  endRound,
  buildGameSessionPayload,
} from "./state";

export function usePuttingLadderGame({ puttsPerRound }) {
  const [state, setState] = useState(() => createInitialState(puttsPerRound));

  const make = useCallback(() => {
    setState((prev) => {
      if (prev.status !== "playing") return prev;

      const next = onMake(prev);

      if (next.puttsTakenInRound === next.puttsPerRound) {
        return endRound(next);
      }

      return next;
    });
  }, []);

  const miss = useCallback(() => {
    setState((prev) => {
      if (prev.status !== "playing") return prev;

      const next = onMiss(prev);

      if (next.puttsTakenInRound === next.puttsPerRound) {
        return endRound(next);
      }

      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setState(createInitialState(puttsPerRound));
  }, [puttsPerRound]);

  const getPayload = useCallback(() => {
    if (state.status !== "completed") return null;
    return buildGameSessionPayload(state);
  }, [state]);

  return {
    state,

    // actions
    make,
    miss,
    reset,

    // helpers
    isPlaying: state.status === "playing",
    isCompleted: state.status === "completed",
    currentDistance: state.currentDistance,
    puttsRemaining: state.puttsPerRound - state.puttsTakenInRound,
    puttsMadeInRound: state.puttsMadeInRound,
    madeByDistance: state.madeByDistance,

    getPayload,
  };
}
