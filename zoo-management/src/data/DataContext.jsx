/**
 * DataContext - Shared state management for Wildwood Zoo system
 *
 * This context provides centralized data management for:
 * - Animals: All zoo animals across 8 habitats
 * - Gift Shop Items: All items available in the gift shop
 * - Concession Items: All food/beverage items across 4 concession stands
 *
 * All additions, updates, and deletions are automatically reflected
 * across all pages and portals in real-time.
 */

import { createContext, useContext, useState } from "react";
import {
  animals as initialAnimals,
  items as initialItems,
  concessionItems as initialConcessionItems,
} from "./mockData";

const DataContext = createContext(undefined);

export function DataProvider({ children }) {
  const [animals, setAnimals] = useState(initialAnimals);
  const [items, setItems] = useState(initialItems);
  const [concessionItems, setConcessionItems] = useState(
    initialConcessionItems
  );

  // Animal operations
  const addAnimal = (animal) => {
    setAnimals((prev) => [...prev, animal]);
  };

  const updateAnimal = (animalId, updates) => {
    setAnimals((prev) =>
      prev.map((animal) =>
        animal.Animal_ID === animalId ? { ...animal, ...updates } : animal
      )
    );
  };

  const deleteAnimal = (animalId) => {
    setAnimals((prev) =>
      prev.filter((animal) => animal.Animal_ID !== animalId)
    );
  };

  // Item operations
  const addItem = (item) => {
    setItems((prev) => [...prev, item]);
  };

  const updateItem = (itemId, updates) => {
    setItems((prev) =>
      prev.map((item) =>
        item.Item_ID === itemId ? { ...item, ...updates } : item
      )
    );
  };

  const deleteItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.Item_ID !== itemId));
  };

  // Concession item operations
  const addConcessionItem = (item) => {
    setConcessionItems((prev) => [...prev, item]);
  };

  const updateConcessionItem = (itemId, updates) => {
    setConcessionItems((prev) =>
      prev.map((item) =>
        item.Concession_Item_ID === itemId ? { ...item, ...updates } : item
      )
    );
  };

  const deleteConcessionItem = (itemId) => {
    setConcessionItems((prev) =>
      prev.filter((item) => item.Concession_Item_ID !== itemId)
    );
  };

  return (
    <DataContext.Provider
      value={{
        animals,
        addAnimal,
        updateAnimal,
        deleteAnimal,
        items,
        addItem,
        updateItem,
        deleteItem,
        concessionItems,
        addConcessionItem,
        updateConcessionItem,
        deleteConcessionItem,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
