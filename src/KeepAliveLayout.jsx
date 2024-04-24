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
    <KeepAlive
      activeName={cacheKey}
      exclude={[/\/exclude-counter/]}
      max={10}
      strategy={"LRU"}>
      <div id="App">
        <NavBar />
        {outlet}
      </div>
    </KeepAlive>
  );
}
