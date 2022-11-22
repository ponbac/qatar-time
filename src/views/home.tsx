import { motion } from "framer-motion";
import { useEffect } from "react";
import { useQuery } from "react-query";
import Header from "../components/Header";
import Leaderboard from "../components/Leaderboard";
import UpcomingGames from "../components/UpcomingGames";
import { fetchAllUsers } from "../utils/dataFetcher";

const PricePool = () => {
  const { data: players } = useQuery("users", fetchAllUsers);

  return (
    <div className="font-novaMono mx-2 flex flex-row items-center justify-center bg-gray-400/40 backdrop-blur-sm py-2 px-8 gap-6 rounded-lg w-fit">
      <h1 className={"text-4xl font-bold"}>🏆</h1>
      <div>
        <div className="flex flex-row gap-2">
          <p className="text-2xl font-bold text-ellipsis overflow-hidden">
            Prispengar:
          </p>
          <p className="text-2xl font-bold text-ellipsis overflow-hidden">
            {players?.reduce(
              (acc: number, player: PlayerUser) =>
                acc + (player.money ? 200 : 0),
              0
            )}
            {" SEK"}
          </p>
        </div>
        <p className="text-sm text-gray-400 text-ellipsis overflow-hidden h-5">
          Swisha 200 kr till 070-576 56 77 för att tävla!
        </p>
      </div>
    </div>
  );
};

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      className="flex flex-col flex-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header text="LEADERBOARD" />
      <div className="flex flex-col flex-0 justify-center items-center py-16 space-y-16">
        <UpcomingGames numberOfGames={4} />
        <div className="flex flex-col space-y-3 items-center justify-center">
          <PricePool />
          <Leaderboard />
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
