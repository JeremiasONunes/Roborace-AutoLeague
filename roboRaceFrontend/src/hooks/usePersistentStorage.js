import { useEffect, useCallback } from 'react';

const STORAGE_KEY = 'roborace_data';
const BACKUP_KEY = 'roborace_backup';

export const usePersistentStorage = (data, setData, initialData) => {
  // Função para salvar dados com backup
  const saveData = useCallback((dataToSave) => {
    try {
      const dataString = JSON.stringify(dataToSave);
      
      // Salvar dados principais
      localStorage.setItem(STORAGE_KEY, dataString);
      
      // Criar backup com timestamp
      const backupData = {
        data: dataToSave,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(BACKUP_KEY, JSON.stringify(backupData));
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      return false;
    }
  }, []);

  // Função para carregar dados com fallback para backup
  const loadData = useCallback(() => {
    try {
      // Tentar carregar dados principais
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData && typeof parsedData === 'object') {
          return { ...initialData, ...parsedData };
        }
      }

      // Fallback para backup se dados principais falharem
      const backupData = localStorage.getItem(BACKUP_KEY);
      if (backupData) {
        const parsedBackup = JSON.parse(backupData);
        if (parsedBackup?.data && typeof parsedBackup.data === 'object') {
          console.warn('Dados principais corrompidos, carregando backup');
          return { ...initialData, ...parsedBackup.data };
        }
      }

      return initialData;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return initialData;
    }
  }, [initialData]);

  // Função para verificar integridade dos dados
  const validateData = useCallback((dataToValidate) => {
    const requiredFields = ['teams', 'groups', 'matches'];
    return requiredFields.every(field => 
      dataToValidate.hasOwnProperty(field) && Array.isArray(dataToValidate[field])
    );
  }, []);

  // Salvar dados automaticamente quando mudarem
  useEffect(() => {
    if (data && validateData(data)) {
      saveData(data);
    }
  }, [data, saveData, validateData]);

  // Listener para mudanças no localStorage (sincronização entre abas)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newData = JSON.parse(e.newValue);
          if (validateData(newData)) {
            setData({ ...initialData, ...newData });
          }
        } catch (error) {
          console.error('Erro ao sincronizar dados:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [setData, initialData, validateData]);

  // Salvar dados antes de fechar a página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (data && validateData(data)) {
        saveData(data);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && data && validateData(data)) {
        saveData(data);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [data, saveData, validateData]);

  // Salvar periodicamente (a cada 30 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      if (data && validateData(data)) {
        saveData(data);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [data, saveData, validateData]);

  return {
    saveData,
    loadData,
    validateData
  };
};