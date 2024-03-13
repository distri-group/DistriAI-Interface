import styled from "styled-components";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import ReactHammer from "react-hammerjs";
import { Context } from "../../views/Home";

const AboutUs = ({ className }) => {
  const { scrollProgress, width } = useContext(Context);
  const [visible, setVisible] = useState(2);
  const container = useRef(null);
  const isInView = useInView(container);
  const video = useRef(null);
  const [p1State, setP1State] = useState(1);
  const [[p2State, direction], setP2State] = useState([1, 1]);
  const [learnMore1, setLearnMore1] = useState(false);
  const [learnMore2, setLearnMore2] = useState(false);
  const [learnMore3, setLearnMore3] = useState(false);
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
      setP2State([p2State === 3 ? 3 : p2State + 1, 1]);
    } else if (dir === -1) {
      setP2State([p2State === 1 ? 1 : p2State - 1, -1]);
    }
  };
  const p1Cards = [
    <div className="card">
      <span
        className="bg"
        style={{
          backgroundImage: "url(/img/home/about_us_1.png)",
        }}
      />
      <h3>GPUs monopolized by giants, high cost of use</h3>
      <ul>
        <li>H100 selling for $40,000</li>
        <li>72% gross profit margin for cloud services</li>
      </ul>
    </div>,
    <div className="card">
      <span
        className="bg"
        style={{
          backgroundImage: "url(/img/home/about_us_2.png)",
        }}
      />
      <h3>Ensuring data privacy and security remains challenging</h3>
      <ul>
        <li>Unauthorized access</li>
        <li>sensitive data leaks</li>
      </ul>
    </div>,
  ];
  const p2Cards = [
    <motion.div
      key="p2Card-1"
      onMouseEnter={() => setLearnMore1(true)}
      onMouseLeave={() => setLearnMore1(false)}
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
          display: window.innerWidth <= 1200 && learnMore1 && "none",
        }}>
        Pooling global computing resources
      </h3>
      {!learnMore1 && <span className="learn-more">Learn More &gt;</span>}
      <AnimatePresence initial={false}>
        {learnMore1 ? (
          <motion.div
            key="learnmore-1-desc"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            onClick={() => {
              setLearnMore1(false);
            }}
            className="desc">
            <p>
              Distri.AI aggregates globally underutilized GPU resources,
              creating the industry's first privacy-centric economic distributed
              GPU computing network, establishing itself as the forefront of
              intelligent computing.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="learnmore-1-btn"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}>
            <span
              className="bg"
              style={{
                backgroundImage: "url(/img/home/about_us_3.png)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>,
    <motion.div
      key="p2Card-2"
      onMouseEnter={() => setLearnMore2(true)}
      onMouseLeave={() => setLearnMore2(false)}
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
          display: window.innerWidth <= 1200 && learnMore2 && "none",
        }}>
        PPML Framework
      </h3>
      {!learnMore2 && <span className="learn-more">Learn More &gt;</span>}
      <AnimatePresence initial={false}>
        {learnMore2 ? (
          <motion.div
            key="learnmore-2-desc"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            onClick={() => {
              setLearnMore2(false);
            }}
            className="desc">
            <p>
              Distri.AI focuses on building a privacy- centricdeep learning
              framework. Ensuring optimal protection for data and models during
              the AI training process, driving AI innovation securely and
              worry-free.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="learnmore-2-btn"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}>
            <span
              className="bg"
              style={{
                backgroundImage: "url(/img/home/about_us_4.png)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>,
    <motion.div
      key="p2Card-3"
      onMouseEnter={() => setLearnMore3(true)}
      onMouseLeave={() => setLearnMore3(false)}
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
          display: window.innerWidth <= 1200 && learnMore3 && "none",
        }}>
        A secure, efficient, and sustainable transaction model
      </h3>
      {!learnMore3 && <span className="learn-more">Learn More &gt;</span>}
      <AnimatePresence initial={false}>
        {learnMore3 ? (
          <motion.div
            key="learnmore-3-desc"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            onClick={() => {
              setLearnMore3(false);
            }}
            className="desc">
            <p>
              Distri.AI's model/data sharing platform allows users to securely
              share AI training data and models, ensuring the protection of data
              providers' interests.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="learnmore-3-btn"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}>
            <span
              className="bg"
              style={{
                backgroundImage: "url(/img/home/about_us_5.png)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>,
  ];
  // useEffect(() => {
  //   if (scrollProgress <= 55) {
  //     setVisible(1);
  //   } else if (scrollProgress <= 60) {
  //     setVisible(2);
  //   } else {
  //     setVisible(3);
  //   }
  // }, [scrollProgress]);
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
          <AnimatePresence>
            {visible === 1 ? (
              <motion.div
                key="about-us-1"
                className="p1"
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
                <h2 style={{ marginBottom: "60px" }}>
                  In the AI era, computing power has become the 'digital oil',
                  <br />
                  but we face such a dilemma
                </h2>
                <div className="card-container">
                  {width > 500 ? (
                    p1Cards.map((item) => item)
                  ) : (
                    <ReactHammer
                      onSwipe={(e) => {
                        if (e.direction === 2) {
                          setP1State(2);
                        } else if (e.direction === 4) {
                          setP1State(1);
                        }
                      }}>
                      {p1Cards[p1State - 1]}
                    </ReactHammer>
                  )}
                </div>
                {width <= 500 && (
                  <div className="carousel-container">
                    <motion.span
                      variants={carouselVariants}
                      animate={p1State === 1 ? "active" : "default"}
                      className="carousel-item"
                      onClick={() => setP1State(1)}
                    />
                    <motion.span
                      variants={carouselVariants}
                      animate={p1State === 2 ? "active" : "default"}
                      className="carousel-item"
                      onClick={() => setP1State(2)}
                    />
                  </div>
                )}
              </motion.div>
            ) : visible === 2 ? (
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
                <h2 style={{ marginBottom: "120px" }}>
                  What do we aim to achieve?
                </h2>
                <div className="card-container">
                  {width > 500 ? (
                    p2Cards.map((item) => item)
                  ) : (
                    <AnimatePresence custom={direction}>
                      {p2Cards[p2State - 1]}
                    </AnimatePresence>
                  )}
                </div>
                {width <= 500 && (
                  <div className="carousel-container">
                    <motion.span
                      variants={carouselVariants}
                      animate={p2State === 1 ? "active" : "default"}
                      className="carousel-item"
                      onClick={() => setP2State(1)}
                    />
                    <motion.span
                      variants={carouselVariants}
                      animate={p2State === 2 ? "active" : "default"}
                      className="carousel-item"
                      onClick={() => setP2State(2)}
                    />
                    <motion.span
                      variants={carouselVariants}
                      animate={p2State === 3 ? "active" : "default"}
                      className="carousel-item"
                      onClick={() => setP2State(3)}
                    />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="about-us-3"
                className="p3"
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
                <h2>
                  Join Distri.AI to collectively propel the future of
                  intelligent computing and explore the limitless possibilities
                  of technology!
                </h2>
              </motion.div>
            )}
          </AnimatePresence>
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
    .p1,
    .p2,
    .p3 {
      position: absolute;
      top: 0;
      width: 100%;
      padding-top: 162px;
    }
    .p3 {
      h2 {
        width: 1048px;
        margin: 0 auto;
        margin-top: 120px;
      }
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
      .p1,
      .p2,
      .p3 {
        padding-top: 64pt;
      }
      .p1 {
        h2 {
          font-size: 24pt;
          line-height: 40pt;
          width: 268pt;
          margin: 0 auto;
          margin-top: 40pt;
        }
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
      .p3 {
        h2 {
          width: 80%;
        }
      }
    }
  }
`;
