import { Trophy, Medal, Award } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function FinalRanking() {
  const { matches, currentPhase, rankings } = useData();

  // Se não estamos na final ou não há partidas da final, mostrar ranking normal
  if (currentPhase !== 'final') {
    return null;
  }

  const finalMatches = matches.filter(m => m.phaseType === 'final' && m.status === 'completed');
  const finalMatch = finalMatches.find(m => m.phase === 'Final');
  const thirdPlaceMatch = finalMatches.find(m => m.phase === 'Disputa do 3º Lugar');

  // Se as partidas finais não foram concluídas, mostrar ranking normal
  if (!finalMatch || !thirdPlaceMatch) {
    return null;
  }

  const finalRanking = [
    { position: 1, team: finalMatch.winner, points: 'Campeão' },
    { position: 2, team: finalMatch.winner?.id === finalMatch.team1.id ? finalMatch.team2 : finalMatch.team1, points: 'Vice-Campeão' },
    { position: 3, team: thirdPlaceMatch.winner, points: '3º Lugar' },
    { position: 4, team: thirdPlaceMatch.winner?.id === thirdPlaceMatch.team1.id ? thirdPlaceMatch.team2 : thirdPlaceMatch.team1, points: '4º Lugar' }
  ];

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-500">{position}</span>;
    }
  };

  const getPositionBg = (position) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      <div className="px-6 py-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-b border-yellow-200">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Classificação Final da Competição
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
                      {ranking.position}º Lugar - {ranking.team.name}
                    </div>
                    <div className="text-sm text-gray-600">{ranking.points}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{ranking.position}º</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}