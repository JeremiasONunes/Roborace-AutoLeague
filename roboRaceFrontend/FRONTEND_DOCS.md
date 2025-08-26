# 📚 Documentação do Frontend - RoboRace

## 📋 Visão Geral

O frontend do RoboRace é uma aplicação React moderna construída com Vite, projetada para gerenciar competições de robótica de forma intuitiva e eficiente. A aplicação oferece uma interface administrativa completa e uma visualização pública em tempo real.

## 🏗️ Arquitetura

### Stack Tecnológico
- **React** 19.1.1 - Biblioteca principal para UI
- **Vite** 7.1.2 - Build tool e dev server
- **TailwindCSS** 4.1.12 - Framework CSS utilitário
- **React Router DOM** 7.8.1 - Roteamento SPA
- **Lucide React** 0.540.0 - Biblioteca de ícones

### Estrutura de Diretórios
```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.jsx      # Layout principal com sidebar
│   └── ProtectedRoute.jsx # Proteção de rotas
├── context/            # Contextos React
│   ├── AuthContext.jsx # Gerenciamento de autenticação
│   └── DataContext.jsx # Gerenciamento de dados
├── hooks/              # Hooks customizados
│   └── useRealTimeData.js # Hook para dados em tempo real
├── pages/              # Páginas da aplicação
│   ├── Admin.jsx       # Painel administrativo
│   ├── Groups.jsx      # Gerenciamento de grupos
│   ├── Login.jsx       # Página de login
│   ├── Matches.jsx     # Gerenciamento de partidas
│   ├── Public.jsx      # Página pública (não utilizada)
│   ├── PublicView.jsx  # Visualização pública principal
│   ├── Ranking.jsx     # Ranking das equipes
│   └── Teams.jsx       # Gerenciamento de equipes
├── App.jsx             # Componente raiz
├── main.jsx            # Ponto de entrada
└── index.css           # Estilos globais
```

## 🔐 Sistema de Autenticação

### AuthContext (`context/AuthContext.jsx`)

Gerencia o estado de autenticação da aplicação usando localStorage para persistência.

**Estados:**
- `isAuthenticated`: Boolean indicando se usuário está logado
- `loading`: Boolean para estado de carregamento

**Métodos:**
- `login(username, password)`: Autentica usuário
- `logout()`: Remove autenticação e limpa dados

**Credenciais:**
- Usuário: `admin`
- Senha: `admin123`

```javascript
// Uso do contexto
const { isAuthenticated, login, logout, loading } = useAuth();
```

## 📊 Gerenciamento de Dados

### DataContext (`context/DataContext.jsx`)

Contexto principal que gerencia todos os dados da aplicação com persistência automática no localStorage.

**Estrutura de Dados:**
```javascript
{
  teams: Array<Team>,           // Equipes cadastradas
  groups: Array<Group>,         // Grupos criados
  matches: Array<Match>,        // Partidas
  rankings: Array<Ranking>,     // Rankings calculados
  currentPhase: string,         // Fase atual da competição
  phases: Object               // Configuração das fases
}
```

**Principais Métodos:**

#### Equipes
- `addTeam(team)`: Adiciona nova equipe
- `removeTeam(teamId)`: Remove equipe (cascata)

#### Grupos
- `addGroup(group)`: Cria novo grupo
- `removeGroup(groupId)`: Remove grupo
- `addTeamToGroup(groupId, teamId)`: Adiciona equipe ao grupo
- `removeTeamFromGroup(groupId, teamId)`: Remove equipe do grupo

#### Partidas
- `addMatch(match)`: Cria nova partida
- `updateMatchResult(matchId, winner, isDraw)`: Define resultado
- `resetMatch(matchId)`: Reseta resultado

#### Utilitários
- `generateRandomBrackets()`: Gera chaves aleatórias
- `generateGroupBrackets()`: Gera partidas por grupos
- `clearAllData()`: Limpa todos os dados
- `importData(data)`: Importa dados de backup

## 🎣 Hooks Customizados

### useRealTimeData (`hooks/useRealTimeData.js`)

Hook que monitora mudanças no localStorage para atualizações em tempo real.

**Funcionalidades:**
- Polling a cada 1 segundo
- Event listener para mudanças entre abas
- Recálculo automático de rankings
- Sincronização entre múltiplas instâncias

```javascript
const data = useRealTimeData();
// Retorna: { teams, groups, matches, rankings, currentPhase, phases }
```

## 🧩 Componentes

### Layout (`components/Layout.jsx`)

Componente principal que fornece a estrutura base da aplicação administrativa.

**Características:**
- Sidebar responsiva com navegação
- Header mobile com menu hambúrguer
- Logo e branding
- Créditos do desenvolvedor
- Botões de ação (visualização pública, logout)

**Navegação:**
- `/teams` - Gerenciamento de Equipes
- `/groups` - Organização em Grupos
- `/matches` - Controle de Partidas
- `/ranking` - Visualização de Rankings
- `/admin` - Painel Administrativo (inclui geração de chaves)

### ProtectedRoute (`components/ProtectedRoute.jsx`)

Componente para proteção de rotas que requer autenticação.

## 📄 Páginas

### Teams (`pages/Teams.jsx`)

**Funcionalidades:**
- Cadastro de novas equipes
- Listagem com busca
- Remoção de equipes
- Validação de nomes únicos

