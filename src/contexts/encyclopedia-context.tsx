
"use client";

import type { EncyclopediaEntry, EncyclopediaSourceLink } from "@/types";
import { createContext, useContext, type ReactNode } from "react";

interface EncyclopediaContextType {
  entries: EncyclopediaEntry[];
  setEntries: React.Dispatch<React.SetStateAction<EncyclopediaEntry[]>>;
  addLinkToEntry: (entryId: string, link: EncyclopediaSourceLink) => void;
  updateLinkInSection: (entryId: string, linkId: string, updatedLinkData: Partial<EncyclopediaSourceLink>) => void;
  addEncyclopediaEntry: (newEntry: EncyclopediaEntry) => void;
  updateEncyclopediaEntry: (updatedEntry: EncyclopediaEntry) => void;
}

export const EncyclopediaContext = createContext<EncyclopediaContextType | undefined>(undefined);

export function useEncyclopediaContext() {
  const context = useContext(EncyclopediaContext);
  if (!context) {
    throw new Error("useEncyclopediaContext must be used within an EncyclopediaProvider");
  }
  return context;
}

// The EncyclopediaProvider will be used in DashboardPage.tsx
// It will receive the actual state and dispatcher from DashboardPage's state.
// This file just defines the context and a hook to use it.
// The actual Provider component might be implicitly created by passing `value` to `EncyclopediaContext.Provider`
// in `DashboardPage.tsx`.

// Placeholder for Provider component if we decide to make it explicit here,
// but typically the state lifting to DashboardPage is cleaner.
// export function EncyclopediaProvider({ children, value }: { children: ReactNode, value: EncyclopediaContextType }) {
//   return (
//     <EncyclopediaContext.Provider value={value}>
//       {children}
//     </EncyclopediaContext.Provider>
//   );
// }
