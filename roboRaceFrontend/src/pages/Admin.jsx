import { Trash2, Download, Upload, AlertTriangle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useState } from 'react';
import StorageInfo from '../components/StorageInfo';

export default function Admin() {
  const {
    teams,
    groups, 
    matches,
    _rankings,
    currentPhase,
    phases,
    clearAllData,
    advanceToNextPhase,
    isCurrentPhaseComplete,
    importData,
    exportData
  } = useData();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearData = () => {
    clearAllData();
    setShowConfirm(false);
  };

  const handleExportData = () => {
    const dataString = exportData();
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roborace-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const success = importData(e.target.result);
          
          if (success) {
            alert('Dados importados com sucesso!');
          } else {
            alert('Erro ao importar dados. Verifique se o arquivo está no formato correto.');
          }
        } catch {
          alert('Erro ao ler o arquivo. Verifique se é um arquivo JSON válido.');
        }
      };
      reader.readAsText(file);
    }
    // Limpar o input para permitir reimportar o mesmo arquivo
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Administração</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Equipes</h3>
          <p className="text-3xl font-bold text-[#40BBD9]">{teams.length}</p>
          <p className="text-sm text-gray-500">Total cadastradas</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Grupos</h3>
          <p className="text-3xl font-bold text-[#43CAD9]">{groups.length}</p>
          <p className="text-sm text-gray-500">Total criados</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Partidas</h3>
          <p className="text-3xl font-bold text-[#40BBD9]">{matches.length}</p>
          <p className="text-sm text-gray-500">Total criadas</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Finalizadas</h3>
          <p className="text-3xl font-bold text-[#43CAD9]">{matches.filter(m => m.status === 'completed').length}</p>
          <p className="text-sm text-gray-500">Partidas concluídas</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Fase Atual</h3>
          <p className="text-2xl font-bold text-[#40BBD9]">{phases[currentPhase].name}</p>
          <p className="text-sm text-gray-500">{phases[currentPhase].completed ? 'Concluída' : 'Em andamento'}</p>
        </div>
      </div>

      {/* Controle de Fases */}
      {isCurrentPhaseComplete() && currentPhase !== 'final' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-blue-800">Avançar Fase</h2>
          <p className="text-blue-700 mb-4">
            A fase {phases[currentPhase].name} foi concluída. Você pode avançar para a próxima fase.
          </p>
          <button
            onClick={() => {
              if (confirm('Avançar para a próxima fase? Isso criará as partidas eliminatórias.')) {
                advanceToNextPhase();
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Avançar para Próxima Fase
          </button>
        </div>
      )}



      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Backup e Restauração</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar Dados
          </button>

          <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            Importar Dados
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use essas funções para fazer backup dos dados ou restaurar de um backup anterior.
        </p>
      </div>

      {/* Informações de Armazenamento */}
      <StorageInfo />

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Zona de Perigo
        </h2>
        
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Limpar Todos os Dados
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-red-600 font-medium">
              ⚠️ Esta ação irá apagar TODOS os dados (equipes, grupos, partidas e rankings). Esta ação não pode ser desfeita!
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleClearData}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Sim, Limpar Tudo
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mt-2">
          Use esta função apenas se quiser começar do zero. Recomendamos fazer backup antes.
        </p>
      </div>
    </div>
  );
}