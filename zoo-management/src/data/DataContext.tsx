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

import { createContext, useContext, useState, ReactNode } from 'react';
import { 
  animals as initialAnimals, 
  items as initialItems, 
  concessionItems as initialConcessionItems,
  type Animal,
  type Item,
  type ConcessionItem
} from './mockData';

interface DataContextType {
  animals: Animal[];
  addAnimal: (animal: Animal) => void;
  updateAnimal: (animalId: number, updates: Partial<Animal>) => void;
  deleteAnimal: (animalId: number) => void;
  
  items: Item[];
  addItem: (item: Item) => void;
  updateItem: (itemId: number, updates: Partial<Item>) => void;
  deleteItem: (itemId: number) => void;
  
  concessionItems: ConcessionItem[];
  addConcessionItem: (item: ConcessionItem) => void;
  updateConcessionItem: (itemId: number, updates: Partial<ConcessionItem>) => void;
  deleteConcessionItem: (itemId: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [animals, setAnimals] = useState<Animal[]>(initialAnimals);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [concessionItems, setConcessionItems] = useState<ConcessionItem[]>(initialConcessionItems);

  // Animal operations
  const addAnimal = (animal: Animal) => {
    setAnimals(prev => [...prev, animal]);
  };

  const updateAnimal = (animalId: number, updates: Partial<Animal>) => {
    setAnimals(prev => prev.map(animal => 
      animal.Animal_ID === animalId ? { ...animal, ...updates } : animal
    ));
  };

  const deleteAnimal = (animalId: number) => {
    setAnimals(prev => prev.filter(animal => animal.Animal_ID !== animalId));
  };

  // Item operations
  const addItem = (item: Item) => {
    setItems(prev => [...prev, item]);
  };

  const updateItem = (itemId: number, updates: Partial<Item>) => {
    setItems(prev => prev.map(item => 
      item.Item_ID === itemId ? { ...item, ...updates } : item
    ));
  };

  const deleteItem = (itemId: number) => {
    setItems(prev => prev.filter(item => item.Item_ID !== itemId));
  };

  // Concession item operations
  const addConcessionItem = (item: ConcessionItem) => {
    setConcessionItems(prev => [...prev, item]);
  };

  const updateConcessionItem = (itemId: number, updates: Partial<ConcessionItem>) => {
    setConcessionItems(prev => prev.map(item => 
      item.Concession_Item_ID === itemId ? { ...item, ...updates } : item
    ));
  };

  const deleteConcessionItem = (itemId: number) => {
    setConcessionItems(prev => prev.filter(item => item.Concession_Item_ID !== itemId));
  };

  return (
    <DataContext.Provider value={{
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
      deleteConcessionItem
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
