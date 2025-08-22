# 🍲 Order Management System – Sup Tulang ZZ

A user-friendly web application to manage delivery orders via **GRAB** and **Foodpanda**, streamline runner assignments, and keep customers happy with clear, real-time status updates.

---

## 📌 Objective

- Streamline order assignments to runners.
- Provide runners a clear interface for order details (customer info, items, address).
- Enable **real-time tracking**: _Picked Up → In Transit → Delivered_.
- Improve staff–runner communication via notifications.
- Modernize operations with a scalable digital solution.

---

## ✨ Core Features

- Staff dashboard to view & assign orders to GRAB/Foodpanda runners.
- Runner app to view assigned orders and update status in real time.
- Customer module: registration, login, menu browsing, order & checkout.
- Notification system to alert staff on status updates.
- Clean, responsive UI (Bootstrap/Figma).

---

## 👥 Team Roles & Responsibilities

### 1) **Heng Yi Sheng – Team Lead, Runner Module Developer & UI Designer**
- Runner login/registration.
- Runner dashboard & real-time status updates.
- Notifications to staff on status changes.
- Backend routes: **Runner (POST, GET)**, **Order (GET, UPDATE)**, **Notification (ADD)**.
- UI/UX design with **Figma**.

### 2) **Emanuel – Customer Module Developer & Database Manager**
- Customer membership registration/login.
- Menu browsing, order placement, checkout.
- Backend routes: **Member (POST, GET, UPDATE)**, **Menu (GET single & all)**, **Order (POST, GET, UPDATE, DELETE)**.
- **MySQL** database design & normalization.

### 3) **Danial – Staff Module Developer & System Architect**
- Staff login/registration.
- Member management **(Add, View, Update, Delete)**.
- Staff dashboard: view/assign orders to GRAB/Foodpanda runners.
- System architecture & code structure.

---

## 🛠️ Technology Stack

- **Frontend:** HTML, CSS, JavaScript, Bootstrap • Prototypes in Figma
- **Backend:** Node.js, Express.js (or PHP alternative)
- **Database:** MySQL
- **APIs:** RESTful endpoints
- **Version Control:** Git & GitHub

---

## 🧭 High-Level Architecture

```mermaid
flowchart LR
  A[Customer Web/App] -->|places order| B[Backend API]
  B --> C[(MySQL)]
  D[Staff Dashboard] -->|assigns to runner| B
  E[Runner App] -->|update status| B
  B -->|notify| D
