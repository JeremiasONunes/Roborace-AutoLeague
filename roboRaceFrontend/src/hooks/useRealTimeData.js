import { useState, useEffect } from 'react';

const STORAGE_KEY = 'roborace_data';

const initialData = {
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
};

export const useRealTimeData = () => {
  const [data, setData] = useState(initialData);

  // Função para calcular rankings
  const calculateRankings = (currentData) => {
    if (!currentData || !currentData.teams || currentData.teams.length === 0) return [];
    
    const teamStats = {};
    
    currentData.teams.forEach(team => {
      teamStats[team.id] = {
        team,
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        group: 'Sem Grupo'
      };
    });

    if (currentData.groups && currentData.groups.length > 0) {
      currentData.groups.forEach(group => {
        if (group.teams && group.teams.length > 0) {
          group.teams.forEach(team => {
            if (teamStats[team.id]) {
              teamStats[team.id].group = group.name;
            }
          });
        }
      });
    }

    if (currentData.matches && currentData.matches.length > 0) {
      currentData.matches.filter(match => match.status === 'completed').forEach(match => {
        const team1Stats = teamStats[match.team1?.id];
        const team2Stats = teamStats[match.team2?.id];

        if (!team1Stats || !team2Stats) return;

        if (match.draw) {
          team1Stats.points += 1;
          team2Stats.points += 1;
          team1Stats.draws += 1;
          team2Stats.draws += 1;
        } else if (match.winner && match.winner.id == match.team1.id) {
          team1Stats.points += 3;
          team1Stats.wins += 1;
          team2Stats.losses += 1;
        } else if (match.winner && match.winner.id == match.team2.id) {
          team2Stats.points += 3;
          team2Stats.wins += 1;
          team1Stats.losses += 1;
        }
      });
    }

    return Object.values(teamStats)
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return a.losses - b.losses;
      })
      .map((stats, index) => ({
        ...stats,
        position: index + 1
      }));
  };

  const loadData = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Mesclar com dados padrão
        const mergedData = {
          ...initialData,
          ...parsedData
        };
        
        // Recalcular rankings
        mergedData.rankings = calculateRankings(mergedData);
        setData(mergedData);
      } else {
        setData(initialData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
      setData(initialData);
    }
  };

  useEffect(() => {
    // Carregar dados inicialmente
    loadData();
    
    // Polling para atualizações
    const interval = setInterval(loadData, 3000);
    
    // Listener para mudanças entre abas
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