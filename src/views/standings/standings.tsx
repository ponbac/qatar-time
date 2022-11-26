import { motion } from "framer-motion";
import { useQuery } from "react-query";
import { fetchGames } from "../../utils/dataFetcher";
import GroupStandings from "./group";

const Standings = () => {
  return (
    <div className="min-h-screen font-novaMono flex flex-col items-center justify-center my-6">
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h1 className="text-4xl font-bold">Group Standings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-12 mt-8">
          <GroupStandings groupName="A" />
          <GroupStandings groupName="B" />
          <GroupStandings groupName="C" />
          <GroupStandings groupName="D" />
          <GroupStandings groupName="E" />
          <GroupStandings groupName="F" />
          <GroupStandings groupName="G" />
          <GroupStandings groupName="H" />
        </div>
      </motion.div>
    </div>
  );
};

export default Standings;
