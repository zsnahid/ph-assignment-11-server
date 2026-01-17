# PH Assignment 11 Server

A RESTful API server for the Qrius platform - a queries and recommendations management system.

## 📁 Project Structure

```
ph-assignment-11-server/
├── src/
│   ├── config/           # Configuration files
│   │   ├── db.js         # MongoDB connection setup
│   │   └── cors.js       # CORS configuration
│   ├── controllers/      # Business logic
│   │   ├── auth.controller.js
│   │   ├── queries.controller.js
│   │   └── recommendations.controller.js
│   ├── middlewares/      # Custom middleware
│   │   └── auth.js       # JWT authentication middleware
│   ├── routes/           # Route definitions
│   │   ├── auth.routes.js
│   │   ├── queries.routes.js
│   │   └── recommendations.routes.js
│   ├── app.js            # Express app configuration
│   └── server.js         # Server entry point
├── .env                  # Environment variables (not in repo)
├── .gitignore
├── package.json
├── vercel.json           # Vercel deployment config
└── README.md

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   DB_ADMIN=your_mongodb_username
   DB_PASSWORD=your_mongodb_password
   ACCESS_TOKEN_SECRET=your_jwt_secret
   NODE_ENV=development
   PORT=3000
   ```

### Running the Server

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

## 📚 API Endpoints

### Authentication

- `POST /jwt` - Generate JWT token
- `POST /logout` - Clear authentication cookie

### Queries

- `GET /queries` - Get all queries
- `GET /queries/latest` - Get latest 6 queries
- `GET /queries/filter?email=` - Get user-specific queries (protected)
- `GET /queries/search?product=` - Search queries
- `GET /queries/:id` - Get query by ID
- `POST /queries` - Create new query
- `PATCH /queries/update/:id` - Update query
- `PATCH /queries/increment/:id` - Increment recommendation count
- `PATCH /queries/decrement/:id` - Decrement recommendation count
- `DELETE /queries/:id` - Delete query

### Recommendations

- `GET /recommendations` - Get all recommendations
- `GET /recommendations/questioner/filter?email=` - Get recommendations for questioner (protected)
- `GET /recommendations/recommender/filter?email=` - Get recommendations by recommender (protected)
- `GET /recommendations/:id` - Get recommendations by query ID
- `POST /recommendations` - Create new recommendation
- `DELETE /recommendations/delete/:id` - Delete recommendation

## 🔒 Authentication

The API uses JWT tokens for authentication. Protected routes require a valid token in the cookie.

## 🌐 Deployment

The server is configured for deployment on Vercel. The `vercel.json` file contains the necessary configuration.

## 🛠️ Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables management

## 📝 License

ISC
