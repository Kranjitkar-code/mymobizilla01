import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Sponsor {
  id: number;
  name: string;
  link: string;
  image: string;
  isActive: boolean;
}

interface SponsorsStore {
  sponsors: Sponsor[];
  addSponsor: (sponsor: Omit<Sponsor, 'id'>) => void;
  updateSponsor: (id: number, sponsor: Partial<Sponsor>) => void;
  deleteSponsor: (id: number) => void;
  toggleSponsor: (id: number) => void;
}

export const useSponsors = create<SponsorsStore>()(
  persist(
    (set) => ({
      sponsors: [],
      addSponsor: (sponsor) =>
        set((state) => ({
          sponsors: [...state.sponsors, { ...sponsor, id: Date.now() }],
        })),
      updateSponsor: (id, updatedSponsor) =>
        set((state) => ({
          sponsors: state.sponsors.map((sponsor) =>
            sponsor.id === id ? { ...sponsor, ...updatedSponsor } : sponsor
          ),
        })),
      deleteSponsor: (id) =>
        set((state) => ({
          sponsors: state.sponsors.filter((sponsor) => sponsor.id !== id),
        })),
      toggleSponsor: (id) =>
        set((state) => ({
          sponsors: state.sponsors.map((sponsor) =>
            sponsor.id === id ? { ...sponsor, isActive: !sponsor.isActive } : sponsor
          ),
        })),
    }),
    {
      name: 'sponsors-storage',
    }
  )
);
