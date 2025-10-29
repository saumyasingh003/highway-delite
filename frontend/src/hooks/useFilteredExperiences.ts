import { useState, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';

export interface Experience {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  image: string;
  slots: Array<{
    date: string;
    time: string;
    available: boolean;
  }>;
}

export const useFilteredExperiences = (experiences: Experience[]) => {
  const { searchQuery } = useSearch();
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>(experiences);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredExperiences(experiences);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = experiences.filter(
      (exp) =>
        exp.title.toLowerCase().includes(query) ||
        exp.location.toLowerCase().includes(query) ||
        exp.description.toLowerCase().includes(query)
    );

    setFilteredExperiences(filtered);
  }, [searchQuery, experiences]);

  return filteredExperiences;
};