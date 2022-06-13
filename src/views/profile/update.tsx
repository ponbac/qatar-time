import { motion } from "framer-motion";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, signedIn } from "../../features/auth/authSlice";
import { updateUserData } from "../../utils/dataFetcher";

const UpdateProfile: FC<{}> = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleAvatarClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault();
    console.log('Avatar clicked!')
  };

  const handleUpdateClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    let name = document.getElementById("nameField")?.innerHTML;
    let desc = document.getElementById("descField")?.innerHTML;

    const updatedUser: PlayerUser = {
      id: user?.id ?? "",
      name: name ?? "",
      description: desc ?? "",
      avatar: user?.avatar ?? "",
      score: user?.score ?? 0,
    };

    updateUserData(
      updatedUser.id,
      updatedUser.name,
      updatedUser.avatar,
      updatedUser.description
    );

    dispatch(signedIn(updatedUser));
  };

  if (!user) {
    return (
      <motion.div
        className="flex flex-col flex-1 min-h-screen min-w-full items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-row items-center justify-center font-mono bg-gray-500/70 backdrop-blur-sm rounded-lg p-20">
          <h1>No user signed in...</h1>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col flex-1 min-h-screen min-w-full items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center font-mono bg-gray-500/70 backdrop-blur-sm rounded-xl p-10 w-80 h-80 overflow-hidden">
        <img
          className="rounded-full p-1 ring-2 hover:ring-8 hover:cursor-pointer transition-all ring-primary"
          src={user.avatar}
          alt={`${user.name} avatar`}
          width={120}
          height={120}
          onClick={handleAvatarClick}
        />
        <div className="my-4">
          <h1 id="nameField" className="text-xl font-bold text-center" contentEditable>
            {user.name}
          </h1>
          <h1 id="descField" className="text-sm text-gray-400 text-center" contentEditable>
            {user.description}
          </h1>
        </div>
        <button onClick={handleUpdateClick}>
          <div className="hover:cursor-pointer text-center bg-gradient-to-r from-primary to-secondary text-white transition-all w-32 hover:w-36 hover:text-gray-400 p-2 rounded-xl font-bold">
            Save
          </div>
        </button>
      </div>
    </motion.div>
  );
};

export default UpdateProfile;
