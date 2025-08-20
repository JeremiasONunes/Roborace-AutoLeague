# RoboRace - Sistema de Gerenciamento de Competições de Robótica

## 📋 Visão Geral

O RoboRace é um sistema web completo para gerenciamento de competições de robótica, desenvolvido em React com Vite. O sistema permite organizar equipes, criar grupos, gerar chaves de competição, gerenciar partidas e acompanhar rankings em tempo real.

## 🏗️ Arquitetura do Sistema

### Estrutura de Pastas
```
roborace/
├── roboRaceFrontend/
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis
│   │   ├── context/            # Contextos React (Auth e Data)
│   │   ├── hooks/              # Hooks customizados
│   │   ├── pages/              # Páginas da aplicação
│   │   ├── App.jsx             # Componente principal
│   │   └── main.jsx            # Ponto de entrada
│   ├── public/                 # Arquivos estáticos
│   └── package.json            # Dependências e scripts
```

### Tecnologias Utilizadas
- **Frontend**: React 19.1.1 + Vite 7.1.2
- **Roteamento**: React Router DOM 7.8.1
- **Estilização**: TailwindCSS 4.1.12
- **Ícones**: Lucide React 0.540.0
- **Armazenamento**: LocalStorage (persistência local)

## 🔐 Sistema de Autenticação

### Credenciais de Acesso
- **Usuário**: `admin`
- **Senha**: `admin123`

### Funcionalidades de Auth
- Login com validação de credenciais
- Persistência de sessão via localStorage
- Proteção de rotas administrativas
- Logout com limpeza de sessão

## 📊 Estrutura de Dados

### Modelo de Dados Principal
```javascript
{
  teams: [
    {
      id: number,
      name: string,
      createdAt: string (ISO)
    }
  ],
  groups: [
    {
      id: number,
      name: string,
      teams: Array<Team>,
      createdAt: string (ISO)
    }
  ],
  matches: [
    {
      id: number,
      team1: Team,
      team2: Team,
      status: 'pending' | 'completed',
      winner: Team | null,
      draw: boolean,
      phase: string,
      createdAt: string (ISO),
      completedAt?: string (ISO)
    }
  ],
  rankings: [
    {
      team: Team,
      points: number,
      wins: number,
      draws: number,
      losses: number,
      position: number,
      group: string
    }
  ]
}
```

## 🎯 Funcionalidades Principais

### 1. Gerenciamento de Equipes (`/teams`)
- **Cadastro**: Adicionar novas equipes com validação de nome
- **Listagem**: Visualizar todas as equipes cadastradas
- **Remoção**: Excluir equipes (remove automaticamente de grupos e partidas)
- **Geração Automática**: Criar chaves aleatórias com todas as equipes

### 2. Organização em Grupos (`/groups`)
- **Criação de Grupos**: Organizar equipes em grupos específicos
- **Gestão de Membros**: Adicionar/remover equipes dos grupos
- **Validação**: Uma equipe só pode estar em um grupo por vez
- **Geração de Chaves**: Criar partidas automáticas dentro de cada grupo

### 3. Gerenciamento de Partidas (`/matches`)
- **Criação Manual**: Criar partidas específicas entre duas equipes
- **Definição de Resultados**: Marcar vitória, empate ou derrota
- **Fases Personalizadas**: Definir fase da competição (Grupos, Semifinal, etc.)
- **Reset de Resultados**: Possibilidade de alterar resultados já definidos

### 4. Sistema de Ranking (`/ranking`)
- **Cálculo Automático**: Atualização em tempo real baseada nos resultados
- **Critérios de Desempate**: Pontos → Vitórias → Derrotas
- **Visualização Completa**: Posição, pontos, vitórias, empates e derrotas
- **Destaque de Posições**: Pódio com cores diferenciadas

### 5. Sistema de Fases (`/phases`)
- **Evolução Automática**: Progressão por fases baseada na pontuação
- **Timeline Visual**: Acompanhamento do progresso da competição
- **Classificação Automática**: Equipes classificadas para próximas fases
- **Geração de Eliminatórias**: Criação automática de partidas eliminatórias

### 6. Painel Administrativo (`/admin`)
- **Estatísticas Gerais**: Resumo de equipes, grupos, partidas e fase atual
- **Controle de Fases**: Avanço manual entre fases da competição
- **Backup/Restore**: Exportar/importar dados em JSON
- **Geração de Chaves**: Acesso rápido às funções de geração
- **Reset Completo**: Limpeza total dos dados (com confirmação)

### 7. Visualização Pública (`/view`)
- **Acesso Sem Login**: Página pública para acompanhamento
- **Atualização Automática**: Dados atualizados a cada segundo
- **Interface Otimizada**: Design focado na visualização de resultados
- **Informações em Tempo Real**: Ranking, próximas partidas, resultados

## ⚙️ Regras de Negócio

### Sistema de Pontuação
- **Vitória**: 3 pontos
- **Empate**: 1 ponto
- **Derrota**: 0 pontos

### Critérios de Classificação (em ordem de prioridade)
1. **Pontos totais** (maior número)
2. **Número de vitórias** (maior número)
3. **Número de derrotas** (menor número)

### Sistema de Fases da Competição

#### Fases Disponíveis
1. **Fase de Grupos**: Partidas dentro dos grupos criados
2. **Oitavas de Final**: 16 melhores equipes (8 partidas)
3. **Quartas de Final**: 8 melhores equipes (4 partidas)
4. **Semifinais**: 4 melhores equipes (2 partidas)
5. **Final**: 2 melhores equipes (1 partida)

