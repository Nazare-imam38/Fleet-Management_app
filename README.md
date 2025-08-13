# Smart Routing & Logistics Optimization Platform

A comprehensive GIS-powered delivery/logistics platform that optimizes routes for fleets while factoring in traffic, distance, delivery windows, and fuel efficiency.

## 🚀 Features

- **Route Optimization Algorithms** (VRP/DARP/Genetic)
- **Real-time Vehicle Tracking** (GPS integration)
- **Interactive Map Visualization** with stop clustering and route coloring
- **ETA Calculations** and live delay updates
- **Admin Dashboard** for route planning and driver assignment
- **Fleet Management** with vehicle status monitoring
- **Analytics & Reporting** with performance insights
- **Real-time Updates** via WebSocket connections

## 🛠 Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Leaflet** - Interactive maps
- **Chart.js** - Data visualization
- **Lucide Icons** - Beautiful icons
- **Vue Router** - Client-side routing
- **Pinia** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-routing-platform
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies
   cd ../client && npm install
   ```

3. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

### Manual Start

If you prefer to start servers separately:

```bash
# Start backend server
cd server
npm run dev

# Start frontend server (in a new terminal)
cd client
npm run dev
```

## 🔐 Authentication

The platform includes a demo authentication system:

- **Email**: `admin@smartrouting.com`
- **Password**: `password123`

## 📱 Usage

### Dashboard
- Real-time overview of logistics operations
- Key performance metrics
- Recent activity feed
- Vehicle status monitoring

### Live Map
- Interactive map with vehicle locations
- Real-time route visualization
- Traffic layer toggle
- Vehicle and route information panels

### Fleet Management
- Vehicle fleet overview
- Driver assignments
- Maintenance tracking
- Add/edit/delete vehicles

### Route Optimization
- Multiple algorithm selection (VRP, DARP, Genetic)
- Delivery point management
- Optimization parameters configuration
- Results visualization

### Analytics
- Performance metrics and trends
- Cost analysis
- Route performance insights
- Export capabilities

## 🗂 Project Structure

```
smart-routing-platform/
├── client/                 # Vue.js frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── views/          # Page components
│   │   ├── stores/         # Pinia state management
│   │   ├── router/         # Vue Router configuration
│   │   └── style.css       # Global styles
│   ├── index.html          # Main HTML file
│   └── package.json        # Frontend dependencies
├── server/                 # Node.js backend
│   ├── index.js           # Main server file
│   └── package.json       # Backend dependencies
├── package.json           # Root package.json
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Create new vehicle
- `GET /api/routes` - Get all routes
- `POST /api/optimize` - Optimize routes
- `GET /api/analytics` - Get analytics data

## 🚀 Deployment

### Production Build

```bash
# Build the frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

### Docker Deployment

```bash
# Build and run with Docker
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🎯 Roadmap

- [ ] PostgreSQL/PostGIS integration
- [ ] Advanced route optimization algorithms
- [ ] Mobile app for drivers
- [ ] Integration with external mapping services
- [ ] Machine learning for route prediction
- [ ] Multi-tenant architecture
- [ ] Advanced reporting and analytics

---

**Built with ❤️ for efficient logistics management**
