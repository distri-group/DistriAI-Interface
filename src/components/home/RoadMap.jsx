import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

const RoadMap = ({ className }) => {
  const ref = useRef(null);
  const container = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    const width = ref.current.offsetWidth;
    setContainerWidth(width);
  }, []);
  return (
    <section ref={ref} className={className}>
      <div className="container">
        <ul ref={container} className="roadmap">
          {roads.map((item, index) => (
            <motion.div
              key={index}
              animate={{
                x:
                  (activeIndex === 8
                    ? index - activeIndex + 1
                    : index - activeIndex) *
                  (containerWidth / 2),
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
              <span className="time">{item.time}</span>
              {item.features.map((feature) => (
                <h3 key={feature}>{feature}</h3>
              ))}
            </motion.div>
          ))}
        </ul>
        <div className="timeline">
          <div className="dot-container">
            {roads.map((road, index) => (
              <>
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
                    }}>
                    {road.id}
                  </h4>
                </div>
                {index < roads.length - 1 && (
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
              </>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default styled(RoadMap)`
  height: 100vh;
  background-image: url(/img/home/roadmap.png);
  overflow-x: hidden;
  li {
    list-style: none;
  }
  .container {
    width: calc(100% - 320px);
    padding-top: 120px;
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
  @media (max-width: 1200px) {
    height: 1080px;
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
