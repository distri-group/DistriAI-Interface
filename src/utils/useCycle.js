import { useState } from "react";

export default function useCycle(array) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % array.length);
  };
  return [array[currentIndex], next];
}
