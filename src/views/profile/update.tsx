import { motion } from "framer-motion";
import { FC } from "react";

const UpdateProfile: FC<{}> = () => {
  return (
    <motion.div
      className="flex flex-col flex-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <p>UPDATE PROFILE!</p>
    </motion.div>
  );
};

export default UpdateProfile;
