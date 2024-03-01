import styled from "styled-components";
import HorizontalColorChange from "./HorizontalColorChange";
import { motion } from "framer-motion";

const HowToDo = ({ className }) => {
  const initial = {
    opacity: 0,
    y: 20,
  };
  return (
    <section className={className}>
      <div className="container">
        <motion.div
          initial={initial}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
            },
          }}
          className="row">
          <span className="title">BUY</span>
          <div className="card">
            <span className="icon slsb" />
            <span className="desc">Choose computing device</span>
          </div>
          <HorizontalColorChange />
          <div className="card">
            <span className="icon ljqb" />
            <span className="desc">Connect wallet, Purchase duration</span>
          </div>
          <HorizontalColorChange delay={0.3} />
          <div className="card">
            <span className="icon kssy" />
            <span className="desc">Start using</span>
          </div>
        </motion.div>
        <motion.div
          initial={initial}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
              delay: 0.6,
            },
          }}
          className="row"
          style={{ margin: "60px 0" }}>
          <span className="title">SELL</span>
          <div className="card">
            <span className="icon azcx" />
            <span className="desc">Install client, Run program</span>
          </div>
          <HorizontalColorChange delay={0.6} />
          <div className="card">
            <span className="icon szsc" />
            <span className="desc">Set rental duration and price</span>
          </div>
          <HorizontalColorChange delay={0.9} />
          <div className="card">
            <span className="icon ksjy" />
            <span className="desc">Start trading</span>
          </div>
        </motion.div>
        <motion.div
          initial={initial}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
              delay: 1.2,
            },
          }}
          className="row">
          <span className="title">DAO</span>
          <div className="card">
            <span className="icon fbta" />
            <span className="desc">Publish computing task proposal</span>
          </div>
          <HorizontalColorChange delay={1.2} />
          <div className="card">
            <span className="icon jsjd" />
            <span className="desc">Computing nodes claims tasks</span>
          </div>
          <HorizontalColorChange delay={1.5} />
          <div className="card">
            <span className="icon jssy" />
            <span className="desc">Earn from computations</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default styled(HowToDo)`
  height: 100vh;
  background-image: url(/img/home/how_to_do.png);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  .container {
    max-width: 1440px;
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
        white-space: nowrap;
      }
    }
  }
  @media (max-width: 1200px) {
    height: 1080px;
    .content {
      height: auto;
      scroll-snap-type: none;
      section {
        scroll-snap-align: initial;
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
`;
