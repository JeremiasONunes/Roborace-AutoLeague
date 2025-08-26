# 🔌 API Reference - RoboRace Frontend

## 📋 Visão Geral

Este documento descreve a "API" interna do frontend RoboRace, incluindo contextos, hooks e métodos disponíveis para interação com os dados da aplicação.

## 🔐 AuthContext API

### Métodos Disponíveis

#### `login(username, password)`
Autentica o usuário no sistema.

**Parâmetros:**
- `username` (string): Nome de usuário
- `password` (string): Senha do usuário

**Retorno:**
- `boolean`: `true` se autenticação bem-sucedida

**Exemplo:**
```javascript
const { login } = useAuth();
const success = login('admin', 'admin123');
```

#### `logout()`
Remove a autenticação do usuário e limpa a sessão.

**Exemplo:**
```javascript
const { logout } = useAuth();
logout();
```

### Estados Disponíveis

#### `isAuthenticated`
- **Tipo:** `boolean`
- **Descrição:** Indica se o usuário está autenticado

#### `loading`
- **Tipo:** `boolean`
- **Descrição:** Indica se está carregando dados de autenticação

## 📊 DataContext API

### Métodos de Equipes

#### `addTeam(team)`
Adiciona uma nova equipe ao sistema.

**Parâmetros:**
```javascript
{
  name: string  // Nome da equipe (obrigatório, único)
}
```

**Retorno:**
```javascript
{
  id: number,           // ID único gerado
  name: string,         // Nome da equipe
  createdAt: string     // Timestamp ISO
}
```

**Exemplo:**
```javascript
const { addTeam } = useData();
const newTeam = addTeam({ name: 'Robôs Unidos' });
```

#### `removeTeam(teamId)`
Remove uma equipe do sistema (cascata para grupos e partidas).

**Parâmetros:**
- `teamId` (number): ID da equipe a ser removida

**Exemplo:**
```javascript
const { removeTeam } = useData();
removeTeam(123456789);
```

### Métodos de Grupos

#### `addGroup(group)`
Cria um novo grupo no sistema.

**Parâmetros:**
```javascript
{
  name: string  // Nome do grupo (obrigatório)
}
```

**Retorno:**
```javascript
{
  id: number,           // ID único gerado
  name: string,         // Nome do grupo
  teams: Array<Team>,   // Array vazio inicialmente
  createdAt: string     // Timestamp ISO
}
```

#### `removeGroup(groupId)`
Remove um grupo do sistema.

**Parâmetros:**
- `groupId` (number): ID do grupo a ser removido

#### `addTeamToGroup(groupId, teamId)`
Adiciona uma equipe a um grupo específico.

**Parâmetros:**
- `groupId` (number): ID do grupo
- `teamId` (number): ID da equipe

**Validações:**
- Equipe não pode estar em outro grupo
- Grupo deve existir
- Equipe deve existir

#### `removeTeamFromGroup(groupId, teamId)`
Remove uma equipe de um grupo específico.

**Parâmetros:**
- `groupId` (number): ID do grupo
- `teamId` (number): ID da equipe

### Métodos de Partidas

#### `addMatch(match)`
Cria uma nova partida no sistema.

**Parâmetros:**
```javascript
{
  team1: Team,          // Primeira equipe (objeto completo)
  team2: Team,          // Segunda equipe (objeto completo)
  phase?: string        // Fase da partida (opcional)
}
```

**Retorno:**
```javascript
{
  id: number,           // ID único gerado
  team1: Team,          // Primeira equipe
  team2: Team,          // Segunda equipe
  status: 'pending',    // Status inicial
  winner: null,         // Sem vencedor inicialmente
  draw: false,          // Não é empate inicialmente
  phase: string,        // Fase da partida
  createdAt: string     // Timestamp ISO
}
```

#### `updateMatchResult(matchId, winner, isDraw)`
Define o resultado de uma partida.

**Parâmetros:**
- `matchId` (number): ID da partida
- `winner` (Team|null): Equipe vencedora (null se empate)
- `isDraw` (boolean): Se é empate (default: false)

**Efeitos Colaterais:**
- Atualiza status para 'completed'
- Recalcula rankings automaticamente
- Define completedAt timestamp

**Exemplo:**
```javascript
const { updateMatchResult } = useData();

// Vitória da equipe1
updateMatchResult(matchId, team1, false);

// Empate
updateMatchResult(matchId, null, true);
```

#### `resetMatch(matchId)`
Reseta o resultado de uma partida para estado pendente.

**Parâmetros:**
- `matchId` (number): ID da partida

**Efeitos Colaterais:**
- Status volta para 'pending'
- Remove winner e draw
- Recalcula rankings

### Métodos Utilitários

#### `generateRandomBrackets()`
Gera partidas aleatórias com todas as equipes cadastradas.

**Pré-requisitos:**
- Mínimo 2 equipes cadastradas

**Comportamento:**
- Embaralha todas as equipes
- Cria pares aleatórios
- Fase definida como "Chave Aleatória"

**Acesso:**
- Disponível no painel administrativo (`/admin`)

#### `generateGroupBrackets()`
Gera todas as partidas possíveis dentro de cada grupo.

**Pré-requisitos:**
- Grupos criados com pelo menos 2 equipes cada

