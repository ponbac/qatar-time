import { FC } from "react";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TocIcon from "@mui/icons-material/Toc";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, signedOut } from "../features/auth/authSlice";
import { SUPABASE } from "../utils/dataFetcher";

const Navbar: FC<{}> = ({}) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  async function signOut() {
    const { error } = await SUPABASE.auth.signOut();

    dispatch(signedOut());
  }

  const handleSignOutClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    signOut();
  };

  return (
    <div className="hidden lg:flex flex-col min-h-screen w-24 bg-gradient-to-l from-primary to-secondary items-center">
      <Link to={`/user/pontus`}>
        <img
          className="mt-6 rounded-full p-1 ring-2 ring-secondary transition-all hover:cursor-pointer hover:ring-4"
          src={
            user
              ? user.user_metadata.avatar_url
              : "https://avatars.dicebear.com/api/big-ears-neutral/Bakuman.svg"
          }
          alt={`Avatar`}
          width={60}
          height={60}
        />
      </Link>

      <Link to="/">
        <div className="mt-12 flex flex-col items-center hover:cursor-pointer hover:italic">
          <TocIcon className="fill-white w-12 h-12 transition-all hover:w-14 hover:h-14" />
          <p className="text-white font-semibold text-sm font-mono">Home</p>
        </div>
      </Link>
      <Link to="/predict">
        <div className="mt-4 flex flex-col items-center hover:cursor-pointer hover:italic">
          <SportsSoccerIcon className="fill-white w-12 h-12 transition-all hover:w-14 hover:h-14" />
          <p className="text-white font-semibold text-sm font-mono">Predict</p>
        </div>
      </Link>
      <Link to="/schedule">
        <div className="mt-4 flex flex-col items-center hover:cursor-pointer hover:italic">
          <ScheduleIcon className="fill-white w-12 h-12 transition-all hover:w-14 hover:h-14" />
          <p className="text-white font-semibold text-sm font-mono">Schedule</p>
        </div>
      </Link>
      <Link to="/halloffame">
        <div className="mt-4 flex flex-col items-center hover:cursor-pointer hover:italic">
          <EmojiEventsIcon className="fill-white w-12 h-12 transition-all hover:w-14 hover:h-14" />
          <p className="text-white font-semibold text-sm font-mono">HoF</p>
        </div>
      </Link>
      <div
        onClick={handleSignOutClick}
        className="absolute bottom-3 mt-4 flex flex-col items-center hover:cursor-pointer hover:italic"
      >
        <LogoutIcon className="fill-white w-12 h-12 transition-all hover:w-14 hover:h-14" />
        <p className="text-white font-semibold text-sm font-mono">Logout</p>
      </div>
    </div>
  );
};

export default Navbar;
