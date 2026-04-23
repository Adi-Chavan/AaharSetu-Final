const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const { isAuthenticated, hasRole } = require('./middlewares/authMiddleware');

const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donors');
const ngoRoutes = require('./routes/ngos');
const volunteerRoutes = require('./routes/volunteers');
const donationRoutes = require('./routes/donations');
const recommendationRoutes = require('./routes/Recommend');
const adminRoutes = require('./routes/admin');


const app = express();

// Database Connection Handling
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/AaharSetu', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB Connection Error:', err));

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://aaharsetufinal-1.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Middleware Configuration
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '50mb' }));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://aaharsetufinal-1.onrender.com'
  ],
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set true in production if using HTTPS
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7-day session persistence
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Passport Configuration
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'No user found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch 
        ? done(null, user) 
        : done(null, false, { message: 'Incorrect password' });
    } catch (error) {
      return done(error);
    }
  }
));

// Passport Authentication Configuration
passport.serializeUser((user, done) => {
  console.log('Serializing User:', user);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log('Deserializing User ID:', id);
    const user = await User.findById(id);
    console.log('Deserialized User:', user);
    done(null, user);
  } catch (error) {
    done(error);
  }
});


// Debug Middleware
app.use((req, res, next) => {
  console.log('Session Data:', req.session);
  console.log('User from Session:', req.user);
  next();
});

// Routes Configuration
app.use('/api/auth', authRoutes);
app.use('/api/donors', isAuthenticated, hasRole(['donor']), donorRoutes);
app.use('/api/ngos', isAuthenticated, hasRole(['ngo', 'admin']), ngoRoutes);
app.use('/api/volunteers', isAuthenticated, hasRole(['volunteer', 'admin']), volunteerRoutes);
app.use('/donations', isAuthenticated, hasRole(['donor']), donationRoutes);
app.use('/', recommendationRoutes);
app.use('/admin', adminRoutes);

// API Health Check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Server Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

