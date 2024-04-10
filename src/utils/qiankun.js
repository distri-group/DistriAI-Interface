import { registerMicroApps, start } from "qiankun";

registerMicroApps([
  {
    name: "home",
    entry: process.env.REACT_APP_HOME,
    container: "#home",
    activeRule: "/home",
  },
]);

start();