#### Evolução entre Fases
- **Automática**: Sistema detecta quando todas as partidas da fase atual estão concluídas
- **Classificação**: Equipes são classificadas automaticamente baseadas no ranking
- **Geração de Partidas**: Partidas eliminatórias são criadas automaticamente
- **Emparelhamento**: Melhor classificado vs pior classificado em cada confronto

#### Critérios de Classificação por Fase
- **Oitavas**: Top 16 equipes do ranking geral
- **Quartas**: Top 8 equipes do ranking geral
- **Semifinais**: Top 4 equipes do ranking geral
- **Final**: Top 2 equipes do ranking geral

### Geração de Chaves

#### 1. Chaves Aleatórias
- **Requisito**: Mínimo 2 equipes cadastradas
- **Funcionamento**: Embaralha todas as equipes e cria pares aleatórios
- **Resultado**: Partidas com fase "Chave Aleatória"
- **Uso**: Competições simples sem divisão por grupos

#### 2. Chaves por Grupos
- **Requisito**: Grupos criados com pelo menos 2 equipes cada
- **Funcionamento**: Cria todas as combinações possíveis dentro de cada grupo
- **Algoritmo**: Para n equipes em um grupo, gera n×(n-1)/2 partidas
- **Resultado**: Partidas com o nome do grupo como fase
- **Uso**: Competições com fase de grupos seguida de eliminatórias

### Validações e Restrições

#### Equipes
- Nome obrigatório e único
- Não pode estar vazia (trim aplicado)
- Remoção cascata (remove de grupos e partidas)

#### Grupos
- Nome obrigatório
- Uma equipe por grupo (exclusividade)
- Mínimo 2 equipes para gerar partidas

#### Partidas
- Equipes diferentes obrigatórias
- Status controlado (pending → completed)
- Resultados mutuamente exclusivos (vitória OU empate)
- Possibilidade de reset para recontagem

## 🔄 Fluxo de Competição Recomendado

### Configuração Inicial
1. **Cadastrar Equipes**: Adicionar todas as equipes participantes
2. **Criar Grupos** (opcional): Organizar equipes em grupos para fase inicial
3. **Gerar Chaves**: Usar geração automática ou criar partidas manualmente

### Durante a Competição
1. **Fase de Grupos**: Definir resultados das partidas dos grupos
2. **Acompanhar Ranking**: Verificar classificação atualizada automaticamente
3. **Avançar Fases**: Sistema detecta automaticamente quando pode avançar
4. **Fases Eliminatórias**: Partidas únicas com eliminação direta
5. **Visualização Pública**: Usar `/view` para exibição ao público

### Funcionalidades Avançadas
1. **Controle de Fases**: Gerenciar progressão da competição em `/phases`
2. **Backup Regular**: Exportar dados periodicamente
3. **Reset Seletivo**: Resetar partidas específicas se necessário
4. **Timeline Visual**: Acompanhar progresso em tempo real

## 🌐 Modos de Visualização

### Modo Administrativo (Autenticado)
- Acesso completo a todas as funcionalidades
- Criação, edição e exclusão de dados
- Geração automática de chaves
- Backup e restauração

### Modo Público (`/view`)
- Visualização somente leitura
- Atualização automática a cada segundo
- Interface otimizada para exibição
- Ideal para projeção em telões

## 💾 Persistência de Dados

### LocalStorage
- **Chave**: `roborace_data`
- **Formato**: JSON com toda a estrutura de dados
- **Sincronização**: Automática entre abas do navegador
- **Backup**: Função de exportação/importação manual

### Atualização em Tempo Real
- Hook `useRealTimeData` monitora mudanças no localStorage
- Intervalo de 1 segundo para verificação
- Event listener para mudanças entre abas
- Recálculo automático de rankings

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação e Execução
```bash
# Navegar para o diretório do frontend
cd roboRaceFrontend

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Acesso
- **Desenvolvimento**: http://localhost:5173
- **Administrativo**: http://localhost:5173 (login necessário)
- **Público**: http://localhost:5173/view (sem login)

## 🔧 Configurações Técnicas

### Vite Configuration
- Plugin React para JSX
- TailwindCSS integrado
- Hot Module Replacement (HMR)
- Build otimizado para produção

### ESLint Rules
- Configuração para React Hooks
- Regras de refresh automático
- Padrões de código JavaScript moderno

## 📈 Possíveis Melhorias Futuras

### Backend Integration
- API REST para persistência em banco de dados
- Autenticação JWT mais robusta
- WebSockets para atualizações em tempo real

### Funcionalidades Adicionais
- Sistema de usuários múltiplos
- Histórico de competições
- Relatórios e estatísticas avançadas
- Integração com sistemas externos

### Interface
- Modo escuro
- Responsividade aprimorada
- Animações e transições
- PWA (Progressive Web App)

## 📝 Considerações de Segurança

### Autenticação Atual
- Sistema básico com credenciais hardcoded
- Adequado para ambiente controlado/local
- **Não recomendado para produção pública**

### Recomendações para Produção
- Implementar autenticação JWT
- Validação server-side
- HTTPS obrigatório
- Rate limiting
- Sanitização de inputs

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Desenvolvedor

**Jeremias O Nunes**  
*Desenvolvedor Full Stack*

---

**Desenvolvido para competições de robótica educacional**  
*Sistema completo e intuitivo para gerenciamento de torneios*