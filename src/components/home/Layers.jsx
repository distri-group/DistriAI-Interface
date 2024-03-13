import { useRef, useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import MapWithPoints from "./MapWithPoints";
import { Context } from "../../views/Home";

const Layers = ({ className }) => {
  const { scrollProgress, width } = useContext(Context);
  const container = useRef(null);
  const controls = useAnimation();
  const [view, setView] = useState(1);

  const handleChange = (e, nextView) => {
    if (nextView) {
      setView(nextView);
    }
  };

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
    if (view === 1 || (scrollProgress > 21 && scrollProgress < 40)) {
      sequence();
    }
  }, [controls, view, scrollProgress]);

  return (
    <section ref={container} className={className}>
      <div className="container">
        <div className="layers">
          <div className="left">
            <div className="desc">
              <p>
                Connect. Contribute. Commerce. -Unlocking the potential of AI
                together.
              </p>
              <div className="overall" />
            </div>
            <ToggleButtonGroup
              className="buttons"
              orientation="vertical"
              value={view}
              exclusive
              onChange={handleChange}>
              <ToggleButton
                className="button"
                onMouseEnter={() => setView(1)}
                value={1}>
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
              <ToggleButton
                className="button"
                onMouseEnter={() => setView(2)}
                value={2}>
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
              <ToggleButton
                className="button"
                onMouseEnter={() => setView(3)}
                value={3}>
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
              <ToggleButton
                className="button"
                onMouseEnter={() => setView(4)}
                value={4}>
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
                    Provide more cost-effective and transparent computational
                    services,enabling users to conveniently and efficiently
                    utilize computational resources.
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
                    className="line-1">
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
                    className="line-2">
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
                    className="line-3">
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
                    className="line-4">
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
                  <h3>Privacy Preserving Layer</h3>
                  <span className="subtitle">
                    Privacy-PreservingMLFramework
                  </span>
                  <p>
                    Provide users with multi-tiered and flexible
                    privacy-preserving options,ensuring the privacy and security
                    of data and models during AI development.
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
                    Models and Datasets Sharing Platform
                  </span>
                  <p>
                    Create more economic value while ensuring that models and
                    datasets provided by contributors are not maliciously leaked
                    or abused.
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
                    <motion.div
                      className="horizontal-line"
                      initial={{ x: 0, opacity: 0 }}
                      animate={{ x: 150, opacity: [0, 1, 0] }}
                      transition={{
                        duration: 1,
                        delay: 1,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    />
                    <motion.div
                      className="horizontal-line"
                      initial={{ x: 0, opacity: 0 }}
                      animate={{ x: -150, opacity: [0, 1, 0] }}
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
            ) : (
              view === 4 && (
                <div className="layer">
                  <div className="desc">
                    <h3>Community Ecosystem</h3>
                    <span className="subtitle">
                      Eco-Community for AI Developers
                    </span>
                    <p>
                      Offer a platform for cutting-edge discussions, Q&A and
                      innovative collaboration enabling deep exploration of Al
                      potential, connection with peers, and collective
                      advancement.
                    </p>
                  </div>
                  <MapWithPoints />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default styled(Layers)`
  height: 1080px;
  position: relative;
  background-image: url(/img/home/layers/layers.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  .Mui-selected {
    background-color: white !important;
  }
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .layers {
    position: relative;
    z-index: 1;
    margin: 0 auto;
    padding-top: 120px;
    display: flex;
    justify-content: center;
    .left,
    .right {
      height: 648px;
      padding: 40px;
      border-radius: 22px;
      background-color: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(12px);
    }
    .left {
      width: 40%;
      max-width: 890px;
      overflow: hidden;
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
      width: 35%;
      max-width: 590px;
      overflow: hidden;
      padding: 40px 0;
      background-image: url(/img/home/layers/right-card.png);
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: center;
      .layer {
        width: 100%;
        max-width: 590px;
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
          min-width: 590px;
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
          .line-1 {
            position: absolute;
            top: 53px;
            left: 219px;
          }
          .line-2 {
            position: absolute;
            top: 128px;
            right: 124px;
          }
          .line-3 {
            position: absolute;
            bottom: 84px;
            left: 100px;
          }
          .line-4 {
            position: absolute;
            bottom: 37px;
            right: 170px;
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
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50%;
            height: 50%;
            .logo {
              width: 64px;
              height: 64px;
              left: 50%;
              top: 56%;
              transform: translate(-50%, -50%);
            }
            .halo-1 {
              width: 72px;
              height: 72px;
              background-image: url(/img/home/layers/halo_1.png);
              background-repeat: no-repeat;
              background-size: 100%;
              background-position: center;
              position: absolute;
              left: 112px;
              top: 58px;
            }
            .halo-2 {
              width: 120px;
              height: 120px;
              background-image: url(/img/home/layers/halo_2.png);
              background-repeat: no-repeat;
              background-size: 100%;
              background-position: center;
              position: absolute;
              top: 32px;
              left: 87px;
            }
            .halo-3 {
              width: 160px;
              height: 160px;
              background-image: url(/img/home/layers/halo_3.png);
              background-repeat: no-repeat;
              background-size: 100%;
              background-position: center;
              position: absolute;
              top: 14px;
              left: 66px;
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
            .horizontal-line {
              width: 50px;
              height: 1px;
              position: relative;
              top: -40px;
              left: -25px;
              background: linear-gradient(
                to right,
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
          mix-blend-mode: screen;
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
  @media (max-width: 1600px) {
    .layers {
      .left {
        .desc {
          p {
            font-size: 20px;
            line-height: 40px;
          }
        }
      }
      .right {
        .layer {
          .desc {
            h3 {
              font-size: 24px;
              line-height: 40px;
            }
            .subtitle {
              font-size: 20px;
              line-height: 28px;
            }
          }
        }
      }
    }
  }
  @media (max-width: 500px) {
    .container {
      height: 100%;
      .layers {
        flex-direction: column;
        padding-top: 64pt;
        .left {
          width: 295pt;
          height: 288pt;
          padding: 24pt;
          margin: 0 auto;
          flex-direction: column;
          .desc {
            width: 100%;
            p {
              font-size: 12pt;
              line-height: 24pt;
              text-align: center;
              margin: 0;
            }
            .overall {
              width: 160pt;
              height: 160pt;
              margin: 0 auto;
            }
          }
          .buttons {
            flex-direction: row;
            width: calc(100% - 48pt);
            margin: 0 24pt;
            .button {
              width: 56pt;
              height: 56pt;
            }
          }
        }
        .right {
          overflow: hidden;
          width: 343pt;
          height: 300pt;
          margin: 0 auto;
          margin-top: 16pt;
          padding: 24pt 0 12pt 0;
          .layer {
            width: 100%;
            .desc {
              padding: 0 24pt;
              h3 {
                margin: 0;
                font-size: 16pt;
                line-height: 22pt;
                text-align: center;
              }
              .subtitle {
                display: block;
                width: 100%;
                font-size: 14pt;
                line-height: 20pt;
                text-align: center;
              }
              p {
                margin: 12pt 0;
                font-size: 12pt;
                line-height: 20pt;
                text-align: center;
              }
            }
            .lattice {
              height: 193pt;
              min-width: 0;
              .halos {
                .logo {
                  top: 55pt;
                  left: 85pt;
                }
                .halo-1 {
                  top: 28pt;
                  left: 58pt;
                }
                .halo-2 {
                  top: 10pt;
                  left: 39pt;
                }
                .halo-3 {
                  top: -6pt;
                  left: 23pt;
                }
              }
              .logo {
                width: 56pt;
                height: 56pt;
                top: 80pt;
                left: 143pt;
              }
              .icon-1,
              .icon-2,
              .icon-3,
              .icon-4 {
                width: 36pt;
                height: 36pt;
              }
              .line-1,
              .line-2,
              .line-3,
              .line-4 {
                scale: 0.8;
              }
              .icon-1 {
                top: 12pt;
                left: 90pt;
              }
              .icon-2 {
                top: 56pt;
                right: 34pt;
              }
              .icon-3 {
                top: 79pt;
                left: 38pt;
              }
              .icon-4 {
                bottom: 20pt;
                right: 62pt;
              }
              .line-1 {
                top: 22pt;
                left: 120pt;
              }
              .line-2 {
                top: 70pt;
                right: 61pt;
              }
              .line-3 {
                bottom: 44pt;
                left: 43pt;
              }
              .line-4 {
                bottom: 17pt;
                right: 87pt;
              }
            }
            .privacy {
              height: 193pt;
            }
          }
        }
      }
    }
  }
`;
