import { test, expect } from "@playwright/test";
import { evaluateRoundOutcome } from "../app/game/puttingLadder/rules.js";

// Tests for the app's putting ladder rules.
test("making half the putts moves the player back five feet", () => {
  // Arrange: create an input for a player at 10 feet who makes 2 of 4 putts.
const input = {
  currentDistance: 10,
  makes: 2,
  puttsPerRound: 4,
};

  // Act: call evaluateRoundOutcome with that input and save the result.
  const result = evaluateRoundOutcome(input);

  // Assert: use expect(result).toEqual(...) to check both returned properties.
  expect(result).toEqual({
    nextDistance: 15,
    gameComplete: false,
  });
});


//first tests I have written on my own 


test("Fewer than half stays at the same distance", () => {
  //arrange
  const input = {
    currentDistance: 10,
    makes: 1,
    puttsPerRound: 4,
  };

  //act 
  const result = evaluateRoundOutcome(input);

  //assert
  expect(result).toEqual({    
    nextDistance: 10,
    gameComplete: false,
  })
})

test("Success at the final distance finishes the game", () => {
  // arrange 
  const input = {
    currentDistance: 35,
    makes: 2,
    puttsPerRound: 4,
  }

  // act
  const result = evaluateRoundOutcome(input);

  // assert
  expect(result).toEqual({
    nextDistance: 35,
    gameComplete: true,
  })
})

test("An odd number of putts rounds the requirement up", () => {
  //arrange
  const input = {
    currentDistance: 10,
    makes: 2,
    puttsPerRound: 5,
  }

  //act
  const result = evaluateRoundOutcome(input);

  //assert
  expect(result).toEqual({
    nextDistance: 10,
    gameComplete: false,
  })
})


test("Three makes out of five succeeds", () => {
  //arrange
  const input = {
    currentDistance: 10,
    makes: 3,
    puttsPerRound: 5,
  };
  // act
  const result = evaluateRoundOutcome(input);
  // assert
  expect(result).toEqual({
    nextDistance: 15,
    gameComplete: false,
  })
})
