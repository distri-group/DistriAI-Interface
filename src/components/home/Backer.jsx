import styled from "styled-components";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const Backer = ({ className }) => {
  const container = useRef(null);
  const video = useRef(null);
  const isInView = useInView(container);
  const initial = {
    opacity: 0,
    y: 20,
  };
  useEffect(() => {
    if (isInView) {
      video.current.play();
    } else {
      video.current.pause();
      video.current.currentTime = 0;
    }
  }, [isInView]);
  return (
    <section className={className}>
      <video ref={video} muted>
        <source src="/video/backer.webm" type="video/webm" />
      </video>
      <div className="backer">
        <div ref={container} className="container">
          <motion.h2
            initial={initial}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                delay: 1.5,
              },
            }}>
            Backer
          </motion.h2>
          <div className="icons">
            <motion.span
              initial={initial}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  delay: 2,
                },
              }}
              className="ld-capital"
            />
            <motion.span
              initial={initial}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  delay: 2.3,
                },
              }}
              className="aws"
            />
            <motion.span
              initial={initial}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  delay: 2.6,
                },
              }}
              className="google-cloud"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default styled(Backer)`
  height: 100vh;
  position: relative;
  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .backer {
    padding-top: 240px;
    min-width: 1200px;
    margin: 0 auto;
    position: relative;
  }
  .container {
    position: relative;
    z-index: 1;
  }
  h2 {
    margin-top: 112px;
    margin-bottom: 120px;
    text-align: center;
    font-family: AvenirNext, AvenirNext;
    font-weight: 600;
    font-size: 48px;
    line-height: 72px;
  }
  .icons {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    span {
      display: block;
      min-width: 280px;
      height: 48px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100%;
    }
    .ld-capital {
      background-image: url(/img/home/ld_capital.png);
    }
    .aws {
      background-image: url(/img/home/aws.png);
      background-size: 25%;
    }
    .google-cloud {
      background-image: url(/img/home/google_cloud.png);
    }
  }
  @media (max-width: 1200px) {
    height: 1080px;
    .container {
      max-width: 1080px;
      margin: 0 auto;
    }
  }
`;
