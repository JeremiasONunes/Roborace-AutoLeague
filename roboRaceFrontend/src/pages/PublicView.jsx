import { Trophy, Calendar, Users, Clock, Eye, Zap, ChevronRight, CheckCircle, Play, Medal, Award, User, Phone, Github } from 'lucide-react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useMemo } from 'react';

export default function PublicView() {
  const data = useRealTimeData();
  const { _teams, matches, rankings, currentPhase, phases } = data;

  const { pendingMatches, _completedMatches, displayRankings } = useMemo(() => {
    const pending = matches.filter(m => m.status === 'pending').slice(0, 4);
    const completed = matches.filter(m => m.status === 'completed');
    
    // Lógica de ranking para mata-mata
    let displayRankings = rankings;
    
    if (currentPhase !== 'groups') {
      const finalMatches = matches.filter(m => m.phaseType === 'final' && m.status === 'completed');
      const semifinalMatches = matches.filter(m => m.phaseType === 'semifinals' && m.status === 'completed');
      const finalMatch = finalMatches.find(m => m.phase === 'Final');
      const thirdPlaceMatch = finalMatches.find(m => m.phase === 'Disputa do 3º Lugar');
      
      if (currentPhase === 'final' && finalMatch && thirdPlaceMatch) {
        // Classificação final completa
        displayRankings = [
          { position: 1, team: finalMatch.winner, points: 'Campeão', wins: 0, draws: 0, losses: 0, group: 'Final' },
          { position: 2, team: finalMatch.winner?.id === finalMatch.team1.id ? finalMatch.team2 : finalMatch.team1, points: 'Vice', wins: 0, draws: 0, losses: 0, group: 'Final' },
          { position: 3, team: thirdPlaceMatch.winner, points: '3º', wins: 0, draws: 0, losses: 0, group: '3º Lugar' },
          { position: 4, team: thirdPlaceMatch.winner?.id === thirdPlaceMatch.team1.id ? thirdPlaceMatch.team2 : thirdPlaceMatch.team1, points: '4º', wins: 0, draws: 0, losses: 0, group: '4º Lugar' }
        ];
      } else if (currentPhase === 'semifinals' && semifinalMatches.length === 2) {
        // Classificados para a final
        const winners = semifinalMatches.map(m => m.winner).filter(Boolean);
        const losers = semifinalMatches.map(m => m.winner?.id === m.team1.id ? m.team2 : m.team1).filter(Boolean);
        
        displayRankings = [
          ...winners.map((team, index) => ({ position: index + 1, team, points: 'Final', wins: 0, draws: 0, losses: 0, group: 'Finalista' })),
          ...losers.map((team, index) => ({ position: index + 3, team, points: '3º', wins: 0, draws: 0, losses: 0, group: 'Disputa 3º' }))
        ];
      }
    }
    
    return {
      pendingMatches: pending,
      completedMatches: completed,
      displayRankings
    };
  }, [matches, rankings, currentPhase]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B3E5FC] via-[#81D4FA] to-[#4FC3F7] relative">
      

      <main className="max-w-7xl mx-auto py-4 px-6 ">
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[#40BBD9] to-[#43CAD9] rounded-xl p-2 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-40 h-40 bg-white rounded-full p-6 flex-shrink-0">
                  <img src="/publicLogo.png" alt="Roborace Univas" className="w-full h-full object-contain" />
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
                {['groups', 'semifinals', 'final'].map((phase, index, array) => (
                  <div key={phase} className="flex items-center">
                    <div className={`flex items-center gap-2 ${phase === currentPhase ? 'text-[#40BBD9]' : phases[phase]?.completed ? 'text-[#43CAD9]' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        phases[phase]?.completed ? 'bg-[#43CAD9]' :
                        phase === currentPhase ? 'bg-[#40BBD9]' : 'bg-gray-200'
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
                        phases[array[index + 1]]?.completed || array[index + 1] === currentPhase ? 'bg-[#40BBD9]' : 'bg-gray-200'
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
                <div className="text-sm text-gray-500">{displayRankings.length} equipes</div>
              </div>
            
              {displayRankings.length > 0 ? (
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
                      {displayRankings.map((team) => (
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
                               <span className="text-sm font-bold text-gray-600">{team.position}º</span>}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="text-sm font-semibold text-gray-900">{team.team.name}</div>
                            <div className="text-xs text-gray-500">{team.group}</div>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className="inline-flex items-center px-2 py-1 bg-[#40BBD9]/10 rounded text-sm font-bold text-[#40BBD9]">{team.points}</span>
                          </td>
                          <td className="px-3 py-2 text-center text-sm font-semibold text-[#43CAD9]">{team.wins}</td>
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
                  <Calendar className="w-5 h-5 text-[#40BBD9]" />
                  <h2 className="text-lg font-bold text-gray-900">Próximas Partidas</h2>
                </div>
                <div className="space-y-3 max-h-32 overflow-y-auto">
                  {pendingMatches.slice(0, 1).map((match) => (
                    <div key={match.id} className="bg-gray-50 border-l-2 border-[#40BBD9] rounded p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">{match.phase}</span>
                        <div className="flex items-center gap-1 text-xs text-yellow-700">
                          <Clock className="w-3 h-3" />
                          Aguardando
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold">{match.team1.name}</div>
                        <div className="text-xs text-[#40BBD9] font-bold my-1">VS</div>
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
                  {displayRankings.slice(0, 3).map((team) => (
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
                          <div className="text-lg font-bold text-[#40BBD9]">{team.points}</div>
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
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2 text-black text-2xl">
              <User className="w-8 h-8" />
              <span>Desenvolvido por <span className="font-semibold text-gray-700">Jeremias O Nunes</span></span>
            </div>
            <div className="flex items-center gap-2 text-black text-2xl">
              <Phone className="w-8 h-8" />
              <span className="font-medium">(35) 9 9850-0813</span>
            </div>
            <div className="flex items-center gap-2 text-black text-2xl">
              <Github className="w-8 h-8" />
              <span className="font-medium">jeremiasoNunes</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}