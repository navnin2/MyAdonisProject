# My AdonisJS Backend Assessment

> **Stack:** AdonisJS v6 · MySQL · TypeScript

## Project Overview

This project was built as a single AdonisJS v6 application containing
all four assessment levels. The goal was not only to complete the
requested APIs but also to follow good backend engineering practices
such as separation of concerns, validation, authentication, structured
logging, reusable services, proper database design, and secure token
management.

The project is organized around the following principles:

- Controllers contain only request/response logic.
- Business logic lives inside the `app/services` directory.
- Validation is handled through dedicated validator classes.
- Database access is handled through Lucid ORM.
- Authentication uses JWT access tokens and hashed refresh tokens.
- Authorization is enforced using RBAC middleware.
- Expired refresh tokens are automatically cleaned by the scheduler.

---

# Technology Stack

- AdonisJS v6
- TypeScript
- Lucid ORM
- MySQL
- JWT Authentication
- Adonis Hash Service
- Japa (Testing)

---

# Packages Used

Package Why it was used

---

@adonisjs/core Main framework
@adonisjs/lucid ORM and migrations
mysql2 MySQL driver
@adonisjs/auth Authentication
jsonwebtoken JWT creation and verification
@adonisjs/hash Password hashing
@adonisjs/scheduler Daily cleanup task
vinejs Request validation
luxon Date handling

---

# Project Structure

```text
app/
 ├── controllers/
 ├── middleware/
 ├── models/
 ├── services/
 ├── validators/
database/
 ├── migrations/
 ├── seeders/
 └── raw-queries.sql
start/
 └── routes.ts
```

---

# Installation

```bash
npm create adonisjs@latest [project-name] -- --kit=api

cd my-adonis-project

npm install

cp .env.example .env

node ace migration:run

node ace db:seed

npm run dev
```

---

# Environment Variables

```bash
  Variable      Description
  ------------- ------------------------
  PORT          Server port
  HOST          Application host
  APP_KEY       Adonis encryption key
  NODE_ENV      Runtime environment
  DB_HOST       MySQL server
  DB_PORT       MySQL port
  DB_USER       Database username
  DB_PASSWORD   Database password
  DB_DATABASE   Database name
  JWT_SECRET    Secret for signing JWT
```

The application validates all required environment variables using
`Env.schema`. If any required variable is missing, the application fails
during startup instead of producing runtime errors.

---

# Architecture Decisions

The application follows a layered architecture.

- Controllers receive HTTP requests.
- Validators validate incoming data.
- Services contain business logic.
- Models communicate with the database.
- Middleware handles cross-cutting concerns like authentication, RBAC,
  and logging.

This separation keeps controllers small, improves maintainability, and
makes business logic easier to test.

---

# Logger Middleware

A global middleware logs every request using Adonis Logger.

Example:

```text
GET /api/products 200 15ms
```

Using `ctx.logger` integrates with Adonis logging and supports different
log transports and environments.

---

# Global Exception Handler

All application errors are converted into a consistent JSON response.

Development returns useful debugging information.

Production never exposes stack traces or internal implementation
details.

---

# Health Endpoint

```http
GET /health
```

Returns:

```json
{
  "status": "ok",
  "uptime": 152,
  "timestamp": "2026-07-04T18:30:00Z"
}
```

---

# Level 1 Answers

## 1. Global middleware vs Route middleware

Global middleware executes for every incoming request. It is best suited
for logging, security headers, request timing, CORS, or features that
every request should pass through.

Route middleware only executes on routes where it is explicitly applied.
This is ideal for authentication, role checks, or permissions that only
certain endpoints require.

## 2. Dependency Injection

Dependency Injection allows classes to receive their dependencies
instead of creating them internally.

Instead of importing and instantiating services everywhere, Adonis
resolves them through the IoC container. This reduces coupling,
simplifies testing, and allows implementations to be replaced without
modifying consumers.

## 3. Env.schema

`Env.schema` validates configuration before the application starts.

Without it, missing variables might remain unnoticed until the affected
code executes, leading to runtime failures that are harder to debug.

---

# Level 2 Answers

## Soft Deletes

The SoftDeletes mixin automatically updates `deleted_at` instead of
physically removing records. Queries automatically ignore deleted rows.

Without it, every query would require:

```sql
WHERE deleted_at IS NULL
```

which is repetitive and easy to forget.

## Cursor Pagination

Cursor pagination performs significantly better on large datasets
because it uses indexed values instead of scanning skipped rows.

Offset pagination becomes increasingly expensive as tables grow beyond
hundreds of thousands or millions of rows.

## PUT vs PATCH

PUT replaces an entire resource.

PATCH modifies only supplied fields.

Using PUT with missing properties could accidentally overwrite existing
values with NULL or defaults, while PATCH preserves unchanged fields.

---

# Level 3 Design

## Entities

- Users
- Products
- Categories
- Orders
- Order Items
- Reviews
- Refresh Tokens

## Relationships

- Category has many Products.
- User has many Orders.
- Order has many Order Items.
- Product belongs to Category.
- Product has many Reviews.
- User writes Reviews.

The order_items table stores the unit price separately to preserve
historical pricing. If a product price changes later, old invoices and
revenue reports remain accurate.

## NOT EXISTS vs NOT IN

`NOT EXISTS` is safer because NULL values inside a NOT IN subquery can
cause unexpected empty results.

## Revenue Report

Months with no orders should still appear with revenue 0. This can be
achieved using a calendar table or recursive CTE combined with a LEFT
JOIN.

## preload()

`preload()` avoids the N+1 query problem by loading related records
efficiently.

Loading relationships inside loops creates unnecessary database queries
and significantly impacts performance.

---

# Level 4 Authentication

## Authentication Flow

1.  Register user.
2.  Password hashed before storage.
3.  Login validates credentials.
4.  Access token (15 min) generated.
5.  Refresh token (7 days) generated.
6.  Refresh token hashed before database storage.
7.  Client stores raw refresh token.
8.  Refresh endpoint rotates token.
9.  Old token revoked immediately.
10. Logout revokes refresh token.

## Why hash refresh tokens?

If the refresh_tokens table is leaked, attackers cannot directly reuse
hashed tokens. This provides similar protection to password hashing.

## Refresh Token Rotation

Every refresh request invalidates the old refresh token and issues a new
one.

If an attacker attempts to reuse an old token after rotation, the
application detects that it has already been revoked, indicating
possible token theft.

## Authentication vs Authorization

Authentication verifies identity.

Authorization determines permissions.

Example:

Authentication: User logs in using email and password.

Authorization: RBAC middleware checks whether the authenticated user has
the Admin role before allowing access.

## Guards

A guard defines how users are authenticated.

Multiple guards are useful when an application supports different
authentication mechanisms, such as JWT for APIs and session
authentication for an admin dashboard.

---

# Security Considerations

- Passwords are hashed.
- Refresh tokens are hashed.
- JWT expiration is short.
- Token rotation implemented.
- Input validation everywhere.
- Soft deletes protect accidental data loss.
- Structured exception handling.
- Role-based authorization.

---

# Future Improvements

- Redis caching
- Rate limiting
- Audit logging
- OpenAPI documentation
- Docker deployment
- CI/CD pipeline
- Monitoring with Prometheus/Grafana

---

# Conclusion

The project emphasizes clean architecture, maintainability, security,
and scalability while following AdonisJS best practices. The
implementation focuses on production-oriented patterns rather than
simply making the APIs functional.
