<div align="center">

<img src="https://img.shields.io/badge/Matrix-LMS-blue?style=for-the-badge&logo=book&logoColor=white" alt="Matrix LMS" />

# 📚 Matrix Library Management System

A full-stack web application for educational institution library management, featuring dual-role dashboards for students and administrators.

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Preview](https://img.shields.io/badge/🌐_LIVE_PREVIEW-Visit_Website-brightgreen?style=flat)](https://matrix-library-management-system-j1.vercel.app/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Overview](#-api-overview)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Matrix LMS** is a modern, responsive Library Management System designed for educational institutions. It provides a seamless experience for both students and administrators — from browsing and borrowing books to tracking activity logs, accessing digital resources, and monitoring real-time library analytics.

Key highlights:

- 🔐 **Dual-role authentication** — separate dashboards for Students and Admins
- 📖 **Full book lifecycle management** — catalog, borrow, return, and track
- 🌐 **Digital library** — integrated document access and downloads
- 📊 **Analytics dashboard** — comprehensive admin insights
- 🌙 **Dark mode** throughout the application
- 📱 **Mobile-optimized** responsive design

---

## 🚀 Live Preview

<div align="center">

### ✨ Try the Application Now

[![Live Demo](https://img.shields.io/badge/🌐_LIVE_PREVIEW-matrix--library--management--system-blue?style=for-the-badge&logoColor=white)](https://matrix-library-management-system-j1.vercel.app/)

**Frontend (Vercel):** https://matrix-library-management-system-j1.vercel.app/

**Backend API (Render):** https://matrix-library-management-system-de7y.onrender.com/

### 📝 Test Credentials

#### Student Account

```
Email: student@university.in
Password: student123
```

#### Admin Account

```
Email: admin@matrix.com
Password: admin123
```

</div>

---

## ✨ Features

### 👨‍🎓 Student Dashboard

| Feature            | Description                                   |
| ------------------ | --------------------------------------------- |
| Book Catalog       | Browse and search the full book inventory     |
| Borrow & Return    | Request books and track borrow history        |
| Activity Log       | View personal borrowing and activity timeline |
| Digital Library    | Access and download digital documents         |
| Seat Availability  | Check real-time library seat status           |
| Notifications      | Receive real-time alerts via WebSocket        |
| Profile Management | Update personal information and preferences   |

### 🛠️ Admin Dashboard

| Feature                  | Description                                |
| ------------------------ | ------------------------------------------ |
| Book Management          | Add, edit, delete, and categorize books    |
| User Management          | View and manage student/admin accounts     |
| Borrow Tracking          | Monitor all active and past borrow records |
| Analytics                | Visual reports on library usage and trends |
| Form Builder             | Create and manage custom submission forms  |
| Activity Logs            | System-wide event and activity monitoring  |
| Email Notifications      | Send automated emails via Nodemailer       |
| Google Drive Integration | Manage digital library documents           |

### 🔧 Technical Features

- JWT-based authentication with Bearer tokens
- Real-time WebSocket updates
- Dark mode support across all components
- Environment-based API URL configuration
- Secure middleware and input validation
- RESTful API with `/api` prefix

---

## 🛠 Tech Stack

### Backend

| Technology           | Purpose                  |
| -------------------- | ------------------------ |
| **Node.js**          | Runtime environment      |
| **Express.js**       | Web framework & REST API |
| **JWT**              | Stateless authentication |
| **Nodemailer**       | Email service            |
| **WebSocket**        | Real-time notifications  |
| **Google Drive API** | Digital document storage |

### Frontend

| Technology            | Purpose                    |
| --------------------- | -------------------------- |
| **React.js**          | UI library                 |
| **Framer Motion**     | Animations and transitions |
| **Tailwind CSS**      | Utility-first styling      |
| **Styled Components** | Component-level styling    |
| **React Icons**       | Icon library               |
| **Axios**             | HTTP client for API calls  |

---

## 📁 Project Structure

```
Matrix-Library-Management-System/
│
├── MatrixBackendAlphaVersion/          # Express.js backend
│   ├── src/
│   │   ├── controllers/                # Route handler logic
│   │   ├── models/                     # Database models/schemas
│   │   ├── routes/                     # API route definitions
│   │   ├── middleware/                 # Auth, validation, error handling
│   │   └── services/                   # Business logic & external services
│   ├── config/
│   │   └── db.js                       # Database connection configuration
│   ├── package.json
│   └── server.js                       # Application entry point
│
├── MatrixFrontEndAlphaVersion/         # React.js frontend
│   ├── src/
│   │   ├── views/                      # Page-level components
│   │   │   ├── student/                # Student dashboard pages
│   │   │   └── admin/                  # Admin dashboard pages
│   │   ├── components/                 # Reusable UI components
│   │   ├── hooks/                      # Custom React hooks
│   │   ├── contexts/                   # React context providers
│   │   └── api/                        # Axios API integration layer
│   ├── public/
│   ├── package.json
│   └── .env                            # Environment variables
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (for database)
- A Google account (for Google Drive integration, optional)
- Gmail app password (for Nodemailer email service, optional)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Narayaaana11/Matrix-Library-Management-System.git
   cd Matrix-Library-Management-System
   ```

2. **Install backend dependencies:**

   ```bash
   cd MatrixBackendAlphaVersion
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../MatrixFrontEndAlphaVersion
   npm install
   ```

### Environment Variables

#### Backend (`MatrixBackendAlphaVersion/.env`)

Create a `.env` file in the backend directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Google Drive (optional)
GOOGLE_APPLICATION_CREDENTIALS_BASE64=your_base64_encoded_credentials

# Frontend
FRONTEND_URL=http://localhost:3000
```

#### Frontend (`MatrixFrontEndAlphaVersion/.env`)

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
```

### Running the Application

#### Start the Backend

```bash
cd MatrixBackendAlphaVersion
npm start
# or for development with auto-reload:
npm run dev
```

The backend API will be running at: `http://localhost:5000/api`

#### Start the Frontend

Open a **new terminal** and run:

```bash
cd MatrixFrontEndAlphaVersion
npm start
```

The frontend will be running at: `http://localhost:3000`

> **Tip:** You can also use tools like [concurrently](https://www.npmjs.com/package/concurrently) to run both servers simultaneously.

### Deployment (Render)

For production deployment on Render:

#### Backend Deployment

1. Connect your GitHub repository to Render
2. Set **Root Directory** to `MatrixBackendAlphaVersion`
3. Set **Build Command** to `npm install`
4. Set **Start Command** to `npm start`
5. Add environment variables in Render dashboard:
   - All variables from `.env` with `NODE_ENV=production`
   - Update `FRONTEND_URL` to your frontend's Render URL

#### Frontend Deployment

1. Connect your GitHub repository to Render
2. Set **Root Directory** to `MatrixFrontEndAlphaVersion`
3. Set **Build Command** to `npm run build` or `npm install`
4. Set **Start Command** to `npm start`
5. Update `.env` with production URLs:
   ```env
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   REACT_APP_WS_URL=https://your-backend-url.onrender.com
   REACT_APP_ENVIRONMENT=production
   ```

**Current Live URL:** https://matrix-library-management-system-de7y.onrender.com

---

### Test Credentials

Use the following credentials to test the application:

#### Admin Account

```
Email: admin@matrix.com
Password: admin123
```

#### Student Account

```
Email: 24m11mc176@adityauniversity.in
Password: student123
```

---

## 📡 API Overview

All API endpoints are prefixed with `/api`. Authentication is required for most routes via a **Bearer token** in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| `POST` | `/api/auth/register` | Register a new user         |
| `POST` | `/api/auth/login`    | Login and receive JWT token |
| `POST` | `/api/auth/logout`   | Logout the current user     |
| `GET`  | `/api/auth/me`       | Get current user profile    |

### Books

| Method   | Endpoint         | Description                 |
| -------- | ---------------- | --------------------------- |
| `GET`    | `/api/books`     | List all books              |
| `GET`    | `/api/books/:id` | Get book details            |
| `POST`   | `/api/books`     | Add a new book (Admin)      |
| `PUT`    | `/api/books/:id` | Update book details (Admin) |
| `DELETE` | `/api/books/:id` | Delete a book (Admin)       |

### Borrowing

| Method | Endpoint                  | Description                       |
| ------ | ------------------------- | --------------------------------- |
| `GET`  | `/api/borrows`            | List all borrow records (Admin)   |
| `GET`  | `/api/borrows/my`         | Get current user's borrow history |
| `POST` | `/api/borrows`            | Borrow a book                     |
| `PUT`  | `/api/borrows/:id/return` | Return a borrowed book            |

### Digital Library

| Method | Endpoint                            | Description                |
| ------ | ----------------------------------- | -------------------------- |
| `GET`  | `/api/digital-library`              | List all digital documents |
| `GET`  | `/api/digital-library/:id/download` | Download a document        |
| `POST` | `/api/digital-library`              | Upload a document (Admin)  |

### Activity & Seats

| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| `GET`  | `/api/activity` | Get activity logs     |
| `GET`  | `/api/seats`    | Get seat availability |

> **Note:** This is a high-level overview. Refer to the route files in `MatrixBackendAlphaVersion/src/routes/` for the complete and up-to-date API documentation.

---

## 💡 Usage

### As a Student

1. Register or log in with your student credentials
2. Browse the **Book Catalog** to search and filter available books
3. Request to borrow a book and track its due date in **My Borrows**
4. Access digital documents from the **Digital Library**
5. Check **Seat Availability** before visiting the library
6. View your **Activity Log** for a complete history

### As an Admin

1. Log in with admin credentials
2. Manage the book inventory from the **Books** section
3. Monitor all active borrows and overdue returns
4. Use the **Analytics Dashboard** for usage insights
5. Create and manage custom forms from the **Form Builder**
6. Review the **System Activity Log** for auditing

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how you can help:

1. **Fork** the repository
2. **Create** a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make** your changes and commit them:
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open** a Pull Request describing your changes

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages (we recommend [Conventional Commits](https://www.conventionalcommits.org/))
- Update documentation if you add new features or change existing behavior
- Test your changes before submitting a PR
- Be respectful and constructive in all discussions

### Reporting Issues

Found a bug or have a feature request? Please [open an issue](https://github.com/Narayaaana11/Matrix-Library-Management-System/issues) and include:

- A clear description of the problem or feature
- Steps to reproduce (for bugs)
- Expected vs. actual behavior
- Screenshots if applicable

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Narayaaana11

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

Made with ❤️ by [Narayaaana11](https://github.com/Narayaaana11)

⭐ If you find this project useful, please consider giving it a star!

</div>
