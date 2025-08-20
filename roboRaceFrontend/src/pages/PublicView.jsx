import { Trophy, Calendar, Users, Clock, Eye, Zap, ChevronRight, CheckCircle, Play } from 'lucide-react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useMemo } from 'react';

export default function PublicView() {
  const data = useRealTimeData();
  const { teams, matches, rankings, currentPhase, phases } = data;

  const { pendingMatches, completedMatches, topTeams } = useMemo(() => {
    const pending = matches.filter(m => m.status === 'pending').slice(0, 4);
    const completed = matches.filter(m => m.status === 'completed');
    const top = rankings.slice(0, 5);
    
    return {
      pendingMatches: pending,
      completedMatches: completed,
      topTeams: top
    };
  }, [matches, rankings]);

  return (
    <div className="min-h-screen bg-[#A7D9AE]">
      

      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-10">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24">
                <img src="/logo.png" alt="Roborace Univas" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 text-center -ml-24">
                <div className="inline-flex items-center gap-2 bg-[#2DA63F]/10 text-[#2DA63F] px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Zap className="w-4 h-4" />
                  {phases?.[currentPhase]?.name || 'Fase de Grupos'}
                </div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-3">Roborace Univas</h1>
                <p className="text-gray-500">Competição de Robótica em Tempo Real</p>
              </div>
            </div>
          </div>

          {/* Timeline das Fases */}
          {phases && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-lg font-medium mb-8 text-center text-gray-900">Progresso da Competição</h2>
              <div className="flex items-center justify-between overflow-x-auto pb-4">
                {['groups', 'round16', 'quarterfinals', 'semifinals', 'final'].map((phase, index, array) => (
                  <div key={phase} className="flex items-center min-w-0">
                    <div className={`flex flex-col items-center ${phase === currentPhase ? 'text-[#2DA63F]' : phases[phase]?.completed ? 'text-[#41A650]' : 'text-gray-400'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                        phases[phase]?.completed ? 'bg-[#41A650]' :
                        phase === currentPhase ? 'bg-[#2DA63F]' : 'bg-gray-200'
                      }`}>
                        {phases[phase]?.completed ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : phase === currentPhase ? (
                          <Play className="w-5 h-5 text-white" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-center mb-1">{phases[phase]?.name}</span>
                      <span className="text-xs text-gray-500">
                        {phases[phase]?.completed ? 'Concluída' : phase === currentPhase ? 'Atual' : 'Aguardando'}
                      </span>
                    </div>
                    {index < array.length - 1 && (
                      <div className={`flex-1 h-px mx-4 ${
                        phases[array[index + 1]]?.completed || array[index + 1] === currentPhase ? 'bg-[#2DA63F]' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-bold">Ranking Atual</h2>
                </div>
                <div className="space-y-4">
                  {topTeams.length > 0 ? topTeams.map((team) => (
                    <div key={team.team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          team.position === 1 ? 'bg-yellow-500' :
                          team.position === 2 ? 'bg-gray-400' :
                          team.position === 3 ? 'bg-amber-600' : 'bg-gray-500'
                        }`}>
                          {team.position}
                        </div>
                        <span className="font-medium">{team.team.name}</span>
                      </div>
                      <span className="text-lg font-bold text-[#2DA63F]">{team.points}pts</span>
                    </div>
                  )) : (
                    <div className="text-center text-gray-500 py-8">
                      Nenhum ranking disponível
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-6 h-6 text-[#2DA63F]" />
                  <h2 className="text-xl font-bold">Próximas Partidas - {phases?.[currentPhase]?.name}</h2>
                </div>
                <div className="space-y-4">
                  {pendingMatches.length > 0 ? pendingMatches.map((match) => (
                    <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-purple-600">{match.phase}</span>
                          {match.phaseType && (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              match.phaseType === currentPhase ? 'bg-[#A7D9AE] text-[#2DA63F]' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {phases?.[match.phaseType]?.name || 'Personalizada'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          Aguardando
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-center flex-1">
                          <div className="font-semibold text-lg">{match.team1.name}</div>
                        </div>
                        <div className="px-4">
                          <div className="text-2xl font-bold text-gray-400">VS</div>
                        </div>
                        <div className="text-center flex-1">
                          <div className="font-semibold text-lg">{match.team2.name}</div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center text-gray-500 py-8">
                      Nenhuma partida pendente na fase atual
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-6 h-6 text-[#41A650]" />
              <h2 className="text-xl font-bold">Resultados Recentes</h2>
            </div>
            
            <div className="space-y-4">
              {completedMatches.slice(-8).reverse().map((match) => (
                <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-purple-600">{match.phase}</span>
                      {match.phaseType && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          match.phaseType === 'final' ? 'bg-yellow-100 text-yellow-800' :
                          match.phaseType === 'semifinals' ? 'bg-orange-100 text-orange-800' :
                          match.phaseType === 'quarterfinals' ? 'bg-red-100 text-red-800' :
                          match.phaseType === 'round16' ? 'bg-purple-100 text-purple-800' :
                          'bg-[#A7D9AE] text-[#2DA63F]'
                        }`}>
                          {phases?.[match.phaseType]?.name || 'Personalizada'}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">Finalizada</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`text-center flex-1 p-2 rounded ${
                      match.winner?.id === match.team1.id ? 'bg-[#A7D9AE] text-[#2DA63F] font-bold' : ''
                    }`}>
                      {match.team1.name}
                    </div>
                    <div className="px-4 text-gray-400 font-bold">VS</div>
                    <div className={`text-center flex-1 p-2 rounded ${
                      match.winner?.id === match.team2.id ? 'bg-[#A7D9AE] text-[#2DA63F] font-bold' : ''
                    }`}>
                      {match.team2.name}
                    </div>
                  </div>
                  <div className="mt-2 text-center text-sm">
                    {match.draw ? (
                      <span className="text-gray-600">Empate</span>
                    ) : (
                      <span className="text-[#2DA63F] font-medium">
                        Vencedor: {match.winner?.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {completedMatches.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Nenhuma partida finalizada ainda
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-[#2DA63F]">{teams.length}</div>
              <div className="text-sm text-gray-500">Equipes</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-[#41A650]">{matches.length}</div>
              <div className="text-sm text-gray-500">Partidas</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-[#75BF80]">{completedMatches.length}</div>
              <div className="text-sm text-gray-500">Finalizadas</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-[#A7D9AE]">{pendingMatches.length}</div>
              <div className="text-sm text-gray-500">Restantes</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-lg font-bold text-[#2DA63F]">{phases?.[currentPhase]?.name || 'Grupos'}</div>
              <div className="text-sm text-gray-500">Fase Atual</div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Créditos */}
      <footer className="bg-white border-t border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500">
            Desenvolvido por <span className="font-semibold text-gray-700">Jeremias O Nunes</span>
          </p>
        </div>
      </footer>
    </div>
  );
}