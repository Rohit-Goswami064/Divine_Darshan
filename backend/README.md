# Divine Darshan - Backend Server

This is the backend server for the Divine Darshan application. It is built with Node.js, Express, and MongoDB, and it provides a RESTful API for all frontend operations, including user authentication, temple management, bookings, and content management.

## Features

- **JWT Authentication:** Secure user registration and login using JSON Web Tokens.
- **Role-Based Access Control:** Differentiates between regular users, temple managers, and administrators.
- **CRUD Operations:** Full Create, Read, Update, and Delete functionality for temples, services, and other content.
- **MongoDB Integration:** Uses Mongoose for elegant object data modeling with MongoDB.
- **Centralized Error Handling:** Robust and user-friendly error responses.

## Technologies Used

- **Node.js:** JavaScript runtime environment.
- **Express:** Web framework for Node.js.
- **MongoDB:** NoSQL database.
- **Mongoose:** Object Data Modeling (ODM) library for MongoDB.
- **jsonwebtoken (JWT):** For creating and verifying access tokens.
- **bcryptjs:** For hashing passwords.
- **dotenv:** For managing environment variables.
- **cors:** For enabling Cross-Origin Resource Sharing.

---
## Setup and Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (either a local instance or a cloud-hosted version like MongoDB Atlas)

### 1. Install Dependencies

Navigate to the backend directory and install the required npm packages.

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory. You can do this by copying the `.env.example` if it exists, or creating a new file.

Now, open the `.env` file and add your configuration details. **Both variables are mandatory.**

```env
# The port your server will run on
PORT=5000

# Your MongoDB connection string (from local instance or MongoDB Atlas)
# Example for local MongoDB: MONGO_URI=mongodb://127.0.0.1:27017/divine_darshan
MONGO_URI=mongodb://127.0.0.1:27017/divine_darshan

# A long, random, and secret string for signing JWTs. This is CRITICAL for security.
# Use a password generator to create a strong secret.
JWT_SECRET=your_super_secret_and_random_string_here
```

### 3. Seed the Database (Initial Setup)

To populate the database with initial temple, service, and user data, run the seeder script. **This will delete all existing data in the collections.**

```bash
npm run seed
```

---
## Running the Server

- **Development Mode:** To run the server with Nodemon (which automatically restarts on file changes):
  ```bash
  npm run dev
  ```
- **Production Mode:** To run the standard server:
  ```bash
  npm start
  ```

The API will be available at `http://localhost:5000/api`.

---
## API Endpoints

### Authentication (`/api/auth`)

- `POST /register`: Register a new user.
- `POST /login`: Log in a user and receive a JWT.
- `GET /me`: Get the profile of the currently logged-in user (Protected).

### Temples (`/api/temples`)

- `GET /`: Get all temples.
- `GET /:id`: Get a single temple by its custom ID.
- `POST /`: Create a new temple (Admin only).
- `PUT /:id`: Update a temple (Admin/Temple Manager only).
- `DELETE /:id`: Delete a temple (Admin only).

### Bookings (`/api/bookings`)

- `POST /`: Create a new booking (User only).
- `GET /my-bookings`: Get all bookings for the current user (User only).
- `GET /all`: Get all bookings from all users (Admin/Temple Manager only).

### Services (`/api/services`)

- `GET /`: Get all core services.
- `POST /`: Create a new service (Admin only).
- `PUT /:id`: Update a service (Admin only).
- `DELETE /:id`: Delete a service (Admin only).

### Content (`/api/content`)

- `GET /testimonials`: Get all testimonials.
- `POST /testimonials`: Create a new testimonial (Admin only).
- `PUT /testimonials/:id`: Update a testimonial (Admin only).
- `DELETE /testimonials/:id`: Delete a testimonial (Admin only).
- `GET /seasonalevent`: Get the seasonal event banner data.
- `PUT /seasonalevent`: Update the seasonal event banner data (Admin only).

### Users (`/api/users`)

- `GET /`: Get a list of all users (Admin only).
# Divine_Darshan_backend
