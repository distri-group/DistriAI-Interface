import { createContext, useContext, useMemo } from "react";

const ClearCacheContext = createContext();
export const useClearCache = () => useContext(ClearCacheContext);

export function ClearCacheProvider({ children, aliveRef }) {
  const value = useMemo(
    () => ({
      clearCache: aliveRef?.current?.cleanOtherCache,
    }),
    [aliveRef]
  );
  return (
    <ClearCacheContext.Provider value={value}>
      {children}
    </ClearCacheContext.Provider>
  );
}
