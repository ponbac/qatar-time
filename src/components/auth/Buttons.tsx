import { useDispatch } from "react-redux";
import { signedIn, signedOut } from "../../features/auth/authSlice";
import { APP_URL } from "../../utils/constants";
import { SUPABASE, updateUserData } from "../../utils/dataFetcher";

const SignInButton: React.FC<{}> = ({}) => {
  const dispatch = useDispatch();

  async function signInWithDiscord() {
    const { user, session, error } = await SUPABASE.auth.signIn(
      {
        provider: "discord",
      },
      {
        redirectTo: `${APP_URL()}/?authStatus=success`,
      }
    );

    dispatch(signedIn(user));
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    signInWithDiscord();
  };

  return (
    <button onClick={handleClick}>
      <div className="mb-6 hover:cursor-pointer text-center bg-gradient-to-r from-primary to-secondary text-white transition-all w-44 hover:w-48 hover:text-gray-400 p-2 rounded-xl font-bold">
        Sign in with Discord
      </div>
    </button>
  );
};

const SignOutButton: React.FC<{}> = ({}) => {
  const dispatch = useDispatch();

  async function signOut() {
    const { error } = await SUPABASE.auth.signOut();

    dispatch(signedOut());
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    signOut();
  };

  return <button onClick={handleClick}>Sign Out!</button>;
};

const SessionInfoButton: React.FC<{}> = ({}) => {
  async function updateMetadata() {
    const user = SUPABASE.auth.user();
    const userId = user?.id;
    if (userId) {
      updateUserData(
        userId,
        "Pontusu",
        user.user_metadata.avatar_url,
        "Hackerutojvi"
      );
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    updateMetadata();
    console.log(SUPABASE.auth.user());
  };

  return <button onClick={handleClick}>Session Info!</button>;
};

export { SignInButton, SignOutButton, SessionInfoButton };
