import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";
import styled from "styled-components";

function InnerBox({ className, style, delay, visible }) {
  const [scope, animate] = useAnimate();
  async function enterAndLoop() {
    await animate(
      scope.current,
      { opacity: 1, y: 0 },
      { duration: 0.3, delay }
    );
    animate(
      scope.current,
      { y: 20 },
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
  return <motion.div ref={scope} style={style} className={className} />;
}

export default styled(InnerBox)`
  width: 77px;
  height: 88px;
  position: absolute;
  z-index: 5;
  background-image: url(/img/home/computing/inner_box.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100%;
`;
