import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const StorageInfo = () => {
  const { getStorageInfo } = useData();
  const [storageInfo, setStorageInfo] = useState(null);

  useEffect(() => {
    const updateStorageInfo = () => {
      setStorageInfo(getStorageInfo());
    };

    updateStorageInfo();
    const interval = setInterval(updateStorageInfo, 5000);

    return () => clearInterval(interval);
  }, [getStorageInfo]);

  if (!storageInfo) return null;

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Informações de Armazenamento
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Status</div>
          <div className="font-medium">
            {storageInfo.available ? (
              <span className="text-green-600">✓ Disponível</span>
            ) : (
              <span className="text-red-600">✗ Indisponível</span>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Tamanho Total</div>
          <div className="font-medium">{formatBytes(storageInfo.totalSize)}</div>
        </div>

        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Dados Principais</div>
          <div className="font-medium">{formatBytes(storageInfo.dataSize)}</div>
        </div>

        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Backup</div>
          <div className="font-medium">{formatBytes(storageInfo.backupSize)}</div>
        </div>

        <div className="bg-gray-50 p-3 rounded col-span-2">
          <div className="text-sm text-gray-600">Último Backup</div>
          <div className="font-medium">{formatDate(storageInfo.lastBackup)}</div>
        </div>
      </div>

      {storageInfo.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <div className="text-sm text-red-600">
            Erro: {storageInfo.error}
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageInfo;