import { useLocation } from "react-router-dom";

export default function Test() {
  const { state } = useLocation();
  return (
    <div>
      <span>{state.words}</span>
    </div>
  );
}
