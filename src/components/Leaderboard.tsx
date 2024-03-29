import { motion } from "framer-motion";
import { FC, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { fetchAllUsers } from "../utils/dataFetcher";
import LoadingIndicator from "./LoadingIndicator";
import TeamFlag from "./TeamFlag";

const CountryToFlagEmoji = {
  Argentina: "🇦🇷",
  Spain: "🇪🇸",
  France: "🇫🇷",
  Brazil: "🇧🇷",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
} as const;

type PlayerItemProps = {
  rank: number;
  player: PlayerUser;
};
const PlayerItem = (props: PlayerItemProps) => {
  const { rank, player } = props;

  const rankColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return "text-[#C9B037]";
      case 2:
        return "text-[#B4B4B4]";
      case 3:
        return "text-[#AD8A56]";
      default:
        return "";
    }
  };

  const hasPlayoffPredictions =
    player.predictions?.length == 12 &&
    player.predictions[8].games.length == 8 &&
    player.predictions[9].games.length == 4 &&
    player.predictions[10].games.length == 2 &&
    player.predictions[11].games.length == 1;

  const winnerId = hasPlayoffPredictions
    ? player.predictions?.[11].games[0].winner
    : null;
  const winnerTeam: Team = useMemo(() => {
    if (winnerId) {
      return player.predictions
        .flatMap((p) => p.result)
        .filter((r) => r.id == winnerId)[0];
    }
    return null;
  }, [player.predictions, winnerId]);

  return (
    <Link to={`/profile/${player.id}`}>
      <div
        className={`font-novaMono mb-2 hover:cursor-pointer hover:bg-primary/40 transition-all mx-2 flex flex-row items-center gap-5 lg:gap-11 ${
          hasPlayoffPredictions ? "bg-gray-400/40" : "bg-red-500/40"
        } backdrop-blur-sm py-2 px-6 rounded-lg`}
      >
        <h1 className={`text-4xl font-bold`}>
          <span className={rankColor(rank)}>{rank}</span>.
        </h1>
        <img
          className="object-cover rounded-full p-1 ring-2 hover:ring-4 transition-all ring-primary w-16 h-16"
          src={
            player.avatar ??
            "https://avatars.dicebear.com/api/big-ears-neutral/randomo.svg"
          }
          alt={`${player.name} avatar`}
          width={70}
          height={70}
        />
        <div className="flex-1 lg:w-72 overflow-hidden">
          <h1 className="text-xl font-bold text-ellipsis overflow-hidden">
            {player.name ?? "Unknown"}
            {player.money ? "    💵" : "    🍜"}
          </h1>
          {hasPlayoffPredictions ? (
            winnerTeam && <TeamFlag team={winnerTeam} width="1.5rem" className="rounded-md max-h-full mt-1" />
          ) : (
            <h1 className="text-md text-red-500">
              Playoff predictions missing!
            </h1>
          )}
        </div>
        <h1 className="text-3xl font-bold">{player.score}p</h1>
      </div>
    </Link>
  );
};

type PlayerListProps = {
  players: PlayerUser[];
};
const PlayerList = (props: PlayerListProps) => {
  const { players } = props;

  const filteredPlayers = useMemo(() => {
    return players
      .filter((player) => (player.predictions ? true : false))
      .sort((a, b) => b.score - a.score);
  }, [players]);

  return (
    <ul className="space-y-2">
      {filteredPlayers.map((player, index) => {
        return <PlayerItem key={index} rank={index + 1} player={player} />;
      })}
    </ul>
  );
};

const Leaderboard = () => {
  const {
    data: players,
    isLoading,
    error,
  } = useQuery("users", fetchAllUsers, { refetchInterval: 60 * 1000 });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full mb-6"
    >
      <PlayerList players={players} />
    </motion.div>
  );
};

export default Leaderboard;
