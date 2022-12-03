import { motion } from "framer-motion";
import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import {
  savePredictions,
  selectPredictions,
} from "../../features/predict/predictSlice";
import { PLAYOFF_PREDICTIONS_CLOSE } from "../../utils/constants";
import { fetchGames } from "../../utils/dataFetcher";
import { useAppDispatch, useAppSelector } from "../../utils/store";
import { calcSemifinals, calcFinal, calcQuarters } from "../../utils/utils";
import { GameBlock } from "./[groupId]";

const PredictPlayoffs = () => {
  const { data: games, isLoading, error } = useQuery("games", fetchGames);
  const [eights, setEights] = useState<Game[]>([]);
  const [quarters, setQuarters] = useState<Game[]>([]);
  const [semis, setSemis] = useState<Game[]>([]);
  const [final, setFinal] = useState<Game[]>([]);
  const [predictionsClosed, setPredictionsClosed] = useState<boolean>(false);

  const predictions = useAppSelector(selectPredictions);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const currentTime = moment();
    if (currentTime.isAfter(PLAYOFF_PREDICTIONS_CLOSE)) {
      setPredictionsClosed(true);
    }

    if (games) {
      setEights(
        games
          .filter((game) => game.groupId === "EIGHTS")
          .sort((a, b) => a.date.localeCompare(b.date))
      );
      setQuarters(calcQuarters(eights, predictions));
      setSemis(calcSemifinals(quarters, predictions));
      setFinal(calcFinal(semis, predictions));
    }
  }, [games, predictions]);

  useEffect(() => {
    function checkTime() {
      const currentTime = moment();
      if (currentTime.isAfter(PLAYOFF_PREDICTIONS_CLOSE)) {
        setPredictionsClosed(true);
      }
    }

    const interval = setInterval(checkTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (predictionsClosed) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-3">
        <h1 className="text-4xl font-bold font-novaMono">
          Predictions are currently closed!
        </h1>
        <h2 className="text-sm font-novaMono">
          All you can do is wait for the final results.
        </h2>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center gap-4 font-novaMono"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-row gap-4 justify-center items-center">
        <h1 className="text-center text-7xl font-bold font-novaMono pb-3 pt-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Playoffs
        </h1>
        <img
          className="w-min mt-8"
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/199.gif"
          alt="Gengar"
        />
      </div>
      <h2 className=" text-lg px-2 text-center font-bold">
        Correct winner grants 4 points in round of 16, 6 points in quarters, 8
        points in semis and 10 points in the final. <br /> +2 for correct score.{" "}
        <br />{" "}
        <span className="italic text-base">
          (Score includes potential goals scored after ordinary game time, e.g.
          penalty shoot-out)
        </span>
      </h2>
      {eights.length > 0 && (
        <div className="flex flex-col items-center justify-center space-y-2">
          <h2 className="text-4xl font-bold mb-4">Round of 16</h2>
          <div className="flex flex-col space-y-10 md:space-y-2">
            {eights.map((game) => (
              <GameBlock game={game} />
            ))}
          </div>
        </div>
      )}
      {quarters.length > 0 && (
        <div className="flex flex-col items-center justify-center space-y-2">
          <h2 className="text-4xl font-bold mb-4">Quarters</h2>
          <div className="flex flex-col space-y-10 md:space-y-2">
            {quarters.map((game) => (
              <GameBlock game={game} />
            ))}
          </div>
        </div>
      )}
      {semis.length > 0 && (
        <motion.div
          className="flex flex-col items-center justify-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4">Semis</h2>
          <div className="flex flex-col space-y-10 md:space-y-2">
            {semis.map((game) => (
              <GameBlock game={game} />
            ))}
          </div>
        </motion.div>
      )}
      {final.length > 0 && (
        <motion.div
          className="flex flex-col items-center justify-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4">Final</h2>
          {final.map((game) => (
            <GameBlock game={game} />
          ))}
        </motion.div>
      )}
      <Link to={"/"}>
        <button
          className="hover:cursor-pointer text-center bg-gradient-to-r from-primary to-secondary text-white transition-all w-32 hover:w-36 hover:text-gray-400 p-2 mb-2 rounded-xl font-bold"
          onClick={() => dispatch(savePredictions())}
        >
          Save
        </button>
      </Link>
    </motion.div>
  );
};

export default PredictPlayoffs;
