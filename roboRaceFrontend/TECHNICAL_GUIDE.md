# 🔧 Guia Técnico - RoboRace Frontend

## 🏗️ Arquitetura de Componentes

### Hierarquia de Componentes
```
App
├── AuthProvider
│   └── DataProvider
│       ├── PublicView (rota /view)
│       └── AppContent
│           ├── Login (não autenticado)
│           └── Layout (autenticado)
│               ├── Sidebar
│               ├── Header Mobile
│               └── Pages
│                   ├── Teams
│                   ├── Groups
│                   ├── Matches
│                   ├── Ranking
│                   ├── Phases
│                   └── Admin
```

## 📊 Estruturas de Dados

### Team
```javascript
{
  id: number,           // Timestamp único
  name: string,         // Nome da equipe (único)
  createdAt: string     // ISO timestamp
}
```

### Group
```javascript
{
  id: number,           // Timestamp único
  name: string,         // Nome do grupo
  teams: Array<Team>,   // Equipes do grupo
  createdAt: string     // ISO timestamp
}
```

### Match
```javascript
{
  id: number,           // Timestamp único
  team1: Team,          // Primeira equipe
  team2: Team,          // Segunda equipe
  status: 'pending' | 'completed',
  winner: Team | null,  // Equipe vencedora
  draw: boolean,        // Se foi empate (apenas fase de grupos)
  phase: string,        // Nome da fase
  phaseType: string,    // Tipo da fase (groups, semifinals, final)
  createdAt: string,    // ISO timestamp
  completedAt?: string  // ISO timestamp quando finalizada
}
```

### Ranking
```javascript
{
  team: Team,           // Referência da equipe
  points: number,       // Pontos totais
  wins: number,         // Número de vitórias
  draws: number,        // Número de empates
  losses: number,       // Número de derrotas
  position: number,     // Posição no ranking
  group: string         // Nome do grupo
}
```

## 🔄 Fluxos de Estado

### Fluxo de Autenticação
```mermaid
graph TD
    A[App Load] --> B{Check localStorage}
    B -->|Token exists| C[Set Authenticated]
    B -->|No token| D[Show Login]
    D --> E[User Login]
    E -->|Success| F[Save Token + Redirect]
    E -->|Failure| G[Show Error]
    C --> H[Show Admin Interface]
    F --> H
```

### Fluxo de Dados
```mermaid
graph TD
    A[User Action] --> B[Context Method]
    B --> C[Update State]
    C --> D[Save to localStorage]
    D --> E[Trigger Re-render]
    E --> F[Update UI]
    
    G[External Change] --> H[useRealTimeData Hook]
    H --> I[Detect Change]
    I --> J[Update State]
    J --> F
```

## 🎯 Padrões de Desenvolvimento

### Context Pattern
```javascript
// Criação do contexto
const DataContext = createContext();

// Provider com estado e métodos
export const DataProvider = ({ children }) => {
  const [data, setData] = useState(initialData);
  
  const addTeam = (team) => {
    // Lógica de adição
    setData(prev => ({ ...prev, teams: [...prev.teams, newTeam] }));
  };
  
  return (
    <DataContext.Provider value={{ ...data, addTeam }}>
      {children}
    </DataContext.Provider>
  );
};

// Hook customizado para uso
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de DataProvider');
  }
  return context;
};
```

### Estado Imutável
```javascript
// ❌ Mutação direta
data.teams.push(newTeam);

// ✅ Atualização imutável
setData(prev => ({
  ...prev,
  teams: [...prev.teams, newTeam]
}));
```

### Persistência Automática
```javascript
// Salvar automaticamente no localStorage
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}, [data]);
```

## 🔍 Algoritmos Principais

