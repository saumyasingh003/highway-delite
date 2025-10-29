# Highway Delite - Experience Booking Platform

A full-stack web application for booking travel experiences with features like authentication, promo code management, and real-time booking system.

## Project Structure

```
├── Backend/            # Backend server code
│   ├── src/           # Source files
│   │   ├── config/    # Configuration files
│   │   ├── controllers/# Route controllers
│   │   ├── middleware/# Express middleware
│   │   ├── models/    # Mongoose models
│   │   └── routes/    # Express routes
│   └── api/           # Serverless function entry point
└── frontend/          # React frontend code
    └── src/
        ├── components/# React components
        ├── context/   # React context providers
        └── hooks/     # Custom React hooks
```

## Technology Stack

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Serverless deployment (Vercel)

### Frontend
- React with TypeScript
- TailwindCSS for styling
- React Router for navigation
- Axios for API requests
- Context API for state management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB database

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Backend directory and copy the contents from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB URI and JWT secret:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=4000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- 🔐 User Authentication (Register/Login)
- 🎫 Experience Listings and Details
- 📅 Slot-based Booking System
- 🎟️ Promo Code Generation and Validation
- 💳 Payment Processing
- 🔍 Search Functionality
- 📱 Responsive Design

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login

### Experiences
- GET `/api/experiences` - List all experiences
- GET `/api/experiences/:id` - Get experience details
- POST `/api/experiences/add` - Add new experience

### Bookings
- POST `/api/bookings` - Create new booking

### Promo Codes
- GET `/api/promo/random` - Get random promo code
- POST `/api/promo/validate` - Validate promo code

## Deployment

The application is deployed on Vercel:
- Frontend: [Your frontend URL]
- Backend API: https://highway-delite-server-six.vercel.app

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[MIT License](LICENSE)