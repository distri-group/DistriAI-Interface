import useIpfs from "@/utils/useIpfs.js";

export default function Test() {
  const { methods } = useIpfs();
  const test = async () => {
    const res = await methods.getFolderList(
      `/distri.ai/model/4F1fmZAmZ7bwQF3vz3Dv7VFJDyrkyjDyftsKHq9bTb1p/test/deployment`
    );
    console.log(res);
  };
  return <button onClick={test}>test</button>;
}
