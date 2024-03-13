import styled from "styled-components";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useState, useRef, useContext } from "react";
import Shadow from "./Shadow";
import MovingDot from "./MovingDot";
import InnerBox from "./InnerBox";
import { Context } from "../../views/Home";

const ComputingPower = ({ className }) => {
  const { scrollProgress, width } = useContext(Context);
  const [titleSelected, setTitleSelected] = useState(true);
  const [visible, setVisible] = useState(false);
  const [securityLevel, setSecurityLevel] = useState(1);
  const [banner, setBanner] = useState(false);
  const container = useRef();
  const isInView = useInView(container);
  let interval = useRef();
  const initial = { opacity: 0, y: 20 };
  const variants = {
    hidden: { opacity: 0, y: 20 },
    hiddenRev: { opacity: 0, y: -60 },
    scaleNone: { scale: 0 },
    scale: { scale: 1, opacity: 1 },
    visible: { opacity: 1, y: 0 },
    shine: {
      boxShadow: [
        "0 0 10px #ffffff",
        "0 0 30px #ffffff",
        "0 0 50px #ffffff",
        "0 0 70px #ffffff",
        "0 0 90px #ffffff",
        "0px 0px 110px rgba(255, 255, 255, 0.4)",
      ],
    },
  };
  useEffect(() => {
    if (interval.current) {
      interval.current = setInterval(() => {
        setTitleSelected((t) => !t);
      }, 3000);
    }
    return () => interval.current && clearInterval(interval.current);
  }, []);
  return (
    <section className={className}>
      <div ref={container} className="container">
        <div className="logo">
          <motion.div
            className="banner"
            initial={{ opacity: 0, y: 60 }}
            whileInView="visible"
            transition={{ duration: 1 }}
            onAnimationStart={() => setBanner(false)}
            variants={variants}>
            <AnimatePresence>
              <motion.div
                className="grids"
                initial="scaleNone"
                whileInView="scale"
                variants={variants}
                transition={{ delay: 0.4 }}
                onAnimationComplete={() => {
                  setBanner(true);
                }}>
                {banner &&
                  (visible ? (
                    <motion.div
                      className="p2"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      style={{
                        width: "571px",
                        height: "336px",
                        position: "absolute",
                      }}
                      variants={variants}
                      transition={{ duration: 0.5 }}>
                      <motion.div
                        className="box-container"
                        initial={{ scale: 0, originY: 1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                        style={{ top: -16, right: -30 }}>
                        <motion.div className="box-shadow" />
                        <motion.div
                          animate={{
                            y: [0, 18, 0],
                            transition: { repeat: Infinity, duration: 2.5 },
                          }}
                          className="box"
                        />
                      </motion.div>
                      <motion.div
                        className="box-container"
                        initial={{ scale: 0, originY: 1 }}
                        animate={{ scale: 0.9 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                        style={{ top: -18, left: -35 }}>
                        <motion.div className="box-shadow" />
                        <motion.div
                          animate={{
                            y: [0, 15, 0],
                            transition: { repeat: Infinity, duration: 2 },
                          }}
                          className="box"
                        />
                      </motion.div>
                      <motion.div
                        className="box-container"
                        initial={{ scale: 0, originY: 1 }}
                        animate={{ scale: 1.1 }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                        style={{ bottom: -17, left: 229, zIndex: 10 }}>
                        <motion.div className="box-shadow" />
                        <motion.div
                          animate={{
                            y: [0, 20, 0],
                            transition: { repeat: Infinity, duration: 2.5 },
                          }}
                          className="box"
                        />
                      </motion.div>
                      <motion.div
                        className="box-container"
                        initial={{ scale: 0, originY: 1 }}
                        animate={{ scale: 0.8 }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                        style={{ top: -125, left: 161 }}>
                        <motion.div className="box-shadow" />
                        <motion.div
                          animate={{
                            y: [0, 20, 0],
                            transition: { repeat: Infinity, duration: 2.5 },
                          }}
                          className="box"
                        />
                      </motion.div>
                      <motion.div
                        initial="hiddenRev"
                        animate="visible"
                        exit="hidden"
                        variants={variants}
                        transition={{ duration: 0.4 }}
                        className="hexagon-1">
                        <motion.div
                          initial="hiddenRev"
                          animate="visible"
                          variants={variants}
                          transition={{ duration: 0.4, delay: 0.4 }}
                          className="hexagon-2">
                          <motion.div
                            initial="hiddenRev"
                            animate="visible"
                            variants={variants}
                            transition={{ duration: 0.4, delay: 0.8 }}
                            className="shield">
                            <motion.div
                              initial="hiddenRev"
                              animate="visible"
                              variants={variants}
                              transition={{ duration: 0.4, delay: 1.2 }}
                              className="lock">
                              <motion.div
                                initial={{ scaleY: 0, originY: 1 }}
                                animate={{ scaleY: 1 }}
                                variants={variants}
                                transition={{ duration: 0.4, delay: 1.2 }}
                                className="light-beam"
                              />
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="p1"
                      initial="hiddenRev"
                      animate="visible"
                      exit="hidden"
                      variants={variants}
                      transition={{ duration: 0.5 }}>
                      <AnimatePresence mode="wait">
                        {titleSelected ? (
                          <div
                            style={{
                              position: "relative",
                              left: 10,
                              bottom: 10,
                            }}>
                            <motion.div
                              key="boxes"
                              initial="hiddenRev"
                              animate="visible"
                              exit="hidden"
                              variants={variants}
                              transition={{
                                duration: 0.4,
                              }}
                              className="boxes">
                              <motion.div className="dots">
                                <motion.span
                                  initial={{
                                    boxShadow:
                                      "0px 0px 8px 4px rgba(255, 255, 255, 0.4)",
                                  }}
                                  animate="shine"
                                  variants={variants}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  style={{
                                    top: width > 500 ? 73 : 56,
                                    left: -5,
                                  }}
                                  className="dot"
                                />
                                <motion.span
                                  initial={{
                                    boxShadow:
                                      "0px 0px 8px 4px rgba(255, 255, 255, 0.4)",
                                  }}
                                  animate="shine"
                                  variants={variants}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0.5,
                                  }}
                                  style={{
                                    top: width > 500 ? 73 : 56,
                                    left: width > 500 ? 83 : 61,
                                  }}
                                  className="dot"
                                />
                                <motion.span
                                  initial={{
                                    boxShadow:
                                      "0px 0px 8px 4px rgba(255, 255, 255, 0.4)",
                                  }}
                                  animate="shine"
                                  variants={variants}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0.2,
                                  }}
                                  style={
                                    width > 500
                                      ? { top: 21, left: 170 }
                                      : { top: 15, left: 127 }
                                  }
                                  className="dot"
                                />
                                <motion.span
                                  initial={{
                                    boxShadow:
                                      "0px 0px 8px 4px rgba(255, 255, 255, 0.4)",
                                  }}
                                  animate="shine"
                                  variants={variants}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0.8,
                                  }}
                                  style={
                                    width > 500
                                      ? { top: 46, left: 217 }
                                      : { top: 34, left: 162 }
                                  }
                                  className="dot"
                                />
                                <motion.span
                                  initial={{
                                    boxShadow:
                                      "0px 0px 8px 4px rgba(255, 255, 255, 0.4)",
                                  }}
                                  animate="shine"
                                  variants={variants}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 1.1,
                                  }}
                                  style={
                                    width > 500
                                      ? { top: 46, left: 304 }
                                      : { top: 35, left: 227 }
                                  }
                                  className="dot"
                                />
                                <motion.span
                                  initial={{
                                    boxShadow:
                                      "0px 0px 8px 4px rgba(255, 255, 255, 0.4)",
                                  }}
                                  animate="shine"
                                  variants={variants}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0.3,
                                  }}
                                  style={
                                    width > 500
                                      ? { top: 124, left: 172 }
                                      : { top: 94, left: 128 }
                                  }
                                  className="dot"
                                />
                                <motion.span
                                  initial={{
                                    boxShadow:
                                      "0px 0px 8px 4px rgba(255, 255, 255, 0.4)",
                                  }}
                                  animate="shine"
                                  variants={variants}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0.6,
                                  }}
                                  style={
                                    width > 500
                                      ? { top: 151, left: 128 }
                                      : { top: 113, left: 96 }
                                  }
                                  className="dot"
                                />
                                <motion.span
                                  initial={{
                                    boxShadow:
                                      "0px 0px 8px 4px rgba(255, 255, 255, 0.4)",
                                  }}
                                  animate="shine"
                                  variants={variants}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0.7,
                                  }}
                                  style={
                                    width > 500
                                      ? { top: 151, left: 304 }
                                      : { top: 112, left: 228 }
                                  }
                                  className="dot"
                                />
                                <motion.span
                                  initial={{
                                    boxShadow:
                                      "0px 0px 8px 4px rgba(255, 255, 255, 0.4)",
                                  }}
                                  animate="shine"
                                  variants={variants}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 1,
                                  }}
                                  style={
                                    width > 500
                                      ? { top: 200, left: 217 }
                                      : { top: 150, left: 162 }
                                  }
                                  className="dot"
                                />
                              </motion.div>
                            </motion.div>
                          </div>
                        ) : (
                          <>
                            <motion.div
                              key="cloud"
                              initial="hiddenRev"
                              animate="visible"
                              exit="hidden"
                              variants={variants}
                              transition={{
                                duration: 0.4,
                              }}
                              className="logo-cloud"
                            />
                            <InnerBox
                              style={
                                width > 500
                                  ? { top: "113px", right: "32px" }
                                  : { scale: 0.8, top: 123, right: 21 }
                              }
                              delay={0.2}
                              visible={!titleSelected}
                            />
                            <InnerBox
                              style={
                                width > 500
                                  ? {
                                      scale: 1.2,
                                      bottom: "-5px",
                                      left: "244px",
                                    }
                                  : { scale: 0.9, bottom: 35, left: 177 }
                              }
                              delay={0.3}
                              visible={!titleSelected}
                            />
                            <InnerBox
                              style={
                                width > 500
                                  ? {
                                      scale: 0.9,
                                      top: "117px",
                                      left: "22px",
                                    }
                                  : { scale: 0.6, top: 122, left: 11 }
                              }
                              delay={0.4}
                              visible={!titleSelected}
                            />
                            <motion.div
                              initial="hiddenRev"
                              animate="visible"
                              exit="hidden"
                              variants={variants}
                              transition={{ delay: 0.4 }}
                              className="dots">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                                <>
                                  <MovingDot
                                    steps={
                                      width > 500
                                        ? [
                                            { x: -58, y: -34 },
                                            { x: -163, y: 32 },
                                          ]
                                        : [
                                            { x: -62, y: -38 },
                                            { x: -176, y: 34 },
                                          ]
                                    }
                                    position={{
                                      top: 132,
                                      left: 218,
                                    }}
                                    delay={30 * value}
                                    opacity={1 - value / 12}
                                  />
                                  <MovingDot
                                    steps={
                                      width > 500
                                        ? [
                                            { x: -58, y: 32 },
                                            { x: 56, y: 96 },
                                          ]
                                        : [
                                            { x: -50, y: 24 },
                                            { x: 50, y: 78 },
                                          ]
                                    }
                                    position={
                                      width > 500
                                        ? {
                                            bottom: 129,
                                            left: 217,
                                          }
                                        : {
                                            bottom: 136,
                                            left: 164,
                                          }
                                    }
                                    delay={30 * value}
                                    opacity={1 - value / 12}
                                  />
                                  <MovingDot
                                    steps={[
                                      { x: 52, y: 28 },
                                      { x: 164, y: -38 },
                                    ]}
                                    position={
                                      width > 500
                                        ? {
                                            bottom: 126,
                                            right: 227,
                                          }
                                        : {
                                            bottom: 114,
                                            right: 217,
                                          }
                                    }
                                    delay={30 * value}
                                    opacity={1 - value / 12}
                                  />
                                </>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <Shadow
            height={width > 500 ? 438 : "200pt"}
            bottom={width > 500 ? 0 : 22}
            delay={0}
            visible={isInView}
          />
          <Shadow
            height={width > 500 ? 438 : "200pt"}
            bottom={width > 500 ? 71 : -10}
            delay={0.2}
            visible={isInView}
          />
          <Shadow
            height={width > 500 ? 438 : "200pt"}
            bottom={width > 500 ? 138 : -36}
            delay={0.4}
            visible={isInView}
          />
        </div>
        <div className="desc">
          {visible ? (
            <motion.div
              key="p2-desc"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={variants}
              transition={{ duration: 0.5 }}
              className="p2">
              <motion.h2>
                PrivySphere - our proprietary deep learning framework providing
                multi-layered privacy protection capabilities
              </motion.h2>
              <motion.div className="subtitle">
                <motion.h3
                  style={{ color: securityLevel === 1 ? "#9babff" : "#898989" }}
                  onClick={() => setSecurityLevel(1)}>
                  PrivySphere L1
                </motion.h3>
                <motion.h3
                  style={{
                    color: securityLevel === 2 ? "#9babff" : "#898989",
                    margin: "0 32px",
                  }}
                  onClick={() => setSecurityLevel(2)}>
                  PrivySphere L2
                </motion.h3>
                <motion.h3
                  style={{ color: securityLevel === 3 ? "#9babff" : "#898989" }}
                  onClick={() => setSecurityLevel(3)}>
                  PrivySphere L3
                </motion.h3>
              </motion.div>
              <motion.div>
                {securityLevel === 1 ? (
                  <motion.p
                    key="privySphere-1"
                    initial={initial}
                    animate={{ opacity: 1, y: 0 }}
                    exit={initial}>
                    We provide a secure, isolated, and independent runtime
                    environment, ensuring computing tasks do not affect external
                    environments. We emphasize container image compatibility and
                    maintainability to support diverse computing needs on
                    different hardware and operating systems.
                  </motion.p>
                ) : securityLevel === 2 ? (
                  <motion.p
                    key="privySphere-2"
                    initial={initial}
                    animate={{ opacity: 1, y: 0 }}
                    exit={initial}>
                    We create a hardware-isolated execution environment to
                    ensure security of computing activities, preventing external
                    system access or modification. This enhances data processing
                    security, improves trustworthiness and verifiability of
                    processing.
                  </motion.p>
                ) : (
                  <motion.p
                    key="privySphere-3"
                    initial={initial}
                    animate={{ opacity: 1, y: 0 }}
                    exit={initial}>
                    Designed for scenarios with the highest data security
                    requirements, multiple participants can jointly compute a
                    function's output without revealing their respective input
                    data. This guarantees privacy and security of data during
                    processing.
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="p1-desc"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={variants}
              transition={{ duration: 0.5 }}
              className="p1">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    staggerChildren: 0.1,
                    duration: 0.4,
                  },
                }}
                viewport={{ once: true }}>
                Two computing power service models, Powering your largest
                computing needs
              </motion.h2>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    staggerChildren: 0.1,
                    duration: 0.4,
                    delay: 0.4,
                  },
                }}
                viewport={{ once: true }}
                onClick={() => setTitleSelected(true)}
                onMouseEnter={() => setTitleSelected(true)}
                style={{ color: titleSelected ? "#9babff" : "#898989" }}>
                Submit computing proposals to the DAO
              </motion.h3>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    staggerChildren: 0.1,
                    duration: 0.4,
                    delay: 0.4,
                  },
                }}
                viewport={{ once: true }}
                onClick={() => setTitleSelected(false)}
                onMouseEnter={() => setTitleSelected(false)}
                style={{ color: titleSelected ? "#898989" : "#9babff" }}>
                Buy computing power - P2P market
              </motion.h3>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    staggerChildren: 0.1,
                    duration: 0.4,
                    delay: 0.8,
                  },
                }}
                viewport={{ once: true }}>
                {titleSelected ? (
                  <motion.p
                    key="modal-1"
                    initial={initial}
                    animate={{ opacity: 1, y: 0 }}
                    exit={initial}>
                    Free computing tasks published through the DAO community.
                    Computing nodes can select and execute suitable tasks based
                    on their capabilities and preferences, enabling large-scale
                    distributed training with extensive distributed computing
                    resources.
                  </motion.p>
                ) : (
                  <motion.p
                    key="modal-2"
                    initial={initial}
                    animate={{ opacity: 1, y: 0 }}
                    exit={initial}>
                    For small computing tasks, we provide flexible and instant
                    access to computing resources through peer-to-peer trading
                    on our marketplace, connecting suppliers and demand.
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default styled(ComputingPower)`
  height: 1080px;
  position: relative;
  .container {
    position: static;
    top: 0;
    display: flex;
    /* max-width: 1600px; */
    padding: 0 160px;
    justify-content: space-between;
    height: 1080px;
    /* background-image: url(/img/home/computing_power.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center; */
    background-color: #090319;
    .desc {
      width: 730px;
      h2 {
        margin: 0;
        margin-bottom: 40px;
        font-size: 48px;
        font-weight: 600;
        line-height: 72px;
      }
      h3 {
        margin: 0;
        margin-bottom: 24px;
        font-size: 28px;
        font-weight: 600;
        line-height: 44px;
        cursor: pointer;
      }
      p {
        margin: 0;
        margin-top: 10px;
        font-size: 24px;
        font-weight: 500;
        line-height: 40px;
      }
    }
  }
  .subtitle {
    display: flex;
    margin-bottom: 32px;
  }
  .logo {
    height: 700px;
    min-width: 762px;
    position: relative;
    margin-top: 144px;
    .banner {
      height: 499px;
      width: 100%;
      position: absolute;
      top: 0;
      background-image: url(/img/home/computing/banner.png);
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100%;
      .grids {
        height: 336px;
        width: 571px;
        margin: 0 auto;
        margin-top: 54px;
        background-image: url(/img/home/computing/grid.png);
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100%;
        .p1 {
          width: 571px;
          height: 336px;
          position: absolute;
          padding: 0;
          .boxes {
            height: 260px;
            width: 355px;
            position: absolute;
            top: 40px;
            left: 104px;
            background-image: url(/img/home/computing/cubes.png);
            background-position: center;
            background-repeat: no-repeat;
            background-size: 100%;
            .dots {
              height: 260px;
              width: 355px;
            }
          }
          .dots {
            width: 571px;
            height: 336px;
            position: absolute;
            top: 0;
            left: 0;
            .dot {
              width: 12px;
              height: 12px;
              position: absolute;
              background-color: white;
              box-shadow: 0px 0px 8px 4px rgba(255, 255, 255, 0.4);
              border-radius: 100%;
            }
          }
          .logo-cloud {
            width: 357px;
            height: 242px;
            position: absolute;
            top: 36px;
            left: 128px;
            z-index: 5;
            background-image: url(/img/home/computing/logo_cloud.png);
            background-position: center;
            background-repeat: no-repeat;
            background-size: 100%;
          }
        }
        .p2 {
          padding: 0;
          .box-container {
            height: 215px;
            width: 100px;
            position: absolute;
            .box {
              height: 105px;
              width: 100%;
              position: absolute;
              z-index: 10;
              top: 0;
              background-image: url(/img/home/computing/box.png);
              background-position: center;
              background-repeat: no-repeat;
              background-size: 100%;
            }
            .box-shadow {
              height: 165px;
              width: 100%;
              position: absolute;
              z-index: 5;
              bottom: 0;
              background-image: url(/img/home/computing/box_shadow.png);
              background-position: center;
              background-repeat: no-repeat;
              background-size: 100%;
            }
          }
          .hexagon-1 {
            height: 287px;
            width: 453px;
            position: absolute;
            bottom: 18px;
            left: 67px;
            background-image: url(/img/home/computing/hexagon_1.png);
            background-position: center;
            background-repeat: no-repeat;
            background-size: 100%;
            .hexagon-2 {
              height: 249px;
              width: 389px;
              position: absolute;
              top: -9px;
              left: 34px;
              background-image: url(/img/home/computing/hexagon_2.png);
              background-position: center;
              background-repeat: no-repeat;
              background-size: 100%;
              .shield {
                height: 209px;
                width: 319px;
                position: absolute;
                top: -9px;
                left: 34px;
                background-image: url(/img/home/computing/shield.png);
                background-position: center;
                background-repeat: no-repeat;
                background-size: 100%;
                .lock {
                  height: 114px;
                  width: 158px;
                  position: absolute;
                  top: 25px;
                  left: 87px;
                  background-image: url(/img/home/computing/lock.png);
                  background-position: center;
                  background-repeat: no-repeat;
                  background-size: 100%;
                  .light-beam {
                    height: 154px;
                    width: 22px;
                    position: absolute;
                    top: -97px;
                    left: 71px;
                    background-image: url(/img/home/computing/light_beam.png);
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: 100%;
                  }
                }
              }
            }
          }
        }
      }
    }
    .shadow {
      height: 438px;
      width: 100%;
      position: absolute;
      background-image: url(/img/home/computing/shadow.png);
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100%;
    }
  }
  .p1,
  .p2 {
    padding-top: 144px;
  }
  @media (max-width: 1800px) {
    .container {
      padding: 0 120px;
    }
  }
  @media (max-width: 1600px) {
    .container {
      padding: 0;
    }
  }
  @media (max-width: 1440px) {
    .container {
      .desc {
        h2 {
          font-size: 36px;
          line-height: 64px;
        }
        h3 {
          font-size: 24px;
          line-height: 36px;
        }
        p {
          font-size: 20px;
          line-height: 32px;
        }
      }
    }
  }
  @media (max-width: 500px) {
    .container {
      padding: 24pt;
      flex-direction: column-reverse;
      justify-content: flex-end;
      .desc {
        width: 100%;
        h2 {
          font-size: 20pt;
          line-height: 32pt;
          text-align: center;
        }
        h3 {
          font-size: 16pt;
          line-height: 24pt;
          text-align: center;
        }
        p {
          font-size: 14pt;
          line-height: 24pt;
          text-align: center;
        }
        .p1 {
          padding-top: 104pt;
        }
      }
      .logo {
        width: 100%;
        margin-top: 40pt;
        height: 296pt;
        .banner {
          height: 100%;
          .grids {
            width: 100%;
            margin-top: 0;
            .p1 {
              width: 100%;
              .logo-cloud {
                width: 160pt;
                height: 103pt;
                top: 84pt;
                left: 89pt;
              }
              .dots {
                width: 100%;
              }
              .boxes {
                width: 200pt;
                height: 150pt;
                top: 52pt;
                left: 54pt;
                .dots {
                  height: 100%;
                }
              }
            }
          }
        }
      }
    }
  }
`;
