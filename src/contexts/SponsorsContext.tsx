import React, { createContext, useContext } from "react";

type Sponsor = {
  id: string;
  name: string;
  link: string;
  image?: string;
  isActive: boolean;
};

type SponsorsContextType = {
  sponsors: Sponsor[];
};

const SponsorsContext = createContext<SponsorsContextType>({ sponsors: [] });

export const useSponsors = () => {
  const context = useContext(SponsorsContext);
  if (!context) {
    throw new Error('useSponsors must be used within a SponsorsProvider');
  }
  return context;
};

export const SponsorsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Example sponsors data - replace with real data later
  const sponsors: Sponsor[] = [
    {
      id: "1",
      name: "Apple",
      link: "https://apple.com",
      isActive: true,
    },
    {
      id: "2",
      name: "Samsung",
      link: "https://samsung.com",
      isActive: true,
    },
    {
      id: "3",
      name: "Google",
      link: "https://google.com",
      isActive: true,
    }
  ];

  return (
    <SponsorsContext.Provider value={{ sponsors }}>
      {children}
    </SponsorsContext.Provider>
  );
};
