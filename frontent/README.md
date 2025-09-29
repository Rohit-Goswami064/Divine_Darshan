# Divine Darshan - A Modern Devotional Services Platform

Divine Darshan is a modern, devotional, and user-friendly full-stack application for booking religious services online. It is designed for ease of use, especially for elderly devotees, with a focus on a quick and simple booking process for pujas, prasad subscriptions, and other temple services.

![Divine Darshan Screenshot](https://storage.googleapis.com/aistudio-project-images/22904323-289c-40d1-b51f-61219b5b248a/4a1c1d0b-68d8-4a0b-93f0-4fc750e64c1c.png)

---

## Table of Contents

1.  [Architecture Overview](#1-architecture-overview)
2.  [Features](#2-features)
3.  [Tech Stack](#3-tech-stack)
4.  [Local Development Setup](#4-local-development-setup)
5.  [Deployment Guide (Railway)](#5-deployment-guide-for-railway)
6.  [Critical: Configuration for Production Deployment](#6-critical-configuration-for-production-deployment)
7.  [Project Workflow](#7-project-workflow)

---

## 1. Architecture Overview

This project is a **monorepo** containing two main parts:

-   **Frontend:** A client-side application built with **React** and TypeScript. It is a static application served directly to the user's browser. It communicates with the backend via a REST API.
-   **Backend:** A RESTful API server built with **Node.js, Express, and MongoDB**. It handles business logic, database interactions, user authentication, and payment processing logic.

The two parts are designed to be developed and deployed together but run as separate services in a production environment.

## 2. Features

-   **User Authentication:** Secure JWT-based login and registration for users, admins, and temple managers.
-   **Temple & Service Browsing:** Users can view detailed information about temples, pujas, and other available services.
-   **Online Booking:** Seamless puja booking with secure payment processing via Razorpay.
-   **Prasad Subscription:** Users can subscribe to receive temple prasad at home.
-   **User Dashboard:** Devotees can view their past and upcoming bookings, manage their profile, and check subscriptions.
-   **Admin Dashboard:** A comprehensive backend interface for administrators to manage:
    -   Temples (CRUD operations)
    -   Core Services (CRUD operations)
    -   User Bookings
    -   Website Content (Seasonal Banners, Testimonials)

## 3. Tech Stack

| Area      | Technology                                                                          |
| :-------- | :---------------------------------------------------------------------------------- |
| **Frontend**  | React, TypeScript, Tailwind CSS, Axios, Lucide React                                |
| **Backend**   | Node.js, Express.js, MongoDB                                                        |
| **Database**  | Mongoose (ODM)                                                                      |
| **Auth**      | JWT (jsonwebtoken), bcryptjs                                                        |
| **Payments**  | Razorpay (Client-side Integration)                                                  |
| **Deployment**| Railway.app                                                                         |

---

## 4. Local Development Setup

### Prerequisites

-   **Node.js:** v16 or later.
-   **MongoDB:** A running instance, either locally or on a cloud service like MongoDB Atlas.

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd <your-repository-name>
```

### Step 2: Install Dependencies

This is a monorepo, so you need to install dependencies for both the frontend and backend.

```bash
# Install frontend dependencies from the root directory
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 3: Configure Backend Environment

1.  Navigate to the `/backend` directory.
2.  Create a new file named `.env`.
3.  Copy the contents below into the `.env` file and replace the placeholder values.

    ```env
    # The port your server will run on
    PORT=5000

    # Your MongoDB connection string.
    # Replace with your actual string from your local instance or MongoDB Atlas.
    # Example for local DB: MONGO_URI=mongodb://127.0.0.1:27017/divine_darshan
    MONGO_URI=mongodb://your_connection_string_here

    # A long, random, and secret string for signing security tokens. This is critical.
    # Use an online generator to create a strong secret key.
    JWT_SECRET=your_super_secret_and_random_string_for_jwt
    ```

### Step 4: Seed the Database

To populate your database with initial sample data (temples, users, services), run the seeder script from the `/backend` directory.

**Warning:** This will delete any existing data in the database.

```bash
cd backend
npm run seed
```

### Step 5: Run the Application

You need to run the backend server and the frontend development server in two separate terminals.

-   **Terminal 1: Start the Backend Server**
    ```bash
    cd backend
    npm run dev
    ```
    The backend API should now be running at `http://localhost:5000`.

-   **Terminal 2: Start the Frontend**
    The frontend is served as a static site. You can use any simple HTTP server. If you have `serve` installed:
    ```bash
    # Run from the root directory
    serve -l 3000
    ```
    The website should now be accessible at `http://localhost:3000`. The frontend will automatically connect to the backend running on port 5000.

---

## 5. Deployment Guide for Railway

This guide provides step-by-step instructions to deploy the entire application to [Railway.app](https://railway.app/).

### Prerequisites

-   A GitHub account.
-   A Railway account.
-   The project code pushed to a GitHub repository.
-   A MongoDB database (you can use Railway's own addon or an external service like MongoDB Atlas).

### Step 1: Deploy on Railway

1.  Log in to your Railway dashboard and click **"New Project"**.
2.  Select **"Deploy from GitHub repo"** and choose your project's repository.
3.  Railway will detect the monorepo structure. It might add a single service initially. We will configure it to have two: one for the backend and one for the frontend.

### Step 2: Configure the Backend Service

1.  If Railway created a default service, open it. If not, click **"Add a new service"** and choose your GitHub repo again.
2.  Go to the service's **"Settings"** tab.
3.  **Service Name:** Rename it to `backend` or `api`.
4.  **Root Directory:** Set this to `./backend`. This tells Railway to look inside the `/backend` folder for this service.
5.  **Start Command:** Railway should automatically detect `npm start` from `package.json`. If not, you can set it to `npm install && npm start`.
6.  Go to the **"Variables"** tab for the `backend` service.
7.  Add the same environment variables from your local `.env` file:
    -   `MONGO_URI`: Your production MongoDB connection string.
    -   `JWT_SECRET`: Your strong, unique production JWT secret.
    -   **Important:** Railway provides the `PORT` variable automatically, so you do not need to add it here.

### Step 3: Configure the Frontend Service

1.  Go back to the project dashboard and click **"New"**.
2.  Select your GitHub repository again. Railway will create a second service.
3.  Go to this new service's **"Settings"** tab.
4.  **Service Name:** Rename it to `frontend` or `web`.
5.  **Root Directory:** Set this to `./`. The root directory contains the `index.html`.
6.  **Start Command:** Leave this blank. Railway's buildpacks are smart and will detect the `index.html` and serve it as a static website.

### Step 4: Connect Frontend to Backend

1.  After your `backend` service has deployed, go to its **"Settings"** tab and copy its public URL under the "Domains" section (e.g., `https://divine-darshan-backend-prod.up.railway.app`).
2.  Go to your `frontend` service's **"Variables"** tab.
3.  Click **"Add a new variable"** and create the following:
    -   **Variable Name:** `VITE_API_URL`
    -   **Variable Value:** Paste the backend URL you copied, making sure to add the `/api` suffix at the end.
        -   **Example Value:** `https://divine-darshan-backend-prod.up.railway.app/api`
4.  Your frontend will automatically redeploy with this new variable, connecting it to the backend.

### Step 5: Finalize and Secure

1.  Open the public URL for your `frontend` service. The website should be live and fully functional.
2.  For better security, follow the steps in the **"Critical: Configuration for Production Deployment"** section below, especially for setting up CORS.

---

## 6. Critical: Configuration for Production Deployment

This section details the files and settings you **must** configure or verify to take the application from a local setup to a live, production server.

**⚠️ Important Note:** The best practice is to use **Environment Variables** on your deployment platform (like Railway) instead of hardcoding values directly into the code.

#### **1. Frontend: Connecting to the Backend API**

-   **File to Configure:** This is an **Environment Variable** on your `frontend` service in Railway.
-   **Variable Name:** `VITE_API_URL`
-   **Action:** As described in Step 4 of the Railway guide, this variable **must** be set to the public URL of your deployed `backend` service, with `/api` at the end.
-   **Why:** This tells your live frontend where to find your live backend API. Without this, it will fail to fetch any data and the site will not work.

#### **2. Frontend: Razorpay Live Keys**

-   **Files to Change:**
    -   `components/BookingModal.tsx`
    -   `components/SubscriptionModal.tsx`
-   **Action:** In both files, find the `RazorpayOptions` object and locate the `key` property. Replace the existing value with your **live public Razorpay Key ID**.
-   **Example (in both files):**
    ```javascript
    const options: RazorpayOptions = {
        key: 'rzp_live_YOUR_PUBLIC_KEY_ID', // <--- REPLACE THIS VALUE
        // ... other options
    };
    ```
-   **Why:** You must use your own live key to process real payments into your Razorpay account. Test keys will not work for actual transactions.

#### **3. Backend: Security and Database Connection**

-   **File to Configure:** These are **Environment Variables** on your `backend` service in Railway.
-   **Variables to Set:**
    -   `MONGO_URI`: Your production MongoDB connection string.
    -   `JWT_SECRET`: A long, random, and unique secret string for security. **Never use a weak or default secret in production.**
-   **Why:** The backend server will refuse to start without these variables. They securely connect your application to the database and protect user sessions.

#### **4. Backend: Restrict API Access (CORS)**

-   **File to Change:** `backend/server.js`
-   **Action:** For security, you must only allow your frontend application to make requests to your API. Find the line `app.use(cors());` and replace it with the following block.
-   **Code to Use:**
    ```javascript
    // Replace this line:
    // app.use(cors());

    // With this block:
    const allowedOrigins = ['https://your-frontend-domain.up.railway.app']; // <-- REPLACE WITH YOUR FRONTEND URL
    const corsOptions = {
      origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      }
    };
    app.use(cors(corsOptions));
    ```
-   **Why:** This acts as a firewall, preventing other malicious websites from making requests to your backend API on behalf of your users.

---

## 7. Project Workflow

-   **Devotee Journey:** A user visits the site, browses temples, selects a puja, fills in their details, and completes the payment via Razorpay. They can then view their booking details in their personal dashboard.
-   **Admin Journey:** An administrator logs in and is redirected to the `/admin_dashboard`. From here, they can add/edit/delete temple information, manage core services offered by the platform, and view all user bookings.
-   **Data Flow:** The React frontend makes authenticated API requests to the Express backend. The backend controllers handle the logic, interact with the MongoDB database via Mongoose models, and return JSON responses to the frontend.
```

# Divine_Darshan
