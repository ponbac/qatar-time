import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, signedOut } from "../features/auth/authSlice";
import { SUPABASE } from "../utils/dataFetcher";

enum MenuItem {
  Home,
  Predict,
  Schedule,
  HallOfFame,
}

const ResponsiveNavbar: FC<{}> = ({}) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  // TODO: Highlight active menu item
  const [activeItem, setActiveItem] = useState<MenuItem>();

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

  return <div></div>;
};

export default ResponsiveNavbar;
