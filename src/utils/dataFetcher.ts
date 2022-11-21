import { createClient, User } from "@supabase/supabase-js";
import { GROUPS } from "./constants";

const API_URL = "/api";
const SUPABASE = createClient(
  "https://ewzrzvitukrwrxtvifkv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3enJ6dml0dWtyd3J4dHZpZmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ2MTIwMzksImV4cCI6MTk3MDE4ODAzOX0.0BowcecwZUYnFQjdohl9YTsvRW05bkbbEnRHQsuc0lE",
  {
    schema: "public",
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
);

const fetchTeams = async (): Promise<Team[]> => {
  const { data, error } = await SUPABASE.from("teams").select();
  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const fetchGroupResults = async (): Promise<GroupResult[]> => {
  const { data, error } = await SUPABASE.from("groups").select();
  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const fetchGroups = async (): Promise<Group[]> => {
  const groupNames = GROUPS;
  let groups: Group[] = [];

  await Promise.all(
    groupNames.map(async (groupName) => {
      const g = await fetchGroup(groupName);
      groups.push(g);
    })
  );

  return groups.sort((a, b) => a.id.localeCompare(b.id));
};

const fetchGroup = async (groupId: string): Promise<Group> => {
  let group: Group = {
    id: groupId.toUpperCase(),
    teams: [],
    games: [],
  };

  // TODO: Don't fetch teams here, still fetches them multiple times from the games...
  const { data: teams, error: teamsError } = await SUPABASE.from("teams")
    .select()
    .eq("groupId", groupId.toUpperCase());
  if (teamsError) {
    throw new Error(teamsError.message);
  }
  group.teams = teams;

  const { data: games, error: gamesError } = await SUPABASE.from("games")
    .select(
      `
    id,
    finished,
    homeGoals,
    awayGoals,
    homeTeam: homeTeam ( id, name, flagCode, groupId ),
    awayTeam: awayTeam ( id, name, flagCode, groupId ),
    date,
    groupId
    `
    )
    .eq("groupId", groupId.toUpperCase());
  if (gamesError) {
    throw new Error(gamesError.message);
  }
  group.games = games;

  return group;
};

const fetchAllTeams = async (): Promise<Team[]> => {
  const response = await fetch(`${API_URL}/teams`);
  const data = await response.json();
  return data;
};

const fetchTeam = async (teamId?: string, teamName?: string): Promise<Team> => {
  let query = "";
  if (teamId) {
    query = `id=${teamId}`;
  } else if (teamName) {
    query = `name=${teamName}`;
  } else {
    throw new Error("Team id or name must be provided");
  }

  const response = await fetch(`${API_URL}/teams?${query}`);
  const data = await response.json();
  return data;
};

const insertTeam = async (team: Team): Promise<any> => {
  const { data, error } = await SUPABASE.from("teams").insert(team);
  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// const useGames = (): {
//   games: Game[] | undefined;
//   isLoading: boolean;
//   isError: Error;
// } => {
//   const { data, error } = useSWR<Game[]>("/api/games", FETCHER);

//   return { games: data, isLoading: !error && !data, isError: error };
// };

const fetchGames = async (): Promise<Game[]> => {
  const { data, error } = await SUPABASE.from("games").select(
    `
    id,
    finished,
    homeGoals,
    awayGoals,
    homeTeam: homeTeam ( id, name, flagCode, groupId ),
    awayTeam: awayTeam ( id, name, flagCode, groupId ),
    date,
    groupId,
    winner
    `
  );
  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const fetchGame = async (gameId: string): Promise<Game> => {
  const { data, error } = await SUPABASE.from("games")
    .select(
      `
    id,
    finished,
    homeGoals,
    awayGoals,
    homeTeam: homeTeam ( id, name, flagCode, groupId ),
    awayTeam: awayTeam ( id, name, flagCode, groupId ),
    date,
    groupId,
    winner
    `
    )
    .match({ id: gameId });
  if (error) {
    throw new Error(error.message);
  }

  return data[0];
};

const insertGame = async (game: DBGame): Promise<any> => {
  const { data, error } = await SUPABASE.from("games").insert(game);
  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const getCurrentUser = (): User | null => {
  const user = SUPABASE.auth.user();

  return user;
};

const isLoggedIn = (): boolean => {
  const user = SUPABASE.auth.user();

  return user ? true : false;
};

const fetchUser = async (userId: string): Promise<any> => {
  const { data, error } = await SUPABASE.from("users")
    .select()
    .eq("id", userId);
  if (error) {
    throw new Error(error.message);
  }

  let user = data[0];
  if (user.predictions != null) {
    user.predictions = JSON.parse(user.predictions);
  }

  return user;
};

const fetchAllUsers = async (): Promise<any> => {
  const { data, error } = await SUPABASE.from("users").select();
  if (error) {
    throw new Error(error.message);
  }

  let parsedUsers = data.map((user) => {
    if (user.predictions != null) {
      try {
        user.predictions = JSON.parse(user.predictions);
      } catch (e) {
        console.error(`Error parsing predictions for user ${user.name}: ${e}`);
      }
    }
    return user;
  });

  return parsedUsers;
};

const updateUserData = async (
  userId: string,
  name: string,
  avatar: string,
  description: string
): Promise<any> => {
  const { data, error } = await SUPABASE.from("users")
    .update({ name: name, avatar: avatar, description: description })
    .match({ id: userId });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const updateUserPredictions = async (
  userId: string,
  predictions: GroupPrediction[]
): Promise<any> => {
  const predictionsJson = JSON.stringify(predictions);
  //console.log(predictionsJson);

  const { data, error } = await SUPABASE.from("users")
    .update({ predictions: predictionsJson })
    .match({ id: userId });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const updateGame = async (
  gameId: number,
  winner: number,
  homeGoals: number,
  awayGoals: number
): Promise<any> => {
  const { data, error } = await SUPABASE.from("games")
    .update({
      finished: true,
      winner: winner == -1 ? null : winner,
      homeGoals: homeGoals,
      awayGoals: awayGoals,
    })
    .match({ id: gameId });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const fetchPredictions = async (userId: string): Promise<GroupPrediction[]> => {
  const { data, error } = await SUPABASE.from("users")
    .select(
      `
    predictions
    `
    )
    .match({ id: userId });
  if (error) {
    throw new Error(error.message);
  }

  const parsedPredictions = JSON.parse(data[0].predictions);
  console.log(parsedPredictions);

  return parsedPredictions;
};

export {
  SUPABASE,
  fetchTeams,
  fetchGroup,
  fetchGroups,
  fetchGroupResults,
  fetchGame,
  fetchGames,
  getCurrentUser,
  fetchUser,
  fetchAllUsers,
  fetchPredictions,
  updateUserData,
  updateUserPredictions,
  updateGame,
  insertGame,
  isLoggedIn,
  insertTeam,
};
