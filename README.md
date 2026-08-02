# ResQNet

Smart Disaster Response & Resource Management System

## Project Structure
This is a full-stack application with:
- **Frontend**: React.js, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, MongoDB (using In-Memory DB for prototype)

## Prerequisites
- Node.js installed

## Installation & Running Locally

1. **Start the Backend**
   Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *The backend will automatically start an in-memory MongoDB instance and seed dummy users, shelters, hospitals, and resources.*

2. **Start the Frontend**
   Open a second terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend will run on http://localhost:5173*

## Demo Accounts (Password: `password123`)
- **Citizen**: `citizen@resqnet.com`
- **Volunteer**: `volunteer@resqnet.com`
- **Admin**: `admin@resqnet.com`

## Deployment Instructions

To deploy this site, you can use a combination of **Render** (for the backend) and **Vercel** (for the frontend).

### 1. Deploying Backend (Render)
1. Since the current backend uses `mongodb-memory-server` for prototyping, you will need to replace it with a real MongoDB connection string (e.g., from MongoDB Atlas) for a production deployment.
2. In `backend/server.js`, replace the `MongoMemoryServer` connection logic with: `mongoose.connect(process.env.MONGO_URI)`
3. Push your code to GitHub.
4. Go to [Render.com](https://render.com), create a new **Web Service**, and connect your repository.
5. Set the Root Directory to `backend`, Build Command to `npm install`, and Start Command to `node server.js`.
6. Add the `MONGO_URI` and `JWT_SECRET` in the Environment Variables on Render.

### 2. Deploying Frontend (Vercel)
1. In `frontend/src/App.jsx`, change `axios.defaults.baseURL` to the URL provided by Render for your backend (e.g., `https://resqnet-api.onrender.com`).
2. Go to [Vercel.com](https://vercel.com) and import your GitHub repository.
3. Set the Framework Preset to **Vite** and the Root Directory to `frontend`.
4. Click Deploy.
