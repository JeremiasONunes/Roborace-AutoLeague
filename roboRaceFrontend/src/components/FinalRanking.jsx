import { Trophy, Medal, Award } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function FinalRanking() {
  const { matches, currentPhase, _rankings } = useData();

  // Mostrar apenas quando todas as partidas eliminatórias estiverem concluídas
  if (currentPhase === 'groups') return null;

  const finalMatches = matches.filter(m => m.phaseType === 'final' && m.status === 'completed');
  const semifinalMatches = matches.filter(m => m.phaseType === 'semifinals' && m.status === 'completed');
  const finalMatch = finalMatches.find(m => m.phase === 'Final');
  const thirdPlaceMatch = finalMatches.find(m => m.phase === 'Disputa do 3º Lugar');

  // Se ainda não temos todas as partidas eliminatórias, não mostrar
  if (currentPhase === 'semifinals' && semifinalMatches.length < 2) return null;
  if (currentPhase === 'final' && (!finalMatch || !thirdPlaceMatch)) return null;

  let finalRanking = [];

  if (currentPhase === 'final' && finalMatch && thirdPlaceMatch) {
    // Classificação final completa - apenas top 3
    finalRanking = [
      { position: 1, team: finalMatch.winner, status: 'Campeão' },
      { position: 2, team: finalMatch.winner?.id === finalMatch.team1.id ? finalMatch.team2 : finalMatch.team1, status: 'Vice-Campeão' },
      { position: 3, team: thirdPlaceMatch.winner, status: '3º Lugar' }
    ];
  } else if (currentPhase === 'semifinals' && semifinalMatches.length === 2) {
    // Classificados para a final - apenas finalistas
    const winners = semifinalMatches.map(m => m.winner).filter(Boolean);
    
    finalRanking = [
      ...winners.map((team, index) => ({ position: index + 1, team, status: 'Classificado para Final' }))
    ];
  }

  if (finalRanking.length === 0) return null;

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-600" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-500">{position}</span>;
    }
  };

  const getPositionBg = (position) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-500';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-400';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      <div className="px-6 py-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-b border-yellow-200">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          {currentPhase === 'final' ? 'Classificação Final da Competição' : 'Classificados - Mata-Mata'}
        </h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {finalRanking.map((ranking) => (
            <div key={ranking.position} className={`${getPositionBg(ranking.position)} border-l-4 rounded-lg p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getPositionIcon(ranking.position)}
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {ranking.position}º - {ranking.team.name}
                    </div>
                    <div className="text-sm text-gray-600">{ranking.status}</div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}