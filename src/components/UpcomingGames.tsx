import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { selectPredictions } from "../features/predict/predictSlice";
import { TBD_TEAM } from "../utils/constants";
import { fetchGames } from "../utils/dataFetcher";
import { useAppSelector } from "../utils/store";
import { findPrediction, useWindowDimensions } from "../utils/utils";
import LoadingIndicator from "./LoadingIndicator";
import TeamFlag from "./TeamFlag";

type UpcomingGameProps = {
  game: Game;
};
const UpcomingGame = (props: UpcomingGameProps) => {
  let { game } = props;

  const [prediction, setPrediction] = useState<GamePrediction | undefined>(
    undefined
  );

  const userPredictions = useAppSelector(selectPredictions);

  const resultTextColor = () => {
    if (prediction && game?.finished) {
      game.winner = game.winner == null ? -1 : game.winner;
      const correctPrediction = prediction.winner == game.winner;
      const correctScore =
        prediction.homeGoals == game.homeGoals &&
        prediction.awayGoals == game.awayGoals;
      if (correctScore) {
        return "text-blue-400";
      } else if (correctPrediction) {
        return "text-green-500";
      } else {
        return "text-red-600/80";
      }
    }
  };

  useEffect(() => {
    if (game.homeTeam === null) {
      game.homeTeam = TBD_TEAM;
    }
    if (game.awayTeam === null) {
      game.awayTeam = TBD_TEAM;
    }

    setPrediction(findPrediction(game, userPredictions));
  }, [game]);

  if (!game) {
    return <LoadingIndicator />;
  }

  return (
    <Link to={`/game/${game.id}`}>
      <div className="flex flex-col items-center justify-center font-novaMono space-y-2 hover:bg-gray-700/70 rounded-xl transition-all p-3">
        <div className="flex flex-row gap-4 justify-center items-center">
          <TeamFlag
            team={game.homeTeam}
            width={"4.5rem"}
            className="rounded-md"
          />
          <p className="font-bold text-3xl">vs</p>
          <TeamFlag
            team={game.awayTeam}
            width={"4.5rem"}
            className="rounded-md"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          {game.finished && (
            <p className={`font-bold text-3xl ${resultTextColor()}`}>
              {game.homeGoals} - {game.awayGoals}
            </p>
          )}
          <p className="text-md text-center">
            {moment(game.date).format("dddd DD/MM, HH:mm")}
          </p>
          {prediction && (
            <p className="text-sm italic text-center">
              Prediction: ({prediction.homeGoals} - {prediction.awayGoals})
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

const FINISHED_TIMER_MINUTES = 165;
const UpcomingGames = ({ numberOfGames }: { numberOfGames: number }) => {
  // const { height, width } = useWindowDimensions();
  const {
    data: games,
    isLoading,
    error,
  } = useQuery("games", fetchGames, { refetchInterval: 60 * 1000 });

  const unfinishedGames = useMemo(
    () =>
      games
        ? games
            .filter((g) =>
              moment(g.date).isAfter(
                moment().subtract(FINISHED_TIMER_MINUTES, "minutes")
              )
            )
            .sort((a, b) => a.date.localeCompare(b.date))
        : [],
    [games]
  );

  const finishedGames = useMemo(
    () =>
      games
        ? games
            .filter((g) =>
              moment(g.date).isBefore(
                moment().subtract(FINISHED_TIMER_MINUTES, "minutes")
              )
            )
            .sort((a, b) => b.date.localeCompare(a.date))
        : [],
    [games]
  );

  if (!games) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-400/40 w-72 py-3 rounded-3xl font-novaMono space-y-4">
        <LoadingIndicator />
      </div>
    );
  }

  if (unfinishedGames.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-400/40 w-72 lg:w-fit py-3 rounded-3xl font-novaMono">
      {finishedGames.length > 0 && (
        <>
          <p className="font-bold text-2xl text-center mb-2">Played:</p>
          <div className="lg:grid lg:grid-cols-4 lg:gap-x-8 lg:px-4">
            {finishedGames
              .slice(
                0,
                finishedGames.length > numberOfGames ? numberOfGames : undefined
              )
              .map((g, i) => (
                <UpcomingGame game={g} key={i} />
              ))}
          </div>
        </>
      )}
      {unfinishedGames.length > 0 && (
        <>
          <p className="font-bold text-2xl text-center mb-2 mt-4">Upcoming:</p>
          <div className="lg:grid lg:grid-cols-4 lg:gap-x-8 lg:px-4">
            {unfinishedGames
              .slice(
                0,
                unfinishedGames.length > numberOfGames
                  ? numberOfGames
                  : undefined
              )
              .map((g, i) => (
                <UpcomingGame game={g} key={i} />
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UpcomingGames;
