📱 EventManagement Mobile App

EventManagement is a cross-platform React Native mobile application designed to interact with the EventManagement Web API. It allows users to browse, register, and manage events easily from their mobile devices.

🚀 Features

🔐 User Authentication (Login/Register)
📅 View Upcoming Events
➕ Register for Events
🧾 My Events Section
🗓️ Create and Manage Events (Admin-only)
📡 API Integration with ASP.NET Core Web API

🛠️ Tech Stack

Framework: React Native
Language: JavaScript / TypeScript (edit as applicable)
Navigation: React Navigation
API Client: Axios
Authentication: JWT Token with Secure Storage
State Management: UseState Context API
Form Handling: Formik + Yup
UI Library: React Native Paper / NativeBase / Tailwind (choose yours)


📱 Screenshots

| Login                                  | Events List                            | Event Detail                            |
| -------------------------------------- | -------------------------------------- | --------------------------------------- |
| ![Login Screen](screenshots/login.png) | ![Events List](screenshots/events.png) | ![Event Detail](screenshots/detail.png) |




⚙️ Getting Started

Prerequisites
Node.js
Expo CLI or React Native CLI
Android Studio / Xcode for emulators



🔐 Authentication

Uses JWT tokens stored securely (e.g., AsyncStorage or SecureStore). Token is added to all authorized requests.

