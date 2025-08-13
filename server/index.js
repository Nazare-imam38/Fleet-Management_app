const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Mock database
let vehicles = [
  {
    id: 1,
    name: 'Truck-001',
    type: 'Truck',
    driver: 'John Smith',
    status: 'active',
    location: 'Downtown',
    coordinates: [40.7128, -74.0060],
    fuel: 78,
    speed: 45,
    eta: '15 min',
    lastService: '2024-01-15'
  },
  {
    id: 2,
    name: 'Van-002',
    type: 'Van',
    driver: 'Sarah Johnson',
    status: 'idle',
    location: 'Warehouse',
    coordinates: [40.7589, -73.9851],
    fuel: 92,
    speed: 0,
    eta: 'N/A',
    lastService: '2024-01-10'
  },
  {
    id: 3,
    name: 'Truck-003',
    type: 'Truck',
    driver: 'Mike Wilson',
    status: 'active',
    location: 'Airport',
    coordinates: [40.7505, -73.9934],
    fuel: 65,
    speed: 38,
    eta: '32 min',
    lastService: '2024-01-20'
  }
];

let routes = [
  {
    id: 'R001',
    vehicle: 'Truck-001',
    stops: 8,
    distance: 45.2,
    duration: '2h 15m',
    coordinates: [
      [40.7128, -74.0060],
      [40.7589, -73.9851],
      [40.7505, -73.9934],
      [40.7484, -73.9857],
      [40.7549, -73.9840]
    ]
  }
];

let deliveries = [
  {
    id: 1,
    address: '123 Main St, Downtown',
    coordinates: [40.7128, -74.0060],
    priority: 'high',
    timeWindow: '9:00 AM - 5:00 PM',
    weight: 150,
    status: 'pending',
    assignedVehicle: 'Truck-001'
  },
  {
    id: 2,
    address: '456 Oak Ave, Midtown',
    coordinates: [40.7589, -73.9851],
    priority: 'medium',
    timeWindow: '10:00 AM - 6:00 PM',
    weight: 200,
    status: 'in_progress',
    assignedVehicle: 'Van-002'
  }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Routing API is running' });
});

// Vehicle routes
app.get('/api/vehicles', (req, res) => {
  res.json(vehicles);
});

app.get('/api/vehicles/:id', (req, res) => {
  const vehicle = vehicles.find(v => v.id === parseInt(req.params.id));
  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  res.json(vehicle);
});

app.post('/api/vehicles', (req, res) => {
  const newVehicle = {
    id: Date.now(),
    ...req.body,
    status: 'idle',
    location: 'Warehouse',
    coordinates: [40.7128, -74.0060],
    fuel: 100,
    speed: 0,
    eta: 'N/A',
    lastService: new Date().toISOString().split('T')[0]
  };
  vehicles.push(newVehicle);
  res.status(201).json(newVehicle);
});

app.put('/api/vehicles/:id', (req, res) => {
  const index = vehicles.findIndex(v => v.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  vehicles[index] = { ...vehicles[index], ...req.body };
  res.json(vehicles[index]);
});

app.delete('/api/vehicles/:id', (req, res) => {
  const index = vehicles.findIndex(v => v.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  vehicles.splice(index, 1);
  res.status(204).send();
});

// Route routes
app.get('/api/routes', (req, res) => {
  res.json(routes);
});

app.post('/api/routes', (req, res) => {
  const newRoute = {
    id: `R${String(routes.length + 1).padStart(3, '0')}`,
    ...req.body
  };
  routes.push(newRoute);
  res.status(201).json(newRoute);
});

// Delivery routes
app.get('/api/deliveries', (req, res) => {
  res.json(deliveries);
});

app.post('/api/deliveries', (req, res) => {
  const newDelivery = {
    id: Date.now(),
    ...req.body,
    status: 'pending'
  };
  deliveries.push(newDelivery);
  res.status(201).json(newDelivery);
});

// Optimization routes
app.post('/api/optimize', (req, res) => {
  const { algorithm, deliveryPoints, vehicles } = req.body;
  
  // Simulate optimization process
  setTimeout(() => {
    const optimizedRoutes = [
      {
        id: 1,
        vehicle: 'Truck-001',
        distance: 89.2,
        duration: '4h 30m',
        stops: deliveryPoints.slice(0, 3).map((point, index) => ({
          address: point.address,
          eta: `${9 + index * 2}:${index * 15} AM`
        }))
      },
      {
        id: 2,
        vehicle: 'Van-002',
        distance: 67.6,
        duration: '3h 45m',
        stops: deliveryPoints.slice(3).map((point, index) => ({
          address: point.address,
          eta: `${10 + index * 2}:${index * 15} AM`
        }))
      }
    ];

    const results = {
      totalDistance: 156.8,
      totalTime: 8.5,
      vehiclesUsed: 2,
      efficiency: 94,
      routes: optimizedRoutes
    };

    res.json(results);
  }, 2000);
});

// Analytics routes
app.get('/api/analytics', (req, res) => {
  const analytics = {
    metrics: {
      totalDeliveries: 1247,
      onTimeDelivery: 94.2,
      fuelEfficiency: 18.5,
      costPerDelivery: 23.45
    },
    deliveryChart: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Deliveries',
          data: [45, 52, 48, 61, 55, 42, 38]
        },
        {
          label: 'On-Time Rate',
          data: [92, 95, 89, 96, 94, 91, 88]
        }
      ]
    },
    utilizationChart: {
      labels: ['Active', 'Idle', 'Maintenance'],
      datasets: [{
        data: [65, 25, 10]
      }]
    }
  };
  
  res.json(analytics);
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial data
  socket.emit('vehicles', vehicles);
  socket.emit('routes', routes);

  // Handle vehicle updates
  socket.on('updateVehicle', (vehicleData) => {
    const index = vehicles.findIndex(v => v.id === vehicleData.id);
    if (index !== -1) {
      vehicles[index] = { ...vehicles[index], ...vehicleData };
      io.emit('vehicles', vehicles);
    }
  });

  // Handle route updates
  socket.on('updateRoute', (routeData) => {
    const index = routes.findIndex(r => r.id === routeData.id);
    if (index !== -1) {
      routes[index] = { ...routes[index], ...routeData };
      io.emit('routes', routes);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Smart Routing Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🔌 WebSocket server ready for real-time updates`);
});
