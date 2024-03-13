import styled from "styled-components";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../../views/Home";

const AboutUs = ({ className }) => {
  const { width } = useContext(Context);
  const container = useRef(null);
  const isInView = useInView(container);
  const video = useRef(null);
  const [[state, direction], setState] = useState([1, 1]);
  const initial = { opacity: 0, y: 20 };
  const carouselVariants = {
    active: {
      width: "18pt",
      background: "#ffffff",
    },
    default: {
      width: "6pt",
      background: "rgba(255, 255, 255, 0.24)",
    },
  };
  const cardsVariants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 500 : -500,
      };
    },
    center: {
      x: 0,
    },
    exit: (direction) => {
      return {
        x: direction < 0 ? 500 : -500,
      };
    },
  };
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };
  const handleSwipe = (dir) => {
    if (dir === 1) {
      setState([state === 3 ? 3 : state + 1, 1]);
    } else if (dir === -1) {
      setState([state === 1 ? 1 : state - 1, -1]);
    }
  };
  const Cards = [
    <motion.div
      key="card-1"
      className="card"
      variants={cardsVariants}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 500, damping: 30 },
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={(e, { offset, velocity }) => {
        const swipe = swipePower(offset.x, velocity.x);
        if (swipe < -swipeConfidenceThreshold) {
          handleSwipe(1);
        } else if (swipe > swipeConfidenceThreshold) {
          handleSwipe(-1);
        }
      }}>
      <h3
        style={{
          display: window.innerWidth <= 1200 && "none",
        }}>
        Large-Scale Distributed Training
      </h3>
      <AnimatePresence initial={false}>
        <motion.div
          key="learnmore-1-desc"
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }}
          className="desc">
          <p>
            Harness the power of globally under utilized GPUs to fuel the
            training of large-scale models across decentralized, heterogeneous
            networks.
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.div>,
    <motion.div
      key="card-2"
      className="card"
      variants={cardsVariants}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={(e, { offset, velocity }) => {
        const swipe = swipePower(offset.x, velocity.x);
        if (swipe < -swipeConfidenceThreshold) {
          handleSwipe(1);
        } else if (swipe > swipeConfidenceThreshold) {
          handleSwipe(-1);
        }
      }}>
      <h3
        style={{
          display: window.innerWidth <= 1200 && "none",
        }}>
        Flexible Privacy Preserving Option
      </h3>
      <AnimatePresence initial={false}>
        <motion.div
          key="learnmore-2-desc"
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }}
          className="desc">
          <p>
            Using secure containers and zero knowledge proofs to protect the
            privacy and security of models and data.
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.div>,
    <motion.div
      key="card-3"
      className="card"
      variants={cardsVariants}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={(e, { offset, velocity }) => {
        const swipe = swipePower(offset.x, velocity.x);
        if (swipe < -swipeConfidenceThreshold) {
          handleSwipe(1);
        } else if (swipe > swipeConfidenceThreshold) {
          handleSwipe(-1);
        }
      }}>
      <h3
        style={{
          display: window.innerWidth <= 1200 && "none",
        }}>
        Model as a Service
      </h3>
      <AnimatePresence initial={false}>
        <motion.div
          key="learnmore-3-desc"
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }}
          className="desc">
          <p>
            Support model training, deployment,and maintenance on our platform,
            and offering a one-stop solution for model management.
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.div>,
  ];
  useEffect(() => {
    if (isInView) {
      if (video.current && video.current.readyState >= 3) {
        video.current.play();
        video.current.loop = true;
      }
    } else {
      video.current.pause();
      video.current.currentTime = 0;
    }
  }, [isInView]);

  return (
    <section id="about-us" ref={container} className={className}>
      <div className="container">
        <div className="video-container">
          <video ref={video} muted>
            <source src="/video/bg.webm" type="video/webm" />
          </video>
        </div>
        <div className="about-us">
          <motion.div
            key="about-us-2"
            className="p2"
            initial={initial}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.6 },
            }}
            exit={{
              opacity: 0,
              y: 20,
              transition: {
                duration: 0.6,
              },
            }}>
            <h2 style={{ maxWidth: 1600, margin: "0 auto 120px auto" }}>
              The innovation of Distri.AI consists in its large-Scale
              distributed training, flexible privacy-peserving mechanism and
              model as a service.
            </h2>
            <div className="card-container">
              {width > 500 ? (
                Cards.map((item) => item)
              ) : (
                <AnimatePresence custom={direction}>
                  {Cards[state - 1]}
                </AnimatePresence>
              )}
            </div>
            {width <= 500 && (
              <div className="carousel-container">
                <motion.span
                  variants={carouselVariants}
                  animate={state === 1 ? "active" : "default"}
                  className="carousel-item"
                />
                <motion.span
                  variants={carouselVariants}
                  animate={state === 2 ? "active" : "default"}
                  className="carousel-item"
                />
                <motion.span
                  variants={carouselVariants}
                  animate={state === 3 ? "active" : "default"}
                  className="carousel-item"
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default styled(AboutUs)`
  height: 1080px;
  position: relative;
  .container {
    position: static;
    top: 0;
    height: 100%;
  }
  .video-container {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #090319;
    padding: 120px 0;
    width: 100vw;
    height: 840px;
  }
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .about-us {
    position: relative;
    z-index: 1;
    width: 100%;
    margin: 0 auto;
    height: 100vh;
    h2 {
      margin: 0;
      font-size: 48px;
      font-weight: 600;
      line-height: 72px;
      text-align: center;
    }
    .p2 {
      position: absolute;
      top: 0;
      width: 100%;
      padding-top: 162px;
    }
    .p2 {
      height: 748pt;
    }
    .card-container {
      display: flex;
      justify-content: center;
      position: relative;
      height: 343pt;
      .card {
        z-index: 10;
        width: 400px;
        height: 400px;
        margin: 0 40px;
        background: rgba(255, 255, 255, 0.12);
        border-radius: 24px;
        backdrop-filter: blur(12px);
        padding: 40px;
        h3 {
          margin: 0;
          margin-bottom: 24px;
          height: 88px;
          font-weight: 600;
          font-size: 28px;
          color: #9babff;
          line-height: 44px;
          text-align: left;
          font-style: normal;
        }
        ul {
          margin: 0;
          padding: 0;
          position: relative;
          z-index: 3;
        }
        li {
          padding: 8px 0;
        }
        .desc {
          font-size: 20px;
          font-weight: 500;
          line-height: 40px;
          position: relative;
          z-index: 5;
        }
        .bg {
          display: block;
          position: absolute;
          bottom: 0;
          right: 0;
          width: 300px;
          height: 300px;
          background-position: center;
          background-size: 100%;
          background-repeat: no-repeat;
        }
        h3 {
          font-weight: 600;
          font-size: 28px;
          color: #9babff;
          line-height: 44px;
          text-align: left;
          font-style: normal;
          transition: all 0.5s linear;
        }
        .learn-more {
          position: absolute;
          top: 160px;
          left: 40px;
        }
      }
    }
    .carousel-container {
      display: flex;
      justify-content: center;
      padding-top: 16pt;
      .carousel-item {
        width: 6pt;
        height: 6pt;
        display: block;
        margin: 3pt;
        background: rgba(255, 255, 255, 0.24);
        border-radius: 3pt;
      }
    }
  }
  @media (max-width: 1600px) {
    .about-us {
      .card-container {
        .card {
          h3 {
            font-size: 24px;
            line-height: 36px;
          }
          .desc {
            font-size: 18px;
            line-height: 32px;
          }
        }
      }
    }
  }
  @media (max-width: 500px) {
    .about-us {
      .p2 {
        padding-top: 64pt;
      }
      .p2 {
        h2 {
          margin-top: 80pt;
        }
        .card-container {
          .card {
            position: absolute;
            top: 0;
            width: 263pt;
            height: 263pt;
            margin: 0;
            padding: 40pt;
            h3 {
              height: auto;
            }
            .learn-more {
              position: static;
            }
          }
        }
      }
    }
  }
`;
