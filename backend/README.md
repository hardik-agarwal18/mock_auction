# IPL Mock Auction Backend

A real-time auction platform backend for conducting mock IPL (Indian Premier League) player auctions. This application allows users to create auction rooms, add players, and participate in live bidding sessions.

## 🚀 Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **Auction Room Management**: Create and join multiple auction rooms
- **Player Management**: Add players to auction rooms with base prices and roles
- **Real-time Bidding**: Place bids on players during live auctions
- **Team Management**: Track team budgets, squad limits, and purchased players
- **Auction States**: Support for WAITING, LIVE, and COMPLETED auction states
- **Player Status Tracking**: Monitor player states (UPCOMING, ACTIVE, SOLD, UNSOLD)

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.x
- **Database**: PostgreSQL
- **ORM**: Prisma v5.22.0
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Logging**: Morgan
- **Environment**: dotenv

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend directory:

```env
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/mock_auction"
JWT_SECRET="your-secret-key-here-change-in-production"
```

**Environment Variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |

### 4. Set up the database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start the server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 📊 Database Schema

### Models

#### User
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password`: String (Hashed)
- `username`: String (Unique)
- `createdAt`: DateTime

#### AuctionRoom
- `id`: UUID (Primary Key)
- `name`: String
- `hostId`: String
- `status`: RoomStatus (WAITING | LIVE | COMPLETED)
- `purse`: Integer (Starting budget per team)
- `squadLimit`: Integer (Maximum players per team)
- `currentPlayerId`: String (Nullable)
- `createdAt`: DateTime

#### Team
- `id`: UUID (Primary Key)
- `roomId`: String (Foreign Key)
- `userId`: String (Foreign Key)
- `name`: String
- `budget`: Integer (Remaining budget)

#### RoomPlayer
- `id`: UUID (Primary Key)
- `roomId`: String (Foreign Key)
- `name`: String
- `role`: String (e.g., Batsman, Bowler, All-rounder, Wicket-keeper)
- `basePrice`: Integer
- `status`: PlayerStatus (UPCOMING | ACTIVE | SOLD | UNSOLD)
- `soldPrice`: Integer (Nullable)
- `soldToTeamId`: String (Nullable)

#### TeamPlayer
- `id`: UUID (Primary Key)
- `teamId`: String (Foreign Key)
- `playerId`: String (Foreign Key)
- `price`: Integer (Purchase price)

## 🔌 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe"
}
```

### Room Endpoints

#### Create Auction Room
```http
POST /api/rooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "IPL 2026 Mock Auction",
  "purse": 100000000,
  "squadLimit": 25
}
```

**Response:**
```json
{
  "id": "room-uuid",
  "name": "IPL 2026 Mock Auction",
  "hostId": "user-uuid",
  "status": "WAITING",
  "purse": 100000000,
  "squadLimit": 25,
  "createdAt": "2026-02-12T10:00:00.000Z"
}
```

#### Join Room
```http
POST /api/rooms/:roomId/join
Authorization: Bearer <token>
Content-Type: application/json

{
  "teamName": "Mumbai Indians"
}
```

#### Get Room Details
```http
GET /api/rooms/:roomId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "room-uuid",
  "name": "IPL 2026 Mock Auction",
  "status": "LIVE",
  "purse": 100000000,
  "squadLimit": 25,
  "teams": [
    {
      "id": "team-uuid",
      "name": "Mumbai Indians",
      "budget": 95000000,
      "players": []
    }
  ],
  "players": [],
  "currentPlayer": null
}
```

#### Start Auction
```http
PATCH /api/rooms/:roomId/start
Authorization: Bearer <token>
```

### Player Endpoints

#### Add Player to Room
```http
POST /api/players/:roomId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Virat Kohli",
  "role": "Batsman",
  "basePrice": 2000000
}
```

**Response:**
```json
{
  "id": "player-uuid",
  "roomId": "room-uuid",
  "name": "Virat Kohli",
  "role": "Batsman",
  "basePrice": 2000000,
  "status": "UPCOMING"
}
```

