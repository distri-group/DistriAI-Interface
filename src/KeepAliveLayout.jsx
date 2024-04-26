import KeepAlive from "keepalive-for-react";
import NavBar from "@/components/NavBar.jsx";
import { useMemo } from "react";
import { useLocation, useOutlet } from "react-router-dom";

export default function KeepAliveLayout() {
  const outlet = useOutlet();
  const location = useLocation();

  const cacheKey = useMemo(() => {
    return location.pathname + location.search;
  }, [location]);

  return (
    <>
      <div className="bg" />
      <div id="App">
        <NavBar />
        <KeepAlive
          activeName={cacheKey}
          include={[
            /\/dashboard/,
            /\/model/,
            /\/dataset/,
            /\/earning/,
            /\/reward/,
            /\/market/,
          ]}
          max={10}
          strategy={"LRU"}>
          {outlet}
        </KeepAlive>
      </div>
    </>
  );
}
