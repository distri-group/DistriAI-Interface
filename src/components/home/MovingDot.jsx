import { useAnimation, motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function MovingDot({ steps, position, delay, opacity }) {
  const controls = useAnimation();
  let interval = useRef();
  const variants = {
    step1: {
      x: steps[0].x,
      y: steps[0].y,
      transition: {
        duration: 1.5,
      },
    },
    step2: {
      x: steps[1].x,
      y: steps[1].y,
      transition: {
        duration: 1.5,
      },
    },
    disappear: {
      opacity: 0,
      transition: {
        duration: 1.1,
      },
    },
    return: {
      x: 0,
      y: 0,
      opacity,
      transition: {
        duration: 0,
      },
    },
    exit: {
      x: 0,
      y: 0,
      opacity: 1,
    },
  };
  const runAnimation = async () => {
    try {
      await controls.start("step1");
      await controls.start("step2");
      await controls.start("disappear");
      await controls.start("return");
    } catch (e) {}
  };
  const startAnimation = () => {
    if (delay) {
      setTimeout(() => {
        runAnimation();
        interval.current = setInterval(() => {
          runAnimation();
        }, 4200);
      }, delay);
    } else {
      runAnimation();
      interval.current = setInterval(() => {
        runAnimation();
      }, 4200);
    }
  };
  useEffect(() => {
    startAnimation();
    return () => interval.current && clearInterval(interval.current);
  }, []);
  return (
    <>
      <motion.span
        variants={variants}
        animate={controls}
        style={{
          width: 12,
          height: 12,
          position: "absolute",
          backgroundColor: "white",
          boxShadow: "0px 0px 8px 4px rgba(255, 255, 255, 0.4)",
          borderRadius: "100%",
          opacity,
          ...position,
        }}
      />
    </>
  );
}
