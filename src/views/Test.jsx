import { useAnchorWallet } from "@solana/wallet-adapter-react";
import FileList from "../components/FileList";
import { useEffect, useState } from "react";

export default function Test() {
  const wallet = useAnchorWallet();
  const [list, setList] = useState([]);
  useEffect(() => {
    console.log(list);
  }, [list]);
  return (
    wallet?.publicKey && (
      <FileList
        item={{ Owner: wallet.publicKey.toString(), Name: "readme-test-3" }}
        type="dataset"
        onSelect={(list) => setList(list)}
      />
    )
  );
}
