# TimeAI Watch Store - Test Credentials & Setup Guide

## 🔐 Default Test Credentials

### Admin Account
- **Email**: `admin@timeaiwatch.com`
- **Password**: `Admin123!`
- **Role**: ADMIN (Full Access)
- **Status**: ACTIVE

### Regular User Account #1
- **Email**: `john@example.com`
- **Password**: `Password123!`
- **Role**: USER
- **Phone**: +1-555-0101
- **Status**: ACTIVE

### Regular User Account #2
- **Email**: `jane@example.com`
- **Password**: `Password123!`
- **Role**: USER
- **Phone**: +1-555-0102
- **Status**: ACTIVE

---

## ⚠️ Important Security Notes

### Development vs Production
- ✅ **Use these credentials for**: Local development, testing, staging
- ❌ **DO NOT use in production**: These are default/demo credentials
- ✅ **For production**: Create unique admin user with strong password

### Password Security
- Passwords are hashed with SHA-256 in database
- Never stored in plain text
- Change before any production deployment

### Seed Data
- Located in: `/workspace/timeai-watch-store/database/seeds/seedDatabase.ts`
- Created by running: `npm run seed`
- Can be recreated anytime (resets all data)

---

## 🚀 Quick Setup Steps

### Step 1: Install Dependencies
```bash
cd /workspace/timeai-watch-store/backend
npm install
```

### Step 2: Configure Database
```bash
# Create .env file with DATABASE_URL
DATABASE_URL="postgresql://user:password@localhost:5432/timeai_db"
```

### Step 3: Setup Database
```bash
npm run migrate  # Run migrations
npm run seed     # Seed test data with these credentials
```

### Step 4: Start Backend
```bash
npm start
# Server runs on http://localhost:3000
```

### Step 5: Start Frontend
```bash
cd ../frontend
npm install
npm run dev
# Frontend runs on http://localhost:3001
```

### Step 6: Login
- Go to: `http://localhost:3001/login`
- Email: `admin@timeaiwatch.com`
- Password: `Admin123!`
- Click Login

---

## 🔗 How to Access

### Frontend Login
```
URL: http://localhost:3001/login
Email: admin@timeaiwatch.com
Password: Admin123!
```

### API Login
```
Method: POST
URL: http://localhost:3000/api/auth/login
Headers: Content-Type: application/json
Body: {
  "email": "admin@timeaiwatch.com",
  "password": "Admin123!"
}
```

### Swagger API Docs
```
URL: http://localhost:3000/api/docs
Authentication: Click "Authorize" and paste JWT token
```

---

## 🎯 What You Can Do

### With Admin Account
- ✅ Access admin dashboard
- ✅ Create/edit/delete products
- ✅ Manage users
- ✅ View all orders
- ✅ View sales statistics
- ✅ Access all system features

### With User Account
- ✅ Browse products
- ✅ Search/filter products
- ✅ Add to cart
- ✅ Checkout
- ✅ Create orders
- ✅ View own orders
- ✅ Update profile
- ❌ No admin access

### As Guest
- ✅ Browse public products
- ✅ View product details
- ❌ Cannot add to cart
- ❌ Login required to checkout

---

## 🔄 Password Management

### Change Password Option 1: Update Seed Data
```bash
# Edit seedDatabase.ts
# Change: hashPassword('Admin123!')
# To: hashPassword('NewPassword123!')

npm run seed  # Recreate users with new password
```

### Change Password Option 2: Use API
```bash
# Login first
# Then call: PUT /api/users/profile
{
  "newPassword": "NewPassword123!"
}
```

### Change Password Option 3: Direct Database
```sql
-- Connect to PostgreSQL
UPDATE users 
SET password = SHA256('NewPassword123!')
WHERE email = 'admin@timeaiwatch.com';
```

---

## 📋 User Roles Explained

### ADMIN Role
- Full system access
- Can manage all products
- Can manage all users
- Can view all orders
- Can change system settings
- Can access admin dashboard

### USER Role
- Browse and search products
- Add/remove from cart
- Checkout and create orders
- View own orders and profile
- Update profile information
- Cannot access admin features

---

## ⚠️ Before Production

### Security Checklist
- [ ] Delete seed database and test data
- [ ] Create new admin user with strong password (20+ characters)
- [ ] Remove seed script from production code
- [ ] Use environment variables for all credentials
- [ ] Enable HTTPS/TLS
- [ ] Enable 2FA for admin accounts
- [ ] Setup regular backups
- [ ] Configure logging and monitoring
- [ ] Run security audit
- [ ] Setup SSL certificates

### Database Changes
- [ ] Rotate database credentials
- [ ] Set strong password policy
- [ ] Enable database encryption
- [ ] Setup automated backups
- [ ] Configure replication for HA

### Application Changes
- [ ] Update JWT secret key
- [ ] Set secure session timeout
- [ ] Enable rate limiting
- [ ] Setup CORS properly
- [ ] Enable security headers
- [ ] Setup logging/monitoring

---

## 🆘 Troubleshooting

### If You Forget the Password
**Development**: Re-run `npm run seed` (will reset all data)  
**Production**: Use password reset email link or contact admin

### If Seed Fails
```bash
# Reset database
npm run prisma:reset

# Then re-seed
npm run seed
```

### Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists
- Check network connectivity

### Login Issues
- Verify email exists in database
- Confirm password is correct
- Check JWT secret in .env
- Verify backend is running

---

## 📞 Contact & Support

### For Development Questions
- Check START_HERE.md for setup
- Check README.md for overview
- Check API_DOCUMENTATION.md for endpoints

### For Deployment Questions
- Follow deployment checklist
- Use environment variables
- Implement security controls
- Setup monitoring

---

## 📁 Related Files

- **Seed Data**: `/workspace/timeai-watch-store/database/seeds/seedDatabase.ts`
- **Setup Guide**: `/workspace/timeai-watch-store/START_HERE.md`
- **API Docs**: `/workspace/timeai-watch-store/docs/api/API_DOCUMENTATION.md`
- **Environment**: `/workspace/timeai-watch-store/.env.example`

---

## ✅ Summary

| Item | Details |
|------|---------|
| **Admin Email** | admin@timeaiwatch.com |
| **Admin Password** | Admin123! |
| **User Email #1** | john@example.com |
| **User Password #1** | Password123! |
| **User Email #2** | jane@example.com |
| **User Password #2** | Password123! |
| **Seed Location** | database/seeds/seedDatabase.ts |
| **Setup Command** | npm run seed |
| **Usage** | Development/Testing ONLY |

**⚠️ Remember**: Change these credentials before any production deployment!
