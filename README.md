# SmartKhata

<p align="center">
  <strong>Digital credit, inventory, sales & expense management for small businesses.</strong>
</p>

<p align="center">
  A mobile-first application for managing customers, credit, inventory, sales, expenses, and business operations.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-2026-blue?logo=react" alt="React Native">
  <img src="https://img.shields.io/badge/Expo-54-black?logo=expo" alt="Expo">
  <img src="https://img.shields.io/badge/TypeScript-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=springboot" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Java-21-orange?logo=openjdk" alt="Java">
  <img src="https://img.shields.io/badge/PostgreSQL-18-336791?logo=postgresql" alt="PostgreSQL">
</p>

---

## Overview

**SmartKhata** is a full-stack mobile application built to digitize everyday business management for small shop owners.

It replaces traditional notebook-based credit and business record keeping with a centralized system for managing customer ledgers, products, inventory, sales, expenses, and business insights.

The application consists of a **React Native mobile frontend** and a **Spring Boot REST API** backed by **PostgreSQL**.

---

## Features

* **Authentication** — Secure registration and login using JWT authentication.
* **Customer Management** — Create, update, view, and manage shop customers.
* **Credit Management** — Record customer credit and payments with outstanding balance tracking.
* **Customer Ledger** — View transaction history and customer statements.
* **Product Management** — Manage products, pricing, and stock.
* **Inventory Tracking** — Monitor stock levels and identify low-stock products.
* **Sales Management** — Create sales with multiple products and payment methods.
* **Expense Management** — Record and categorize business expenses.
* **Dashboard** — View sales, expenses, profit, outstanding credit, customers, products, and low-stock information.
* **Shop Management** — Maintain business data for the shop owner.

---

## Screenshots

> Add your application screenshots here.

<p align="center">
  <img src="screenshots/login.png" width="220" alt="Login">
  <img src="screenshots/dashboard.png" width="220" alt="Dashboard">
  <img src="screenshots/customers.png" width="220" alt="Customers">
  <img src="screenshots/products.png" width="220" alt="Products">
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


## Author

**Jogeshkumar Mali**

If you found this project useful or interesting, consider giving it a ⭐ on GitHub.
