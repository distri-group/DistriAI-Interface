import { create } from "kubo-rpc-client";
import { useEffect, useState } from "react";

export default function useIpfs() {
  const [client, setClient] = useState(null);
  useEffect(() => {
    const client = create({ url: "https://distri.ai/ipfs-rpc/api/v0" });
    setClient(client);
  }, []);
  return client;
}
