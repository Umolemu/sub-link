# Sublink

Sublink is a full-stack mobile subscription management portal built with:

- Frontend: Vite + React + TypeScript + Vitest
- Backend: Express + TypeScript, JWT authentication, MongoDB, and Socket.io

## Prerequisites

- Node.js 18+
- PowerShell

## Setup

1. Backend

   - Navigate to the server folder and install dependencies:

   ```bash
   cd server
   npm install
   ```

   - Create a `.env` file in the `server` folder and add the following values:

   ```bash
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority&appName=<app-name>

   PORT=<port-number> # e.g. 5000

   JWT_SECRET=<your-jwt-secret> # e.g. 83bc1b6a-be90-4ca4-bbac-c22846b90d61
   ```

2. Frontend

   - Navigate to the `client` folder and install dependencies:

   ```bash
   cd client
   npm install
   ```

   - Create a `.env` file in the `client` folder and add the backend API URL:

   ```bash
   VITE_BACKEND_API=http://localhost:<PORT> # Use the same PORT value as the backend
   ```

## Run

- Start the backend API (example uses port from `.env`):

  ```bash
  cd server
  npm run dev
  ```

- Start the frontend (Vite default port 5173):

  ```bash
  cd client
  npm run dev
  ```

## Tests

- Vitest is used for both frontend and backend.

- Backend tests (API):

  ```bash
  cd server
  npm run test
  ```

- Frontend tests (components and API):

  ```bash
  cd client
  npm run test
  ```

## Usage

- When navigating to the app the welcome page will appear (screenshot):

  <img width="568" height="408" alt="welcome-screen" src="https://github.com/user-attachments/assets/63e36fc0-4224-4a1a-8915-fb9be55ef751" />

- Enter a phone number between 8 and 14 digits (screenshot):

  <img width="522" height="363" alt="enter-number" src="https://github.com/user-attachments/assets/d8f2e49a-0138-4fe5-bf68-8a7fb54e6671" />

- Request an OTP (screenshot):

  <img width="529" height="438" alt="request-otp" src="https://github.com/user-attachments/assets/8cc7c434-96d1-4cb1-a277-84c4ecc702c8" />

- Check the server terminal for the mocked OTP (screenshot):

  <img width="917" height="205" alt="server-terminal-otp" src="https://github.com/user-attachments/assets/4c79bc73-47da-4dd6-a8f6-d2c242349a64" />

- Paste the OTP into the input to complete verification. After successful verification the dashboard will appear (screenshot):

  <img width="1559" height="631" alt="dashboard" src="https://github.com/user-attachments/assets/db2c8502-66fb-40aa-a0f7-74452d94c3cf" />

- Transactions view (screenshot):

  <img width="334" height="126" alt="transactions" src="https://github.com/user-attachments/assets/43713769-e45c-4a76-a20b-e2b075fc0724" />

## Admin

- If you access the Admin page without an admin account you will be redirected to the dashboard.

- To create an admin account, update the user's `isAdmin` flag to `true` in the MongoDB `users` collection (screenshot):

  <img width="916" height="366" alt="set-isAdmin" src="https://github.com/user-attachments/assets/3162cdc6-4b6f-4569-afd0-3a0fdca7fc78" />

- After updating `isAdmin`, log out and log back in to refresh the token (screenshot):

  <img width="1063" height="914" alt="logout-login" src="https://github.com/user-attachments/assets/38b49487-9b64-4870-9e82-23ed0af66af0" />

- Admin capabilities:

  - View all users
  - View all created services
  - Create services

- Creating a service (screenshot):

  <img width="1064" height="397" alt="creating-service" src="https://github.com/user-attachments/assets/e99570ce-fafd-4c03-929b-ce2bb3c12d7b" />

- New services appear in real-time via Socket.io (screenshot):

  <img width="1022" height="229" alt="service-socket" src="https://github.com/user-attachments/assets/4d29f572-26a9-4e2f-88b2-6ff2acf837c8" />

- Subscribe to a service from the dashboard (screenshot):

  <img width="1117" height="550" alt="subscribe" src="https://github.com/user-attachments/assets/64af2d73-a7f6-4a28-a4b9-ece5ca49aaf2" />

- Select a payment method (mock) to complete subscription (screenshot):

  <img width="364" height="320" alt="payment-method" src="https://github.com/user-attachments/assets/cd9ed9b8-53f6-4b41-a3cb-773abc7552d5" />

- After subscribing, the subscription will appear in the dashboard (screenshot):

  <img width="1030" height="406" alt="subscribed" src="https://github.com/user-attachments/assets/9f347141-3483-4387-985e-f3d90c13afa4" />

- Transactions will list subscribe/unsubscribe events (screenshot):

  <img width="1016" height="245" alt="transactions-list" src="https://github.com/user-attachments/assets/55330036-53eb-44b8-90b9-5c73dae68557" />

- Admin users view (screenshot):

  <img width="1017" height="237" alt="admin-users" src="https://github.com/user-attachments/assets/815bb54a-7dff-4b38-b7be-4649d1671572" />

- View user details and remove services for a specific user (screenshot):

  <img width="821" height="390" alt="user-detail" src="https://github.com/user-attachments/assets/90322856-233b-4ecf-8221-c964e4d35267" />

- Admin dashboard with populated data (screenshots):

  <img width="886" height="958" alt="admin-dashboard" src="https://github.com/user-attachments/assets/5d3f6fd8-191e-4134-accf-8956698d3e0d" />

  <img width="681" height="500" alt="admin-dashboard-2" src="https://github.com/user-attachments/assets/e6a16479-7f80-44f4-b330-5f930f43ca24" />

- Transactions with populated data (screenshots):

  <img width="681" height="500" alt="transactions-populated" src="https://github.com/user-attachments/assets/e4d8d80d-9ead-41ed-a1bd-8c858f3d93a6" />

  <img width="879" height="450" alt="transactions-populated-2" src="https://github.com/user-attachments/assets/aea1d041-22a8-4d35-a27c-104289f0f435" />

## Notes

- If the same user requests an OTP 3 times in a row (by navigating back to the welcome page) they will hit the rate limiter (screenshot):

  <img width="568" height="416" alt="otp-rate-limited" src="https://github.com/user-attachments/assets/16ed1d5b-3e06-4e52-9d3d-ff09e5f033df" />