#### Get All Players in Room
```http
GET /api/players/:roomId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "players": [
    {
      "id": "player-uuid",
      "name": "Virat Kohli",
      "role": "Batsman",
      "basePrice": 2000000,
      "status": "UPCOMING"
    }
  ]
}
```

### Auction Endpoints

#### Place Bid
```http
POST /api/auction/:roomId/bid
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 2500000,
  "playerId": "player-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "currentBid": 2500000,
  "biddingTeam": "Mumbai Indians"
}
```

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma           # Database schema definition
│   └── migrations/             # Database migrations
├── src/
│   ├── app.js                  # Express app configuration
│   ├── server.js               # Server entry point
│   ├── config/
│   │   ├── database.js         # Database connection
│   │   └── env.js              # Environment configuration
│   ├── modules/
│   │   ├── auth/               # Authentication module
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.repo.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validation.js
│   │   ├── room/               # Auction room module
│   │   │   ├── room.controller.js
│   │   │   ├── room.service.js
│   │   │   ├── room.repo.js
│   │   │   ├── room.routes.js
│   │   │   └── room.validation.js
│   │   ├── player/             # Player management module
│   │   │   ├── player.controller.js
│   │   │   ├── player.service.js
│   │   │   ├── player.repo.js
│   │   │   ├── player.routes.js
│   │   │   └── player.validation.js
│   │   └── auction/            # Bidding module
│   │       ├── auction.controller.js
│   │       ├── auction.service.js
│   │       ├── auction.state.js
│   │       ├── auction.routes.js
│   │       └── auction.validation.js
│   └── shared/
│       ├── errors/
│       │   └── AppError.js     # Custom error class
│       └── middleware/
│           ├── auth.middleware.js      # JWT authentication
│           ├── error.middleware.js     # Error handling
│           └── validate.middleware.js  # Input validation
├── .env                        # Environment variables
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `npm start` | Start the server in production mode |
| `dev` | `npm run dev` | Start the server in development mode with auto-reload |
| `test` | `npm test` | Run tests (not configured yet) |

## 🎮 Usage Guide

### Basic Workflow

1. **Register/Login**: Create an account or login to get a JWT token
2. **Create Room**: Host creates an auction room with budget and squad limit
3. **Join Room**: Other users join the room with their team names
4. **Add Players**: Host adds players to the auction pool
5. **Start Auction**: Host starts the auction (status changes to LIVE)
6. **Place Bids**: Teams bid on players during the auction
7. **Complete Auction**: All players are sold or passed, auction completes

### Example Flow

```bash
# 1. Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"host@example.com","password":"pass123","username":"auctionhost"}'

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"host@example.com","password":"pass123"}'

# 3. Create a room (use token from login)
curl -X POST http://localhost:3000/api/rooms \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"IPL 2026","purse":100000000,"squadLimit":25}'

# 4. Add players to room
curl -X POST http://localhost:3000/api/players/<roomId> \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Virat Kohli","role":"Batsman","basePrice":2000000}'

# 5. Start the auction
curl -X PATCH http://localhost:3000/api/rooms/<roomId>/start \
  -H "Authorization: Bearer <your-token>"

# 6. Place a bid
curl -X POST http://localhost:3000/api/auction/<roomId>/bid \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"amount":2500000,"playerId":"<playerId>"}'
```

## 🔒 Security

- All passwords are hashed using bcrypt before storage
- JWT tokens are used for authentication
- Protected routes require valid JWT token
- Input validation using Zod schemas
- Environment variables for sensitive data

## 🐛 Error Handling

The application uses a centralized error handling middleware. All errors are caught and formatted as:

```json
{
  "status": "error",
  "message": "Error message here",
  "statusCode": 400
}
```

## 🚧 Future Enhancements

- [ ] WebSocket integration for real-time bidding updates
- [ ] Auction timer functionality
- [ ] Player statistics and analytics
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Auction history and replays
- [ ] Export auction results
- [ ] Multi-language support

## 📝 License

ISC

## 👥 Author

Created by the development team

---

**Note**: This is a backend API. For the complete application, you'll need to build a frontend client that consumes these endpoints.
