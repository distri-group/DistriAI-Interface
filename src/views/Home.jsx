import styled from "styled-components";
import { message, Input } from "antd";
import React, { useState } from "react";
import { subscribe } from "../services/mailbox";
import Header from "../components/Header";

function Home({ className }) {
  document.title = "DistriAI Home";
  const [email, setEmail] = useState();
  const onInputEmail = (e) => {
    let v = e.target.value;
    console.log(v);
    setEmail(v);
  };
  const onSubmitEmail = () => {
    if (!validateEmail(email)) {
      return message.error("Email error.");
    }
    message.loading("loading...");
    let data = { mailbox: email };
    subscribe(data).then((t) => {
      console.log(t);
      message.destroy();
      message.success("Email Subscribed.");
    });
  };
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  return (
    <div className={className}>
      <div className="content">
        <video autoPlay loop muted className="bg-video">
          <source src="/video/bg.mp4" type="video/mp4" />
        </video>
        <div className="box1">
          <Header className="page-header" />
          <h1>Decentralized AI Computing Power Network</h1>
          <a
            className="play-btn"
            href="https://www.youtube.com/watch?v=nOn8aBgtXiM"
            title="https://www.youtube.com/"
            target="_blank"
            rel="noreferrer">
            {" "}
            Play Video
          </a>
        </div>
        <div className="box2">
          <div className="con">
            <h1>How to buy computing power with wallet</h1>
            <div className="line-box1"></div>
            <div className="line-box2"></div>
            <div className="mini-boxs">
              <div className="img-box">
                <img
                  src="/img/home/box2-1.png"
                  alt="Create an account on phantom"
                />
                <span>Create an account on phantom</span>
              </div>
              <div className="img-box">
                <img
                  src="/img/home/box2-2.png"
                  alt="Select a provider of computing power"
                />
                <span>Select a provider of computing power</span>
              </div>
              <div className="img-box">
                <img src="/img/home/box2-3.png" alt="Buy the computing power" />
                <span>Buy the computing power</span>
              </div>
            </div>
          </div>
        </div>
        <div className="box-intro">
          <div className="mini-boxs-2">
            <div className="text">
              <h2>What is DistriAI</h2>
              <p>
                Distri.AI is committed to establishing a globally leading
                distributed artificial intelligence secure computing platform.
                It boasts robust capabilities in integrating and scheduling
                computational resources.
              </p>
              <p>
                Distri.AI stands out as the first system with privacy and
                security protection for data/models and the pioneering platform
                with large-scale distributed training capabilities.
              </p>
            </div>
          </div>
        </div>
        <div className="round-bg">
          <div className="box3">
            <div className="con">
              <h3>Let your idle resources regain value</h3>
              <div>
                <span
                  style={{
                    backgroundImage: "url(/img/home/icon_jb.png)",
                    backgroundSize: 100,
                  }}>
                  <font>Easy</font>
                  <label>
                    Just a few clicks to list your devices on the market, then
                    sit back and wait for automatic transactions
                  </label>
                </span>
                <span
                  style={{
                    backgroundImage: "url(/img/home/icon_cs.png)",
                    backgroundSize: 100,
                  }}>
                  <font>Earn</font>
                  <label>
                    Every minute your GPU is idle can bring you earnings{" "}
                  </label>
                </span>
                <span
                  style={{
                    backgroundImage: "url(/img/home/icon_ai.png)",
                    backgroundSize: 100,
                  }}>
                  <font>Witness the AI era for All</font>
                  <label>
                    Utilize your computing resources to lower the barrier to AI
                    research, embracing the era of AI for everyone
                  </label>
                </span>
              </div>
            </div>
          </div>
          <div className="box4">
            <div className="container">
              <h2>Effortlessly Attain GPU Resources</h2>
              <div className="icons">
                <span
                  style={{
                    backgroundImage: "url(/img/home/icon_aq.png)",
                    backgroundSize: 100,
                  }}>
                  <font>Secure</font>
                  <label>
                    Equipped with a PPML framework ensuring data/model privacy
                    and security, offering a three-tier security model
                  </label>
                </span>
                <span
                  style={{
                    backgroundImage: "url(/img/home/icon_py.png)",
                    backgroundSize: 100,
                  }}>
                  <font>Affordable</font>
                  <label>
                    Eliminate 70% of costs for your AI model training endeavors
                  </label>
                </span>
                <span
                  style={{
                    backgroundImage: "url(/img/home/icon_stws.png)",
                    backgroundSize: 100,
                  }}>
                  <font>Comprehensive Ecosystem</font>
                  <label>
                    Access computing power, data, and algorithmic model
                    resources directly. All you need to prepare is your idea
                  </label>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="box5">
          <div className="con">
            <div className="t1">Backer</div>
            <div className="pater">
              <span className="l1" />
              <span className="l3" />
              <span className="l4" />
            </div>
          </div>
        </div>
        <div className="box6">
          <div className="con">
            <div className="t1">Learn more about DistriAI</div>
            <div className="t2">
              Subscribe to the latest news from DistriAI to stay informed about
              project updates in real time.
            </div>
            <div className="sub-box">
              <Input
                onChange={onInputEmail}
                onKeyUp={onInputEmail}
                placeholder="email@your.domain"
                suffix={
                  <button className="email-submit" onClick={onSubmitEmail}>
                    <span>Subscribe</span>
                  </button>
                }
                className="email-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default styled(Home)`
  display: block;
  font-family: Montserrat, Montserrat Bold, Montserrat, sans-serif;

  .content {
    min-width: 1200px;
    display: block;
    overflow: hidden;
  }
  .con {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    padding: 0 20px;
  }
  .block {
    display: block;
    overflow: hidden;
  }
  .hold {
    display: block;
    overflow: hidden;
    width: 100%;
    height: 56px;
    clear: both;
    background-color: rgb(0, 0, 0);
  }
  .box1 {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 600px;
    display: block;
    overflow: hidden;
    h1 {
      width: 100%;
      line-height: 100px;
      text-align: center;
      color: white;
      font-weight: bold;
      font-size: 48px;
      margin-top: 140px;
    }
    .play-btn {
      background-image: url(/img/home/play.svg);
      background-repeat: no-repeat;
      background-size: 20px;
      background-position: 10px;
      width: 150px;
      height: 40px;
      line-height: 40px;
      text-indent: 49px;
      display: block;
      margin: 42px auto;
      background-color: rgba(0, 0, 0, 1);
      border-radius: 5px;
      font-family: Montserrat, sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #ffffff;
      text-decoration: none;
    }
    .play-btn:hover {
      background-color: rgb(49 49 49);
    }
  }
  .box2 {
    text-align: center;
    background-color: #00000b;
    padding: 100px 0;
    color: #fff;
    .con {
      position: relative;
      top: 0;
    }
    h1 {
      text-align: center;
      display: block;
      width: 100%;
      font-size: 40px;
    }
    .line-box1,
    .line-box2 {
      width: 155px;
      height: 2px;
      display: block;
      overflow: hidden;
      position: absolute;
      top: 235px;
      background-image: url(/img/home/box-2-line.svg);
      background-repeat: repeat-x;
      background-position: center;
    }
    .line-box1 {
      left: 22%;
    }
    .line-box2 {
      left: 62%;
    }
    .mini-boxs {
      display: flex;
      flex-direction: row;
      width: 100%;
      margin: 100px auto;
      justify-content: space-between;
      .img-box {
        width: 25%;
        img {
          width: 114px;
        }
        .box-line {
          width: 75%;
          margin-top: 79px;
        }
        span {
          display: block;
          clear: both;
          height: 80px;
          line-height: 80px;
          font-size: 16px;
          color: #fff;
          text-align: center;
          overflow: hidden;
          font-family: Montserrat, sans-serif;
        }
      }
    }
  }
  .round-bg {
    background-image: url("/img/home/round4.png");
    background-repeat: no-repeat;
    background-position-x: -360px;
    background-position-y: -80px;
  }
  .box3 {
    height: 600px;
    display: block;
    overflow: hidden;
    .con {
      width: 90%;
      margin: 0 auto;
      display: block;
      padding: 117px 0;
      h3 {
        font-size: 40px;
        font-weight: 500;
        color: #ffffff;
        line-height: 55px;
        margin: 0;
        padding-bottom: 70px;
      }
      div {
        display: flex;
        flex-direction: row;
        span {
          width: 27.33%;
          margin: 0 3%;
          display: flex;
          flex-direction: column;
          background-repeat: no-repeat;
          background-position: top;
          background-size: 84px;
          margin-top: 57px;
          font {
            width: 100%;
            font-family: Montserrat Bold, Montserrat, Montserrat, sans-serif;
            font-weight: 500;
            font-style: normal;
            font-size: 24px;
            color: white;
            text-align: center;
            line-height: 33px;
            margin-top: 122px;
          }
          label {
            margin-top: 15px;
            font-size: 16px;
            font-weight: 500;
            color: #ffffff;
            line-height: 22px;
            text-align: center;
          }
        }
      }
    }
  }
  .box4 {
    color: white;
    padding: 100px 0;
    .container {
      width: 90%;
      max-width: 1200px;
      margin: 0 auto;
      h2 {
        margin: 0;
        padding-bottom: 70px;
        font-size: 40px;
        font-weight: 500;
        color: #ffffff;
        line-height: 55px;
      }
      .icons {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        span {
          width: 27.33%;
          margin: 0 3%;
          display: flex;
          flex-direction: column;
          background-repeat: no-repeat;
          background-position: top;
          background-size: 84px;
          margin-top: 57px;
          font {
            width: 100%;
            font-family: Montserrat Bold, Montserrat, Montserrat, sans-serif;
            font-weight: 500;
            font-style: normal;
            font-size: 24px;
            color: white;
            text-align: center;
            line-height: 33px;
            margin-top: 122px;
          }
          label {
            margin-top: 15px;
            font-size: 16px;
            font-weight: 500;
            color: #ffffff;
            line-height: 22px;
            text-align: center;
          }
        }
      }
    }
  }
  .box-intro {
    padding-bottom: 90px;
    background-image: url("/img/home/bg_sjys.png");
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    .mini-boxs-2 {
      display: flex;
      flex-direction: row;
      justify-content: right;
      width: 90%;
      height: 900px;
      justify-content: right;
      width: 90%;
      height: 900px;
      margin: 0 auto;

      .text {
        width: 40%;
        color: #fff;
        h2 {
          margin: 0;
          padding-top: 140px;
          padding-bottom: 80px;
          font-size: 40px;
          font-weight: 500;
          line-height: 55px;
        }
        p {
          font-size: 24px;
          font-weight: 500;
          line-height: 33px;
        }
      }
    }
  }
  .box5 {
    background-color: #00000b;
    background-color: #00000b;
    background-image: url("/img/home/round4.png");
    background-position-x: 120%;
    background-position-y: -80px;
    background-size: 40%;
    background-repeat: no-repeat;
    display: block;
    padding: 50px 0;
    height: 600px;
    overflow: hidden;
    .con {
      flex-direction: column;
      .t1 {
        font-weight: 700;
        font-size: 40px;
        color: #ffffff;
        text-align: center;
        margin-top: 88px;
        line-height: 95px;
      }
      .pater {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 200px;
        span {
          width: 25%;
          background-repeat: no-repeat;
          background-position: center;
          height: 200px;
          display: block;
          overflow: hidden;
          background-size: 70%;
          margin: 0 4.16%;
        }
        .l1 {
          background-image: url(/img/home/box5-1.png);
        }
        .l3 {
          background-size: 25%;
          background-image: url(/img/home/box5-3.png);
        }
        .l4 {
          background-image: url(/img/home/box5-4.png);
        }
      }
    }
  }
  .box6 {
    background-color: #00000b;
    background-color: #00000b;
    background-image: url("/img/home/round5.png");
    background-position-y: 30%;
    background-position-x: 30%;
    background-size: 25%;
    background-repeat: no-repeat;
    display: block;
    padding: 80px 0 76px;
    .con {
      flex-direction: column;
      .t1 {
        font-weight: 700;
        font-size: 40px;
        color: #ffffff;
        text-align: center;
        font-family: Montserrat Bold, Montserrat, Montserrat, sans-serif;
      }
      .t2 {
        width: 653px;
        font-size: 16px;
        color: #ffffff;
        text-align: center;
        overflow: hidden;
        display: block;
        line-height: 24px;
        margin: 20px auto;
        font-family: Montserrat, sans-serif;
      }
      .sub-box {
        display: flex;
        flex-direction: row;
        width: 791px;
        overflow: hidden;
        margin: 50px auto;
        .email-input {
          height: 72px;
          border-radius: 50px;
          background-color: transparent;
          .ant-input {
            border-radius: 50px;
            background-color: transparent;
          }
        }
        .email-submit {
          border: none;
          border-radius: 25px;
          cursor: pointer;
          background-image: linear-gradient(to right, #20ae98, #0aab50);
          span {
            display: block;
            font-size: 14px;
            padding: 5px 20px;
          }
          :focus-within {
            border-color: #0aab50;
          }
        }
      }
    }
  }
  .bg-video {
    position: absolute;
    width: 100%;
    height: 600px;
    object-fit: cover;
    z-index: -1;
  }
`;
