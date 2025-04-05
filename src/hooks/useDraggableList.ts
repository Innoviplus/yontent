
import { useState } from 'react';

export function useDraggableList<T>(initialItems: T[]) {
  const [items, setItems] = useState<T[]>(initialItems);
  
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData('application/json', JSON.stringify({ index }));
    event.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    event.preventDefault();
    
    try {
      const data = JSON.parse(event.dataTransfer.getData('application/json'));
      const sourceIndex = data.index;
      
      if (sourceIndex === targetIndex) return;
      
      const newItems = [...items];
      const [movedItem] = newItems.splice(sourceIndex, 1);
      newItems.splice(targetIndex, 0, movedItem);
      
      setItems(newItems);
    } catch (error) {
      console.error('Error during drag and drop:', error);
    }
  };
  
  return {
    items,
    setItems,
    handleDragStart,
    handleDragOver,
    handleDrop
  };
}
