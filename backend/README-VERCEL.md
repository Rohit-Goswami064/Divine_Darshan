# Divine Darshan Backend - Vercel Deployment Guide

This guide will help you deploy your Divine Darshan backend API to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Database**:
   - Local MongoDB instance, or
   - MongoDB Atlas cloud database (recommended for production)
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)

## Environment Variables Setup

### 1. MongoDB Database

**Option A: MongoDB Atlas (Recommended)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/divine_darshan`)

**Option B: Local MongoDB**

- Use: `mongodb://127.0.0.1:27017/divine_darshan`

### 2. JWT Secret

Generate a secure secret key:

- Visit: https://generate-secret.vercel.app/32
- Or use: `openssl rand -base64 32`

## Deployment Steps

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Navigate to backend directory**

   ```bash
   cd backend
   ```

3. **Login to Vercel**

   ```bash
   vercel login
   ```

4. **Deploy**

   ```bash
   vercel
   ```

5. **Set Environment Variables**

   ```bash
   vercel env add MONGO_URI
   # Enter your MongoDB connection string when prompted

   vercel env add JWT_SECRET
   # Enter your JWT secret when prompted
   ```

6. **Redeploy with environment variables**
   ```bash
   vercel --prod
   ```

### Method 2: Vercel Dashboard

1. **Connect Repository**

   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Set Root Directory to `backend`

2. **Configure Build Settings**

   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: Leave empty
   - Install Command: `npm install`

3. **Set Environment Variables**

   - Go to Project Settings → Environment Variables
   - Add the following variables:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key

4. **Deploy**
   - Click "Deploy"

## Post-Deployment Setup

### 1. Seed the Database

After deployment, you'll need to populate your database with initial data. You can do this by:

**Option A: Using Vercel CLI**

```bash
# Run the seeder script locally with production database
MONGO_URI=your_production_mongo_uri npm run seed
```

**Option B: Create a temporary API endpoint**
Add this to your `api/index.js` temporarily:

```javascript
// Temporary seeder endpoint (remove after seeding)
app.post("/api/seed", async (req, res) => {
  try {
    // Import and run seeder
    const { importData } = require("../seed/seeder");
    await importData();
    res.json({ success: true, message: "Database seeded successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### 2. Test Your API

Your API will be available at: `https://your-project-name.vercel.app/api`

Test endpoints:

- Health check: `GET https://your-project-name.vercel.app/api/health`
- Get temples: `GET https://your-project-name.vercel.app/api/temples`

## API Endpoints

Once deployed, your API will be available at:

- Base URL: `https://your-project-name.vercel.app/api`
- Health Check: `GET /api/health`
- Authentication: `POST /api/auth/register`, `POST /api/auth/login`
- Temples: `GET /api/temples`, `GET /api/temples/:id`
- Bookings: `POST /api/bookings`, `GET /api/bookings/my-bookings`
- And more...

## Troubleshooting

### Common Issues

1. **Database Connection Issues**

   - Ensure your MongoDB URI is correct
   - Check if your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0)

2. **Environment Variables Not Working**

   - Make sure variables are set in Vercel dashboard
   - Redeploy after adding environment variables

3. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version is compatible (18+)

### Useful Commands

```bash
# Check deployment logs
vercel logs

# View environment variables
vercel env ls

# Remove environment variable
vercel env rm VARIABLE_NAME

# Redeploy
vercel --prod
```

## Security Notes

1. **Never commit `.env` files** to your repository
2. **Use strong JWT secrets** (32+ characters)
3. **Restrict MongoDB access** to specific IPs in production
4. **Use HTTPS** (automatically provided by Vercel)

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Test database connectivity
4. Check API endpoint responses

Your Divine Darshan backend is now ready for production! 🚀
