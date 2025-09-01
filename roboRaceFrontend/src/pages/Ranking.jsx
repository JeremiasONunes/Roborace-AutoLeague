import { Trophy, Medal, Award } from 'lucide-react';
import { useData } from '../context/DataContext';
import FinalRanking from '../components/FinalRanking';

export default function Ranking() {
  const { rankings, matches } = useData();

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">{position}</span>;
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

  const totalMatches = matches.reduce((acc, match) => {
    if (match.status === 'completed') {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Ranking</h1>
        <span className="text-sm text-gray-500">Atualizado em tempo real</span>
      </div>

      <FinalRanking />
      
      {rankings.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Classificação Geral</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grupo
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pontos
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      V
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      E
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      D
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rankings.map((ranking) => (
                    <tr key={ranking.team.id} className={`${getPositionBg(ranking.position)} border-l-4`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {getPositionIcon(ranking.position)}
                          <span className="text-sm font-medium text-gray-900">
                            {ranking.position}º
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {ranking.team.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-[#A7D9AE] text-[#2DA63F] rounded-full">
                          {ranking.group}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-lg font-bold text-[#2DA63F]">
                          {ranking.points}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-medium text-[#41A650]">
                          {ranking.wins}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-medium text-gray-600">
                          {ranking.draws}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-medium text-red-600">
                          {ranking.losses}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-semibold">Líder</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">{rankings[0]?.team.name || 'N/A'}</p>
              <p className="text-sm text-gray-500">{rankings[0]?.points || 0} pontos</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-6 h-6 text-[#2DA63F]" />
                <h3 className="text-lg font-semibold">Total de Partidas</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalMatches}</p>
              <p className="text-sm text-gray-500">Jogos realizados</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <Medal className="w-6 h-6 text-[#41A650]" />
                <h3 className="text-lg font-semibold">Sistema de Pontos</h3>
              </div>
              <div className="text-sm space-y-1">
                <div className="font-medium text-gray-700 mb-1">Fase de Grupos:</div>
                <div>Vitória: <span className="font-semibold text-[#2DA63F]">3 pontos</span></div>
                <div>Empate: <span className="font-semibold text-[#75BF80]">1 ponto</span></div>
                <div>Derrota: <span className="font-semibold">0 pontos</span></div>
                <div className="font-medium text-gray-700 mt-2 mb-1">Eliminatórias:</div>
                <div className="text-xs text-gray-600">Ganhou = Classificou</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum ranking disponível</h3>
          <p className="text-gray-500">Cadastre equipes e realize partidas para ver o ranking</p>
        </div>
      )}
    </div>
  );
}