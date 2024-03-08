import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const HorizontalColorChange = ({ delay = 0 }) => {
  const colors = [
    "#808080",
    "#a0a0a0",
    "#c0c0c0",
    "#d0d0d0",
    "#e0e0e0",
    "#f0f0f0",
    "#f8f8f8",
    "#ffffff",
  ];
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div ref={ref} style={{ display: "flex", margin: "20px" }}>
      {colors.map((color, index) => (
        <motion.div
          key={index}
          style={{
            width: "12px",
            height: "12px",
            marginTop: "54px",
            marginRight: "10px",
          }}
          initial={{ backgroundColor: "#808080" }}
          animate={{
            backgroundColor: isInView
              ? ["#808080", "#ffffff", "#808080"]
              : "#808080",
          }}
          transition={{
            delay: delay + index * 0.1,
            duration: 0.3,
            repeat: Infinity,
            repeatDelay: 0.7,
          }}
        />
      ))}
    </div>
  );
};

export default HorizontalColorChange;
