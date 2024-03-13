import styled from "styled-components";
import React, { useRef, useState, useEffect, createContext } from "react";
import Header from "../components/Header";
import AboutUs from "../components/home/AboutUs";
import Banner from "../components/home/Banner";
import ComputingPower from "../components/home/ComputingPower";
import ContactUs from "../components/home/ContactUs";
import HowToDo from "../components/home/HowToDo";
import RoadMap from "../components/home/RoadMap";
import Layers from "../components/home/Layers";

export const Context = createContext();

function Home({ className }) {
  document.title = "DistriAI Home";
  const ref = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollableElement = ref.current;
      if (!scrollableElement) return;
      const scrollTop = scrollableElement.scrollTop;
      const scrollHeight = scrollableElement.scrollHeight;
      const clientHeight = scrollableElement.clientHeight;
      const totalScroll = scrollHeight - clientHeight;
      const currentScrollProgress = (scrollTop / totalScroll) * 100;
      setScrollProgress(currentScrollProgress);
    };
    const handleResize = () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    const scrollableElement = ref.current;
    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={className}>
      <Context.Provider value={{ scrollProgress, width }}>
        <div ref={ref} className="content">
          <Header className="page-header" />
          <Banner />
          <ComputingPower />
          <Layers />
          <HowToDo />
          <AboutUs />
          <RoadMap />
          <ContactUs />
        </div>
      </Context.Provider>
    </div>
  );
}

export default styled(Home)`
  position: relative;
  .content {
    overflow-x: hidden;
    position: relative;
  }
  .page-header {
    padding-top: 32px;
    position: fixed;
    z-index: 200;
  }
  .page-header {
    padding: 0;
  }
`;
