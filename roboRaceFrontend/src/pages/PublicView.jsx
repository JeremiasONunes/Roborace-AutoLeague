import { Trophy, Calendar, Users, Clock, Eye, Zap, ChevronRight, CheckCircle, Play, Medal, Award } from 'lucide-react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useMemo } from 'react';

export default function PublicView() {
  const data = useRealTimeData();
  const { teams, matches, rankings, currentPhase, phases } = data;

  const { pendingMatches, completedMatches } = useMemo(() => {
    const pending = matches.filter(m => m.status === 'pending').slice(0, 4);
    const completed = matches.filter(m => m.status === 'completed');
    
    return {
      pendingMatches: pending,
      completedMatches: completed
    };
  }, [matches]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A7D9AE] via-[#B8E0BF] to-[#C9E7D0] relative overflow-x-hidden">
      

      <main className="max-w-7xl mx-auto py-4 px-6">
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[#2DA63F] to-[#41A650] rounded-xl p-2 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white rounded-full p-3">
                  <img src="/logo.png" alt="Roborace Univas" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-1">Roborace Univas</h1>
                  <p className="text-green-100 text-lg">Competição de Robótica em Tempo Real</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm px-6 py- rounded-full">
                  <div className="flex items-center gap-2 text-white">
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold text-lg">{phases?.[currentPhase]?.name || 'Fase de Grupos'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline das Fases - Compacta */}
          {phases && (
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                {['groups', 'round16', 'quarterfinals', 'semifinals', 'final'].map((phase, index, array) => (
                  <div key={phase} className="flex items-center">
                    <div className={`flex items-center gap-2 ${phase === currentPhase ? 'text-[#2DA63F]' : phases[phase]?.completed ? 'text-[#41A650]' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        phases[phase]?.completed ? 'bg-[#41A650]' :
                        phase === currentPhase ? 'bg-[#2DA63F]' : 'bg-gray-200'
                      }`}>
                        {phases[phase]?.completed ? (
                          <CheckCircle className="w-3 h-3 text-white" />
                        ) : phase === currentPhase ? (
                          <Play className="w-3 h-3 text-white" />
                        ) : (
                          <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                        )}
                      </div>
                      <span className="text-xs font-medium">{phases[phase]?.name}</span>
                    </div>
                    {index < array.length - 1 && (
                      <div className={`w-8 h-px mx-2 ${
                        phases[array[index + 1]]?.completed || array[index + 1] === currentPhase ? 'bg-[#2DA63F]' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Layout Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Ranking Completo */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 h-[484px] overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <h2 className="text-lg font-bold text-gray-900">Classificação Geral</h2>
                </div>
                <div className="text-sm text-gray-500">{rankings.length} equipes</div>
              </div>
            
              {rankings.length > 0 ? (
                <div className="overflow-y-auto h-[414px]">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Pos</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Equipe</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Pts</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">V</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">E</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">D</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rankings.map((team) => (
                        <tr key={team.team.id} className={`${
                          team.position === 1 ? 'bg-yellow-50 border-l-2 border-yellow-400' :
                          team.position === 2 ? 'bg-gray-50 border-l-2 border-gray-400' :
                          team.position === 3 ? 'bg-amber-50 border-l-2 border-amber-500' :
                          'bg-white'
                        }`}>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              {team.position === 1 ? <Trophy className="w-4 h-4 text-yellow-600" /> :
                               team.position === 2 ? <Medal className="w-4 h-4 text-gray-500" /> :
                               team.position === 3 ? <Award className="w-4 h-4 text-amber-600" /> :
                               <span className="text-sm font-bold text-gray-600">{team.position}</span>}
                              <span className="text-sm font-medium">{team.position}º</span>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="text-sm font-semibold text-gray-900">{team.team.name}</div>
                            <div className="text-xs text-gray-500">{team.group}</div>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className="inline-flex items-center px-2 py-1 bg-[#2DA63F]/10 rounded text-sm font-bold text-[#2DA63F]">{team.points}</span>
                          </td>
                          <td className="px-3 py-2 text-center text-sm font-semibold text-[#41A650]">{team.wins}</td>
                          <td className="px-3 py-2 text-center text-sm font-semibold text-gray-600">{team.draws}</td>
                          <td className="px-3 py-2 text-center text-sm font-semibold text-red-500">{team.losses}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">Nenhum ranking disponível</div>
              )}
            </div>
            
            {/* Coluna Lateral */}
            <div className="space-y-4">
              {/* Próximas Partidas */}
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 h-48">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-[#2DA63F]" />
                  <h2 className="text-lg font-bold text-gray-900">Próximas Partidas</h2>
                </div>
                <div className="space-y-3 max-h-32 overflow-y-auto">
                  {pendingMatches.slice(0, 1).map((match) => (
                    <div key={match.id} className="bg-gray-50 border-l-2 border-[#2DA63F] rounded p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">{match.phase}</span>
                        <div className="flex items-center gap-1 text-xs text-yellow-700">
                          <Clock className="w-3 h-3" />
                          Aguardando
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold">{match.team1.name}</div>
                        <div className="text-xs text-[#2DA63F] font-bold my-1">VS</div>
                        <div className="text-sm font-bold">{match.team2.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Pódio */}
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <h2 className="text-lg font-bold text-gray-900">Pódio</h2>
                </div>
                <div className="space-y-2">
                  {rankings.slice(0, 3).map((team) => (
                    <div key={team.team.id} className={`p-2 rounded-lg border-l-2 ${
                      team.position === 1 ? 'bg-yellow-50 border-yellow-400' :
                      team.position === 2 ? 'bg-gray-50 border-gray-400' :
                      'bg-amber-50 border-amber-500'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            team.position === 1 ? 'bg-yellow-500' :
                            team.position === 2 ? 'bg-gray-400' :
                            'bg-amber-600'
                          }`}>
                            {team.position}
                          </div>
                          <div>
                            <div className="font-bold text-sm">{team.team.name}</div>
                            <div className="text-xs text-gray-500">{team.group}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#2DA63F]">{team.points}</div>
                          <div className="text-xs text-gray-500">{team.wins}V {team.draws}E {team.losses}D</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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