### Cálculo de Ranking
```javascript
const calculateRankings = (currentData) => {
  const teamStats = {};
  
  // 1. Inicializar estatísticas
  currentData.teams.forEach(team => {
    teamStats[team.id] = {
      team, points: 0, wins: 0, draws: 0, losses: 0
    };
  });
  
  // 2. Processar APENAS partidas da fase de grupos
  currentData.matches
    .filter(match => match.status === 'completed' && match.phaseType === 'groups')
    .forEach(match => {
      if (match.draw) {
        // Empate: 1 ponto para cada (apenas grupos)
        teamStats[match.team1.id].points += 1;
        teamStats[match.team2.id].points += 1;
        teamStats[match.team1.id].draws += 1;
        teamStats[match.team2.id].draws += 1;
      } else {
        // Vitória: 3 pontos para vencedor (apenas grupos)
        const winnerId = match.winner.id;
        const loserId = winnerId === match.team1.id ? match.team2.id : match.team1.id;
        
        teamStats[winnerId].points += 3;
        teamStats[winnerId].wins += 1;
        teamStats[loserId].losses += 1;
      }
    });
  
  // 3. Contar vitórias/derrotas de TODAS as fases
  currentData.matches
    .filter(match => match.status === 'completed' && match.phaseType !== 'groups')
    .forEach(match => {
      if (!match.draw && match.winner) {
        const winnerId = match.winner.id;
        const loserId = winnerId === match.team1.id ? match.team2.id : match.team1.id;
        
        teamStats[winnerId].wins += 1;
        teamStats[loserId].losses += 1;
      }
    });
  
  // 4. Ordenar por critérios (pontos apenas da fase de grupos)
  return Object.values(teamStats)
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;     // Pontos
      if (b.wins !== a.wins) return b.wins - a.wins;           // Vitórias
      return a.losses - b.losses;                              // Derrotas
    })
    .map((stats, index) => ({ ...stats, position: index + 1 }));
};
```

### Geração de Chaves por Grupos
```javascript
const generateGroupBrackets = () => {
  const newMatches = [];
  let matchId = Date.now();
  
  data.groups.forEach(group => {
    if (group.teams.length >= 2) {
      // Algoritmo de combinações: C(n,2) = n×(n-1)/2
      for (let i = 0; i < group.teams.length; i++) {
        for (let j = i + 1; j < group.teams.length; j++) {
          newMatches.push({
            id: matchId++,
            team1: group.teams[i],
            team2: group.teams[j],
            status: 'pending',
            winner: null,
            draw: false,
            phase: group.name,
            phaseType: 'groups',
            createdAt: new Date().toISOString()
          });
        }
      }
    }
  });
  
  return newMatches;
};
```

### Sistema de Fases Simplificado
```javascript
const PHASES = {
  GROUPS: 'groups',
  SEMIFINALS: 'semifinals', 
  FINAL: 'final'
};

// Classificação automática para semifinais
const getQualifiedTeams = () => {
  const qualified = [];
  
  data.groups.forEach(group => {
    const groupRanking = calculateRankings(data)
      .filter(r => group.teams.some(t => t.id === r.team.id))
      .slice(0, 2); // Top 2 de cada grupo
    
    qualified.push(...groupRanking.map(r => r.team));
  });
  
  return qualified;
};
```

**Acesso:** Disponível na página de grupos (`/groups`) e no painel administrativo (`/admin`)

## 🎨 Sistema de Estilos

### Convenções TailwindCSS
```javascript
// Cores do sistema (Esquema Azul)
const colors = {
  primary: '#40BBD9',      // bg-[#40BBD9]
  secondary: '#43CAD9',    // bg-[#43CAD9]
  accent: '#3B82F6',       // bg-blue-500
  background: '#F8FAFC'    // bg-slate-50
};

// Classes padrão para componentes
const buttonClasses = {
  primary: 'px-4 py-2 bg-[#40BBD9] text-white rounded-md hover:bg-[#43CAD9]',
  secondary: 'px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700',
  danger: 'px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
};

// Cores do pódio
const podiumColors = {
  first: 'bg-yellow-500',   // Dourado
  second: 'bg-gray-600',    // Cinza escuro
  third: 'bg-orange-500'    // Laranja
};
```

### Componentes Reutilizáveis
```javascript
// Card padrão
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    {children}
  </div>
);

// Button com variantes
const Button = ({ variant = 'primary', children, ...props }) => (
  <button className={buttonClasses[variant]} {...props}>
    {children}
  </button>
);
```

## 🔄 Gerenciamento de Estado

### Estado Local vs Global
```javascript
// ✅ Estado local para UI
const [isModalOpen, setIsModalOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');

// ✅ Estado global para dados de negócio
const { teams, addTeam, removeTeam } = useData();
```

### Otimização de Performance
```javascript
// Memoização de cálculos pesados
const expensiveValue = useMemo(() => {
  return calculateComplexRanking(teams, matches);
}, [teams, matches]);

// Callback memoizado
const handleAddTeam = useCallback((team) => {
  addTeam(team);
}, [addTeam]);
```

## 🔍 Debugging e Logs

