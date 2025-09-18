# Sublink
A full stack mobile subscription management portal made with:
 Frontend: Vite + React + TypeScript and Vitest
 Backend: Express + TypeScript, JWT auth, MongoDB and Socket.io

# Prerequisites
  Node.js 18+
  PowerShell

# Setup
1. Setup backend 
cd server; npm install
create an env file in the root of server
add the values

MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority&appName=<app-name>

PORT=<Port you want to use ie 5000>

JWT_SECRET=<Secret key ie (83bc1b6a-be90-4ca4-bbac-c22846b90d61)>

2. Setup Frontend 
cd ..; <---- navigate to root if still within server
cd client;
npm install

create an env file in the root of client
add the values

VITE_API_URL=http://localhost:<Your Port> <------ port you want the application to run on
VITE_BACKEND_API=http://localhost:<PORT> <----- Same port as the backend env's PORT

# Run 
Start backend API (port(PORT)):
cd ..;
cd server; 
npm run dev   

Start Frontend (port(PORT)):
cd front-end; 
npm run dev

# Tests
Vitest is used for both frontend and backend.
Backend tests (API):
cd server; 
npm run test

Frontend tests (components and api):
cd client; 
npm run test

Usage







