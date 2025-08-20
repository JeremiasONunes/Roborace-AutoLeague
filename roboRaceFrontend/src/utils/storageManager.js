const STORAGE_KEY = 'roborace_data';
const BACKUP_KEY = 'roborace_backup';
const SETTINGS_KEY = 'roborace_settings';

class StorageManager {
  constructor() {
    this.isAvailable = this.checkStorageAvailability();
  }

  checkStorageAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage não está disponível:', e);
      return false;
    }
  }

  saveData(data) {
    if (!this.isAvailable) return false;

    try {
      const dataString = JSON.stringify(data);
      
      localStorage.setItem(STORAGE_KEY, dataString);
      
      const backupData = {
        data,
        timestamp: new Date().toISOString(),
        version: '1.0',
        checksum: this.generateChecksum(dataString)
      };
      
      localStorage.setItem(BACKUP_KEY, JSON.stringify(backupData));
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      return false;
    }
  }

  loadData(initialData = {}) {
    if (!this.isAvailable) return initialData;

    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (this.validateData(parsedData)) {
          return { ...initialData, ...parsedData };
        }
      }

      const backupData = localStorage.getItem(BACKUP_KEY);
      if (backupData) {
        const parsedBackup = JSON.parse(backupData);
        if (parsedBackup?.data && this.validateData(parsedBackup.data)) {
          console.warn('Dados principais corrompidos, usando backup de:', parsedBackup.timestamp);
          return { ...initialData, ...parsedBackup.data };
        }
      }

      return initialData;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return initialData;
    }
  }

  validateData(data) {
    if (!data || typeof data !== 'object') return false;
    
    const requiredFields = ['teams', 'groups', 'matches'];
    return requiredFields.every(field => 
      data.hasOwnProperty(field) && Array.isArray(data[field])
    );
  }

  generateChecksum(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  clearAllData() {
    if (!this.isAvailable) return false;

    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(BACKUP_KEY);
      return true;
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      return false;
    }
  }

  exportData() {
    const data = this.loadData();
    const exportData = {
      ...data,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  importData(jsonString, initialData = {}) {
    try {
      const importedData = JSON.parse(jsonString);
      
      delete importedData.exportedAt;
      delete importedData.version;
      
      if (this.validateData(importedData)) {
        const mergedData = { ...initialData, ...importedData };
        this.saveData(mergedData);
        return { success: true, data: mergedData };
      } else {
        return { success: false, error: 'Estrutura de dados inválida' };
      }
    } catch (error) {
      return { success: false, error: 'Arquivo JSON inválido' };
    }
  }

  getStorageInfo() {
    if (!this.isAvailable) {
      return { available: false };
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const backup = localStorage.getItem(BACKUP_KEY);

      return {
        available: true,
        dataSize: data ? data.length : 0,
        backupSize: backup ? backup.length : 0,
        totalSize: (data?.length || 0) + (backup?.length || 0),
        lastBackup: backup ? JSON.parse(backup).timestamp : null
      };
    } catch (error) {
      return { available: true, error: error.message };
    }
  }
}

export const storageManager = new StorageManager();

export const saveData = (data) => storageManager.saveData(data);
export const loadData = (initialData) => storageManager.loadData(initialData);
export const clearAllData = () => storageManager.clearAllData();
export const exportData = () => storageManager.exportData();
export const importData = (jsonString, initialData) => storageManager.importData(jsonString, initialData);
export const getStorageInfo = () => storageManager.getStorageInfo();