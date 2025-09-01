import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { usePersistentStorage } from '../hooks/usePersistentStorage';
import { storageManager } from '../utils/storageManager';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de DataProvider');
  }
  return context;
};

const STORAGE_KEY = 'roborace_data';

const initialData = {
  teams: [],
  groups: [],
  matches: [],
  rankings: [],
  currentPhase: 'groups', // groups, semifinals, final
  phases: {
    groups: { name: 'Fase de Grupos', completed: false },
    semifinals: { name: 'Semifinais', completed: false },
    final: { name: 'Final', completed: false }
  }
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    // Carregar dados imediatamente usando o gerenciador
    return storageManager.loadData(initialData);
  });

  // Usar hook de persistência robusta
  const { validateData } = usePersistentStorage(data, setData, initialData);

  // Salvar dados automaticamente quando mudarem
  useEffect(() => {
    if (data && validateData(data)) {
      storageManager.saveData(data);
    }
  }, [data, validateData]);

  // Geração de ID único
  const generateId = () => {
    return crypto.randomUUID ? crypto.randomUUID() : Date.now() + Math.random();
  };

  // Funções para Teams
  const addTeam = (team) => {
    const newTeam = {
      id: generateId(),
      name: team.name.trim(),
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      teams: [...prev.teams, newTeam]
    }));
    return newTeam;
  };

  const removeTeam = (teamId) => {
    setData(prev => ({
      ...prev,
      teams: prev.teams.filter(team => team.id != teamId),
      groups: prev.groups.map(group => ({
        ...group,
        teams: group.teams.filter(team => team.id != teamId)
      })),
      matches: prev.matches.filter(match => 
        match.team1.id != teamId && match.team2.id != teamId
      )
    }));
  };

  // Funções para Groups
  const addGroup = (group) => {
    const newGroup = {
      id: generateId(),
      name: group.name.trim(),
      teams: [],
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      groups: [...prev.groups, newGroup]
    }));
    return newGroup;
  };

  const removeGroup = (groupId) => {
    setData(prev => ({
      ...prev,
      groups: prev.groups.filter(group => group.id != groupId)
    }));
  };

  const addTeamToGroup = (groupId, teamId) => {
    const team = data.teams.find(t => t.id == teamId);
    if (!team) return;

    setData(prev => ({
      ...prev,
      groups: prev.groups.map(group => {
        if (group.id == groupId && !group.teams.find(t => t.id == teamId)) {
          return { ...group, teams: [...group.teams, team] };
        }
        return group;
      })
    }));
  };

  const removeTeamFromGroup = (groupId, teamId) => {
    setData(prev => ({
      ...prev,
      groups: prev.groups.map(group => {
        if (group.id == groupId) {
          return { ...group, teams: group.teams.filter(t => t.id != teamId) };
        }
        return group;
      })
    }));
  };

  // Funções para Matches
  const addMatch = (match) => {
    const newMatch = {
      id: generateId(),
      team1: match.team1,
      team2: match.team2,
      status: 'pending',
      winner: null,
      draw: false,
      phase: match.phase || 'Fase de Grupos',
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      matches: [...prev.matches, newMatch]
    }));
    return newMatch;
  };

  const updateMatchResult = (matchId, winner, isDraw = false) => {
    setData(prev => {
      const updatedData = {
        ...prev,
        matches: prev.matches.map(match => {
          if (match.id == matchId) {
            return {
              ...match,
              status: 'completed',
              winner: isDraw ? null : winner,
              draw: isDraw,
              completedAt: new Date().toISOString()
            };
          }
          return match;
        })
      };
      
      // Calcular rankings atualizados
      updatedData.rankings = calculateRankings(updatedData);
      
      // Verificar se precisa criar partida de desempate na final
      const completedMatch = updatedData.matches.find(m => m.id == matchId);
      if (completedMatch && completedMatch.phaseType === 'final' && completedMatch.draw) {
        const tiebreakMatch = {
          id: Date.now() + 1000,
          team1: completedMatch.team1,
          team2: completedMatch.team2,
          status: 'pending',
          winner: null,
          draw: false,
          phase: 'Desempate da Final',
          phaseType: 'final',
          createdAt: new Date().toISOString()
        };
        updatedData.matches.push(tiebreakMatch);
      }
      
      return updatedData;
    });
  };

  const resetMatch = (matchId) => {
    setData(prev => {
      const updatedData = {
        ...prev,
        matches: prev.matches.map(match => {
          if (match.id == matchId) {
            return {
              ...match,
              status: 'pending',
              winner: null,
              draw: false,
              completedAt: null
            };
          }
          return match;
        })
      };
      
      // Calcular rankings atualizados
      updatedData.rankings = calculateRankings(updatedData);
      return updatedData;
    });
  };

  // Função para calcular rankings baseado nos resultados das partidas (memoizada)
  const calculateRankings = useMemo(() => (currentData) => {
    const teamStats = {};
    
    // Inicializar stats para todas as equipes
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

    // Encontrar grupo de cada equipe
    currentData.groups.forEach(group => {
      group.teams.forEach(team => {
        if (teamStats[team.id]) {
          teamStats[team.id].group = group.name;
        }
      });
    });

    // Calcular estatísticas baseado apenas nas partidas da fase de grupos
    // Se já chegou na semifinal, não atualizar mais os pontos
    if (currentData.currentPhase === 'groups') {
      currentData.matches
        .filter(match => match.status === 'completed' && match.phaseType === 'groups')
        .forEach(match => {
      const team1Stats = teamStats[match.team1.id];
      const team2Stats = teamStats[match.team2.id];

      if (!team1Stats || !team2Stats) return;

      if (match.draw) {
        team1Stats.points += 1;
        team2Stats.points += 1;
        team1Stats.draws += 1;
        team2Stats.draws += 1;
      } else if (match.winner.id == match.team1.id) {
        team1Stats.points += 3;
        team1Stats.wins += 1;
        team2Stats.losses += 1;
      } else {
        team2Stats.points += 3;
        team2Stats.wins += 1;
        team1Stats.losses += 1;
        }
      });
    }

    // Converter para array e ordenar
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
  }, []);

  // Função para gerar chaves aleatórias
  const generateRandomBrackets = () => {
    if (data.teams.length < 2) return;
    
    const shuffledTeams = [...data.teams].sort(() => Math.random() - 0.5);
    const newMatches = [];
    
    for (let i = 0; i < shuffledTeams.length - 1; i += 2) {
      if (shuffledTeams[i + 1]) {
        newMatches.push({
          id: generateId(),
          team1: shuffledTeams[i],
          team2: shuffledTeams[i + 1],
          status: 'pending',
          winner: null,
          draw: false,
          phase: 'Chave Aleatória',
          phaseType: 'groups',
          createdAt: new Date().toISOString()
        });
      }
    }
    
    setData(prev => ({
      ...prev,
      matches: [...prev.matches, ...newMatches]
    }));
  };

  // Função para gerar chaves por grupo
  const generateGroupBrackets = () => {
    const newMatches = [];
    
    data.groups.forEach(group => {
      if (group.teams.length >= 2) {
        // Gerar todas as combinações possíveis dentro do grupo
        for (let i = 0; i < group.teams.length; i++) {
          for (let j = i + 1; j < group.teams.length; j++) {
            newMatches.push({
              id: generateId(),
              team1: group.teams[i],
              team2: group.teams[j],
              status: 'pending',
              winner: null,
              draw: false,
              phase: group.name,
              phaseType: 'groups',
              createdAt: new Date().toISOString()
            });
          }
        }
      }
    });
    
    setData(prev => ({
      ...prev,
      matches: [...prev.matches, ...newMatches]
    }));
  };

  // Função para avançar para próxima fase
  const advanceToNextPhase = () => {
    const phaseOrder = ['groups', 'semifinals', 'final'];
    const currentIndex = phaseOrder.indexOf(data.currentPhase);
    
    if (currentIndex === -1 || currentIndex === phaseOrder.length - 1) return;
    
    const nextPhase = phaseOrder[currentIndex + 1];
    const qualifiedTeams = getQualifiedTeams();
    
    if (qualifiedTeams.length < 2) return;
    
    const newMatches = generateEliminationMatches(nextPhase, qualifiedTeams);
    
    setData(prev => ({
      ...prev,
      currentPhase: nextPhase,
      phases: {
        ...prev.phases,
        [prev.currentPhase]: { ...prev.phases[prev.currentPhase], completed: true }
      },
      matches: [...prev.matches, ...newMatches]
    }));
  };

  // Função para obter equipes classificadas
  const getQualifiedTeams = () => {
    if (data.currentPhase === 'groups') {
      // Classificar 2 primeiros de cada grupo
      const qualifiedTeams = [];
      
      data.groups.forEach(group => {
        // Calcular ranking específico do grupo
        const groupTeamStats = {};
        
        // Inicializar stats para equipes do grupo
        group.teams.forEach(team => {
          groupTeamStats[team.id] = {
            team,
            points: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            group: group.name
          };
        });
        
        // Calcular estatísticas baseado nas partidas do grupo
        data.matches
          .filter(match => match.status === 'completed' && match.phaseType === 'groups')
          .filter(match => 
            group.teams.some(t => t.id === match.team1.id) && 
            group.teams.some(t => t.id === match.team2.id)
          )
          .forEach(match => {
            const team1Stats = groupTeamStats[match.team1.id];
            const team2Stats = groupTeamStats[match.team2.id];
            
            if (!team1Stats || !team2Stats) return;
            
            if (match.draw) {
              team1Stats.points += 1;
              team2Stats.points += 1;
              team1Stats.draws += 1;
              team2Stats.draws += 1;
            } else if (match.winner.id == match.team1.id) {
              team1Stats.points += 3;
              team1Stats.wins += 1;
              team2Stats.losses += 1;
            } else {
              team2Stats.points += 3;
              team2Stats.wins += 1;
              team1Stats.losses += 1;
            }
          });
        
        // Ordenar e pegar os 2 primeiros do grupo
        const groupRanking = Object.values(groupTeamStats)
          .sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.wins !== a.wins) return b.wins - a.wins;
            return a.losses - b.losses;
          });
        
        // Adicionar os 2 primeiros (se existirem)
        qualifiedTeams.push(...groupRanking.slice(0, 2));
      });
      
      return qualifiedTeams;
    }
    
    // Para outras fases, usar ranking geral
    const currentRankings = calculateRankings(data);
    const phaseTeamCounts = {
      semifinals: 2,
      final: 1
    };
    
    const targetCount = phaseTeamCounts[data.currentPhase] || currentRankings.length;
    return currentRankings.slice(0, Math.min(targetCount, currentRankings.length));
  };



  // Função para distribuir equipes automaticamente em grupos
  const distributeTeamsToGroups = () => {
    if (data.groups.length === 0 || data.teams.length === 0) return 0;
    
    // Embaralhar equipes para distribuição aleatória
    const shuffledTeams = [...data.teams].sort(() => Math.random() - 0.5);
    const availableGroups = [...data.groups];
    
    // Limpar grupos existentes
    const clearedGroups = availableGroups.map(group => ({ ...group, teams: [] }));
    
    // Distribuir equipes igualmente entre os grupos
    shuffledTeams.forEach((team, index) => {
      const groupIndex = index % clearedGroups.length;
      clearedGroups[groupIndex].teams.push(team);
    });
    
    setData(prev => ({
      ...prev,
      groups: clearedGroups
    }));
    
    return shuffledTeams.length;
  };

  // Função para gerar partidas eliminatórias
  const generateEliminationMatches = (phase, teams) => {
    const matches = [];
    let matchId = Date.now();
    
    if (phase === 'semifinals') {
      // Embaralhar as equipes classificadas para criar semifinais
      const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < shuffledTeams.length; i += 2) {
        if (shuffledTeams[i + 1]) {
          matches.push({
            id: matchId++,
            team1: shuffledTeams[i].team,
            team2: shuffledTeams[i + 1].team,
            status: 'pending',
            winner: null,
            draw: false,
            phase: data.phases[phase].name,
            phaseType: phase,
            createdAt: new Date().toISOString()
          });
        }
      }
    } else if (phase === 'final') {
      // Pegar vencedores das semifinais para a final
      const semifinalMatches = data.matches.filter(m => m.phaseType === 'semifinals' && m.status === 'completed');
      const winners = semifinalMatches.map(m => m.winner).filter(Boolean);
      const losers = semifinalMatches.map(m => m.winner?.id === m.team1.id ? m.team2 : m.team1).filter(Boolean);
      
      // Criar final
      if (winners.length >= 2) {
        matches.push({
          id: matchId++,
          team1: winners[0],
          team2: winners[1],
          status: 'pending',
          winner: null,
          draw: false,
          phase: 'Final',
          phaseType: 'final',
          createdAt: new Date().toISOString()
        });
      }
      
      // Criar disputa do 3º lugar
      if (losers.length >= 2) {
        matches.push({
          id: matchId++,
          team1: losers[0],
          team2: losers[1],
          status: 'pending',
          winner: null,
          draw: false,
          phase: 'Disputa do 3º Lugar',
          phaseType: 'final',
          createdAt: new Date().toISOString()
        });
      }
    }
    
    return matches;
  };

  // Função para verificar se fase atual está completa
  const isCurrentPhaseComplete = () => {
    const currentPhaseMatches = data.matches.filter(m => m.phaseType === data.currentPhase);
    return currentPhaseMatches.length > 0 && currentPhaseMatches.every(m => m.status === 'completed');
  };

  // Função para limpar todos os dados
  const clearAllData = () => {
    try {
      setData(initialData);
      storageManager.clearAllData();
      storageManager.saveData(initialData);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  };

  // Função para importar dados
  const importData = (jsonString) => {
    try {
      const result = storageManager.importData(jsonString, initialData);
      
      if (result.success) {
        // Recalcular rankings baseado nas partidas importadas
        result.data.rankings = calculateRankings(result.data);
        setData(result.data);
        return true;
      } else {
        console.error('Erro ao importar:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  };

  const value = {
    // Dados
    teams: data.teams,
    groups: data.groups,
    matches: data.matches,
    rankings: data.rankings,
    
    // Funções Teams
    addTeam,
    removeTeam,
    
    // Funções Groups
    addGroup,
    removeGroup,
    addTeamToGroup,
    removeTeamFromGroup,
    
    // Funções Matches
    addMatch,
    updateMatchResult,
    resetMatch,
    
    // Utilitários
    generateRandomBrackets,
    generateGroupBrackets,
    clearAllData,
    importData,
    exportData: () => storageManager.exportData(),
    getStorageInfo: () => storageManager.getStorageInfo(),
    
    // Sistema de Fases
    currentPhase: data.currentPhase,
    phases: data.phases,
    advanceToNextPhase,
    isCurrentPhaseComplete,
    getQualifiedTeams,
    
    // Distribuição Automática
    distributeTeamsToGroups
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};