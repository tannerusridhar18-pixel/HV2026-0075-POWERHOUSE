# MSME SmartBiz Hub

MSME SmartBiz Hub is a web-based business management platform designed to help Micro, Small, and Medium Enterprises (MSMEs) manage their business operations through a centralized application.

The project provides a modern web interface with a React frontend, a Java Spring Boot backend, and a MySQL database.

## 🚀 Project Overview

MSME SmartBiz Hub provides a centralized platform for managing common business operations such as:

* User registration and authentication
* Business dashboard
* Customer management
* Product and business information
* Order management
* Invoice management
* Business insights and analytics
* Database-backed business records

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* JavaScript
* HTML5
* CSS
* npm

### Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Hibernate
* Maven
* REST APIs

### Database

* MySQL
* MySQL Connector/J

### Deployment

* Frontend: Vercel
* Backend: Railway
* Database: Railway MySQL
* Source Control: GitHub

## 📁 Project Structure

```text
HV2026-0075-POWERHOUSE/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── pom.xml
│   └── ...
│
├── .gitignore
├── Jenkinsfile
└── README.md
```

## 💻 Running the Frontend Locally

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

To create a production build:

```bash
npm run build
```

The production build is generated inside:

```text
frontend/dist/
```

## ☕ Running the Backend Locally

Navigate to the backend directory:

```bash
cd backend
```

Build the Spring Boot application:

### Windows

```bash
.\mvnw.cmd clean package
```

### Git Bash

```bash
bash mvnw clean package
```

Run the application:

```bash
java -jar target/msme-business-hub-0.0.1-SNAPSHOT.jar
```

The backend runs locally on:

```text
http://localhost:8080
```

## 🗄️ Database Configuration

The backend uses MySQL.

The application supports environment variables for database configuration.

```properties
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/msme_smartbiz_hub?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata}

spring.datasource.username=${DB_USERNAME:root}

spring.datasource.password=${DB_PASSWORD:YOUR_LOCAL_PASSWORD}
```

### Environment Variables

| Variable      | Description                              |
| ------------- | ---------------------------------------- |
| `DB_URL`      | MySQL JDBC connection URL                |
| `DB_USERNAME` | MySQL username                           |
| `DB_PASSWORD` | MySQL password                           |
| `PORT`        | Port provided by the deployment platform |

**Never commit real database passwords, API keys, or other secrets to GitHub.**

## 🌐 Deployment

### Frontend — Vercel

The React/Vite frontend is deployed using Vercel.

The Vercel project uses:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Backend — Railway

The Spring Boot backend is deployed using Railway.

Because the repository contains both frontend and backend applications, the Railway service uses:

```text
Root Directory: /backend
```

The backend is built from the Maven project:

```text
backend/pom.xml
```

### Database — Railway MySQL

The application uses a Railway MySQL service for the production database.

The Spring Boot backend connects to the Railway MySQL service using environment variables rather than hard-coded production credentials.

## 🔐 Security

The following files and values should not be committed to GitHub:

```text
.env
.env.local
node_modules/
dist/
database passwords
API keys
private credentials
```

Production secrets should be configured through the deployment platform's environment-variable settings.

## 🔄 Git Workflow

Clone the repository:

```bash
git clone https://github.com/tannerusridhar18-pixel/HV2026-0075-POWERHOUSE.git
```

Create a branch:

```bash
git checkout -b feature/your-feature-name
```

Check changes:

```bash
git status
```

Add changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Describe your change"
```

Push the branch:

```bash
git push origin feature/your-feature-name
```

## 🧪 Build Verification

### Frontend

```bash
cd frontend
npm install
npm run build
```

### Backend

```bash
cd backend
.\mvnw.cmd clean package
```

A successful frontend build should generate the `dist` directory.

A successful backend build should generate the Spring Boot JAR inside:

```text
backend/target/
```

## 👥 Contributors

This project is developed collaboratively using GitHub.

Contributors can work on separate branches and create pull requests for merging changes into the `main` branch.

## 📌 Project Status

### Completed

* Frontend development
* Vite production build
* Vercel frontend deployment
* Spring Boot backend deployment setup
* Railway MySQL database setup
* GitHub repository integration

### In Progress

* Production database connectivity
* Frontend-to-backend API integration
* CORS configuration
* Production authentication testing
* End-to-end deployment testing

## 📄 License

This project is developed for educational and hackathon purposes.
