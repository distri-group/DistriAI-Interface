import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import useCycle from "../../utils/useCycle";

const Banner = ({ className }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const initial = {
    opacity: 0,
    y: 20,
  };
  const statements = [
    "The first system with privacy and security protection for data/models.",
    "The pioneering platform with large-scale distributed training capabilities.",
    "Building the next generation secure distributed Al computing network.",
  ];
  const [current, cycle] = useCycle(statements);
  useEffect(() => {
    let interval;
    const timeout = setTimeout(() => {
      setIsVisible(true);
      interval = setInterval(() => {
        cycle();
      }, 3000);
    }, 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [cycle]);
  return (
    <section className={className}>
      <div className="title">
        <motion.h1
          style={{ margin: 0 }}
          initial={initial}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              staggerChildren: 0.1,
              duration: 0.6,
            },
          }}>
          Distributed Al <br />
          Computing Network
        </motion.h1>
        <motion.h1
          style={{ color: "#09E98D", margin: "32px 0" }}
          initial={initial}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              staggerChildren: 0.1,
              duration: 0.6,
              delay: 0.5,
            },
          }}>
          Safe · Cost-Effective
        </motion.h1>
        {isVisible && (
          <motion.p
            className="desc"
            key={current}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
            }}>
            {current}
          </motion.p>
        )}
        <div className="buttons">
          <motion.span
            className="trans-btn"
            onClick={() => navigate("/market")}
            initial={initial}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.1,
                duration: 0.6,
                delay: 1,
              },
            }}>
            Need GPU
          </motion.span>
          <motion.span
            className="trans-btn"
            onClick={() => navigate("/device")}
            initial={initial}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.1,
                duration: 0.6,
                delay: 1,
              },
            }}>
            Share GPU
          </motion.span>
        </div>
      </div>
      <motion.div
        className="ring background"
        animate={{ scale: [1.3, 1.2, 1.3] }}
        transition={{ repeat: Infinity, duration: 10 }}>
        <div className="ring ring-2">
          <div className="ring ring-3">
            <div className="ring base" />
          </div>
        </div>
      </motion.div>
      <div className="center">
        <div className="base" />
      </div>
      <video autoPlay loop muted playsInline>
        <source
          src="/img/title/line.webm"
          type='video/webm; codecs="vp8, vorbis"'
        />
        Your browser does not support the video tag.
      </video>
    </section>
  );
};

export default styled(Banner)`
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #0b0118;
  .title {
    position: relative;
    width: 50%;
    min-width: 800px;
    margin-top: 272px;
    margin-left: 160px;
    z-index: 200;
    h1 {
      font-size: 72px;
      font-weight: 600;
      line-height: 104px;
      position: relative;
      z-index: 100;
    }
  }
  .describe {
    position: relative;
    z-index: 100;
    margin: 0;
    margin-bottom: 40px;
  }
  .buttons {
    display: flex;
    justify-content: space-between;
    width: 520px;
  }
  video {
    width: 50%;
    height: 50%;
    position: absolute;
    right: 0%;
    top: 25%;
    mix-blend-mode: screen;
    z-index: 200;
  }
  .ring {
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ring-2 {
    background-image: url(/img/title/ring-2.png);
    width: 90%;
    height: 100%;
  }
  .ring-3 {
    background-image: url(/img/title/ring-1.png);
    width: 75%;
    height: 100%;
  }
  .base {
    background-image: url(/img/title/round-base.png);
    width: 70%;
    height: 100%;
  }
  .center {
    position: absolute;
    top: 0;
    right: 5%;
    height: 100%;
    width: 40%;
    display: flex;
    justify-content: center;
    z-index: 100;
    .base {
      background-image: url(/img/title/banner.png);
      background-position: center;
      background-repeat: no-repeat;
      background-size: 110%;
      width: 800px;
    }
  }
  .background {
    position: absolute;
    overflow-x: hidden;
    width: 50%;
    min-width: 600px;
    height: 100%;
    right: 0;
    background-image: url(/img/title/ring-3.png);
    z-index: 40;
    top: 0;
  }
  .desc {
    font-weight: 500;
    font-size: 24px;
    line-height: 33px;
    margin-top: 8px;
    margin-bottom: 80px;
  }
  @media (max-width: 1200px) {
    height: 1080px;
  }
`;
