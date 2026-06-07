#  Banca Verde

Sistema Full Stack de gerenciamento de estoque desenvolvido com **ASP.NET Core**, **Entity Framework Core**, **SQL Server** e **React**.

O projeto foi desenvolvido para simular um sistema real de gestão de estoque, incluindo autenticação JWT, controle de acesso por perfil, dashboard analítico, movimentação de estoque, versionamento de API, paginação e geração de logs.

---

## 🚀 Destaques do Projeto

✔ Autenticação JWT

✔ Controle de acesso por Roles (Admin e User)

✔ Dashboard Analítico

✔ Gestão de Produtos

✔ Gestão de Categorias

✔ Gestão de Usuários

✔ Registro de Vendas

✔ Histórico de Movimentações

✔ Paginação

✔ Versionamento de API

✔ Logs com Serilog

✔ Middleware Global de Exceções

---

# 📸 Demonstração

## Login

![Login](screenshots/login.png)

---

## Dashboard

![Dashboard](screenshots/dashboard.png)

---

## Produtos

![Produtos](screenshots/produtos.png)

---

## Categorias

![Categorias](screenshots/categorias.png)

---

## Usuários

![Usuários](screenshots/usuarios.png)

---

## Vendas

![Vendas](screenshots/vendas.png)

---

## Movimentações

![Movimentações](screenshots/movimentacoes.png)

---

# 🏗 Arquitetura

```text
React
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
SQL Server
```

---

# ✨ Funcionalidades

## 🔐 Autenticação

- Login JWT
- BCrypt para criptografia de senha
- Controle de acesso por perfil
- Rotas protegidas
- Endpoints protegidos

---

## 📦 Produtos

- Cadastro
- Edição
- Exclusão
- Busca
- Ordenação
- Filtros
- Paginação
- Controle de estoque
- Visualização detalhada

---

## 🏷 Categorias

- Cadastro
- Edição
- Exclusão
- Associação com produtos

---

## 👥 Usuários

- Cadastro
- Edição
- Exclusão
- Controle de permissões

---

## 💰 Vendas

- Registro de venda
- Validação de estoque
- Atualização automática do estoque
- Registro automático de movimentação

---

## 📋 Movimentações Para Usuários ADM

Registro de:

- CREATE
- UPDATE
- DELETE
- SALE

com:

- Usuário responsável
- Produto afetado
- Estoque anterior
- Estoque atual
- Data da operação

---

## 📊 Dashboard

Indicadores disponíveis:

- Total de Produtos
- Total de Categorias
- Total de Usuários
- Estoque Total
- Produtos com Estoque Baixo
- Valor Total do Estoque
- Produto Mais Caro
- Produto Mais Barato
- Categoria com Mais Produtos
- Total de Vendas
- Quantidade Vendida
- Última Venda
- Produto Mais Vendido

---

# 🔒 Segurança

O sistema utiliza:

- JWT Authentication
- Role Based Authorization
- BCrypt Password Hashing
- Middleware Global de Exceções

Exemplo:

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

Também suporta:

```http
search
category
sort
```

Exemplo:

```http
GET /api/v1/Products?page=1&pageSize=10&search=banana&category=Frutas&sort=name-asc
```

---

# 📝 Logs

Implementados utilizando Serilog.

Exemplos registrados:

- Requisições HTTP
- Erros
- Exceções
- Operações do sistema

Arquivos:

```text
Logs/log-yyyyMMdd.txt
```

---

# 🛠 Tecnologias

## Backend

- ASP.NET Core
- Entity Framework Core
- SQL Server
- JWT
- BCrypt
- Serilog
- Swagger
- API Versioning

## Frontend

- React
- React Router DOM
- Axios
- React Toastify
- SweetAlert2
- Recharts

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

# ⚙ Como Executar

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

# 🧠 Conhecimentos Aplicados

Durante o desenvolvimento foram utilizados conceitos de:

- APIs REST
- Entity Framework Core
- SQL Server
- JWT Authentication
- Authorization
- DTOs
- Middleware
- Logging
- Paginação
- Versionamento de API
- React
- Axios
- Consumo de APIs
- Dashboards Analíticos

---

# 🔮 Melhorias Futuras

- Refresh Token
- Upload de Imagens
- Relatórios PDF
- Exportação Excel
- Docker
- CI/CD
- Testes Automatizados

---

# 👨‍💻 Autor

**Guilherme Cavalcante**

Projeto desenvolvido para estudo e demonstração de competências Full Stack utilizando tecnologias amplamente utilizadas no mercado.

---

## 📌 Status

🟢 Projeto Concluído

- Backend Finalizado
- Frontend Finalizado
- Paginação Implementada
- Logs Implementados
- API Versionada
- Pronto para Deploy
