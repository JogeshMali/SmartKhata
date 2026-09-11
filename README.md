


<h1 align="center">SmartKhata</h1>

<p align="center">
  <strong>Digital Credit, Inventory, Sales & Expense Management for Small Businesses</strong>
</p>

<p align="center">
  A mobile-first business management application designed to help small shop owners
  manage customers, credit, inventory, sales, expenses, and daily business operations.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-2026-blue?logo=react" alt="React Native">
  <img src="https://img.shields.io/badge/Expo-54-black?logo=expo" alt="Expo">
  <img src="https://img.shields.io/badge/TypeScript-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=springboot" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Java-21-orange?logo=openjdk" alt="Java 21">
  <img src="https://img.shields.io/badge/PostgreSQL-18-336791?logo=postgresql" alt="PostgreSQL">
</p>

---

## 📱 Overview

**SmartKhata** is a full-stack mobile application built to digitize everyday business management for small shop owners.

Traditional businesses often rely on notebooks to track customer credit, payments, inventory, sales, and expenses. SmartKhata provides a centralized digital solution that makes these operations easier to manage and monitor.

The application consists of:

- 📱 **React Native mobile application**
- ⚙️ **Spring Boot REST API**
- 🗄️ **PostgreSQL database**
- 🔐 **JWT-based authentication**
- ☁️ **Cloudinary integration for media management**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Secure registration and login using JWT authentication |
| 👥 **Customer Management** | Create, update, view, and manage customers |
| 💳 **Credit Management** | Record customer credit, payments, and outstanding balances |
| 📖 **Customer Ledger** | View customer transaction history and statements |
| 📦 **Product Management** | Manage products, pricing, and stock |
| 📊 **Inventory Tracking** | Monitor stock levels and identify low-stock products |
| 🛒 **Sales Management** | Create sales containing multiple products |
| 💰 **Payment Tracking** | Support cash and credit-based transactions |
| 🧾 **Expense Management** | Record and categorize business expenses |
| 📈 **Dashboard** | View sales, expenses, profit, credit, customers, and inventory insights |
| 🏪 **Shop Management** | Manage shop and business information |

---

# 📸 Screenshots

## 📸 Screenshots

<p align="center">
  <img src="screenshots/Login.jpeg" height="500" alt="Login">
  <img src="screenshots/Dashboard.jpeg" height="500" alt="Dashboard">
</p>
<br>
<br>
<p align="center">
  <img src="screenshots/Customer.jpeg" height="500" alt="Customers">
  <img src="screenshots/Sales.jpeg" height="500" alt="Sales">
</p>
---

## Tech Stack

### Frontend
* React Native
* Expo
* TypeScript
* Expo Router
* NativeWind
* Redux Toolkit
* TanStack React Query
* Axios

### Backend
* Java 21
* Spring Boot 3
* Spring Security
* JWT
* Spring Data JPA
* Hibernate
* Maven

### Database & Services
* PostgreSQL
* Cloudinary
* Git
* GitHub

---

## Architecture

```text
                 ┌──────────────────────┐
                 │   React Native App   │
                 │   Expo + TypeScript  │
                 └──────────┬───────────┘
                            │
                         REST API
                            │
                            ▼
                 ┌──────────────────────┐
                 │    Spring Boot API   │
                 │ Security + JWT + JPA │
                 └──────────┬───────────┘
                            │
                         Hibernate
                            │
                            ▼
                 ┌──────────────────────┐
                 │      PostgreSQL      │
                 └──────────────────────┘
```

---

## Future Enhancements

* Automated payment reminders
* Advanced business analytics
* Detailed reports
* Bill generation and sharing
* Barcode scanning
* Offline-first support
* Cloud synchronization
* Customer credit scoring
* Advanced inventory analytics

---

