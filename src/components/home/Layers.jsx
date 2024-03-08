import { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useInView, motion, useAnimation } from "framer-motion";
import MapWithPoints from "./MapWithPoints";

const Layers = ({ className, progress }) => {
  const container = useRef(null);
  const video = useRef(null);
  const isInView = useInView(container);
  const controls = useAnimation();
  const [view, setView] = useState(0);

  const handleChange = (e, nextView) => {
    if (nextView) {
      setView(nextView);
    }
  };

  useEffect(() => {
    if (progress > 21 && progress < 40) {
      if (video.current && video.current.readyState >= 3) {
        video.current.play();
        video.current.loop = true;
      }
      setView(1);
    } else {
      video.current.pause();
      video.current.currentTime = 0;
      setView(0);
    }
  }, [isInView, progress]);
  useEffect(() => {
    const sequence = async () => {
      await controls.start("main");
      await controls.start("icon1");
      await controls.start("line1");
      await controls.start("icon2");
      await controls.start("line2");
      await controls.start("icon3");
      await controls.start("line3");
      await controls.start("icon4");
      await controls.start("line4");
    };
    sequence();
  }, [controls, view]);

  return (
    <section ref={container} className={className}>
      <div className="container">
        <div className="video-container">
          <video ref={video} muted>
            <source src="/video/bg.webm" type="video/webm" />
          </video>
        </div>
        <div className="layers">
          <div className="left">
            <div className="desc">
              <p>
                Distri.AI is committed to establishing a globally leading
                distributed artificial intelligence secure computing platform.
              </p>
              <div className="overall" />
              <span
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                }}>
                Overall Architecture
              </span>
            </div>
            <ToggleButtonGroup
              className="buttons"
              orientation="vertical"
              value={view}
              exclusive
              onChange={handleChange}>
              <ToggleButton className="button" value={1}>
                <div
                  className="icon"
                  style={{
                    backgroundImage:
                      view === 1
                        ? "url(/img/home/layers/left_icon_1_selected.png)"
                        : "url(/img/home/layers/left_icon_1.png)",
                    width: view === 1 && "78px",
                    height: view === 1 && "78px",
                  }}
                />
              </ToggleButton>
              <ToggleButton className="button" value={2}>
                <div
                  className="icon"
                  style={{
                    backgroundImage:
                      view === 2
                        ? "url(/img/home/layers/left_icon_2_selected.png)"
                        : "url(/img/home/layers/left_icon_2.png)",
                    width: view === 2 && "72px",
                    height: view === 2 && "76px",
                  }}
                />
              </ToggleButton>
              <ToggleButton className="button" value={3}>
                <div
                  className="icon"
                  style={{
                    backgroundImage:
                      view === 3
                        ? "url(/img/home/layers/left_icon_3_selected.png)"
                        : "url(/img/home/layers/left_icon_3.png)",
                    width: view === 3 && "74px",
                    height: view === 3 && "80px",
                  }}
                />
              </ToggleButton>
              <ToggleButton className="button" value={4}>
                <div
                  className="icon"
                  style={{
                    backgroundImage:
                      view === 4
                        ? "url(/img/home/layers/left_icon_4_selected.png)"
                        : "url(/img/home/layers/left_icon_4.png)",
                    width: view === 4 && "74px",
                    height: view === 4 && "74px",
                  }}
                />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div className="right">
            {view === 1 ? (
              <div className="layer">
                <div className="desc">
                  <h3>Computing Layer</h3>
                  <span className="subtitle">
                    Distributed GPU Computing Network
                  </span>
                  <p>
                    A system combining blockchain technology and P2P network
                    architecture where computing nodes can contribute resources
                    in two ways.
                  </p>
                </div>
                <div className="lattice" style={{ display: "flex" }}>
                  <motion.div
                    variants={{
                      main: { opacity: 1, scale: 1 },
                      exit: { opacity: 0, scale: 0 },
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={controls}
                    className="logo"
                  />
                  <motion.div
                    variants={{
                      icon1: { opacity: 1, scale: 1 },
                      exit: { opacity: 0, scale: 0 },
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={controls}
                    className="icon-1"
                  />
                  <motion.div
                    variants={{
                      icon2: { opacity: 1, scale: 1 },
                      exit: { opacity: 0, scale: 0 },
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={controls}
                    className="icon-2"
                  />
                  <motion.div
                    variants={{
                      icon3: { opacity: 1, scale: 1 },
                      exit: { opacity: 0, scale: 0 },
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={controls}
                    className="icon-3"
                  />
                  <motion.div
                    variants={{
                      icon4: { opacity: 1, scale: 1 },
                      exit: { opacity: 0, scale: 0 },
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={controls}
                    className="icon-4"
                  />
                  <svg
                    width="77"
                    height="87"
                    viewBox="0 0 77 87"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      position: "absolute",
                      top: "53px",
                      left: "219px",
                    }}>
                    <motion.path
                      d="M76 73C76 73 76 111.5 76 57.5C76 3.50002 39 1 15 1C-8.99999 1 3 1 3 1"
                      stroke="url(#paint0_linear_151_27141)"
                      strokeWidth={3}
                      variants={{
                        line1: { pathLength: 1, pathOffset: 0 },
                        exit: { pathLength: 0, pathOffset: 0 },
                      }}
                      initial={{ pathLength: 0, pathOffset: 0 }}
                      animate={controls}></motion.path>
                    <defs>
                      <linearGradient
                        id="paint0_linear_151_27141"
                        x1="15"
                        y1="0.999995"
                        x2="76"
                        y2="58"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF79D9"></stop>
                        <stop offset="1" stopColor="#A479FF"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                  <svg
                    width="124"
                    height="62"
                    viewBox="0 0 124 62"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      position: "absolute",
                      top: "128px",
                      right: "124px",
                    }}>
                    <motion.path
                      d="M124 1H112.5C41.5 1 73 61 15.5 61H0"
                      stroke="url(#paint0_linear_152_27154)"
                      strokeWidth={3}
                      variants={{
                        line2: { pathLength: 1, pathOffset: 0 },
                        exit: { pathLength: 1, pathOffset: 1 },
                      }}
                      initial={{ pathLength: 1, pathOffset: 1 }}
                      animate={controls}
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_152_27154"
                        x1="112"
                        y1="0.999999"
                        x2="17"
                        y2="61.5"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#7996FF" />
                        <stop offset="1" stopColor="#A479FF" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <svg
                    width="149"
                    height="60"
                    viewBox="0 0 149 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      position: "absolute",
                      bottom: "84px",
                      left: "100px",
                    }}>
                    <motion.path
                      d="M148.501 1H132.501C93.9315 1 68.501 59.4998 29.501 59.4998C17.5011 59.4998 0.0133284 50.7764 1.00101 19.4999V7.99999"
                      stroke="url(#paint0_linear_151_27142)"
                      strokeWidth={3}
                      variants={{
                        line3: { pathLength: 1, pathOffset: 0 },
                        exit: { pathLength: 0, pathOffset: 0 },
                      }}
                      initial={{ pathLength: 0, pathOffset: 0 }}
                      animate={controls}
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_151_27142"
                        x1="15.001"
                        y1="7.9997"
                        x2="133.001"
                        y2="0.999707"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#79FFBF" />
                        <stop offset="1" stopColor="#A479FF" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <svg
                    width="126"
                    height="61"
                    viewBox="0 0 126 61"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      position: "absolute",
                      bottom: "37px",
                      right: "170px",
                    }}>
                    <motion.path
                      d="M1 0V14.5C1 48.7158 15 60 29.5 60C57 60 60.5 31.5 107.5 37L125 39"
                      stroke="url(#grad)"
                      strokeWidth={3}
                      variants={{
                        line4: { pathLength: 1, pathOffset: 0 },
                        exit: { pathLength: 0, pathOffset: 0 },
                      }}
                      initial={{ pathLength: 0, pathOffset: 0 }}
                      animate={controls}
                    />
                    <defs>
                      <linearGradient
                        id="grad"
                        x1="112"
                        y1="39.5"
                        x2="4.14377"
                        y2="49.3665"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FFC179" />
                        <stop offset="1" stopColor="#A479FF" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            ) : view === 2 ? (
              <div className="layer">
                <div className="desc">
                  <h3>Privacyl Preserving Layer</h3>
                  <span className="subtitle">
                    A Deep Learning Framework Based on Hierarchical Privacy
                    Protection
                  </span>
                  <p>
                    Introducing an innovative deep learning framework -
                    PrivySphere, providing multi-layered, flexible privacy
                    protection options.
                  </p>
                </div>
                <video className="privacy" autoPlay muted loop>
                  <source src="/video/privacy.webm" type="video/webm" />
                </video>
              </div>
            ) : view === 3 ? (
              <div className="layer">
                <div className="desc">
                  <h3>Model Development Layer</h3>
                  <span className="subtitle">
                    Online ML Platform with Shared Models and Datasets
                  </span>
                  <p>
                    Allows users access to providers' models or data for AI
                    training tasks, while ensuring providers' models and data
                    are fully protected, maximizing value.
                  </p>
                </div>
                <div
                  className="lattice"
                  style={{
                    backgroundImage:
                      "url(/img/home/layers/lattice_with_round.png)",
                  }}>
                  <div className="types">
                    <div className="type">
                      <span
                        className="icon"
                        style={{
                          backgroundImage:
                            "url(/img/home/layers/icon_Multimodal.png)",
                        }}
                      />
                      <span className="title">Multimodal</span>
                    </div>
                    <div className="type">
                      <span
                        className="icon"
                        style={{
                          backgroundImage: "url(/img/home/layers/icon_NLP.png)",
                        }}
                      />
                      <span className="title">NLP</span>
                    </div>
                    <div className="type">
                      <span
                        className="icon"
                        style={{
                          backgroundImage: "url(/img/home/layers/icon_CV.png)",
                        }}
                      />
                      <span className="title">Computer Vision</span>
                    </div>
                    <div className="type">
                      <span
                        className="icon"
                        style={{
                          backgroundImage:
                            "url(/img/home/layers/icon_Audio.png)",
                        }}
                      />
                      <span className="title">Audio</span>
                    </div>
                  </div>
                  <div className="halos">
                    <motion.span
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                      className="halo-1"
                    />
                    <motion.span
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                      className="halo-2"
                    />
                    <motion.span
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                      className="halo-3"
                    />
                    <span className="logo" />
                  </div>
                  <div className="integrations-lines">
                    <motion.div
                      className="line"
                      initial={{ y: 0, opacity: 0 }}
                      animate={{ y: -150, opacity: [0, 1, 0] }}
                      transition={{
                        duration: 1,
                        delay: 1,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    />
                    <motion.div
                      className="line"
                      initial={{ y: 0, opacity: 0 }}
                      animate={{ y: 150, opacity: [0, 1, 0] }}
                      transition={{
                        duration: 1,
                        delay: 1,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : view === 4 ? (
              <div className="layer">
                <div className="desc">
                  <h3>Community Ecosystem</h3>
                  <span className="subtitle">
                    Technical exchange, friendly interaction, resource sharing
                  </span>
                  <p>
                    Inviting cybersecurity experts, enterprise IT users, and
                    academic researchers to join and provide instant messaging
                    and collaboration toolkits.
                  </p>
                </div>
                <MapWithPoints />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default styled(Layers)`
  height: 100vh;
  position: relative;
  .Mui-selected {
    background-color: white !important;
  }
  .video-container {
    position: absolute;
    top: 0;
    left: 0;
    padding: 120px 0;
    background-color: #090319;
    width: 100vw;
    height: calc(100vh - 240px);
  }
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .layers {
    position: relative;
    z-index: 1;
    max-width: 1600px;
    margin: 0 auto;
    padding-top: 192px;
    display: flex;
    justify-content: center;
    .left,
    .right {
      height: 648px;
      padding: 40px;
      background-color: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(12px);
      border-radius: 8px;
    }
    .left {
      width: 890px;
      margin-right: 40px;
      display: flex;
      .desc {
        width: 666px;
        p {
          font-weight: 600;
          font-size: 24px;
          line-height: 56px;
        }
        .overall {
          width: 420px;
          height: 420px;
          margin: 0 auto;
          margin-top: 40px;
          background-image: url(/img/home/layers/overall.png);
          background-position: center;
          background-repeat: no-repeat;
          background-size: 100%;
        }
      }
      .buttons {
        margin-left: 48px;
        width: 160px;
        height: 100%;
        justify-content: space-between;
        .button {
          width: 100%;
          height: 144px;
          border-radius: 16px;
          border: none;
          background: rgba(155, 171, 255, 0.12);
          .icon {
            width: 40px;
            height: 40px;
            margin: 0;
            background-size: 100%;
            background-repeat: no-repeat;
            background-position: center;
          }
        }
      }
    }
    .right {
      width: 590px;
      padding: 40px 0;
      .layer {
        width: 590px;
        .desc {
          padding: 0px 40px;
          h3 {
            font-weight: 600;
            font-size: 32px;
            line-height: 56px;
            margin: 16px 0;
          }
          p {
            font-weight: 400;
            font-size: 20px;
            line-height: 32px;
            margin: 24px 0;
          }
          .subtitle {
            font-weight: 600;
            font-size: 24px;
            line-height: 36px;
            color: white;
          }
        }
        .lattice {
          width: 100%;
          height: 332px;
          background-image: url(/img/home/layers/lattice.png);
          background-position: center;
          background-repeat: no-repeat;
          background-size: 100%;
          position: relative;
          .logo {
            width: 96px;
            height: 96px;
            position: absolute;
            top: 138px;
            left: 247px;
            background-image: url(/img/home/layers/logo.png);
            background-position: center;
            background-repeat: no-repeat;
            background-size: 100%;
          }
          .icon-1 {
            width: 64px;
            height: 64px;
            position: absolute;
            top: 21px;
            left: 155px;
            background-image: url(/img/home/layers/icon_01.png);
            background-position: center;
            background-repeat: no-repeat;
            background-size: 100%;
          }
          .icon-2 {
            width: 64px;
            height: 64px;
            position: absolute;
            top: 96px;
            right: 62px;
            background-image: url(/img/home/layers/icon_02.png);
            background-position: center;
            background-repeat: no-repeat;
            background-size: 100%;
          }
          .icon-3 {
            width: 64px;
            height: 64px;
            position: absolute;
            top: 133px;
            left: 68px;
            background-image: url(/img/home/layers/icon_03.png);
            background-position: center;
            background-repeat: no-repeat;
            background-size: 100%;
          }
          .icon-4 {
            width: 64px;
            height: 64px;
            position: absolute;
            bottom: 25px;
            right: 108px;
            background-image: url(/img/home/layers/icon_04.png);
            background-position: center;
            background-repeat: no-repeat;
            background-size: 100%;
          }
          .types {
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: repeat(2, 50%);
            grid-template-rows: repeat(2, 50%);
            .type {
              width: 100%;
              display: flex;
              flex-direction: column;
              justify-content: end;
              .icon {
                display: block;
                width: 64px;
                height: 64px;
                margin: 0 auto;
                background-position: 100%;
                background-repeat: no-repeat;
                background-size: 100%;
              }
              .title {
                text-align: center;
                margin: 8px 0;
              }
            }
          }
          .halos {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            .logo {
              width: 64px;
              height: 64px;
              left: 263px;
              top: 143px;
            }
            .halo-1 {
              width: 72px;
              height: 72px;
              background-image: url(/img/home/layers/halo_1.png);
              background-repeat: no-repeat;
              background-size: 100%;
              background-position: center;
              position: absolute;
              top: 139px;
              left: 259px;
            }
            .halo-2 {
              width: 120px;
              height: 120px;
              background-image: url(/img/home/layers/halo_2.png);
              background-repeat: no-repeat;
              background-size: 100%;
              background-position: center;
              position: absolute;
              top: 115px;
              left: 235px;
            }
            .halo-3 {
              width: 160px;
              height: 160px;
              background-image: url(/img/home/layers/halo_3.png);
              background-repeat: no-repeat;
              background-size: 100%;
              background-position: center;
              position: absolute;
              top: 95px;
              left: 215px;
            }
          }
          .integrations-lines {
            width: 1px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            .line {
              width: 1px;
              height: 50px;
              background: linear-gradient(
                to bottom,
                rgba(201, 177, 255, 0),
                #c9b1ff,
                rgba(201, 177, 255, 0)
              );
            }
          }
        }
        .privacy {
          width: 100%;
          height: 332px;
        }
        .map {
          width: 100%;
          height: 332px;
          position: relative;
          background-image: url(/img/home/layers/map.png);
          background-position: center;
          background-repeat: no-repeat;
          background-size: 100%;
        }
      }
    }
  }
  @media (max-width: 1200px) {
    height: 1080px;
    .video-container {
      height: 840px;
    }
  }
`;
