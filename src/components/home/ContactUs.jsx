import styled from "styled-components";
import { InputAdornment, OutlinedInput } from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { motion } from "framer-motion";
import { subscribe } from "../../services/mailbox";
import Footer from "../footer";

const ContactUs = ({ className }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [email, setEmail] = useState();

  const onInputEmail = (e) => {
    setEmail(e.target.value);
  };
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  const onSubmitEmail = () => {
    if (!validateEmail(email)) {
      return enqueueSnackbar("Email error", { variant: "error" });
    }
    enqueueSnackbar("Loading...", { variant: "info" });
    let data = { mailbox: email };
    subscribe(data).then((t) => {
      closeSnackbar();
      enqueueSnackbar("Email Subscribed", { variant: "success" });
    });
  };
  return (
    <section id="contact-us" className={className}>
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              staggerChildren: 0.1,
              duration: 0.3,
            },
          }}
          viewport={{ once: true }}>
          Learn More About Distri.AI
        </motion.h2>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              staggerChildren: 0.1,
              duration: 0.3,
              delay: 0.3,
            },
          }}
          viewport={{ once: true }}>
          Subscribe to the latest news from Distri.AI to stay informed about
          updates in realtime.
        </motion.h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              staggerChildren: 0.1,
              duration: 0.3,
              delay: 0.6,
            },
          }}
          viewport={{ once: true }}
          className="sub-box">
          <OutlinedInput
            onChange={onInputEmail}
            onKeyUp={onInputEmail}
            placeholder="email@your.domain"
            className="email-input"
            type="email"
            inputProps={{}}
            fullWidth
            endAdornment={
              <InputAdornment position="end">
                <button className="email-submit" onClick={onSubmitEmail}>
                  <span>Subscribe</span>
                </button>
              </InputAdornment>
            }
          />
        </motion.div>
      </div>
      <Footer className="footer" />
    </section>
  );
};

export default styled(ContactUs)`
  height: 100vh;
  max-height: 1080px;
  background-image: url(/img/home/contact_us.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  .container {
    padding-top: 160px;
    h2 {
      font-weight: 700;
      font-size: 40px;
      text-align: center;
    }
    h3 {
      margin: 20px auto;
      line-height: 24px;
      font-size: 16px;
      text-align: center;
    }
    .sub-box {
      display: flex;
      flex-direction: row;
      width: 791px;
      overflow: hidden;
      margin: 50px auto;
      .email-input {
        color: white;
        height: 72px;
        border-radius: 50px;
        background-color: transparent;
      }
      .email-submit {
        border: none;
        border-radius: 25px;
        cursor: pointer;
        background-image: linear-gradient(to right, #20ae98, #0aab50);
        span {
          display: block;
          color: white;
          font-size: 16px;
          padding: 12px 20px;
        }
        :focus-within {
          border-color: #0aab50;
        }
      }
    }
  }
  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  @media (max-width: 500px) {
    height: 812pt;
    .container {
      width: calc(100% - 48pt);
      padding: 0 24pt;
      padding-top: 144pt;
      h2 {
        font-size: 28pt;
        line-height: 40pt;
      }
      h3 {
        margin: 0 22pt;
        font-size: 14pt;
        line-height: 24pt;
      }
      .sub-box {
        width: 100%;
        .email-submit {
          span {
            font-size: 14pt;
          }
        }
      }
    }
  }
`;