**Algoritmo:**
- Para cada grupo com n equipes
- Gera n×(n-1)/2 partidas (todas as combinações)
- Fase definida como nome do grupo

#### `clearAllData()`
Remove todos os dados do sistema.

**Efeitos:**
- Limpa teams, groups, matches, rankings
- Remove dados do localStorage
- Reseta para estado inicial

**⚠️ Ação irreversível**

#### `importData(importedData)`
Importa dados de um backup JSON.

**Parâmetros:**
```javascript
{
  teams: Array<Team>,
  groups: Array<Group>,
  matches: Array<Match>,
  rankings?: Array<Ranking>  // Opcional, será recalculado
}
```

**Retorno:**
- `boolean`: `true` se importação bem-sucedida

**Validações:**
- Estrutura de dados válida
- Arrays obrigatórios presentes
- Recálculo automático de rankings

### Estados Disponíveis

#### `teams`
- **Tipo:** `Array<Team>`
- **Descrição:** Lista de todas as equipes cadastradas

#### `groups`
- **Tipo:** `Array<Group>`
- **Descrição:** Lista de todos os grupos criados

#### `matches`
- **Tipo:** `Array<Match>`
- **Descrição:** Lista de todas as partidas

#### `rankings`
- **Tipo:** `Array<Ranking>`
- **Descrição:** Ranking calculado automaticamente

#### `currentPhase`
- **Tipo:** `string`
- **Descrição:** Fase atual da competição

#### `phases`
- **Tipo:** `Object`
- **Descrição:** Configuração das fases disponíveis

## 🎣 useRealTimeData Hook

### Uso
```javascript
const data = useRealTimeData();
```

### Retorno
Retorna o mesmo objeto que o DataContext, mas com atualizações em tempo real.

### Funcionalidades
- **Polling**: Verifica mudanças a cada 1 segundo
- **Event Listener**: Detecta mudanças entre abas
- **Auto-sync**: Sincronização automática entre instâncias

### Casos de Uso
- Visualização pública
- Dashboards em tempo real
- Múltiplas abas abertas

## 🔄 Fluxos de Dados

### Fluxo de Criação de Equipe
```javascript
// 1. Usuário preenche formulário
const teamData = { name: 'Nova Equipe' };

// 2. Validação client-side
if (!teamData.name.trim()) {
  throw new Error('Nome obrigatório');
}

// 3. Chamada do método
const newTeam = addTeam(teamData);

// 4. Estado atualizado automaticamente
// 5. localStorage sincronizado
// 6. UI re-renderizada
```

### Fluxo de Resultado de Partida
```javascript
// 1. Usuário define resultado
updateMatchResult(matchId, winnerTeam, false);

// 2. Match atualizada
// 3. Rankings recalculados automaticamente
// 4. Estado global atualizado
// 5. Todas as telas refletem mudança
```

## 📊 Algoritmos de Cálculo

### Sistema de Pontuação
```javascript
const POINTS = {
  WIN: 3,    // Vitória
  DRAW: 1,   // Empate
  LOSS: 0    // Derrota
};
```

### Critérios de Desempate
1. **Pontos totais** (maior número)
2. **Número de vitórias** (maior número)  
3. **Número de derrotas** (menor número)

### Fases da Competição
```javascript
const PHASES = {
  groups: 'Fase de Grupos',
  round16: 'Oitavas de Final',
  quarterfinals: 'Quartas de Final', 
  semifinals: 'Semifinais',
  final: 'Final'
};
```

## 🔍 Debugging e Logs

### Estrutura de Dados no localStorage
```javascript
// Chave: 'roborace_data'
{
  teams: [...],
  groups: [...], 
  matches: [...],
  rankings: [...],
  currentPhase: 'groups',
  phases: {...}
}
```

### Logs Importantes
```javascript
// Erros comuns no console
'useData deve ser usado dentro de DataProvider'
'Erro ao carregar dados:'
'Erro ao importar dados:'
'Estrutura de dados inválida'
```

## 🚀 Extensibilidade

### Adicionando Novos Métodos ao DataContext
```javascript
// 1. Definir método no DataProvider
const newMethod = (params) => {
  // Lógica do método
  setData(prev => ({ ...prev, /* mudanças */ }));
};

// 2. Adicionar ao value do Provider
const value = {
  // ... métodos existentes
  newMethod
};

// 3. Usar em componentes
const { newMethod } = useData();
```

### Criando Hooks Customizados
```javascript
// Hook para filtrar dados
export const useFilteredTeams = (searchTerm) => {
  const { teams } = useData();
  
  return useMemo(() => {
    return teams.filter(team => 
      team.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teams, searchTerm]);
};
```

## 📝 Validações e Regras de Negócio

### Validações de Equipe
- Nome obrigatório e não vazio
- Nome único no sistema
- Máximo 50 caracteres

### Validações de Grupo  
- Nome obrigatório
- Uma equipe por grupo (exclusividade)
- Mínimo 2 equipes para gerar partidas

### Validações de Partida
- Equipes diferentes obrigatórias
- Ambas as equipes devem existir
- Resultado mutuamente exclusivo (vitória OU empate)

---

**API Reference para desenvolvedores**  
*Jeremias O Nunes - 2024*