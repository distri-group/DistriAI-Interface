import Countdown from "../components/Countdown";

export default function Test() {
  const test = () => {
    console.log("Countdown ended");
  };
  return <Countdown deadlineTime={new Date().getTime() + 5000} onEnd={test} />;
}
