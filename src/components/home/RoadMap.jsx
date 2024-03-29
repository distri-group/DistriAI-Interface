import { useRef, useState, useEffect, useContext, Fragment } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import ReactHammer from "react-hammerjs";
import { Context } from "../../views/Home";

const RoadMap = ({ className }) => {
  const { width } = useContext(Context);
  const ref = useRef(null);
  const container = useRef(null);
  const [activeIndex, setActiveIndex] = useState(3);
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setContainerWidth(ref.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <section id="roadmap" ref={ref} className={className}>
      <ReactHammer
        onSwipe={(e) => {
          if (e.direction === 2) {
            setActiveIndex(activeIndex === 8 ? 8 : activeIndex + 1);
          } else if (e.direction === 4) {
            setActiveIndex(activeIndex === 0 ? 0 : activeIndex - 1);
          }
        }}>
        <div className="container">
          <ul ref={container} className="roadmap">
            {roads.map((item, index) => (
              <motion.div
                key={index}
                animate={{
                  x:
                    containerWidth > 500
                      ? ((activeIndex === 8
                          ? index - activeIndex + 1
                          : index - activeIndex) *
                          containerWidth) /
                        2
                      : (index - activeIndex) * containerWidth,
                }}
                transition={{
                  ease: "anticipate",
                }}
                className={
                  "item" +
                  (index === activeIndex
                    ? " item-active"
                    : index === activeIndex - 1
                    ? " item-prev"
                    : index === activeIndex + 1
                    ? " item-next"
                    : "")
                }>
                <span className="time">{item.id}</span>
                {item.features.map((feature) => (
                  <h3 key={feature}>{feature}</h3>
                ))}
              </motion.div>
            ))}
          </ul>
          <div className="timeline">
            <div className="dot-container">
              {roads.map((road, index) =>
                width > 500 ? (
                  <Fragment key={index}>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => setActiveIndex(index)}>
                      <div className="dot-box">
                        <span
                          className={`dot-item dot--drop ${
                            activeIndex === index && "dot-item--active"
                          }`}
                        />
                      </div>
                      <h4
                        style={{
                          width: "40px",
                          textAlign: "center",
                          margin: 0,
                          paddingTop: "20px",
                          color: activeIndex === index && "#09e98d",
                        }}>
                        {road.time}
                      </h4>
                    </div>
                    {index !== 8 && (
                      <>
                        <div className="dot-box">
                          <span
                            className={`dot-item ${
                              index === activeIndex && "dot-item--secondary"
                            }`}
                          />
                        </div>
                        <div className="dot-box">
                          <span className="dot-item" />
                        </div>
                        <div className="dot-box">
                          <span
                            className={`dot-item ${
                              index === activeIndex - 1 && "dot-item--secondary"
                            }`}
                          />
                        </div>
                      </>
                    )}
                  </Fragment>
                ) : (
                  <div
                    key={index}
                    style={{
                      display:
                        Math.floor(activeIndex / 3) === Math.floor(index / 3)
                          ? "flex"
                          : "none",
                      width: "30%",
                    }}>
                    {index === 6 && (
                      <div className="dot-box">
                        <span
                          className="dot-item"
                          style={{ opacity: 0.4 }}
                          onClick={() => setActiveIndex(3)}
                        />
                      </div>
                    )}
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => setActiveIndex(index)}>
                      <div className="dot-box">
                        <span
                          className={`dot-item dot--drop ${
                            activeIndex === index && "dot-item--active"
                          }`}
                        />
                      </div>
                      <h4
                        style={{
                          width: "40px",
                          textAlign: "center",
                          margin: 0,
                          paddingTop: "20px",
                          color: activeIndex === index && "#09e98d",
                        }}>
                        {road.time}
                      </h4>
                    </div>
                    {(index === 2 || index === 5) && (
                      <div className="dot-box">
                        <span
                          className="dot-item"
                          style={{ opacity: 0.4 }}
                          onClick={() => setActiveIndex(index + 1)}
                        />
                      </div>
                    )}
                    {(index + 1) % 3 !== 0 && (
                      <>
                        <div className="dot-box">
                          <span
                            className={`dot-item ${
                              index === activeIndex && "dot-item--secondary"
                            }`}
                          />
                        </div>
                        <div className="dot-box">
                          <span className="dot-item" />
                        </div>
                        <div className="dot-box">
                          <span
                            className={`dot-item ${
                              index === activeIndex - 1 && "dot-item--secondary"
                            }`}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </ReactHammer>
    </section>
  );
};

export default styled(RoadMap)`
  height: 1080px;
  /* background-image: url(/img/home/roadmap.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover; */
  background-color: #090319;
  overflow-x: hidden;
  li {
    list-style: none;
  }
  .container {
    width: calc(100% - 320px);
    padding-top: 60px;
    margin: 0 160px;
    .roadmap {
      padding: 160px 0;
      height: 320px;
      position: relative;
      .item {
        position: absolute;
        left: 0;
        width: 35vw;
        flex-shrink: 0;
        opacity: 0.3;
        transition: opacity 0.3s;
        .time {
          font-weight: 500;
          font-size: 24px;
          line-height: 24px;
          margin: 16px 0;
        }
        h3 {
          margin: 24px 0;
          font-weight: 600;
          font-size: 40px;
          color: #09e98d;
          line-height: 66px;
          text-align: left;
        }
      }
      .item-active {
        opacity: 1;
      }
    }
    .timeline {
      .dot-container {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        .dot-box {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dot-item {
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 100%;
          background-color: #898989;
          transition: all 0.3s;
        }
        .dot-item--active {
          width: 40px;
          height: 40px;
        }
        .dot-item--secondary {
          width: 16px;
          height: 16px;
        }
        .dot--drop {
          background-color: #09e98d;
        }
      }
    }
  }
  @media (max-width: 1600px) {
    .container {
      .roadmap {
        .item {
          h3 {
            font-size: 32px;
            line-height: 48px;
          }
        }
      }
    }
  }
  @media (max-width: 500px) {
    height: 812pt;
    width: calc(100% - 80pt);
    padding: 0 40pt;
    position: relative;
    .container {
      width: 100%;
      height: calc(100% - 184pt);
      margin: 0;
      padding: 0;
      padding-top: 184pt;
      .roadmap {
        width: 100%;
        margin: 0;
        padding: 0;
        .item {
          width: 100%;
        }
      }
      .timeline {
        position: absolute;
        bottom: 120pt;
        width: 100%;
        .dot-container {
          justify-content: center;
        }
      }
    }
  }
`;
const roads = [
  {
    id: "01",
    time: "2022 Q4",
    features: [
      "Research key technologies",
      "Initiate projects & conduct surveys",
    ],
  },
  {
    id: "02",
    time: "2023 Q1~2",
    features: ["Publish business proposal", "System design & development"],
  },
  {
    id: "03",
    time: "2023 Q3~4",
    features: [
      "Release Whitepaper 1.0",
      "Conduct internal testing on Testnet-Alpha network",
    ],
  },
  {
    id: "04",
    time: "2024 Q1",
    features: [
      "Launch computing power matching platform",
      "Release Testnet-Beta network",
    ],
  },
  {
    id: "05",
    time: "2024 Q2",
    features: [
      "Go live with the mainnet",
      "Introduce a deep learning framework based on tiered privacy protection",
    ],
  },
  {
    id: "06",
    time: "2024 Q3",
    features: ["Initiate model/data sharing platform"],
  },
  {
    id: "07",
    time: "2024 Q4",
    features: [
      "Provide comprehensive privacy protection support for deep learning",
    ],
  },
  {
    id: "08",
    time: "2025",
    features: [
      "Introduce an efficient communication training framework for decentralized computing power networks",
    ],
  },
  {
    id: "09",
    time: "2026",
    features: [
      "Achieve decentralization and democratization of computing power, models, and data",
    ],
  },
];
