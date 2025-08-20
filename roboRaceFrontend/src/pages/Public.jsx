import { Trophy, Calendar, Users, Clock } from 'lucide-react';

export default function Public() {
  const upcomingMatches = [
    {
      id: 1,
      team1: 'Robô Alpha',
      team2: 'Tech Warriors',
      time: '14:30',
      phase: 'Semifinal'
    },
    {
      id: 2,
      team1: 'Cyber Bots',
      team2: 'Iron Eagles',
      time: '15:00',
      phase: 'Semifinal'
    }
  ];

  const topTeams = [
    { position: 1, name: 'Cyber Bots', points: 9 },
    { position: 2, name: 'Robô Alpha', points: 6 },
    { position: 3, name: 'Tech Warriors', points: 3 }
  ];

  const brackets = [
    {
      round: 'Quartas de Final',
      matches: [
        { team1: 'Cyber Bots', team2: 'Iron Eagles', winner: 'Cyber Bots' },
        { team1: 'Robô Alpha', team2: 'Tech Warriors', winner: 'Robô Alpha' }
      ]
    },
    {
      round: 'Semifinal',
      matches: [
        { team1: 'Cyber Bots', team2: 'Robô Alpha', winner: null }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-2">RoboRace 2024</h1>
        <p className="text-xl opacity-90">Competição de Robótica - Ao Vivo</p>
        <div className="mt-4 flex justify-center items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm">Transmissão ao vivo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ranking ao vivo */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold">Ranking Atual</h2>
            </div>
            <div className="space-y-4">
              {topTeams.map((team) => (
                <div key={team.position} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      team.position === 1 ? 'bg-yellow-500' :
                      team.position === 2 ? 'bg-gray-400' :
                      'bg-amber-600'
                    }`}>
                      {team.position}
                    </div>
                    <span className="font-medium">{team.name}</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{team.points}pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Próximas partidas */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold">Próximas Partidas</h2>
            </div>
            <div className="space-y-4">
              {upcomingMatches.map((match) => (
                <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-purple-600">{match.phase}</span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {match.time}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <div className="font-semibold text-lg">{match.team1}</div>
                    </div>
                    <div className="px-4">
                      <div className="text-2xl font-bold text-gray-400">VS</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="font-semibold text-lg">{match.team2}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chaves da competição */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-bold">Chaves da Competição</h2>
        </div>
        
        <div className="space-y-8">
          {brackets.map((round, roundIndex) => (
            <div key={roundIndex}>
              <h3 className="text-lg font-semibold mb-4 text-center">{round.round}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {round.matches.map((match, matchIndex) => (
                  <div key={matchIndex} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className={`text-center flex-1 p-2 rounded ${
                        match.winner === match.team1 ? 'bg-green-100 text-green-800 font-bold' : ''
                      }`}>
                        {match.team1}
                      </div>
                      <div className="px-4 text-gray-400 font-bold">VS</div>
                      <div className={`text-center flex-1 p-2 rounded ${
                        match.winner === match.team2 ? 'bg-green-100 text-green-800 font-bold' : ''
                      }`}>
                        {match.team2}
                      </div>
                    </div>
                    {match.winner && (
                      <div className="mt-2 text-center text-sm text-green-600 font-medium">
                        Vencedor: {match.winner}
                      </div>
                    )}
                    {!match.winner && (
                      <div className="mt-2 text-center text-sm text-gray-500">
                        Aguardando resultado
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estatísticas da competição */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">8</div>
          <div className="text-sm text-gray-500">Equipes</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">12</div>
          <div className="text-sm text-gray-500">Partidas</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">8</div>
          <div className="text-sm text-gray-500">Finalizadas</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">4</div>
          <div className="text-sm text-gray-500">Restantes</div>
        </div>
      </div>
    </div>
  );
}