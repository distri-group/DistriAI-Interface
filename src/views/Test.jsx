import { Button } from "antd";
import { useState } from "react";

export default function Test() {
  const [publicKey, setPublicKey] = useState("");
  const [signature, setSignature] = useState(null);
  return (
    <>
      <Button
        onClick={async () => {
          const msg = new TextEncoder().encode("Bye bye, world!");
          const sign = await window.phantom.solana.signMessage(msg, "utf8");
          setPublicKey(sign.publicKey.toString());
          setSignature(sign.signature);
        }}>
        SignMessage
      </Button>
      <div style={{ color: "white" }}>
        {publicKey && <p>PublicKey: {publicKey}</p>}
        {signature && <p>Signature: {signature}</p>}
      </div>
    </>
  );
}
