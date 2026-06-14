# 🍃 Banca Verde

Sistema Full Stack de gerenciamento de estoque desenvolvido utilizando **ASP.NET Core Web API**, **Entity Framework Core**, **PostgreSQL** e **React**.

O projeto foi criado com o objetivo de simular um sistema real utilizado por empresas para controle de estoque, produtos, categorias, usuários e movimentações, aplicando conceitos amplamente utilizados no mercado de desenvolvimento de software.

---

# 🌐 Demonstração Online

### Sistema Web

https://banca-verde.vercel.app

### Documentação da API

https://bancaverde-api.onrender.com/swagger

---

## 🔑 Acesso para Demonstração

Para facilitar a avaliação do sistema, utilize as credenciais abaixo:

### Administrador

Email:
[admin@teste.com](mailto:admin@teste.com)

Senha:
123456

### Usuário Comum

Email:
[user@teste.com](mailto:user@teste.com)

Senha:
123456

---

# 🚀 Principais Funcionalidades

✅ Autenticação JWT

✅ Controle de acesso por perfil (Admin e User)

✅ Dashboard Analítico

✅ Gestão de Produtos

✅ Gestão de Categorias

✅ Gestão de Usuários

✅ Registro de Vendas

✅ Histórico de Movimentações (Para Admins)

✅ Paginação de Dados

✅ Versionamento de API

✅ Middleware Global de Exceções

✅ Logs com Serilog

✅ Deploy em Produção

---

# 📸 Demonstração

## Tela de Login

![Login](screenshots/login.png)

---

## Dashboard

![Dashboard](screenshots/dashboard.png)

---

## Gestão de Produtos

![Produtos](screenshots/produtos.png)

---

## Gestão de Categorias

![Categorias](screenshots/categorias.png)

---

## Gestão de Usuários

![Usuários](screenshots/usuarios.png)

---

## Registro de Vendas

![Vendas](screenshots/vendas.png)

---

## Histórico de Movimentações

![Movimentações](screenshots/movimentacoes.png)

---

# 🏗 Arquitetura da Aplicação

```text
Frontend (React + Vite)
        │
        ▼
Axios
        │
        ▼
ASP.NET Core Web API
        │
        ▼
Entity Framework Core
        │
        ▼
PostgreSQL
```

---

# ✨ Funcionalidades

## 🔐 Autenticação e Segurança

* Login com JWT
* Senhas protegidas com BCrypt
* Controle de acesso por Roles
* Rotas protegidas
* Endpoints protegidos
* Middleware global para tratamento de exceções

---

## 📦 Gestão de Produtos

* Cadastro de produtos
* Edição de produtos
* Exclusão de produtos
* Busca por nome
* Controle de estoque
* Paginação
* Visualização detalhada
* Associação com categorias

---

## 🏷 Gestão de Categorias

* Cadastro
* Edição
* Exclusão
* Associação com produtos

---

## 👥 Gestão de Usuários

* Cadastro
* Controle de permissões
* Diferenciação entre Admin e User

---

## 💰 Registro de Vendas

* Baixa automática do estoque
* Validação de quantidade disponível
* Registro automático da movimentação

---

## 📋 Histórico de Movimentações

O sistema registra automaticamente:

* CREATE
* UPDATE
* DELETE
* SALE

Além de armazenar:

* Usuário responsável
* Produto afetado
* Estoque anterior
* Estoque atualizado
* Data da operação

---

## 📊 Dashboard Analítico

Indicadores disponíveis:

* Total de Produtos
* Total de Categorias
* Total de Usuários
* Estoque Total
* Valor Total do Estoque
* Produtos com Estoque Baixo
* Produto Mais Caro
* Produto Mais Barato
* Categoria com Mais Produtos
* Total de Vendas
* Quantidade Vendida
* Última Venda
* Produto Mais Vendido

---

# 🔒 Segurança

A aplicação utiliza:

* JWT Authentication
* Role Based Authorization
* BCrypt Password Hashing
* Middleware Global de Exceções

Exemplo de autenticação:

```http
Authorization: Bearer {token}
```

---

# 📄 Versionamento da API

Versão atual:

```http
/api/v1
```

Exemplos:

```http
GET /api/v1/Products
GET /api/v1/Categories
GET /api/v1/Users
GET /api/v1/Dashboard
```

O versionamento permite evolução futura da API sem quebrar integrações existentes.

---

# 📑 Paginação

Exemplo:

```http
GET /api/v1/Products?page=1&pageSize=10
```

---

# 📝 Logs

Implementados utilizando Serilog.

Eventos registrados:

* Requisições HTTP
* Exceções
* Erros
* Operações da aplicação

Arquivos:

```text
Logs/log-yyyyMMdd.txt
```

---

# ☁️ Deploy

## Frontend

* Vercel

## Backend

* Render

## Banco de Dados

* Banco de Dados:
• SQL Server (desenvolvimento)
• PostgreSQL (produção)

---

# 🛠 Tecnologias Utilizadas

## Backend

* ASP.NET Core
* Entity Framework Core
* PostgreSQL
* JWT
* BCrypt
* Serilog
* Swagger
* API Versioning

## Frontend

* React
* Vite
* Axios
* React Router DOM
* React Toastify
* SweetAlert2
* Recharts

---

# 📂 Estrutura do Projeto

```text
BancaVerde

├── backend
│   ├── Controllers
│   ├── DTOs
│   ├── Models
│   ├── Data
│   ├── Responses
│   ├── Middlewares
│   └── Logs
│
├── frontend
│   ├── Components
│   ├── Pages
│   ├── Routes
│   ├── Services
│   └── Assets
│
├── screenshots
│
└── README.md
```

---

# ⚙️ Executando Localmente

## Backend

```bash
dotnet restore

dotnet ef database update

dotnet run
```

Swagger:

```text
http://localhost:5092/swagger
```

---

## Frontend

```bash
npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🧠 Conceitos Aplicados

Durante o desenvolvimento foram utilizados conceitos de:

* APIs REST
* Entity Framework Core
* PostgreSQL
* JWT Authentication
* Authorization
* DTOs
* Middleware
* Logging
* Paginação
* Versionamento de API
* React
* Axios
* Consumo de APIs
* Dashboards Analíticos
* Deploy em Produção

---

# 🔮 Melhorias Futuras

* Refresh Token
* Upload de Imagens
* Exportação para Excel
* Relatórios PDF
* Docker Compose
* CI/CD
* Testes Automatizados
* Cache Distribuído

---

# 👨‍💻 Desenvolvedor

**Guilherme Cavalcante**

Desenvolvedor Full Stack focado em desenvolvimento de aplicações web utilizando tecnologias modernas do ecossistema .NET e JavaScript.

Este projeto foi desenvolvido para demonstrar conhecimentos práticos em:

* ASP.NET Core
* Entity Framework Core
* PostgreSQL
* React
* JWT Authentication
* Arquitetura de APIs REST
* Deploy em Produção
* Boas práticas de desenvolvimento

---

# 📌 Status do Projeto

🟢 Projeto Concluído e Publicado

* Frontend em Produção
* Backend em Produção
* Banco de Dados em Produção
* API Versionada
* Paginação Implementada
* Logs Implementados
* JWT Implementado
* Controle de Permissões Implementado
* Sistema Operacional em Ambiente Real
