import styled from "styled-components";
import { motion } from "framer-motion";

const ComputingPower = ({ className }) => {
  return (
    <section className={className}>
      <div className="container">
        <div className="logo"></div>
        <div className="desc">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.1,
                duration: 0.4,
              },
            }}>
            Two computing power service models, Powering your largest computing
            needs
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
            style={{ color: "#9babff" }}>
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
            style={{ color: "#898989" }}>
            Buy computing power - P2P market
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.1,
                duration: 0.4,
                delay: 0.8,
              },
            }}>
            Free computing tasks published through the DAO community. Computing
            nodes can select and execute suitable tasks based on their
            capabilities and preferences, enabling large-scale distributed
            training with extensive distributed computing resources.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default styled(ComputingPower)`
  height: 100vh;
  background-color: #0b0018;
  .container {
    display: flex;
    justify-content: space-between;
    padding: 90px 160px 0 160px;
    .logo {
      width: 160px;
      height: 200px;
    }
    .desc {
      width: 680px;
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
        font-size: 32px;
        font-weight: 600;
        line-height: 44px;
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
  @media (max-width: 1200px) {
    height: 1080px;
  }
`;
