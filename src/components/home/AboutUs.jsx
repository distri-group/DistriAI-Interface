import styled from "styled-components";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const AboutUs = ({ className, progress }) => {
  const [visible, setVisible] = useState(1);
  const container = useRef(null);
  const isInView = useInView(container);
  const video = useRef(null);
  const [learnMore1, setLearnMore1] = useState(false);
  const [learnMore2, setLearnMore2] = useState(false);
  const [learnMore3, setLearnMore3] = useState(false);
  const initial = { opacity: 1, y: 0 };
  useEffect(() => {
    if (progress <= 50) {
      setVisible(1);
    } else if (progress <= 60) {
      setVisible(2);
    } else {
      setVisible(3);
    }
  }, [progress]);
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
            className="p1"
            initial={initial}
            animate={{
              opacity: visible === 1 ? 1 : 0,
              y: visible === 1 ? 0 : 20,
            }}
            transition={{ duration: 0.6 }}>
            <h2 style={{ marginBottom: "60px" }}>
              In the AI era, computing power has become the 'digital oil',
              <br />
              but we face such a dilemma
            </h2>
            <div className="card-container">
              <div className="card">
                <span
                  className="bg"
                  style={{ backgroundImage: "url(/img/home/about_us_1.png)" }}
                />
                <h3>GPUs monopolized by giants, high cost of use</h3>
                <ul>
                  <li>H100 selling for $40,000</li>
                  <li>72% gross profit margin for cloud services</li>
                </ul>
              </div>
              <div className="card">
                <span
                  className="bg"
                  style={{ backgroundImage: "url(/img/home/about_us_2.png)" }}
                />
                <h3>Ensuring data privacy and security remains challenging</h3>
                <ul>
                  <li>Unauthorized access</li>
                  <li>sensitive data leaks</li>
                </ul>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="p2"
            initial={initial}
            animate={{
              opacity: visible === 2 ? 1 : 0,
              y: visible === 2 ? 0 : 20,
            }}
            transition={{ duration: 0.6 }}>
            <h2 style={{ marginBottom: "120px" }}>
              What do we aim to achieve?
            </h2>
            <div className="card-container">
              <div
                onMouseEnter={() => setLearnMore1(true)}
                onMouseLeave={() => setLearnMore1(false)}
                className="card">
                <h3
                  style={{
                    display: window.innerWidth <= 1200 && learnMore1 && "none",
                  }}>
                  Pooling global computing resources
                </h3>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: learnMore1 ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="desc">
                  <p>
                    Distri.AI aggregates globally underutilized GPU resources,
                    creating the industry's first privacy-centric economic
                    distributed GPU computing network, establishing itself as
                    the forefront of intelligent computing.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: learnMore1 ? 0 : 1 }}
                  transition={{ duration: 0.5 }}>
                  <span
                    className="bg"
                    style={{
                      backgroundImage: "url(/img/home/about_us_3.png)",
                    }}
                  />
                  <span className="learn-more">Learn More &gt;</span>
                </motion.div>
              </div>
              <div
                onMouseEnter={() => setLearnMore2(true)}
                onMouseLeave={() => setLearnMore2(false)}
                className="card">
                <h3
                  style={{
                    display: window.innerWidth <= 1200 && learnMore2 && "none",
                  }}>
                  PPML Framework
                </h3>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: learnMore2 ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="desc">
                  <p>
                    Distri.AI focuses on building a privacy- centricdeep
                    learning framework. Ensuring optimal protection for data and
                    models during the AI training process, driving AI innovation
                    securely and worry-free.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: learnMore2 ? 0 : 1 }}
                  transition={{ duration: 0.5 }}>
                  <span
                    className="bg"
                    style={{
                      backgroundImage: "url(/img/home/about_us_4.png)",
                    }}
                  />
                  <span className="learn-more">Learn More &gt;</span>
                </motion.div>
              </div>
              <div
                onMouseEnter={() => setLearnMore3(true)}
                onMouseLeave={() => setLearnMore3(false)}
                className="card">
                <h3
                  style={{
                    display: window.innerWidth <= 1200 && learnMore3 && "none",
                  }}>
                  A secure, efficient, and sustainable transaction model
                </h3>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: learnMore3 ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="desc">
                  <p>
                    Distri.AI's model/data sharing platform allows users to
                    securely share AI training data and models, ensuring the
                    protection of data providers' interests.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: learnMore3 ? 0 : 1 }}
                  transition={{ duration: 0.5 }}>
                  <span
                    className="bg"
                    style={{
                      backgroundImage: "url(/img/home/about_us_5.png)",
                    }}
                  />
                  <span className="learn-more">Learn More &gt;</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="p3"
            initial={initial}
            animate={{
              opacity: visible === 3 ? 1 : 0,
              y: visible === 3 ? 0 : 20,
            }}
            transition={{ duration: 0.6 }}>
            <h2
              style={{ width: "1048px", margin: "0 auto", marginTop: "120px" }}>
              Join Distri.AI to collectively propel the future of intelligent
              computing and explore the limitless possibilities of technology!
            </h2>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default styled(AboutUs)`
  height: 300vh;
  position: relative;
  .container {
    position: sticky;
    top: 0;
  }
  .video-container {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #090319;
    padding: 120px 0;
    width: 100vw;
    height: calc(100vh - 240px);
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
      padding-top: 232px;
    }
    .card-container {
      display: flex;
      justify-content: center;
      position: relative;
      .card {
        position: relative;
        z-index: 10;
        width: 400px;
        height: 400px;
        margin: 0 40px;
        background: rgba(255, 255, 255, 0.12);
        border-radius: 24px;
        backdrop-filter: blur(12px);
        padding: 40px;
        ul {
          margin: 0;
          padding: 0;
          position: relative;
          z-index: 3;
        }
        li {
          padding: 16px 0;
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
  }
  @media (max-width: 1200px) {
    height: 3240px;
    .video-container {
      height: 840px;
    }
    .about-us {
      height: 1080px;
    }
    .container {
      top: 25%;
    }
  }
`;
