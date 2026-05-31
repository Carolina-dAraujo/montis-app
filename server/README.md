# Montis API - Suporte à Sobriedade

Esta é a API completa para o aplicativo Montis, fornecendo todos os serviços necessários para o suporte à sobriedade.

## 🎯 **Sobre o Projeto**

Montis é um aplicativo de suporte à sobriedade voltado para adultos em recuperação do abuso de álcool. A proposta é fortalecer o engajamento contínuo dos usuários ao longo da jornada de recuperação, oferecendo uma experiência sensível, acolhedora e centrada no ser humano.

## 🚀 **Funcionalidades**

### **Authentication** 🔐
- Registro de usuários com email e senha
- Login com autenticação segura
- Gerenciamento de perfis de usuário
- Validação de senhas com regras específicas
- Tokens Firebase **ID token** no login/registro (header `Authorization: Bearer`)

### **Sobriety Tracking** 📊
- Rastreamento de dias de sobriedade
- Registro de recaídas
- Metas e marcos de conquista
- Estatísticas de progresso
- Histórico de sobriedade

### **Goals & Achievements** 🏆
- Definição de metas pessoais
- Sistema de conquistas
- Progresso visual
- Celebração de marcos

### **Support Features** 🤝
- Recursos de suporte
- Comunidade de usuários
- Ferramentas de ajuda

### **Notifications** 🔔
- Notificações push
- Lembretes personalizados
- Mensagens motivacionais

## 📋 **Requisitos de Senha**

A API aplica as mesmas regras de validação do frontend:

- **Mínimo 8 caracteres**
- **Pelo menos uma letra maiúscula (A-Z)**
- **Pelo menos uma letra minúscula (a-z)**
- **Pelo menos um número (0-9)**
- **Pelo menos um caractere especial** (`!@#$%^&*(),.?":{}|<>`)

## 🔗 **Endpoints da API**

### **Authentication** (`/auth`)
- `GET /auth/password-rules` - Obter regras de validação de senha
- `POST /auth/register` - Registrar novo usuário (retorna Firebase ID token)
- `POST /auth/login` - Fazer login (retorna Firebase ID token)
- `GET /auth/profile` - Obter perfil do usuário (protegido)
- `PUT /auth/onboarding` - Completar onboarding (protegido)
- `GET /auth/onboarding` / `GET /auth/onboarding/status` - Dados e status de onboarding
- `GET /auth/tracking/:date` - Registro diário de tracking (protegido)
- `PUT /auth/tracking/:date` - Salvar registro diário (protegido)
- `GET /auth/tracking/month?year=&month=` - Tracking do mês (`month` 1–12, protegido)
- `GET /auth/debug/user-data` - Debug (apenas `NODE_ENV !== production`)

### **Sobriety** (`/sobriety`)
- `GET /sobriety/data` - Dados de sobriedade do RTDB (protegido)
- `GET /sobriety/milestones` - Marcos disponíveis
- `POST /sobriety/start` - Iniciar rastreamento
- `POST /sobriety/relapse` - Registrar recaída

### **Crisis log** (`/crisis-log`)
- `GET /crisis-log` - Listar entradas (protegido)
- `POST /crisis-log` - Criar entrada (protegido)
- `PUT /crisis-log/:id` - Atualizar entrada (protegido)
- `DELETE /crisis-log/:id` - Remover entrada (protegido)

### **Emergency** 
- `GET/POST/PATCH/DELETE /emergency-contacts` - Contatos de emergência (protegido)
- `POST /emergency-alerts` - Enviar alerta (protegido; SMS ainda planejado)

### **Groups & preferences**
- `/groups/*` - Grupos AA do usuário e notificações
- `/preferences/*` - Preferências e permissões

### **Planejado** 🚧
- **Goals** (`/goals`) - Metas e conquistas
- **Notifications** (`/notifications`) - Notificações push

## 🛠️ **Tecnologias**

- **Backend**: NestJS (Node.js)
- **Autenticação**: Firebase Admin SDK
- **Banco de Dados**: Firebase Realtime Database/Firestore
- **Documentação**: Swagger/OpenAPI
- **Validação**: class-validator
- **Testes**: Jest

## ⚙️ **Configuração**

### **Variáveis de Ambiente**

Crie um arquivo `.env` no diretório `server/`:

```env
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_CREDENTIALS_PATH=path/to/firebase-credentials.json
PORT=3000
NODE_ENV=development
```

### **Instalação**

1. **Instalar dependências:**
```bash
cd server
npm install
```

2. **Configurar Firebase:**
   - Baixe sua chave de conta de serviço do Firebase Console
   - Coloque o arquivo JSON no diretório `server/`
   - Atualize o `FIREBASE_CREDENTIALS_PATH` no arquivo `.env`

3. **Iniciar servidor:**
```bash
npm run start:dev
```

4. **Acessar documentação:**
   - Abra `http://localhost:3000/api` no navegador

## 🧪 **Testes**

```bash
npm run test
```

## 🏗️ **Arquitetura**

### **Módulos**
- **FirebaseModule**: Operações do Firebase Admin SDK
- **AuthModule**: Autenticação e autorização
- **UsersModule**: Gerenciamento de usuários
- **SobrietyModule**: Rastreamento de sobriedade
- **GoalsModule**: Metas e conquistas (futuro)
- **SupportModule**: Recursos de suporte (futuro)
- **NotificationsModule**: Notificações (futuro)

### **Serviços**
- **FirebaseService**: Operações do Firebase
- **UsersService**: Lógica de negócio para usuários
- **SobrietyService**: Lógica de negócio para sobriedade
- **AuthGuard**: Proteção de rotas
- **PasswordValidator**: Validação de senhas

## 🔒 **Segurança**

- Validação de senhas no cliente e servidor
- Firebase gerencia hash e segurança de senhas
- Tokens JWT para gerenciamento de sessão
- Rotas protegidas requerem tokens Firebase válidos
- Requisitos de senha aplicados consistentemente
- CORS configurado para aplicações móveis

## 📱 **Integração Mobile**

A API é projetada para integração perfeita com o aplicativo React Native, fornecendo:

- Endpoints RESTful bem documentados
- Respostas JSON padronizadas
- Autenticação baseada em tokens
- Validação consistente entre frontend e backend
- Suporte a CORS para desenvolvimento

## 🚀 **Próximos Passos**

1. **Implementar GoalsModule** para metas e conquistas
2. **Adicionar SupportModule** para recursos de suporte
3. **Criar NotificationsModule** para notificações push
4. **Implementar AnalyticsModule** para análise de dados
5. **Adicionar testes E2E** para todos os endpoints
6. **Implementar cache** para melhor performance
7. **Adicionar rate limiting** para proteção contra abuso 