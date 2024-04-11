import { useEffect } from "react";
import { create } from "kubo-rpc-client";

export default function Test() {
  const client = create({ url: "https://distri.ai/ipfs-rpc/api/v0" });
  console.log(client);
  return <div>Hello World</div>;
}
