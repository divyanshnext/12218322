# URL Shortener App 🔗

A full-stack URL shortening service built with **React** (frontend) and **Node.js/Express** (backend). This application allows users to create short URLs with custom shortcodes, set expiration times, and track click analytics.

## 🌟 Features

### Core Features
- ✅ **URL Shortening**: Convert long URLs into short, manageable links
- ✅ **Custom Shortcodes**: Users can provide custom shortcodes (3-10 alphanumeric characters)
- ✅ **Expiration Control**: Set custom expiry times (1 minute to 1 week)
- ✅ **Click Tracking**: Monitor clicks with timestamps
- ✅ **Analytics Dashboard**: View statistics for all shortened URLs
- ✅ **Batch Processing**: Create up to 5 URLs at once

### Security & Production Features
- 🔒 **Authentication**: Static Bearer token-based API authentication
- 🛡️ **Rate Limiting**: 50 requests per minute per IP
- 🔐 **Security Headers**: XSS protection, content type validation
- 📝 **Input Validation**: URL format and shortcode validation
- 🚨 **Error Handling**: Comprehensive error handling and logging
- 📊 **External Logging**: Integration with external logging service

## 🏗️ Architecture

```
12218322/
├── backend-test-submission/     # Node.js/Express API
├── frontend-test-submission/    # React Application
└── logging-middleware/          # External logging utility
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### 1. Backend Setup

```bash
cd backend-test-submission
npm install
```

Create `.env` file:
```env
AUTH_TOKEN=your_auth_token_here
NODE_ENV=development
PORT=5000
BASE_URL=http://localhost:5000
```

Start the backend server:
```bash
npm start
```
Server will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend-test-submission
npm install
```

Create `.env` file:
```env
VITE_AUTH_TOKEN=your_auth_token_here
```

Start the development server:
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📡 API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication
All API requests require static Bearer token authentication:
```
Authorization: Bearer <your_token>
```

### Endpoints

#### 1. Create Short URL
```http
POST /shorturls
Content-Type: application/json
Authorization: Bearer <token>

{
  "url": "https://example.com",
  "validity": 30,           // optional, minutes (default: 30)
  "shortcode": "custom123"  // optional, 3-10 alphanumeric chars
}
```

**Response:**
```json
{
  "shortLink": "http://localhost:5000/abc123",
  "expiry": "2025-07-14T15:30:00.000Z"
}
```

#### 2. Get URL Statistics
```http
GET /shorturls/:shortcode
```

**Response:**
```json
{
  "originalURL": "https://example.com",
  "createdAt": "2025-07-14T15:00:00.000Z",
  "expiry": "2025-07-14T15:30:00.000Z",
  "totalClicks": 5,
  "clicks": [
    { "time": "2025-07-14T15:05:00.000Z" },
    { "time": "2025-07-14T15:10:00.000Z" }
  ]
}
```

#### 3. Get All Statistics
```http
GET /shorturls/stats
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "shortcode": "abc123",
    "originalUrl": "https://example.com",
    "shortUrl": "http://localhost:5000/abc123",
    "totalClicks": 5,
    "createdAt": "2025-07-14T15:00:00.000Z",
    "expiry": "2025-07-14T15:30:00.000Z"
  }
]
```

#### 4. URL Redirection
```http
GET /:shortcode
```
Redirects to the original URL and tracks the click.

## 🎨 Frontend Features

### Pages
- **Home Page** (`/`): Create new short URLs with form validation
- **Stats Page** (`/stats`): View analytics dashboard

### Components
- **URL Form**: Multi-input form for batch URL creation
- **Results Display**: Shows success/error states with proper formatting
- **Navigation**: Clean routing between pages

### UI/UX
- ✅ Loading states and error handling
- ✅ Responsive design
- ✅ Form validation
- ✅ Real-time feedback

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **axios** - HTTP client for logging
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **nodemon** - Development server

### Frontend
- **React 19** - UI framework
- **React Router DOM** - Client-side routing
- **axios** - HTTP client
- **Vite** - Build tool and dev server
- **Material-UI** - UI components (optional)

### Storage
- **In-Memory Map** - Fast data storage (development)
- ⚠️ **Note**: For production, replace with persistent database (PostgreSQL/MongoDB)

## 🔧 Configuration

### Environment Variables

#### Backend (`.env`)
```env
AUTH_TOKEN=your_auth_token_here
NODE_ENV=development|production
PORT=5000
BASE_URL=http://localhost:5000
```

#### Frontend (`.env`)
```env
VITE_AUTH_TOKEN=your_auth_token_here
```

### Rate Limiting
- **Default**: 50 requests per minute per IP
- **Configurable** in `middleware/rateLimiter.js`

### CORS Settings
- **Development**: `http://localhost:3000`, `http://localhost:5173`
- **Production**: Configure your domain in `index.js`

## 📊 Logging & Monitoring

The application includes integration with external logging service:
- **Endpoint**: `http://20.244.56.144/evaluation-service/logs`
- **Levels**: `info`, `warn`, `error`, `debug`
- **Components**: Tracks all major operations

## 🚨 Error Handling

### Backend
- Input validation for URLs and shortcodes
- Rate limiting protection
- Duplicate shortcode detection
- Expiry validation
- Global error handling middleware

### Frontend
- Form validation
- Network error handling
- Loading states
- User-friendly error messages

## 🔒 Security Features

- **Authentication**: Bearer token validation
- **CORS**: Configured for specific origins
- **Security Headers**: XSS protection, content type validation
- **Input Sanitization**: URL and shortcode validation
- **Rate Limiting**: Prevents abuse

## 📈 Performance Considerations

### Current Implementation
- **Storage**: In-memory Map for fast access
- **Shortcode Generation**: Efficient random generation with collision detection
- **Batch Processing**: Frontend handles multiple URLs efficiently

### Production Recommendations
- Replace in-memory storage with Redis/PostgreSQL
- Add caching layer
- Implement database indexing
- Add monitoring and metrics
- Use CDN for static assets

## 🧪 Testing

### Backend Testing
```bash
cd backend-test-submission
npm test  # Configure test script
```

### Frontend Testing
```bash
cd frontend-test-submission
npm run test  # Add testing framework
```

## 📦 Deployment

### Backend Deployment
1. Set production environment variables
2. Configure database connection
3. Update CORS origins
4. Use PM2 or similar for process management

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Configure API endpoints for production
3. Deploy to CDN or static hosting

## 🐛 Known Issues & TODOs

### Current Limitations
- ⚠️ **In-memory storage**: Data lost on server restart
- ⚠️ **No user management**: Single token authentication
- ⚠️ **No database**: Not suitable for production scale


## 👨‍💻 Author

**Divyansh Kumar Chaturvedi**
- Roll No: 12218322
- Email: divyanshkumar@lpu.in

---

## 🚀 Getting Started Commands

```bash
# Clone the repository
git clone <repository-url>
cd 12218322

# Backend setup
cd backend-test-submission
npm install
npm start

# Frontend setup (new terminal)
cd frontend-test-submission
npm install
npm run dev
```

Visit `http://localhost:5173` to use the application!

---