import { useAnimate, motion } from "framer-motion";
import { useEffect } from "react";

export default function Shadow({ bottom, delay, visible }) {
  const [scope, animate] = useAnimate();
  async function enterAndLoop() {
    await animate(scope.current, { opacity: 1, y: 0 }, { delay });
    animate(
      scope.current,
      { y: 40 },
      { repeat: Infinity, repeatType: "mirror", ease: "easeInOut", duration: 1 }
    );
  }
  useEffect(() => {
    if (visible) {
      enterAndLoop();
    } else {
      const exitAnimation = async () => {
        await animate(scope.current, { opacity: 0, y: 20 });
      };
      exitAnimation();
    }
  }, [visible]);
  return (
    <motion.div
      ref={scope}
      style={{
        height: "438px",
        width: "100%",
        position: "absolute",
        backgroundImage: "url(/img/home/computing/shadow.png)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
        bottom,
        opacity: 0,
      }}
    />
  );
}
