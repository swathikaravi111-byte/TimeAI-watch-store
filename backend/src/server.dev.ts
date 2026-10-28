const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}))
app.use(express.json())

// In-memory database
const users = new Map()

// Helper functions
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '24h' }
  )
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running!' })
})

app.post('/api/auth/register', (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters',
      })
    }

    // Check if email exists
    const existingUser = Array.from(users.values()).find(u => u.email === email)
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      })
    }

    // Create user
    const userId = `user-${Date.now()}`
    const user = {
      id: userId,
      firstName,
      lastName,
      email,
      password: hashPassword(password),
      role: 'USER',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    users.set(userId, user)

    // Generate token
    const token = generateToken(user)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken: 'dummy-refresh-token',
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    })
  }
})

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body

    const user = Array.from(users.values()).find(u => u.email === email)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Simple password check
    if (user.password !== hashPassword(password)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    const token = generateToken(user)

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken: 'dummy-refresh-token',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
    })
  }
})

app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      })
    }

    res.json({
      success: true,
      data: {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
    })
  }
})

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Backend Server running on http://localhost:${PORT}`)
  console.log(`✅ CORS enabled for http://localhost:3001`)
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`)
})

module.exports = app
