# MongoDB Installation & Setup Guide

## Option 1: Install MongoDB Community Server (Recommended for Development)

### Windows Installation:
1. **Download MongoDB Community Server**:
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows x64
   - Download the `.msi` installer

2. **Install MongoDB**:
   - Run the downloaded `.msi` file
   - Follow the installation wizard
   - Choose "Complete" installation
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**:
   ```bash
   mongod --version
   ```

4. **Start MongoDB Service**:
   ```bash
   # MongoDB should start automatically as a service
   # If not, start manually:
   net start MongoDB
   ```

## Option 2: Use MongoDB Atlas (Cloud - Free Tier)

### Setup MongoDB Atlas:
1. **Create Account**: Go to https://www.mongodb.com/atlas
2. **Create Cluster**: Choose free tier (M0)
3. **Configure Access**:
   - Add your IP address to whitelist
   - Create database user with password
4. **Get Connection String**: Copy the connection URI

### Update Backend Configuration:
Replace the MONGODB_URI in `backend/.env`:
```env
# For Atlas (replace <password> and <cluster> with your values):
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/costcurve?retryWrites=true&w=majority

# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/costcurve
```

## Option 3: Quick Fix - Continue Development Without Database

Your backend is designed to work without MongoDB for basic API testing. You can continue development and add MongoDB later.

## ⚡ Quick Start Commands After MongoDB Setup:

1. **Start MongoDB** (if local):
   ```bash
   # Windows Service (automatic):
   net start MongoDB
   
   # Manual start:
   mongod
   ```

2. **Restart Backend**:
   ```bash
   cd backend
   npm run dev
   ```

You should see:
```
✅ Connected to MongoDB
```

## 🔧 Current Status:
- ✅ Python dependencies installed
- ✅ Backend API running on port 5000
- ✅ Frontend React app running on port 3000
- ⚠️ MongoDB needs installation/configuration

Choose your preferred MongoDB option above and follow the setup instructions!