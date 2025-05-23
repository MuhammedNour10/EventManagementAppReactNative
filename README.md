📱 EventManagement Mobile App

EventManagement is a cross-platform React Native mobile application that connects with the EventManagement Web API. The app allows users to seamlessly browse, register, and manage events from their mobile devices, while providing admin-level functionality for managing event data.

🚀 Features

🔐 User Authentication (Login / Register)
📅 View Upcoming Events
➕ Register for Events
🧾 My Events section to track registered events
🗓️ Admin Panel to create and manage events
📡 Real-time API Integration with ASP.NET Core Web API



🛠️ Tech Stack

Framework: React Native
Language: JavaScript / TypeScript (choose one and update)
Navigation: React Navigation
API Client: Axios
Authentication: JWT Token stored securely (AsyncStorage or SecureStore)
State Management: useState + Context API
Form Handling: Formik & Yup
UI Library: React Native Paper / NativeBase / Tailwind (choose one and update)


📱 Screenshots


| Login                                                                                     | Register                                                                                     |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| ![Login](https://github.com/user-attachments/assets/6db7e360-bfd5-4d2f-9e00-b32a91a7a46a) | ![Register](https://github.com/user-attachments/assets/bcf57197-e62b-44f9-bcb9-8a4ef0bcc01f) |



| Event Details                                                                                    | Attendance Page                                                                                    |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| ![EventDetails](https://github.com/user-attachments/assets/d2599eb1-93bb-4c92-8df6-b5758ada9320) | ![AttendancePage](https://github.com/user-attachments/assets/72c127c0-ae65-4a88-a156-63d41c60043d) |







⚙️ Getting Started

Prerequisites
Make sure the following are installed:
Node.js
Expo CLI or React Native CLI
Android Studio and/or Xcode for simulators



🔐 Authentication

Uses JWT tokens stored securely (e.g., AsyncStorage or SecureStore). Token is added to all authorized requests.

