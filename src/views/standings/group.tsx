import { useQuery } from "react-query";
import TeamFlag from "../../components/TeamFlag";
import { fetchGroup } from "../../utils/dataFetcher";

type ScoredTeam = Team & {
  goalDifference: number;
  goalsScored: number;
  wonAgainst: number[];
};

const GroupStandings = ({ groupName }: { groupName: string }) => {
  const { data: group, isLoading } = useQuery(["group", groupName], () =>
    fetchGroup(groupName)
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!group) {
    return <p>Could not load games</p>;
  }

  const scoredTeams: ScoredTeam[] = group.teams
    .map((team) => {
      const games = group.games.filter(
        (game) => game.homeTeam.id === team.id || game.awayTeam.id === team.id
      );

      let points = 0;
      let goalDifference = 0;
      let goalsScored = 0;
      let wonAgainst: number[] = [];
      games.forEach((game) => {
        if (game.finished) {
          if (game.winner === team.id) {
            points += 3;
            wonAgainst.push(game.awayTeam.id);
          } else if (game.homeGoals === game.awayGoals) {
            points += 1;
          }

          if (game.homeTeam.id === team.id) {
            goalDifference += game.homeGoals - game.awayGoals;
            goalsScored += game.homeGoals;
          } else {
            goalDifference += game.awayGoals - game.homeGoals;
            goalsScored += game.awayGoals;
          }
        }
      });

      const scoredTeam = {
        ...team,
        points: points,
        goalDifference: goalDifference,
        goalsScored: goalsScored,
        wonAgainst: wonAgainst,
      };

      return scoredTeam;
    })
    .sort((a, b) =>
      a.points === b.points
        ? b.goalDifference === a.goalDifference
          ? b.goalsScored === a.goalsScored
            ? b.wonAgainst.includes(a.id)
              ? -1
              : 1
            : b.goalsScored - a.goalsScored
          : b.goalDifference - a.goalDifference
        : b.points - a.points
    );

  const TeamItem = (props: { team: ScoredTeam; placing: number }) => {
    const { team, placing } = props;

    return (
      <div
        className={`${
          placing < 3 ? "bg-green-600/30" : "bg-gray-400/30"
        } gap-2 w-[17rem] mx-2 flex flex-row items-center font-novaMono backdrop-blur-sm py-2 px-4 rounded-lg h-12`}
      >
        <p className={"font-bold"}>{placing}.</p>
        <TeamFlag team={team} width="2.0rem" />
        <p className="font-bold">{team.name}</p>
        <p className="font-bold flex flex-1 justify-end">
          {team.goalDifference > 0 ? "+" : ""}
          {team.goalDifference}
        </p>
        <p className="pl-2 font-bold flex justify-end">{team.points}p</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-2xl font-bold font-novaMono">Group {groupName}</p>
      <div className="pt-2 space-y-1">
        {scoredTeams.map((team, placing) => (
          <TeamItem team={team} placing={placing + 1} key={team.name} />
        ))}
      </div>
    </div>
  );
};

export default GroupStandings;
