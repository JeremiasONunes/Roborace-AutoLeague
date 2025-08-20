import { useState } from 'react';
import { Plus, Users, Trash2, Zap } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Groups() {
  const { teams, groups, addGroup, removeGroup, addTeamToGroup, removeTeamFromGroup, generateGroupBrackets } = useData();
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      addGroup({ name: newGroupName });
      setNewGroupName('');
    }
  };

  const handleAddTeamToGroup = (groupId, teamId) => {
    addTeamToGroup(groupId, parseInt(teamId));
  };

  const handleRemoveTeamFromGroup = (groupId, teamId) => {
    removeTeamFromGroup(groupId, teamId);
  };

  const handleDeleteGroup = (groupId) => {
    removeGroup(groupId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Grupos</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{groups.length} grupos criados</span>
          {groups.length > 0 && groups.some(g => g.teams.length >= 2) && (
            <button
              onClick={() => {
                if (confirm('Gerar partidas para todos os grupos? Isso criará jogos entre todas as equipes de cada grupo.')) {
                  generateGroupBrackets();
                }
              }}
              className="px-4 py-2 bg-[#41A650] text-white rounded-md hover:bg-[#2DA63F] flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Gerar Chaves dos Grupos
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Criar Novo Grupo</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Nome do grupo"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateGroup()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2DA63F]"
          />
          <button
            onClick={handleCreateGroup}
            className="px-4 py-2 bg-[#2DA63F] text-white rounded-md hover:bg-[#41A650] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Criar Grupo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{group.name}</h3>
              <button
                onClick={() => handleDeleteGroup(group.id)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">{group.teams.length} equipes</span>
              </div>
              
              <div className="space-y-2 mb-4">
                {group.teams.map((team) => (
                  <div key={team.id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                    <span className="text-sm">{team.name}</span>
                    <button
                      onClick={() => handleRemoveTeamFromGroup(group.id, team.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddTeamToGroup(group.id, e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Adicionar equipe...</option>
                {teams
                  .filter(team => {
                    // Não mostrar equipes já no grupo atual
                    if (group.teams.find(t => t.id === team.id)) return false;
                    // Não mostrar equipes já em outros grupos
                    return !groups.some(g => g.id !== group.id && g.teams.find(t => t.id === team.id));
                  })
                  .map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum grupo criado</h3>
          <p className="text-gray-500">Crie grupos para organizar as equipes ou deixe vazio para gerar chaves automáticas</p>
        </div>
      )}
    </div>
  );
}