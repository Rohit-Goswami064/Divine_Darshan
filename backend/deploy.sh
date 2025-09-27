#!/bin/bash

# Divine Darshan Backend - Vercel Deployment Script
# This script helps you deploy your backend to Vercel

echo "🚀 Divine Darshan Backend - Vercel Deployment"
echo "=============================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "Please install it with: npm i -g vercel"
    exit 1
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first:"
    vercel login
fi

echo "📦 Installing dependencies..."
npm install

echo "🌍 Setting up environment variables..."
echo "You'll need to provide:"
echo "1. MONGO_URI (your MongoDB connection string)"
echo "2. JWT_SECRET (a secure random string)"
echo ""

# Add environment variables
echo "Setting MONGO_URI..."
vercel env add MONGO_URI

echo "Setting JWT_SECRET..."
vercel env add JWT_SECRET

echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Your API is now live at: https://your-project.vercel.app/api"
echo "2. Test the health endpoint: https://your-project.vercel.app/api/health"
echo "3. Seed your database with initial data"
echo "4. Update your frontend to use the new API URL"
echo ""
echo "🔧 Useful commands:"
echo "- View logs: vercel logs"
echo "- Redeploy: vercel --prod"
echo "- Check env vars: vercel env ls"
