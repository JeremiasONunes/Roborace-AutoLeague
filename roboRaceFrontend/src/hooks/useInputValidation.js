import { useState, useCallback } from 'react';

export const useInputValidation = () => {
  const [errors, setErrors] = useState({});

  const sanitizeInput = useCallback((input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
  }, []);

  const validateTeamName = useCallback((name, existingTeams = []) => {
    const sanitized = sanitizeInput(name);
    const validationErrors = [];

    if (!sanitized || sanitized.length === 0) {
      validationErrors.push('Nome é obrigatório');
    }

    if (sanitized.length > 50) {
      validationErrors.push('Nome muito longo (máximo 50 caracteres)');
    }

    if (existingTeams.some(team => team.name.toLowerCase() === sanitized.toLowerCase())) {
      validationErrors.push('Nome já existe');
    }

    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors,
      sanitizedValue: sanitized
    };
  }, [sanitizeInput]);

  const validateGroupName = useCallback((name, existingGroups = []) => {
    const sanitized = sanitizeInput(name);
    const validationErrors = [];

    if (!sanitized || sanitized.length === 0) {
      validationErrors.push('Nome é obrigatório');
    }

    if (sanitized.length > 30) {
      validationErrors.push('Nome muito longo (máximo 30 caracteres)');
    }

    if (existingGroups.some(group => group.name.toLowerCase() === sanitized.toLowerCase())) {
      validationErrors.push('Nome já existe');
    }

    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors,
      sanitizedValue: sanitized
    };
  }, [sanitizeInput]);

  const setFieldError = useCallback((field, error) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    sanitizeInput,
    validateTeamName,
    validateGroupName,
    setFieldError,
    clearFieldError,
    clearAllErrors
  };
};