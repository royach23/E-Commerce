# Sock Haven

## Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Installation](#%EF%B8%8F-installation) 
- [Prerequisites](#prerequisites)
- [Setup Steps](#setup-steps)
- [API Documentation](#api-documentation)
- [Project Structure](#-project-structure)
- [Contact](#-contact)

## 📦 Project Overview

Sock Haven is a comprehensive e-commerce platform dedicated to delivering high-quality, stylish socks to customers worldwide. Our website offers a diverse range of sock styles, from athletic and casual to luxury and novelty designs.

## 🚀 Features

- User authentication and account management
- Advanced filtering and search functionality
- Shopping cart and checkout process
- Order tracking and history
- Responsive design for mobile and desktop
- Extensive sock catalog with multiple categories


## 💻 Technologies Used

- **Frontend**: typescript with React.js
- **Backend**: python with FastAPI
- **Database**: postgresSQL and redis
- **Authentication**: JWT
- **Styling**: MUI

## 🛠️ Installation

### Prerequisites
- pyhon 3.8+
- pip
- Node.js (v16+ recommended)
- npm
- postgresSQL
- redis

### Setup Steps

1. Clone the repository
   ```bash
   https://github.com/royach23/E-Commerce
   cd E-Commerce
   ```

2. Install dependencies
   ```bash
   - client:
   cd client/socks-ecommerce
   npm install

   - server:
   cd server
   pip install -r requirements.txt
   ```
3. Set up a posdtres database
- Open your PostgreSQL command-line tool or GUI (e.g., pgAdmin).
- Create a new database by running the following command:
   ```
   CREATE DATABASE sock_haven_db;
   ```
- Create a user and set a password:
   ```
   CREATE USER sock_haven_user WITH PASSWORD 'your_password';
   ```
- Grant privileges to the user on the new database:
   ```
   GRANT ALL PRIVILEGES ON DATABASE sock_haven_db TO sock_haven_user;
   ```

4. Set up Redis
   - **Windows (WSL)**: `sudo apt install redis-server` then `sudo service redis-server start`
   - **Docker**: `docker run -p 6379:6379 -d redis`
   - **Command**:
     ```bash
     redis-server
     ```
   Test Redis Installation: Open a new terminal and run `redis-cli ping`. You should see `PONG`.

5. Set up environment variables
   Create a `.env` file in the root directory with:
   ```
   SQLALCHEMY_DATABASE_URL=postgresql://sock_haven_user:your_password@localhost/sock_haven_db
   SECRET_KEY=your_jwt_secret
   ALGORITHM=your_hashing_algorithm
   ACCESS_TOKEN_EXPIRE_MINUTES=expiration_time_for_the_access_token
   ```

6. Run the development server
   ```bash
   - client:
   cd client
   npm run dev

   - server:
   cd server
   uvicorn app.main:app --reload
   ```

## API documentation
API documentation is available at 'http://127.0.0.1:8000/docs' or 'http://127.0.0.1:8000/redoc' when the server is running

## 📊 Project Structure

```
E-Commerce/
│
├── server/ # Backend FastAPI server
|  └──  app 
|     ├── __init__.py   
|     ├── main.py      
|     ├── .env
|     ├── requirements.txt
|     ├── routers
|     │   ├── __init__.py
|     │   ├── product.py
|     │   ├── transaction.py 
|     │   └── user.py  
|     ├── crud
|     │   ├── __init__.py
|     │   ├── product.py
|     │   ├── transaction.py
|     │   ├── transactionProduct.py 
|     │   └── user.py  
|     ├── schemas
|     │   ├── __init__.py
|     │   ├── product.py
|     │   ├── transaction.py
|     │   ├── transactionProduct.py
|     │   ├── loginUser.py 
|     │   ├── partialTransaction.py 
|     │   ├── partialTransactionProduct.py
|     │   ├── userDetails.py 
|     │   └── user.py  
|     ├── models
|     │   ├── __init__.py
|     │   ├── product.py
|     │   ├── transaction.py
|     │   ├── transactionProduct.py
|     │   ├── loginUser.py 
|     │   ├── userDetails.py 
|     │   └── user.py 
|     ├── enums
|     │   ├── __init__.py
|     │   ├── category.py
|     │   ├── orderStatus.py            
|     │   └── size.py
|     ├── middlewares
|     │   ├── __init__.py          
|     │   └── errorHandler.py   
|     └── utils
|         ├── __init__.py
|         ├── database.py 
|         ├── logger.py 
|         ├── redis.py 
|         └── security.py
|
├── client/socks-ecommerce/  # Frontend React application
|  ├── public/
|  |  └── logo.svg
|  └── src/
|      ├── App.css
|      ├── App.tsx
|      ├── insex.css
|      ├── main.tsx
|      ├── assets/
|      │   ├── logo.svg
|      │   ├── logo.png
|      │   └── logoNoBg.py
|      ├── api/
|      │   └── api.ts
|      ├── components/
|      │   ├── layout/
|      │   |    ├── Footer.tsx
|      │   |    ├── Header.tsx
|      │   │    └── Layout.tsx
|      │   ├── products/
|      │   │   └── ProductCard.tsx
|      │   └── users/
|      │       └── LoginModal.tsx
|      ├── hooks/
|      │   └── useTransaction.ts
|      ├── comntexts/
|      │   ├── CartContext.tsx
|      │   ├── ProductContext.tsx
|      │   └── UserContext.tsx
|      ├── pages/
|      │   ├── index.ts
|      │   ├── CartPage.tsx
|      │   ├── CheckoutPage.tsx
|      │   ├── HomePage.tsx
|      │   ├── OrderComplitionPage.tsx
|      │   ├── OrderHistory.tsx
|      │   ├── ProductDetailsPage.tsx
|      │   ├── ProductsPage.tsx
|      │   ├── ProductContext.tsx
|      │   ├── RegisterPage.tsx
|      │   └── UserDetails.tsx
|      ├── data/
|      │   └── products.txt
|      ├── services/
|      │   ├── TransactionService.ts
|      │   ├── ProductService.ts
|      │   └── UserService.ts
|      ├── styles/
|      │   └── theme.ts
|      ├── types/
|      │   ├── Transaction.ts
|      │   ├── Product.ts
|      │   ├── Cart.ts
|      │   └── User.ts
|      └── utils/
|         └── Security.ts
|
├── .gitignore
└── README.md            
```

## 📞 Contact

**Project Maintainer**: Roy Achituv
- Email: roy.achituv@gmail.com
- Project Link: [https://github.com/royach23/E-Commerce](https://github.com/royach23/E-Commerce)
---

**Happy Sock Shopping! 🧦✨**
