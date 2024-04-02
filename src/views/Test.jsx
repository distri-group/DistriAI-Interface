import { useEffect } from "react";
import { getMachineDetail } from "../services/machine";

export default function Test() {
  useEffect(() => {
    const getMachine = async () => {
      try {
        const machine = await getMachineDetail(
          "AxBoDKGYKBa54qkDusWWYgf8QXufvBKTJTQBaKyEiEzF",
          "0x105fc89c16980c81fd642af19eacbb18"
        );
        console.log(machine);
      } catch (e) {
        console.log(e);
      }
    };
    getMachine();
  }, []);

  return <div></div>;
}
