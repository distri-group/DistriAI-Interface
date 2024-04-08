import useSolanaMethod from "../utils/useSolanaMethod";
import { utils } from "@project-serum/anchor";
export default function Test() {
  const { methods, wallet } = useSolanaMethod();
  const timeStamp = 1712479077129;
  const handleClick = async () => {
    console.log("Uuid", utils.bytes.utf8.encode(timeStamp));
  };
  return <button onClick={handleClick}>Test</button>;
}
