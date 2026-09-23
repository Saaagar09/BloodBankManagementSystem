# Blood Bank Management System

A Spring Boot REST API for managing blood donors and recipients with **JWT-based authentication, role-based authorization, JPA/Hibernate, MySQL, DTO/entity separation, validation, soft deletion, and centralized exception handling**.

The project is structured as a learning-oriented backend application and demonstrates common patterns used in a Java/Spring Boot REST API.

---

## 🚀 Tech Stack

- **Java 21**
- **Spring Boot 4.1.0**
- **Spring Web MVC**
- **Spring Data JPA**
- **Hibernate / JPA**
- **MySQL**
- **Spring Security**
- **JWT (JJWT 0.12.6)**
- **Bean Validation**
- **Lombok**
- **Maven**

---

## ✨ Features

### Authentication & Authorization

- User registration
- User login
- BCrypt password hashing
- JWT token generation
- JWT authentication filter
- Role-based authorization
- `USER` and `ADMIN` roles
- Custom `401 Unauthorized` response
- Custom `403 Forbidden` response
- Protected donor and recipient endpoints

### Donor Management

- Add donor
- Get all donors
- Get donor by ID
- Partially update donor
- Delete donor
- Soft delete using `isDeleted`
- Authenticated users can update/delete their own donor record
- Donor record linked to the authenticated user

### Recipient Management

- Add recipient
- Get all recipients
- Get recipient by ID
- Partially update recipient
- Delete recipient
- Soft delete using `isDeleted`
- Authenticated users can update/delete their own recipient record
- Recipient record linked to the authenticated user

### Validation & Error Handling

- Request validation using Jakarta Bean Validation
- Custom validation messages
- Global exception handling using `@RestControllerAdvice`
- Custom `ResourceNotFoundException`
- Structured error responses
- Validation error response containing field-level errors

### Data & Persistence

- Spring Data JPA repositories
- MySQL persistence
- Entity ↔ DTO mapping
- One-to-one relationship between a user and donor/recipient records
- Soft-delete queries that exclude deleted records

---

## 🏗️ Project Structure

```text
src/main/java/com/example/bloodbankmanagementsystem/
│
├── controller/
│   ├── DonorController.java
│   └── RecipientController.java
│
├── dto/
│   ├── DonorDTO.java
│   ├── DonorUpdateDTO.java
│   ├── RecipientDTO.java
│   ├── RecipientUpdateDTO.java
│   └── auth/
│       ├── LoginDTO.java
│       └── RegisterDTO.java
│
├── entity/
│   ├── DonorEntity.java
│   ├── RecipientEntity.java
│   └── MyUser.java
│
├── exception/
│   ├── ErrorResponse.java
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── ValidationErrorResponse.java
│   └── security/
│       ├── CustomAccessDeniedHandler.java
│       └── CustomAuthenticationEntryPoint.java
│
├── mapper/
│   ├── DonorMapper.java
│   └── RecipientMapper.java
│
├── repository/
│   ├── DonorRepository.java
│   ├── RecipientRepository.java
│   └── MyUserRepository.java
│
├── security/
│   ├── MyAuthenticationProvider.java
│   ├── MyUserDetails.java
│   ├── MyUserDetailsService.java
│   ├── Role.java
│   │
│   ├── authcontroller/
│   │   └── AuthRegisterController.java
│   │
│   ├── authservice/
│   │   └── AuthRegisterService.java
│   │
│   ├── config/
│   │   └── SecurityConfig.java
│   │
│   └── jwt/
│       ├── JwtAuthenticationFilter.java
│       └── JwtService.java
│
├── service/
│   ├── DonorService.java
│   └── RecipientService.java
│
└── BloodBankManagementApplication.java
```

---

## 🔐 Authentication Flow

The application uses Spring Security with a custom authentication provider and JWT.

### Registration

```text
Client
  ↓
POST /api/auth/register
  ↓
AuthRegisterController
  ↓
AuthRegisterService
  ↓
BCryptPasswordEncoder
  ↓
MyUserRepository
  ↓
MySQL
```

The registered user is assigned the default `USER` role.

### Login

```text
Client
  ↓
POST /api/auth/login
  ↓
AuthenticationManager
  ↓
MyAuthenticationProvider
  ↓
MyUserDetailsService
  ↓
MyUserRepository
  ↓
Password verification
  ↓
JwtService
  ↓
JWT token returned
```

### Accessing a Protected Endpoint

The client sends the JWT in the request:

```http
Authorization: Bearer <JWT_TOKEN>
```

The request then follows this flow:

```text
HTTP Request
    ↓
JwtAuthenticationFilter
    ↓
Read Authorization header
    ↓
Extract JWT
    ↓
Validate JWT
    ↓
Load user using MyUserDetailsService
    ↓
Create Authentication object
    ↓
SecurityContextHolder
    ↓
SecurityFilterChain
    ↓
Check USER / ADMIN role
    ↓
Controller
```

---

## 👥 Roles & Authorization

The application currently defines two roles:

```java
public enum Role {
    USER,
    ADMIN
}
```

### USER

A normal registered user can:

- Create a donor record
- Create a recipient record
- Update their own donor record
- Delete their own donor record
- Update their own recipient record
- Delete their own recipient record

### ADMIN

An admin can access administrative donor/recipient operations such as:

- View donor records
- Get donor by ID
- Update donor records
- Delete donor records
- View recipient records
- Get recipient by ID
- Update recipient records
- Delete recipient records

Authorization is configured in `SecurityConfig`.

---

## 📬 API Endpoints

Base path:

```text
/api
```

### 🔑 Authentication APIs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Authenticate user and receive JWT |

---

### 🩸 Donor APIs

Base path:

