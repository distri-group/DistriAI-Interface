import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../../views/Home";

const MapWithPoints = () => {
  const { width } = useContext(Context);
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const mapImage = new Image();
    mapImage.src = "/img/home/layers/map.png";
    mapImage.onload = () => {
      canvas.width = width > 500 ? mapImage.width : 457;
      canvas.height = width > 500 ? mapImage.height : 246;
      context.drawImage(mapImage, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const randomPoints = [];
      while (randomPoints.length < 20) {
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);
        const pixelIndex = (y * canvas.width + x) * 4;
        const alpha = data[pixelIndex + 3];
        if (alpha > 0) {
          const scale = Math.random() * 3 + 2;
          randomPoints.push({ x, y, scale, id: Math.random() });
        }
      }
      setPoints(randomPoints);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: width > 500 ? "100%" : "185pt",
      }}>
      <canvas ref={canvasRef} width={510} />
      {points.map((point, index) => (
        <motion.div
          key={point.id}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{
            duration: 2.5,
            delay: index * 0.2,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
          style={{
            position: "absolute",
            width: "24px",
            height: "24px",
            borderRadius: "100%",
            border: "1px solid #6F4CFF",
            borderWidth: "0.2px",
            backgroundColor: "rgba(111, 76 ,255, 0.4)",
            left: `${point.x}px`,
            top: `${point.y}px`,
          }}
        />
      ))}
    </div>
  );
};

export default MapWithPoints;
