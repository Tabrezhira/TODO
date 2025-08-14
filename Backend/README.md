# Task App Backend

This is the backend API for the Task App, built with Node.js, Express, and MongoDB.

## Features

- User registration and login (JWT & cookies)
- Admin and user roles
- Block/unblock users (admin only)
- CRUD for todos with image upload (multer)
- Authentication middleware
- CORS support for frontend integration

## Setup

1. Clone the repository.
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_ORIGIN=http://localhost:5173
   ```
4. Start the server locally:
   ```
   npm start
   ```
   The server runs on `http://localhost:3000`.

## Deployment

- Ready for deployment on Vercel (see `vercel.json`).
- Use MongoDB Atlas or another cloud database for production.
- For image uploads, consider using a cloud storage service.

## API Endpoints

- `/users/register` - Register user
- `/users/login` - Login user
- `/users/logout` - Logout user
- `/users/me` - Get current user info
- `/users/all` - Get all users (admin only)
- `/users/block/:id` - Block user (admin only)
- `/users/unblock/:id` - Unblock user (admin only)
- `/todos` - CRUD for todos

## Folder Structure

- `src/models` - Mongoose models
- `src/routes` - Express routes
- `src/app.js` - Main app file# Task App Frontend

This is the frontend for the Task App, built with React and Tailwind CSS.

## Features

- User and admin authentication (JWT & cookies)
- Signup, login, and logout
- Profile page
- Admin panel to manage users (block/unblock)
- Create, edit, delete, search, and sort todos with images
- Responsive UI with Tailwind CSS

## Setup

1. Clone the repository.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
   The app runs on `http://localhost:5173`.

## Configuration

- Ensure the backend is running and accessible at `http://localhost:3000`.
- Update API URLs in Axios requests if needed.

## Folder Structure

- `src/pages` - Main pages (Home, Login, Signup, Profile, Admin)
- `src/components` - Shared components (Navbar)
- `src/App.jsx` - Main app file

## Deployment

- Ready for deployment on Vercel or Netlify.
- Configure environment variables and API endpoints for production.

## Usage

- Register or login as a user or admin.
- Create and manage tasks.
- Admins can block/unblock users from the