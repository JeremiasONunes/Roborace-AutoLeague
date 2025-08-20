import { useState, useEffect } from 'react';

const STORAGE_KEY = 'roborace_data';

export const useRealTimeData = () => {
  const [data, setData] = useState({
    teams: [],
    groups: [],
    matches: [],
    rankings: [],
    currentPhase: 'groups',
    phases: {
      groups: { name: 'Fase de Grupos', completed: false },
      round16: { name: 'Oitavas de Final', completed: false },
      quarterfinals: { name: 'Quartas de Final', completed: false },
      semifinals: { name: 'Semifinais', completed: false },
      final: { name: 'Final', completed: false }
    }
  });

  const loadData = () => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 1000);
    
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return data;
};