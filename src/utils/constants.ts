export const APP_URL = (): string =>
  window.location.host == "localhost:5173"
    ? "http://localhost:5173"
    : "https://qatar.backman.app";

export const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H"];

// TODO: This is a hack, but it works for now (should be server-side).
export const GROUP_PREDICTIONS_CLOSE = "2022-11-20T16:45:00";
export const PLAYOFF_PREDICTIONS_OPEN = "2022-11-29T22:00:00";
export const PLAYOFF_PREDICTIONS_CLOSE = "2022-12-03T15:00:00";

export const ADMIN_ID = "ecf31a6f-9403-4276-afd8-f83ffabc9f01";

export const TBD_TEAM: Team = {
  id: -1,
  name: "TBD",
  flagCode: "aq",
  groupId: "TBD",
  points: 0,
};
