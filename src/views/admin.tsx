import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { selectIsAdmin } from "../features/auth/authSlice";
import {
  fetchGames,
  fetchTeams,
  insertGame,
  insertTeam,
} from "../utils/dataFetcher";
import { useAppSelector } from "../utils/store";

type AdminInputProps = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
};
const AdminInput = (props: AdminInputProps) => {
  const { value, setValue, placeholder } = props;

  return (
    <input
      type="text"
      placeholder={placeholder}
      className="px-2 py-[0.1rem] text-black rounded-md outline-none"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
      }}
    />
  );
};

const AddGame = () => {
  const { data: teams, isLoading: tIsLoading } = useQuery("teams", fetchTeams);
  const { data: games, isLoading: gIsLoading } = useQuery("games", fetchGames);

  const [id, setId] = useState<string>("");
  const [date, setDate] = useState<string>("2022-09-06T21:00:00");
  const [homeTeamId, setHomeTeamId] = useState<string>("");
  const [awayTeamId, setAwayTeamId] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");

  const SelectTeam = (props: {
    teams: Team[];
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    setGroup?: React.Dispatch<React.SetStateAction<string>>;
  }) => {
    return (
      <select
        className="px-2 py-[0.1rem] text-black rounded-md outline-none"
        value={props.value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          props.setValue(e.target.value);
          props.setGroup?.(
            props.teams.find((t) => t.id === parseInt(e.target.value))
              ?.groupId ?? ""
          );
        }}
      >
        {props.teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    );
  };

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (
      id.length > 0 &&
      date.length > 0 &&
      homeTeamId.length > 0 &&
      awayTeamId.length > 0 &&
      groupId.length > 0
    ) {
      insertGame({
        id: parseInt(id),
        finished: false,
        homeTeam: parseInt(homeTeamId),
        awayTeam: parseInt(awayTeamId),
        homeGoals: 0,
        awayGoals: 0,
        date: date,
        groupId: groupId,
        winner: null,
      });
      setId((parseInt(id) + 1).toString());
    }
  };

  useEffect(() => {
    if (games) {
      setId(Math.max(...games.map((g) => g.id)) + 1 + "");
    }
  }, [games]);

  if (!teams || tIsLoading || !games || gIsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-3 bg-gray-600/80 rounded-lg w-96 text-center space-y-2 flex flex-col items-center justify-center">
      <h1 className="font-bold">Add Game</h1>
      <AdminInput placeholder="ID" value={id} setValue={setId} />
      <AdminInput placeholder="Date" value={date} setValue={setDate} />
      <SelectTeam
        teams={teams}
        value={homeTeamId}
        setValue={setHomeTeamId}
        setGroup={setGroupId}
      />
      <SelectTeam
        teams={teams}
        value={awayTeamId}
        setValue={setAwayTeamId}
        setGroup={setGroupId}
      />
      <AdminInput
        placeholder="Group ID"
        value={groupId}
        setValue={setGroupId}
      />
      <button
        className="bg-green-600/60 hover:bg-green-500 text-white font-bold px-2 py-1 rounded-full transition-all w-20"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
};

// https://worldvectorlogo.com/
const AddTeam = () => {
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [flag, setFlag] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (
      id.length > 0 &&
      name.length > 0 &&
      flag.length > 0 &&
      groupId.length > 0
    ) {
      insertTeam({
        id: parseInt(id),
        name: name,
        flagCode: flag,
        groupId: groupId,
        points: 0,
      });
    }
  };

  return (
    <div className="p-3 bg-gray-600/80 rounded-lg w-96 text-center space-y-2 flex flex-col items-center justify-center">
      <h1 className="font-bold">Add Team</h1>
      <AdminInput placeholder="ID" value={id} setValue={setId} />
      <AdminInput placeholder="Name" value={name} setValue={setName} />
      <AdminInput placeholder="Flag" value={flag} setValue={setFlag} />
      <AdminInput
        placeholder="Group ID"
        value={groupId}
        setValue={setGroupId}
      />
      <button
        className="bg-green-600/60 hover:bg-green-500 text-white font-bold px-2 py-1 rounded-full transition-all w-20"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
};

const AdminView = () => {
  const isAdmin = useAppSelector(selectIsAdmin);

  if (!isAdmin) {
    return <></>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col space-y-4">
      <h1 className="font-bold text-4xl">Admin View</h1>
      <AddGame />
      <AddTeam />
    </div>
  );
};

export default AdminView;
