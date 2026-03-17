# 🏋️ MrFit AI - Full Stack Health & Fitness App

MrFit is a modern, AI-powered health and fitness application designed to help users track their nutrition, generate personalized workout plans, and manage their fitness journey using a clean and scalable architecture.

## 🚀 Live Demo
Check out the live application here: https://mrfit.onrender.com/
*(Note: Initial load may take up to 1 minute due to Render's free tier sleep policy)*

## ✨ Features
- **AI-Powered Nutrition:** Personalized meal plans and macro tracking.
- **Dynamic Workouts:** Tailored workout routines based on user goals.
- **Secure Authentication:** JWT-based login, password hashing, and cookie management.
- **Clean Architecture:** Built using SOLID principles and Domain-Driven Design (DDD) patterns.
- **Security First:** Implemented Helmet, Rate Limiting, XSS protection, and NoSQL injection prevention.

## 🛠️ Tech Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS.
- **Backend:** Node.js, Express, TypeScript.
- **Database:** MongoDB (Mongoose).
- **AI Integration:** Google Gemini AI.
- **Deployment:** Render.

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/MohamedAbdelmaksoud97/MrFit-api.git](https://github.com/MohamedAbdelmaksoud97/MrFit-api.git)
   cd MrFit-api
Install Dependencies:

Bash
npm install
Environment Variables:
Create a .env file in the root directory and add:

Code snippet
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_api_key
Run in Development Mode:

Bash
npm run dev
Build for Production:

Bash
npm run build
npm start
🏗️ Architecture
The project follows Clean Architecture to ensure maintainability:

Domain: Entities and Repository Interfaces.

Application: Use cases and Mappers.

Infrastructure: Database models and external services.

Presentation: Express routes, controllers, and middlewares.

🛡️ Security Features
Helmet.js: For securing HTTP headers.

CORS: Controlled origin access.

XSS Protection: Sanitizing user input to prevent script injection.

Rate Limiting: Protecting against brute-force attacks.

👤 Author
Mohamed Abdelmaksoud
LinkedIn: [https://www.linkedin.com/in/mohamed-abdelmaksoud-045222352/]
Portfolio: [https://mohamedabdelmaksoud.site/]

Portfolio: [Your Portfolio Link]