**Interface:**
- Formulário de cadastro
- Lista com ações por equipe
- Contador de equipes

### Groups (`pages/Groups.jsx`)

**Funcionalidades:**
- Criação de grupos
- Adição/remoção de equipes
- Validação de exclusividade (uma equipe por grupo)
- Geração de partidas por grupo

**Interface:**
- Formulário de criação de grupos
- Cards de grupos com equipes
- Seletores para adicionar equipes
- Botão de geração de chaves por grupos

### Matches (`pages/Matches.jsx`)

**Funcionalidades:**
- Criação manual de partidas
- Definição de resultados (vitória/empate)
- Reset de resultados
- Filtros por status e fase
- Visualização por fases da competição

**Interface:**
- Formulário de criação de partidas
- Lista de partidas com status
- Botões de ação para resultados
- Indicadores visuais de status

### Ranking (`pages/Ranking.jsx`)

**Funcionalidades:**
- Visualização do ranking atualizado
- Critérios de desempate automáticos
- Agrupamento por grupos
- Destaque para pódio

**Critérios de Classificação:**
1. Pontos (3 vitória, 1 empate, 0 derrota)
2. Número de vitórias
3. Menor número de derrotas

### Admin (`pages/Admin.jsx`)

**Funcionalidades:**
- Dashboard com estatísticas
- Controle de fases da competição
- Geração automática de chaves
- Backup e restauração de dados
- Reset completo do sistema

**Seções:**
- Estatísticas gerais
- Controle de fases
- Geração de chaves
- Backup/Restore
- Zona de perigo (reset)

### PublicView (`pages/PublicView.jsx`)

**Funcionalidades:**
- Visualização pública sem autenticação
- Atualização automática em tempo real
- Timeline de fases da competição
- Ranking ao vivo
- Próximas partidas e resultados recentes

**Interface:**
- Header com logo e fase atual
- Timeline visual das fases
- Grid responsivo com informações
- Footer com créditos

## 🎨 Sistema de Design

### Paleta de Cores
- **Primary**: `#2DA63F` (Verde principal)
- **Secondary**: `#A7D9AE` (Verde claro)
- **Success**: `#41A650` (Verde escuro)
- **Background**: `#FAFCFB` (Cinza muito claro)

### Componentes de UI
- Cards com `rounded-lg` e `shadow`
- Botões com estados hover e cores semânticas
- Inputs com validação visual
- Modais e confirmações
- Indicadores de status coloridos

### Responsividade
- Mobile-first approach
- Breakpoints do TailwindCSS
- Sidebar colapsável em mobile
- Grid responsivo para dados

## 🔄 Fluxo de Dados

### Persistência
1. **LocalStorage**: Chave `roborace_data`
2. **Sincronização**: Automática entre contextos
3. **Backup**: Exportação/importação JSON
4. **Tempo Real**: Polling + Event Listeners

### Estados da Aplicação
1. **Loading**: Durante inicialização
2. **Authenticated**: Usuário logado
3. **Public**: Visualização pública
4. **Error**: Estados de erro com feedback

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Gera build de produção
npm run preview      # Preview do build

# Qualidade
npm run lint         # Executa ESLint
```

## 🔧 Configurações

### Vite (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### TailwindCSS
- Configuração via `@tailwindcss/vite`
- Classes utilitárias para estilização
- Purge automático em produção

### ESLint
- Regras para React e Hooks
- Configuração para refresh automático
- Padrões de código JavaScript moderno

## 📱 Funcionalidades Mobile

### Responsividade
- Sidebar colapsável
- Menu hambúrguer
- Touch-friendly buttons
- Grid adaptativo

### Performance
- Lazy loading de componentes
- Otimização de re-renders
- Debounce em buscas
- Memoização de cálculos

## 🔒 Segurança

### Autenticação
- Credenciais hardcoded (desenvolvimento)
- Session storage para tokens
- Proteção de rotas sensíveis

### Validações
- Input sanitization
- Validação client-side
- Prevenção de XSS básica

## 🐛 Debugging

### Ferramentas
- React DevTools
- Vite HMR
- Console logging estruturado
- Error boundaries (recomendado)

### Logs Importantes
- Erros de importação de dados
- Falhas de autenticação
- Problemas de sincronização

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Arquivos Gerados
- `dist/` - Arquivos estáticos
- `index.html` - Ponto de entrada
- Assets otimizados e minificados

### Configurações de Servidor
- SPA routing (fallback para index.html)
- Compressão gzip recomendada
- Cache headers para assets

## 📈 Melhorias Futuras

### Performance
- Code splitting por rotas
- Service Workers para cache
- Otimização de imagens

### Funcionalidades
- Modo escuro
- Internacionalização (i18n)
- PWA capabilities
- WebSocket para tempo real

### UX/UI
- Animações e transições
- Skeleton loading
- Toast notifications
- Drag and drop

## 📞 Suporte

### Logs e Debugging
- Verificar console do navegador
- Inspecionar localStorage
- Validar estrutura de dados JSON

### Problemas Comuns
1. **Dados não carregam**: Verificar localStorage
2. **Login não funciona**: Verificar credenciais
3. **Importação falha**: Validar formato JSON
4. **Ranking incorreto**: Verificar partidas concluídas

---

**Desenvolvido por Jeremias O Nunes**  
*Sistema completo para competições de robótica*