# 💬 QuickChat - Real-time Chat Application

A modern, full-stack real-time chat application built with React, Node.js, Socket.IO, and MongoDB.

![QuickChat](https://img.shields.io/badge/QuickChat-Real--time%20Messaging-violet)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

## ✨ Features

- **Real-time Messaging** - Instant message delivery with Socket.IO
- **User Authentication** - Secure JWT-based login/signup
- **Online Status** - See who's online in real-time
- **Image Sharing** - Send images via Cloudinary integration
- **Profile Management** - Update profile picture and bio
- **Responsive Design** - Works on desktop and mobile
- **Modern UI** - Dark theme with glassmorphism effects

## 🛠️ Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS 4
- Socket.IO Client
- React Router DOM
- React Hot Toast

### Backend
- Node.js + Express 5
- Socket.IO
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (image uploads)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ankushgarg44/CHAT-APP.git
cd CHAT-APP
```

2. **Setup Backend**
```bash
cd server
npm install
```

Create `.env` file:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3001
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5174
```

3. **Setup Frontend**
```bash
cd ../client
npm install
```

Create `.env` file:
```env
VITE_BACKEND_URL=http://localhost:3001
```

4. **Run the Application**

Backend:
```bash
cd server
npm start
```

Frontend:
```bash
cd client
npm run dev
```

Visit `http://localhost:5174`

## 📁 Project Structure

```
CHAT-APP/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── context/        # React context (Auth, Chat)
│   │   ├── pages/          # Page components
│   │   ├── assets/         # Images and icons
│   │   └── lib/            # Utilities
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── controllers/        # Route handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── lib/                # DB, Cloudinary, Socket
│   └── server.js           # Entry point
│
└── README.md
```

## 🌐 Deployment

- **Backend**: Deploy to [Render](https://render.com)
- **Frontend**: Deploy to [Vercel](https://vercel.com)

See the deployment guide for detailed instructions.

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/check` | Verify authentication |
| POST | `/api/auth/updateProfile` | Update user profile |
| GET | `/api/users` | Get all users |
| GET | `/api/messages/:id` | Get messages with user |
| POST | `/api/messages/send/:id` | Send message |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ by Ankush Garg
