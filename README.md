# NestJS URL Shortener

# NestJS URL Shortener

![Node](https://img.shields.io/badge/node-18.x-green)
![NestJS](https://img.shields.io/badge/nestjs-%F0%9F%94%A5-red)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![Swagger](https://img.shields.io/badge/swagger-api-green)
![License](https://img.shields.io/github/license/williamfds/nestjs-url-shortener)

A simple and fast URL shortener built with NestJS, PostgreSQL, Redis and TypeORM.  
Um encurtador de URLs simples e rápido, construído com NestJS, PostgreSQL, Redis e TypeORM.

---

## Features | Funcionalidades

- Generate short links from long URLs / Gerar links curtos de URLs longas
- Track redirect statistics / Acompanhar estatísticas de redirecionamento
- Custom slugs support / Suporte a slugs personalizados
- Bilingual API documentation (EN/PT) / Documentação bilíngue da API (EN/PT)
- Rate-limiting via Throttler / Limitação de requisições

---

## Installation | Instalação

```bash
# 1. Clone the repository / Clone o repositório
git clone https://github.com/williamfds/nestjs-url-shortener.git
cd nestjs-url-shortener

# 2. Install dependencies / Instale as dependências
npm install
```

---

## Running with Docker | Executando com Docker

```bash
# Start all services / Subir todos os serviços
docker-compose up --build
```

> You will have PostgreSQL, Redis and the API running on http://localhost:3000  
> Você terá PostgreSQL, Redis e a API rodando em http://localhost:3000

---

## Environment Variables | Variáveis de Ambiente

Crie os arquivos `.env.development` e `.env.test` com base no `.env.example`.

### .env.example

```env
# PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASS=123
DATABASE_NAME=shortener

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# App
PORT=3000
```

- `.env.development`: usado no desenvolvimento local.
- `.env.test`: usado durante a execução dos testes e2e.

---

## Testing | Testes

```bash
# Run unit and integration tests / Rodar testes unitários e de integração
docker exec -it nestjs-url-shortener-app npm run test:e2e
```

> Make sure the test database exists:  
> Certifique-se de que o banco `shortener_test` exista.

---

## Swagger Documentation

- 🇺🇸 English: [http://localhost:3000/api](http://localhost:3000/api)
- 🇧🇷 Português: [http://localhost:3000/api-pt](http://localhost:3000/api-pt)

Explore the endpoints and try out the API directly from the browser.  
Explore os endpoints e teste a API diretamente pelo navegador.

---

## API Overview | Visão geral da API

| Method | Endpoint              | Description                              |
|--------|-----------------------|------------------------------------------|
| POST   | `/shorten`            | Create a new short URL                   |
| GET    | `/:slug`              | Redirect to the original URL             |
| GET    | `/stats/:slug`        | Get stats for a short URL                |
| PATCH  | `/slug/:slug`         | Update the slug of a short URL           |
| DELETE | `/slug/:slug`         | Delete a short URL                       |

---

## Technologies Used | Tecnologias Utilizadas

- **NestJS** – Framework backend
- **TypeORM** – ORM com suporte a PostgreSQL
- **PostgreSQL** – Banco relacional
- **Redis** – Armazenamento de cache
- **Swagger** – Documentação da API
- **Docker** – Containerização da aplicação

---

## 🧑‍💻 Author | Autor

William Ferreira da Silva  
[github.com/williamfds](https://github.com/williamfds)

---

## License | Licença

This project is licensed under the MIT License.  
Este projeto está licenciado sob a licença MIT.