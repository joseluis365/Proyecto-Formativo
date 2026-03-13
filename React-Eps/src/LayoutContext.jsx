import { createContext, useContext, useState } from "react";

const LayoutContext = createContext(null);

export function LayoutProvider({ children }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [helpContent, setHelpContent] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        title,
        setTitle,
        subtitle,
        setSubtitle,
        helpContent,
        setHelpContent,
        isHelpOpen,
        setIsHelpOpen,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}

