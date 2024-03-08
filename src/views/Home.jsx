import styled from "styled-components";
import React from "react";
import Header from "../components/Header";
import AboutUs from "../components/home/AboutUs";
import Backer from "../components/home/Backer";
import Banner from "../components/home/Banner";
import ComputingPower from "../components/home/ComputingPower";
import ContactUs from "../components/home/ContactUs";
import HowToDo from "../components/home/HowToDo";
import RoadMap from "../components/home/RoadMap";
import { useRef, useState, useEffect } from "react";
import Layers from "../components/home/Layers";

function Home({ className }) {
  document.title = "DistriAI Home";
  const scrollableRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableElement = scrollableRef.current;
      if (!scrollableElement) return;

      const scrollTop = scrollableElement.scrollTop;
      const scrollHeight = scrollableElement.scrollHeight;
      const clientHeight = scrollableElement.clientHeight;

      const totalScroll = scrollHeight - clientHeight;
      const currentScrollProgress = (scrollTop / totalScroll) * 100;
      console.log(currentScrollProgress);
      setScrollProgress(currentScrollProgress);
    };

    const scrollableElement = scrollableRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className={className}>
      <div ref={scrollableRef} className="content">
        <Header className="page-header" />
        <Banner />
        <ComputingPower progress={scrollProgress} />
        <Layers progress={scrollProgress} />
        <HowToDo />
        <AboutUs progress={scrollProgress} />
        <RoadMap />
        <Backer />
        <ContactUs />
      </div>
    </div>
  );
}

export default styled(Home)`
  position: relative;
  .content {
    min-width: 1200px;
    height: 100vh;
    overflow-y: scroll;
    position: relative;
    scroll-snap-type: y mandatory;
    section {
      scroll-snap-align: start;
      min-width: 1200px;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .page-header {
    padding-top: 32px;
    position: fixed;
    z-index: 200;
  }
  @media (max-width: 1200px) {
    .content {
      scroll-snap-type: none;
      section {
        scroll-snap-align: initial;
      }
    }
  }
`;
