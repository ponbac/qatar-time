import { useState, useEffect } from "react";

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export { sleep };

export const isUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

export const findPrediction = (
  game: Game,
  userPredictions: GroupPrediction[]
) => {
  if (game) {
    const group = userPredictions.find((p) => p.groupId === game.groupId);
    if (group) {
      const prediction = group.games.find((p) => p.id === game.id);
      if (prediction) {
        return prediction;
      }
    }
  }

  return undefined;
};

export const calcQuarters = (
  eights: Game[],
  predictions: GroupPrediction[]
) => {
  const teamOneId = findPrediction(eights[0], predictions)?.winner;
  const teamTwoId = findPrediction(eights[2], predictions)?.winner;
  const teamThreeId = findPrediction(eights[1], predictions)?.winner;
  const teamFourId = findPrediction(eights[3], predictions)?.winner;
  const teamFiveId = findPrediction(eights[4], predictions)?.winner;
  const teamSixId = findPrediction(eights[5], predictions)?.winner;
  const teamSevenId = findPrediction(eights[6], predictions)?.winner;
  const teamEightId = findPrediction(eights[7], predictions)?.winner;

  if (
    teamOneId == -1 ||
    teamTwoId == -1 ||
    teamThreeId == -1 ||
    teamFourId == -1 ||
    teamFiveId == -1 ||
    teamSixId == -1 ||
    teamSevenId == -1 ||
    teamEightId == -1
  ) {
    return [];
  }

  if (
    teamOneId != undefined &&
    teamTwoId != undefined &&
    teamThreeId != undefined &&
    teamFourId != undefined &&
    teamFiveId != undefined &&
    teamSixId != undefined &&
    teamSevenId != undefined &&
    teamEightId != undefined
  ) {
    const teamOne =
      eights[0].homeTeam?.id == teamOneId
        ? eights[0].homeTeam
        : eights[0].awayTeam;
    const teamTwo =
      eights[2].homeTeam?.id == teamTwoId
        ? eights[2].homeTeam
        : eights[2].awayTeam;
    const teamThree =
      eights[1].homeTeam?.id == teamThreeId
        ? eights[1].homeTeam
        : eights[1].awayTeam;
    const teamFour =
      eights[3].homeTeam?.id == teamFourId
        ? eights[3].homeTeam
        : eights[3].awayTeam;
    const teamFive =
      eights[4].homeTeam?.id == teamFiveId
        ? eights[4].homeTeam
        : eights[4].awayTeam;
    const teamSix =
      eights[5].homeTeam?.id == teamSixId
        ? eights[5].homeTeam
        : eights[5].awayTeam;
    const teamSeven =
      eights[6].homeTeam?.id == teamSevenId
        ? eights[6].homeTeam
        : eights[6].awayTeam;
    const teamEight =
      eights[7].homeTeam?.id == teamEightId
        ? eights[7].homeTeam
        : eights[7].awayTeam;

    const maxId = eights.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const quarters: Game[] = [
      {
        id: maxId + 1,
        date: "2022-12-09T20:00:00",
        homeTeam: teamOne,
        awayTeam: teamThree,
        homeGoals: 0,
        awayGoals: 0,
        finished: false,
        winner: -1,
        groupId: "QUARTERS",
      },
      {
        id: maxId + 2,
        date: "2022-12-09T16:00:00",
        homeTeam: teamFive,
        awayTeam: teamSix,
        homeGoals: 0,
        awayGoals: 0,
        finished: false,
        winner: -1,
        groupId: "QUARTERS",
      },
      {
        id: maxId + 3,
        date: "2022-12-10T20:00:00",
        homeTeam: teamFour,
        awayTeam: teamTwo,
        homeGoals: 0,
        awayGoals: 0,
        finished: false,
        winner: -1,
        groupId: "QUARTERS",
      },
      {
        id: maxId + 4,
        date: "2022-12-10T16:00:00",
        homeTeam: teamSeven,
        awayTeam: teamEight,
        homeGoals: 0,
        awayGoals: 0,
        finished: false,
        winner: -1,
        groupId: "QUARTERS",
      },
    ];

    return quarters;
  }

  return [];
};

export const calcSemifinals = (
  quarters: Game[],
  predictions: GroupPrediction[]
) => {
  const teamOneId = findPrediction(quarters[0], predictions)?.winner;
  const teamTwoId = findPrediction(quarters[2], predictions)?.winner;
  const teamThreeId = findPrediction(quarters[1], predictions)?.winner;
  const teamFourId = findPrediction(quarters[3], predictions)?.winner;

  if (
    teamOneId == -1 ||
    teamTwoId == -1 ||
    teamThreeId == -1 ||
    teamFourId == -1
  ) {
    return [];
  }

  if (
    teamOneId != undefined &&
    teamTwoId != undefined &&
    teamThreeId != undefined &&
    teamFourId != undefined
  ) {
    const teamOne =
      quarters[0].homeTeam?.id == teamOneId
        ? quarters[0].homeTeam
        : quarters[0].awayTeam;
    const teamTwo =
      quarters[2].homeTeam?.id == teamTwoId
        ? quarters[2].homeTeam
        : quarters[2].awayTeam;
    const teamThree =
      quarters[1].homeTeam?.id == teamThreeId
        ? quarters[1].homeTeam
        : quarters[1].awayTeam;
    const teamFour =
      quarters[3].homeTeam?.id == teamFourId
        ? quarters[3].homeTeam
        : quarters[3].awayTeam;

    const maxId = quarters.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const semifinalOne: Game = {
      id: maxId + 1,
      date: "2022-12-13T20:00:00",
      homeTeam: teamOne,
      awayTeam: teamThree,
      homeGoals: 0,
      awayGoals: 0,
      finished: false,
      winner: -1,
      groupId: "SEMIS",
    };
    const semifinalTwo: Game = {
      id: maxId + 2,
      date: "2022-12-14T20:00:00",
      homeTeam: teamTwo,
      awayTeam: teamFour,
      homeGoals: 0,
      awayGoals: 0,
      finished: false,
      winner: -1,
      groupId: "SEMIS",
    };

    return [semifinalOne, semifinalTwo];
  }

  return [];
};

export const calcFinal = (semis: Game[], predictions: GroupPrediction[]) => {
  const teamOneId = findPrediction(semis[0], predictions)?.winner;
  const teamTwoId = findPrediction(semis[1], predictions)?.winner;

  if (teamOneId == -1 || teamTwoId == -1) {
    return [];
  }

  if (teamOneId != undefined && teamTwoId != undefined) {
    const teamOne =
      semis[0].homeTeam?.id == teamOneId
        ? semis[0].homeTeam
        : semis[0].awayTeam;
    const teamTwo =
      semis[1].homeTeam?.id == teamTwoId
        ? semis[1].homeTeam
        : semis[1].awayTeam;

    const maxId = semis.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const final: Game = {
      id: maxId + 1,
      date: "2022-12-18T16:00:00",
      homeTeam: teamOne,
      awayTeam: teamTwo,
      homeGoals: 0,
      awayGoals: 0,
      finished: false,
      winner: -1,
      groupId: "FINAL",
    };

    return [final];
  }

  return [];
};
