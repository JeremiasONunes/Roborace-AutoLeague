import { useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Teams() {
  const { teams, addTeam, removeTeam } = useData();
  const [newTeamName, setNewTeamName] = useState('');

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      addTeam({ name: newTeamName });
      setNewTeamName('');
    }
  };

  const handleRemoveTeam = (id) => {
    removeTeam(id);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Equipes</h1>
        <p className="text-gray-500 text-sm">{teams.length} equipes cadastradas</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-medium mb-6 text-gray-900">Nova Equipe</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Nome da equipe"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTeam()}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2DA63F]/20 focus:border-[#2DA63F] transition-all duration-200 bg-gray-50/50"
          />
          <button
            onClick={handleAddTeam}
            className="px-5 py-3 bg-[#2DA63F] text-white rounded-xl hover:bg-[#41A650] flex items-center gap-2 transition-all duration-200 font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Equipes Cadastradas</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {teams.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Nenhuma equipe cadastrada ainda</p>
            </div>
          ) : (
            teams.map((team) => (
              <div key={team.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
                <span className="font-medium text-gray-900">{team.name}</span>
                <button
                  onClick={() => handleRemoveTeam(team.id)}
                  className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}