### Estrutura de Logs
```javascript
// Logs estruturados
const logger = {
  info: (message, data) => console.log(`[INFO] ${message}`, data),
  error: (message, error) => console.error(`[ERROR] ${message}`, error),
  debug: (message, data) => console.debug(`[DEBUG] ${message}`, data)
};

// Uso nos contextos
const addTeam = (team) => {
  try {
    logger.info('Adding team', { teamName: team.name });
    // Lógica de adição
    logger.info('Team added successfully', { teamId: newTeam.id });
  } catch (error) {
    logger.error('Failed to add team', error);
  }
};
```

### DevTools Integration
```javascript
// React DevTools - nomeação de contextos
DataContext.displayName = 'DataContext';
AuthContext.displayName = 'AuthContext';

// Debugging de estado
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Data state updated:', data);
  }
}, [data]);
```

## 🚀 Otimizações

### Code Splitting
```javascript
// Lazy loading de páginas
const Teams = lazy(() => import('./pages/Teams'));
const Groups = lazy(() => import('./pages/Groups'));

// Suspense wrapper
<Suspense fallback={<LoadingSpinner />}>
  <Teams />
</Suspense>
```

### Bundle Analysis
```bash
# Analisar bundle size
npm run build
npx vite-bundle-analyzer dist
```

## 🎯 Regras de Negócio Implementadas

### Sistema de Pontuação Dual
```javascript
// Fase de Grupos: Sistema de pontos (3-1-0)
const GROUP_POINTS = {
  WIN: 3,
  DRAW: 1,
  LOSS: 0
};

// Fases Eliminatórias: Apenas vitória/derrota
const ELIMINATION_RULES = {
  allowDraw: false,     // Sem empates
  pointsSystem: false,  // Sem pontos
  directAdvancement: true
};
```

### Critérios de Classificação
```javascript
const RANKING_CRITERIA = [
  'points',    // 1º: Pontos (apenas grupos)
  'wins',      // 2º: Vitórias (todas as fases)
  'losses'     // 3º: Derrotas (menor número)
];
```

## 🧪 Testing Strategy

### Estrutura de Testes (Recomendada)
```
src/
├── __tests__/
│   ├── components/
│   │   ├── FinalRanking.test.js
│   │   └── Layout.test.js
│   ├── context/
│   │   ├── DataContext.test.js
│   │   └── AuthContext.test.js
│   ├── hooks/
│   │   └── useRealTimeData.test.js
│   └── pages/
│       ├── Teams.test.js
│       ├── Groups.test.js
│       ├── Matches.test.js
│       ├── Ranking.test.js
│       └── PublicView.test.js
├── __mocks__/
│   └── localStorage.js
└── test-utils/
    └── renderWithProviders.js
```

### Testes de Contexto
```javascript
// Exemplo de teste para DataContext
import { renderHook, act } from '@testing-library/react';
import { DataProvider, useData } from '../context/DataContext';

const wrapper = ({ children }) => (
  <DataProvider>{children}</DataProvider>
);

test('should calculate rankings correctly', () => {
  const { result } = renderHook(() => useData(), { wrapper });
  
  act(() => {
    result.current.addTeam({ name: 'Team A' });
    result.current.addTeam({ name: 'Team B' });
  });
  
  expect(result.current.teams).toHaveLength(2);
});
```

## 🚀 Performance e Otimizações

### Memoização Estratégica
```javascript
// Rankings calculados apenas quando necessário
const rankings = useMemo(() => {
  return calculateRankings(data);
}, [data.matches, data.teams]);

// Componentes pesados memoizados
const FinalRanking = memo(({ matches, teams }) => {
  // Renderização otimizada
});
```

### Lazy Loading
```javascript
// Carregamento sob demanda
const PublicView = lazy(() => import('./pages/PublicView'));
const Admin = lazy(() => import('./pages/Admin'));
```er>
);

test('should add team correctly', () => {
  const { result } = renderHook(() => useData(), { wrapper });
  
  act(() => {
    result.current.addTeam({ name: 'Test Team' });
  });
  
  expect(result.current.teams).toHaveLength(1);
  expect(result.current.teams[0].name).toBe('Test Team');
});
```

## 🔒 Segurança

### Sanitização de Inputs
```javascript
const sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, '');
};

const addTeam = (team) => {
  const sanitizedName = sanitizeInput(team.name);
  // Continuar com nome sanitizado
};
```

### Validação de Dados
```javascript
const validateTeam = (team) => {
  const errors = [];
  
  if (!team.name || team.name.trim().length === 0) {
    errors.push('Nome é obrigatório');
  }
  
  if (team.name.length > 50) {
    errors.push('Nome muito longo');
  }
  
  return errors;
};
```

---

**Guia técnico para desenvolvedores**  
*Jeremias O Nunes - 2025*