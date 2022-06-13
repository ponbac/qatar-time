import { motion } from "framer-motion";
import { FC, ReactNode, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "./Navbar";
import {
  fetchUserData,
  isLoggedIn,
  SUPABASE,
  updateUserData,
} from "../utils/dataFetcher";
import { SessionInfoButton, SignInButton, SignOutButton } from "./auth/Buttons";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAuthState,
  signedIn,
  signedOut,
} from "../features/auth/authSlice";
import { sleep } from "../utils/utils";
import { User } from "@supabase/supabase-js";
import { APP_URL } from "../utils/constants";

const Head: FC<{}> = () => {
  return (
    <Helmet>
      <title>Backman - Qatar 2022</title>
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
  // const [searchParams] = useSearchParams();
  // const authStatus = searchParams.get("authStatus");

  const [introVisible, setIntroVisible] = useState(true);
  const introDuration: number = 3.0;

  const authState = useSelector(selectAuthState);
  const dispatch = useDispatch();

  const authIdToPlayerUser = async (authId: string) => {
    const playerUser = await fetchUserData(authId);
    return playerUser;
  };

  useEffect(() => {
    // if (authStatus == "success") {
    //   let navigate = useNavigate();
    //   navigate(`${APP_URL()}`);
    // }

    function listenForStorage() {
      const item = localStorage.getItem("supabase.auth.token");
      if (item) {
        const user = SUPABASE.auth.user();
        if (user) {
          dispatch(signedIn(user));
        }
      } else {
        dispatch(signedOut());
      }
    }
    listenForStorage();
    window.addEventListener("storage", listenForStorage);

    return () => {
      window.removeEventListener("storage", listenForStorage);
    };
  }, [dispatch]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      const authUser = authState.user;
      if (authUser) {
        authIdToPlayerUser(authUser.id).then((playerUser) => {
          if (playerUser.name == null) {
            updateUserData(
              authUser.id,
              authUser.user_metadata.full_name,
              authUser.user_metadata.avatar_url,
              "No cool description yet!"
            );

            console.log(playerUser);
          }
        });
      }
    }
  }, [authState]);

  if (!authState.isAuthenticated) {
    return (
      <>
        <Head />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <SignInButton />
        </div>
      </>
    );
  }

  return (
    <>
      <Head />
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
