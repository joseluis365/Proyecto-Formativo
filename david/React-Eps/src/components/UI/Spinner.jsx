import { motion } from "framer-motion";

export default function MotionSpinner() {
  return (
    <motion.div
      className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear"
      }}
    />
  );
}
