import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import useCycle from "../../utils/useCycle";
import { Context } from "../../views/Home";

const Banner = ({ className }) => {
  const { width } = useContext(Context);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const initial = {
    opacity: 0,
    y: 20,
  };
  const statements = [
    "Building a full-stack AI app with Distri.AI.",
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
    <section id="banner" className={className}>
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
          Community-Powered AI Lab
        </motion.h1>
        <motion.h1
          className="green-title"
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
          Open · Secure
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
      <div className="banner">
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
      </div>
    </section>
  );
};

export default styled(Banner)`
  height: 1080px;
  /* position: relative;
  overflow: hidden; */
  background-color: #0b0118;
  .title {
    position: relative;
    width: 50%;
    padding-top: 272px;
    padding-left: 160px;
    h1 {
      font-size: 72px;
      font-weight: 600;
      line-height: 104px;
      position: relative;
      z-index: 10;
    }
    .green-title {
      color: #09e98d;
      margin: 32px 0;
    }
  }
  .banner {
    width: 100%;
    height: 1080px;
    position: absolute;
    top: 0;
  }
  .describe {
    position: relative;
    margin: 0;
    margin-bottom: 40px;
    z-index: 10;
  }
  .buttons {
    display: flex;
    justify-content: space-between;
    width: 520px;
    position: relative;
    z-index: 20;
  }
  video {
    width: 50%;
    height: 50%;
    position: absolute;
    right: 0%;
    top: 25%;
    mix-blend-mode: screen;
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
    height: 100%;
    right: 0;
    background-image: url(/img/title/ring-3.png);
    top: 0;
  }
  .desc {
    font-weight: 500;
    font-size: 24px;
    line-height: 33px;
    margin-top: 8px;
    margin-bottom: 80px;
    position: relative;
    z-index: 10;
  }
  @media (max-width: 1440px) {
    .title {
      h1 {
        font-size: 60px;
        line-height: 96px;
      }
    }
    .desc {
      font-size: 20px;
      line-height: 28px;
    }
  }
  @media (max-width: 500px) {
    .title {
      position: relative;
      margin: 0;
      width: calc(100% - 24pt);
      margin-top: 104pt;
      padding: 0 12pt;
      h1 {
        font-size: 28pt;
        line-height: 40pt;
        text-align: center;
      }
      .green-title {
        margin-top: 12pt;
        margin-bottom: 16pt;
        line-height: 38pt;
      }
      .desc {
        font-size: 14pt;
        text-align: center;
        margin: 0;
        margin-bottom: 24pt;
      }
      .buttons {
        width: 100%;
        height: 96pt;
        flex-direction: column;
        align-items: center;
        .trans-btn {
          width: 180pt;
          height: 36pt;
          font-size: 14pt;
          line-height: 36pt;
        }
      }
    }
    .banner {
      width: 100%;
      height: 60%;
      position: relative;
      .background {
        width: 100%;
      }
      .center {
        width: 90%;
      }
      video {
        width: 100%;
      }
    }
  }
`;
