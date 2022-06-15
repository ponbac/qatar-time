import { motion } from "framer-motion";
import { FC, ReactNode, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Navbar from "./Navbar";
import { fetchUser, SUPABASE, updateUserData } from "../utils/dataFetcher";
import { SignInButton, SignInProvider } from "./auth/Buttons";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  selectAuthState,
  signedIn,
  signedOut,
} from "../features/auth/authSlice";
import { useAppDispatch } from "../utils/store";
import ResponsiveNavbar from "./ResponsiveNavbar";

const Head: FC<{ user?: PlayerUser }> = ({ user }) => {
  return (
    <Helmet>
      <title>
        {user ? `[${user.name} - ${user.score}p]` : "Backman - [Qatar 2022]"}
      </title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Nova+Mono&display=swap"
        rel="stylesheet"
      />
    </Helmet>
  );
};

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const [introVisible, setIntroVisible] = useState(true);
  const introDuration: number = 3.0;

  const authState = useSelector(selectAuthState);
  const dispatch = useAppDispatch();

  const authIdToPlayerUser = async (authId: string) => {
    const playerUser = await fetchUser(authId);
    return playerUser;
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const session = SUPABASE.auth.session();

    if (session?.user) {
      dispatch(login(session.user));
    }

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = SUPABASE.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          dispatch(login(session.user));
        } else {
          dispatch(signedOut());
        }
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (authState.isAuthenticated) {
      const authUser = authState.user;
      if (authUser) {
        authIdToPlayerUser(authUser.id).then((playerUser) => {
          if (playerUser.name == null) {
            // updateUserData(
            //   authUser.id,
            //   authUser.user_metadata.full_name,
            //   authUser.user_metadata.avatar_url,
            //   "No cool description yet!"
            // );

            console.log(playerUser);
          }
        });
      }
    } else {
      const user = SUPABASE.auth.user();
      if (user) {
        authIdToPlayerUser(user.id).then((playerUser) => {
          dispatch(signedIn(playerUser));
        });
      }
    }
  }, [authState]);

  if (!authState.isAuthenticated) {
    return (
      <>
        <Head />
        <motion.div
          className="min-h-screen flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="flex flex-col space-y-3 w-80 items-center font-mono bg-gray-600/70 backdrop-blur-sm rounded-xl p-10">
            <h1 className="font-mono font-bold text-3xl mb-2">Sign in with</h1>
            <SignInButton provider={SignInProvider.Discord} text="Discord" />
            <SignInButton provider={SignInProvider.Facebook} text="Facebook" />
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <Head user={authState.user ?? undefined} />
      <div className="min-h-screen flex flex-col">
        {introVisible && (
          <motion.div
            className="min-h-screen flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: introDuration }}
            onAnimationStart={() =>
              document.body.classList.add("overflow-hidden")
            }
            onAnimationComplete={() => {
              document.body.classList.remove("overflow-hidden");
              setIntroVisible(false);
            }}
          >
            <h1 className="text-center animate-bounce h-full lg:h-48 font-novaMono font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-primary to-secondary">
              It&apos;s betting time!
            </h1>
          </motion.div>
        )}
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: introDuration }}
          className="min-h-screen flex flex-row"
        >
          <div className="fixed">
            <Navbar />
            <ResponsiveNavbar />
          </div>
          <div className="flex flex-col flex-1">
            <main>{children}</main>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Layout;
