import { useState, useEffect } from "react";
import { ListingCardProps } from "../components/ListingCard";

// Using LocalStorage for now to act as a frontend saving mechanism
// until the Django backend Models are fully setup.
export function useSavedListings() {
  const [savedItems, setSavedItems] = useState<ListingCardProps[]>([]);

  useEffect(() => {
    const loaded = localStorage.getItem("campuscrate_saved");
    if (loaded) {
      try {
        setSavedItems(JSON.parse(loaded));
      } catch (e) {
        console.error("Failed to parse saved items", e);
      }
    }
  }, []);

  const toggleSaved = (item: ListingCardProps) => {
    setSavedItems(prev => {
      const isSaved = prev.some(p => p.id === item.id);
      let next;
      if (isSaved) {
        next = prev.filter(p => p.id !== item.id);
      } else {
        next = [...prev, item];
      }
      localStorage.setItem("campuscrate_saved", JSON.stringify(next));
      return next;
    });
  };

  const isSaved = (id: string) => savedItems.some(item => item.id === id);

  return { savedItems, toggleSaved, isSaved };
}
