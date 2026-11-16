# E-Commerce REST API

A type-safe backend API for managing users, products, categories, and orders.

## Tech Stack
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB, Mongoose (ODM)
- **Validation & Docs:** Zod, Swagger UI (`swagger-ui-express`)

## Key Features
- **CRUD Operations:** Full REST endpoints for Users, Products, Categories, and Orders.
- **Request Validation:** Middleware-level schema validation for request body, params, and query using Zod.
- **Security & Response Shaping:** Automatic exclusion of sensitive fields (`password`, `__v`) and `_id` to `id` transformation.
- **Centralized Error Handling:** Unified error responses and CORS configuration.
- **API Documentation:** Interactive OpenAPI/Swagger UI available at `/docs`.
