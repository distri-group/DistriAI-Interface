import styled from "styled-components";
import HorizontalColorChange from "./HorizontalColorChange";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useState } from "react";
import { Context } from "../../views/Home";

const HowToDo = ({ className }) => {
  const { width } = useContext(Context);
  const [[activeState, direction], setActiveState] = useState([1, 1]);
  const initial = {
    opacity: 0,
    y: 20,
  };
  const variants = {
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
      setActiveState([activeState === 3 ? 3 : activeState + 1, 1]);
    } else if (dir === -1) {
      setActiveState([activeState === 1 ? 1 : activeState - 1, -1]);
    }
  };
  return (
    <section className={className}>
      <div className="container">
        {width > 500 ? (
          <>
            <motion.div
              initial={initial}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                },
              }}
              viewport={{ once: true }}
              className="row">
              <span className="title">BUY</span>
              <div className="card">
                <span className="icon slsb" />
                <span className="desc">Choose a computing device</span>
              </div>
              <HorizontalColorChange />
              <div className="card">
                <span className="icon ljqb" />
                <span className="desc">
                  Connect wallet and complete payment
                </span>
              </div>
              <HorizontalColorChange delay={0.3} />
              <div className="card">
                <span className="icon kssy" />
                <span className="desc">Ready to use</span>
              </div>
            </motion.div>
            <motion.div
              initial={initial}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                },
              }}
              viewport={{ once: true }}
              className="row"
              style={{ margin: "60px 0" }}>
              <span className="title">SELL</span>
              <div className="card">
                <span className="icon azcx" />
                <span className="desc">Deploy a device</span>
              </div>
              <HorizontalColorChange delay={0.6} />
              <div className="card">
                <span className="icon szsc" />
                <span className="desc">Set rental price</span>
              </div>
              <HorizontalColorChange delay={0.9} />
              <div className="card">
                <span className="icon ksjy" />
                <span className="desc">Awaiting rental</span>
              </div>
            </motion.div>
            <motion.div
              initial={initial}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                },
              }}
              viewport={{ once: true }}
              className="row">
              <span className="title">DAO</span>
              <div className="card">
                <span className="icon fbta" />
                <span className="desc">Publish computing tasks</span>
              </div>
              <HorizontalColorChange delay={1.2} />
              <div className="card">
                <span className="icon jsjd" />
                <span className="desc">Claim by compute nodes</span>
              </div>
              <HorizontalColorChange delay={1.5} />
              <div className="card">
                <span className="icon jssy" />
                <span className="desc">Tasks finished</span>
              </div>
            </motion.div>
          </>
        ) : (
          <>
            <div className="titles">
              <span
                style={{ color: activeState === 1 && "#09E98D" }}
                onClick={() => setActiveState(1)}>
                BUY
              </span>
              <span
                style={{ color: activeState === 2 && "#09E98D" }}
                onClick={() => setActiveState(2)}>
                SELL
              </span>
              <span
                style={{ color: activeState === 3 && "#09E98D" }}
                onClick={() => setActiveState(3)}>
                DAO
              </span>
            </div>
            <div className="sequence-container">
              <AnimatePresence custom={direction}>
                {activeState === 1 ? (
                  <motion.div
                    className="item"
                    key="buy"
                    variants={variants}
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
                    <div className="card">
                      <span className="icon slsb" />
                      <div className="desc">
                        <span>Choose a computing device</span>
                      </div>
                    </div>
                    <HorizontalColorChange />
                    <div className="card">
                      <span className="icon ljqb" />
                      <div className="desc">
                        <span>Connect wallet and complete payment</span>
                      </div>
                    </div>
                    <HorizontalColorChange delay={0.3} />
                    <div className="card">
                      <span className="icon kssy" />
                      <div className="desc">
                        <span>Ready to use</span>
                      </div>
                    </div>
                  </motion.div>
                ) : activeState === 2 ? (
                  <motion.div
                    className="item"
                    key="sell"
                    variants={variants}
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
                    <div className="card">
                      <span className="icon azcx" />
                      <div className="desc">
                        <span>Deploy a device</span>
                      </div>
                    </div>
                    <HorizontalColorChange delay={0.6} />
                    <div className="card">
                      <span className="icon szsc" />
                      <div className="desc">
                        <span>Set rental price</span>
                      </div>
                    </div>
                    <HorizontalColorChange delay={0.9} />
                    <div className="card">
                      <span className="icon ksjy" />
                      <div className="desc">
                        <span>Awaiting rental</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  activeState === 3 && (
                    <motion.div
                      className="item"
                      key="dao"
                      variants={variants}
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
                      <div className="card">
                        <span className="icon fbta" />
                        <div className="desc">
                          <span>Publish computing tasks</span>
                        </div>
                      </div>
                      <HorizontalColorChange delay={1.2} />
                      <div className="card">
                        <span className="icon jsjd" />
                        <div className="desc">
                          <span>Claim by compute nodes</span>
                        </div>
                      </div>
                      <HorizontalColorChange delay={1.5} />
                      <div className="card">
                        <span className="icon jssy" />
                        <div className="desc">
                          <span>Tasks finished</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default styled(HowToDo)`
  height: 100vh;
  max-height: 1080px;
  background-color: #090319;
  .container {
    max-width: 1200px;
    height: calc(100% - 360px);
    margin: 0 auto;
    display: flex;
    padding-top: 200px;
    padding-bottom: 160px;
    flex-direction: column;
    justify-content: space-between;
  }
  .row {
    display: flex;
    height: 160px;
    .title {
      line-height: 160px;
      font-weight: 600;
      color: #09e98d;
      font-size: 32px;
    }
    .card {
      width: 320px;
      .icon {
        display: block;
        width: 100%;
        height: 120px;
        background-position: center;
        background-repeat: no-repeat;
      }
      .desc {
        margin-top: 12px;
        display: block;
        width: 100%;
        text-align: center;
        font-size: 20px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.8);
        line-height: 28px;
      }
    }
  }
  .slsb {
    background-image: url(/img/home/icon_slsb.png);
  }
  .ljqb {
    background-image: url(/img/home/icon_ljqb.png);
  }
  .kssy {
    background-image: url(/img/home/icon_kssy.png);
  }
  .azcx {
    background-image: url(/img/home/icon_azcx.png);
  }
  .szsc {
    background-image: url(/img/home/icon_szsc.png);
  }
  .ksjy {
    background-image: url(/img/home/icon_ksjy.png);
  }
  .fbta {
    background-image: url(/img/home/icon_fbta.png);
  }
  .jsjd {
    background-image: url(/img/home/icon_jsjd.png);
  }
  .jssy {
    background-image: url(/img/home/icon_jssy.png);
  }
  @media (max-width: 1600px) {
    .row {
      .card {
        width: 240px;
      }
    }
  }
  @media (max-width: 500px) {
    .container {
      padding: 0;
      padding-top: 64pt;
      height: 748pt;
      justify-content: flex-start;
    }
    .titles {
      width: calc(100% - 100pt);
      padding: 0 50pt;
      padding-top: 40pt;
      display: flex;
      justify-content: space-between;
      span {
        font-size: 16pt;
        line-height: 24pt;
        color: #898989;
      }
    }
    .sequence-container {
      overflow: hidden;
      margin: 48pt;
      position: relative;
      height: 100%;
      .item {
        position: absolute;
        top: 0;
        .card {
          display: flex;
          .icon {
            display: block;
            width: 80pt;
            height: 80pt;
            margin: 0;
            background-position: center;
            background-repeat: no-repeat;
            background-size: 100%;
          }
          .desc {
            display: flex;
            align-items: center;
            width: 140pt;
            margin-left: 24pt;
            span {
              font-size: 12pt;
            }
          }
        }
      }
    }
  }
`;
