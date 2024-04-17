import useIpfs from "@/utils/useIpfs.js";

export default function Test() {
  const { methods } = useIpfs();
  const test = async () => {
    const res = await methods.jsonUpload({
      age: 1,
      name: "lihua",
    });
    console.log(res);
  };
  return <button onClick={test}>test</button>;
}
