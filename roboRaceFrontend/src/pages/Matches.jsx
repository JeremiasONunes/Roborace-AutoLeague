import { useState } from 'react';
import { Play, Trophy, Clock, Plus, ChevronRight, CheckCircle, Users } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Matches() {
  const { 
    matches, 
    teams, 
    updateMatchResult, 
    resetMatch, 
    addMatch, 
    currentPhase, 
    phases,
    advanceToNextPhase,
    isCurrentPhaseComplete,
    getQualifiedTeams,
    rankings
  } = useData();
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [newMatch, setNewMatch] = useState({ team1Id: '', team2Id: '', phase: 'Fase de Grupos' });

  const handleUpdateMatchResult = (matchId, winner, isDraw = false) => {
    updateMatchResult(matchId, winner, isDraw);
  };

  const handleResetMatch = (matchId) => {
    resetMatch(matchId);
  };

  const handleAddMatch = () => {
    if (newMatch.team1Id && newMatch.team2Id && newMatch.team1Id !== newMatch.team2Id) {
      const team1 = teams.find(t => t.id === parseInt(newMatch.team1Id));
      const team2 = teams.find(t => t.id === parseInt(newMatch.team2Id));
      
      addMatch({
        team1,
        team2,
        phase: newMatch.phase
      });
      
      setNewMatch({ team1Id: '', team2Id: '', phase: 'Fase de Grupos' });
      setShowAddMatch(false);
    }
  };

  const getStatusBadge = (match) => {
    if (match.status === 'pending') {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Pendente
      </span>;
    }
    if (match.draw) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Empate</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
      <Trophy className="w-3 h-3" />
      Finalizada
    </span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Partidas</h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-4 text-sm text-gray-500">
            <span>{matches.filter(m => m.status === 'pending').length} pendentes</span>
            <span>{matches.filter(m => m.status === 'completed').length} finalizadas</span>
          </div>
          {teams.length >= 2 && (
            <button
              onClick={() => setShowAddMatch(!showAddMatch)}
              className="px-4 py-2 bg-[#2DA63F] text-white rounded-md hover:bg-[#41A650] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nova Partida
            </button>
          )}
        </div>
      </div>

      {showAddMatch && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Criar Nova Partida</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={newMatch.team1Id}
              onChange={(e) => setNewMatch(prev => ({ ...prev, team1Id: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione Equipe 1</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <select
              value={newMatch.team2Id}
              onChange={(e) => setNewMatch(prev => ({ ...prev, team2Id: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione Equipe 2</option>
              {teams.filter(team => team.id !== parseInt(newMatch.team1Id)).map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Fase (ex: Grupo A)"
              value={newMatch.phase}
              onChange={(e) => setNewMatch(prev => ({ ...prev, phase: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleAddMatch}
              disabled={!newMatch.team1Id || !newMatch.team2Id || newMatch.team1Id === newMatch.team2Id}
              className="px-4 py-2 bg-[#41A650] text-white rounded-md hover:bg-[#2DA63F] disabled:bg-gray-400"
            >
              Criar Partida
            </button>
          </div>
        </div>
      )}

      {/* Informações da Fase Atual e Controle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <Play className="w-6 h-6 text-[#2DA63F]" />
            <h3 className="text-lg font-semibold">Fase Atual</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{phases[currentPhase].name}</p>
          <p className="text-sm text-gray-500">
            {matches.filter(m => m.phaseType === currentPhase && m.status === 'completed').length} de {matches.filter(m => m.phaseType === currentPhase).length} partidas
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-[#41A650]" />
            <h3 className="text-lg font-semibold">Equipes Classificadas</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{getQualifiedTeams().length}</p>
          <p className="text-sm text-gray-500">Para próxima fase</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-semibold">Líder Geral</h3>
          </div>
          <p className="text-lg font-bold text-gray-900">{rankings[0]?.team.name || 'N/A'}</p>
          <p className="text-sm text-gray-500">{rankings[0]?.points || 0} pontos</p>
        </div>
      </div>

      {/* Botão para Avançar Fase */}
      {isCurrentPhaseComplete() && currentPhase !== 'final' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                Fase {phases[currentPhase].name} Concluída!
              </h3>
              <p className="text-green-700 mt-1">
                Todas as partidas foram finalizadas. Você pode avançar para a próxima fase.
              </p>
            </div>
            <button
              onClick={() => {
                const phaseOrder = ['groups', 'round16', 'quarterfinals', 'semifinals', 'final'];
                const currentPhaseIndex = phaseOrder.indexOf(currentPhase);
                if (confirm(`Avançar para ${phases[phaseOrder[currentPhaseIndex + 1]].name}? Isso criará as partidas eliminatórias.`)) {
                  advanceToNextPhase();
                }
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4" />
              Avançar Fase
            </button>
          </div>
        </div>
      )}

      {/* Filtros por Fase */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filtrar por Fase:</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(phases).map(([key, phase]) => {
            const phaseMatches = matches.filter(m => m.phaseType === key);
            if (phaseMatches.length === 0) return null;
            
            return (
              <span key={key} className={`px-3 py-1 rounded-full text-xs font-medium ${
                key === currentPhase ? 'bg-[#A7D9AE] text-[#2DA63F]' : 'bg-gray-100 text-gray-600'
              }`}>
                {phase.name} ({phaseMatches.length})
              </span>
            );
          })}
        </div>
      </div>

      {/* Pódio Geral */}
      {rankings.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Pódio Geral</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rankings.slice(0, 3).map((team, index) => (
                <div key={team.team.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-amber-600' : 'bg-[#2DA63F]'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{team.team.name}</div>
                    <div className="text-sm text-gray-500">{team.points} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {matches
          .sort((a, b) => {
            // Primeiro: partidas pendentes
            if (a.status === 'pending' && b.status === 'completed') return -1;
            if (a.status === 'completed' && b.status === 'pending') return 1;
            
            // Dentro do mesmo status: ordem cronológica
            if (a.status === 'pending' && b.status === 'pending') {
              return new Date(a.createdAt) - new Date(b.createdAt);
            }
            
            // Partidas finalizadas: mais recentes primeiro
            if (a.status === 'completed' && b.status === 'completed') {
              return new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt);
            }
            
            return 0;
          })
          .map((match) => (
          <div key={match.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">{match.phase}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  match.phaseType === currentPhase ? 'bg-[#A7D9AE] text-[#2DA63F]' : 'bg-gray-100 text-gray-600'
                }`}>
                  {phases[match.phaseType]?.name || 'Fase Personalizada'}
                </span>
                {getStatusBadge(match)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 text-center">
                <h3 className="text-lg font-semibold">{match.team1.name}</h3>
              </div>
              
              <div className="px-8 py-4">
                <div className="text-2xl font-bold text-gray-400">VS</div>
              </div>
              
              <div className="flex-1 text-center">
                <h3 className="text-lg font-semibold">{match.team2.name}</h3>
              </div>
            </div>

            {match.status === 'completed' && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                {match.draw ? (
                  <span className="text-gray-600 font-medium">Resultado: Empate</span>
                ) : (
                  <span className="text-green-600 font-medium">
                    Vencedor: {match.winner.name}
                  </span>
                )}
              </div>
            )}

            {match.status === 'pending' && (
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => handleUpdateMatchResult(match.id, match.team1)}
                  className="px-4 py-2 bg-[#2DA63F] text-white rounded-md hover:bg-[#41A650] flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  {match.team1.name} Venceu
                </button>
                <button
                  onClick={() => handleUpdateMatchResult(match.id, null, true)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Empate
                </button>
                <button
                  onClick={() => handleUpdateMatchResult(match.id, match.team2)}
                  className="px-4 py-2 bg-[#2DA63F] text-white rounded-md hover:bg-[#41A650] flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  {match.team2.name} Venceu
                </button>
              </div>
            )}

            {match.status === 'completed' && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => handleResetMatch(match.id)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                >
                  Resetar Resultado
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {matches.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma partida criada</h3>
          <p className="text-gray-500">Crie partidas manualmente ou elas serão geradas automaticamente com base nos grupos</p>
        </div>
      )}
    </div>
  );
}