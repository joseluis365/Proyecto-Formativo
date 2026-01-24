import { createContext, useContext, useState } from "react";

const LayoutContext = createContext(null);

export function LayoutProvider({ children }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  return (
    <LayoutContext.Provider
      value={{
        title,
        setTitle,
        subtitle,
        setSubtitle,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}