```text
/api/bloodbank/Donor
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/bloodbank/Donor` | USER | Create donor |
| GET | `/api/bloodbank/Donor` | ADMIN | Get all active donors |
| GET | `/api/bloodbank/Donor/{id}` | ADMIN | Get donor by ID |
| PATCH | `/api/bloodbank/Donor/me` | USER | Update authenticated user's donor record |
| DELETE | `/api/bloodbank/Donor/me` | USER | Delete authenticated user's donor record |
| PATCH | `/api/bloodbank/Donor/{id}` | ADMIN | Update donor by ID |
| DELETE | `/api/bloodbank/Donor/{id}` | ADMIN | Delete donor by ID |

---

### 🏥 Recipient APIs

Base path:

```text
/api/bloodbank/Recipient
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/bloodbank/Recipient` | USER | Create recipient |
| GET | `/api/bloodbank/Recipient` | ADMIN | Get all active recipients |
| GET | `/api/bloodbank/Recipient/{id}` | ADMIN | Get recipient by ID |
| PATCH | `/api/bloodbank/Recipient/me` | USER | Update authenticated user's recipient record |
| DELETE | `/api/bloodbank/Recipient/me` | USER | Delete authenticated user's recipient record |
| PATCH | `/api/bloodbank/Recipient/{id}` | ADMIN | Update recipient by ID |
| DELETE | `/api/bloodbank/Recipient/{id}` | ADMIN | Delete recipient by ID |

---

## 🧾 Request Validation

Donor and recipient creation requests use Jakarta Bean Validation.

### Donor validation

- Name is required
- Age is required and must be at least 18
- City is required
- Blood group follows the supported format such as `A+`, `O-`, or `AB+`
- Contact number is required

### Recipient validation

- Name is required
- Age is required and must be at least 18
- City is required
- Units are required and must be at least 1
- Purpose is required
- Blood group must follow the supported format
- Contact number is required

Invalid requests are handled by `GlobalExceptionHandler`.

---

## 🗑️ Soft Delete

Donor and recipient records are not physically removed from the database.

Instead, the application sets:

```java
isDeleted = true;
```

Repository methods such as:

```java
findAllByIsDeletedFalse()
```

and:

```java
findByIdAndIsDeletedFalse(...)
```

ensure deleted records are excluded from normal operations.

---

## 🔄 DTO & Entity Separation

The project does not directly expose JPA entities through the donor and recipient APIs.

The flow is:

```text
Request DTO
    ↓
Mapper
    ↓
Entity
    ↓
Repository
    ↓
Database
```

For responses:

```text
Database
    ↓
Entity
    ↓
Mapper
    ↓
Response DTO
    ↓
Client
```

This keeps the API models separate from the persistence entities.

---

## ⚠️ Exception Handling

The project uses:

```java
@RestControllerAdvice
```

through `GlobalExceptionHandler`.

### Resource not found

Custom exception:

```java
ResourceNotFoundException
```

The response contains:

```json
{
  "message": "Donor not found With ID: 1",
  "status": 404,
  "timestamp": "..."
}
```

### Validation errors

Validation failures return field-level errors, for example:

```json
{
  "errors": {
    "name": "Name is required",
    "age": "Age must be >= 18"
  },
  "timestamp": "..."
}
```

### Security errors

The application also provides custom handlers for:

- `401 Unauthorized`
- `403 Forbidden`

---

## 🗄️ Database Configuration

The application uses MySQL.

Create a database named:

```sql
CREATE DATABASE bloodbank;
```

Then configure the database connection in:

```text
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bloodbank
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

The project currently uses Hibernate's `update` mode to update the database schema automatically during development.

> For a production deployment, credentials and JWT secrets should be supplied through environment variables or another secure configuration mechanism instead of being committed to source control.

---

## 🛠️ How to Run

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Open the project

Open the project in IntelliJ IDEA or another Java IDE.

### 3. Configure MySQL

Create the `bloodbank` database and update the MySQL username/password in `application.properties`.

### 4. Configure JWT secret

Set the `jwt.secret` property to a sufficiently long secret value.

### 5. Run the application

Using Maven:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

Or run:

```text
BloodBankManagementApplication.java
```

from IntelliJ IDEA.

---

## 🧪 Testing the API

A typical flow for testing the secured APIs is:

```text
1. Register a user
       ↓
2. Login
       ↓
3. Copy the JWT token
       ↓
4. Send JWT using Authorization header
       ↓
5. Call protected donor/recipient APIs
```

Example header:

```http
Authorization: Bearer <your-token>
```

You can test the APIs using tools such as Postman or another REST API client.

---

## 📌 Current Architecture

The application follows a layered structure:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
MySQL
```

Supporting layers:

```text
DTO ↔ Mapper ↔ Entity
```

Security:

```text
SecurityConfig
      ↓
SecurityFilterChain
      ↓
JwtAuthenticationFilter
      ↓
Authentication / Authorization
```

Exception handling:

```text
Controller
    ↓
Exception
    ↓
GlobalExceptionHandler
    ↓
Structured Error Response
```

---

## 📈 Project Evolution

The project has evolved from a basic CRUD application into a backend project demonstrating:

- REST API development
- DTO and entity separation
- Mapper layer
- Request validation
- Global exception handling
- Custom error responses
- JPA repositories
- Soft deletion
- User registration
- Login authentication
- BCrypt password hashing
- Custom `UserDetails`
- Custom `UserDetailsService`
- Custom `AuthenticationProvider`
- `AuthenticationManager`
- JWT generation
- JWT request filtering
- Role-based authorization
- User-specific `/me` operations
- Custom authentication and access-denied handlers
- Layered backend architecture

---

## 👨‍💻 Author

**Sagar**
