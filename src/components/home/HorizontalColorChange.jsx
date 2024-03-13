import { motion } from "framer-motion";
import { useContext } from "react";
import { Context } from "../../views/Home";

const HorizontalColorChange = ({ delay = 0 }) => {
  const { width } = useContext(Context);
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

  return (
    <div
      style={{
        display: "flex",
        margin: width > 500 ? "20px" : "24pt 0",
        flexDirection: width <= 500 ? "column" : "row",
        width: width <= 500 && "80pt",
        alignItems: width <= 500 && "center",
      }}>
      {colors.map((color, index) => (
        <motion.div
          key={index}
          style={{
            width: "12px",
            height: "12px",
            marginTop: width <= 500 ? "6pt" : "54px",
            marginRight: width > 500 && "10px",
          }}
          initial={{ backgroundColor: "#808080" }}
          whileInView={{
            backgroundColor: ["#808080", "#ffffff", "#808080"],
          }}
          viewport={{ once: true }}
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
