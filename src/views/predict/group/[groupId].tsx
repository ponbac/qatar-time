import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import TeamFlag from "../../../components/TeamFlag";
import { fetchGroup } from "../../../utils/dataFetcher";
import { useAppDispatch } from "../../../utils/store";
import {
  predictGame,
  savePredictions,
} from "../../../features/predict/predictSlice";

const TeamBlock: FC<{
  team: Team;
  selected: boolean;
  toggleSelectedTeam: (team: Team) => void;
}> = ({ team, selected, toggleSelectedTeam }) => {
  const flagWidth = "2.25rem";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    toggleSelectedTeam(team);
  };

  return (
    <button
      className={
        "gap-2 bg-gray-400/30 backdrop-blur-sm py-2 px-4 flex flex-row items-center justify-between w-60 p-4 rounded-xl transition-all " +
        (selected == true ? "bg-green-600/60" : "")
      }
      onClick={handleClick}
    >
      <p className="text-xl">{team.name}</p>
      <TeamFlag team={team} width={flagWidth} />
    </button>
  );
};

const GameBlock: FC<{ game: Game }> = ({ game }) => {
  let params = useParams();
  const id = params.id;

  const dispatch = useAppDispatch();

  const [selectedTeam, setSelectedTeam] = useState<Team>();
  const teamClickHandler = (team: Team) => {
    if (selectedTeam?.id == team.id) {
      setSelectedTeam(undefined);
    } else {
      setSelectedTeam(team);
      dispatch(
        predictGame({
          groupId: id,
          gamePrediction: {
            id: game.id,
            homeGoals: 0,
            awayGoals: 0,
            winner: team.name,
          },
        })
      );
    }
  };

  let date = moment(game.date).format("dddd DD/MM, HH:mm");

  return (
    <div className="font-mono flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-8 mb-10 lg:mb-0">
      <TeamBlock
        team={game.homeTeam}
        selected={game.homeTeam.id == selectedTeam?.id}
        toggleSelectedTeam={teamClickHandler}
      />
      <div className="flex flex-col text-center w-44">
        <p className="text-2xl">vs</p>
        <p className="text-xs italic">{date}</p>
      </div>
      <TeamBlock
        team={game.awayTeam}
        selected={game.awayTeam.id == selectedTeam?.id}
        toggleSelectedTeam={teamClickHandler}
      />
    </div>
  );
};

const GroupBlock: FC<{}> = ({}) => {
  let params = useParams();
  const id = params.id;

  const [group, setGroup] = useState<Group>();
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useAppDispatch();

  const groupOrder = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const nextGroupId = (): string => {
    const index = groupOrder.indexOf((id as string).toUpperCase());
    if (index == -1) {
      return "";
    }
    return groupOrder[index + 1];
  };

  useEffect(() => {
    if (id != undefined) {
      setIsLoading(true);
      fetchGroup(id as string).then((group) => {
        setGroup(group);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (!id) {
    return (
      <div className="font-mono flex flex-row items-center justify-center">
        No group ID provided!
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="loading-indicator">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-mono flex flex-col items-center justify-center my-6">
      <motion.div
        className="flex flex-col items-center justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        key={group?.id}
      >
        <h1 className="text-4xl font-bold" key={"header-" + group?.id}>
          Group {(id as string).toUpperCase()}
        </h1>
        {group &&
          group.games?.map((game) => <GameBlock key={game.id} game={game} />)}
        <Link
          to={
            (id as string).toUpperCase() === "H"
              ? "/"
              : `/predict/group/${nextGroupId()}`
          }
          onClick={() => {
            dispatch(savePredictions());
          }}
        >
          <div className="hover:cursor-pointer text-center bg-gradient-to-r from-primary to-secondary text-white transition-all w-32 hover:w-36 hover:text-gray-400 p-2 rounded-xl font-bold">
            {(id as string).toUpperCase() === "H" ? "Save" : "Next Group"}
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

export default GroupBlock;
