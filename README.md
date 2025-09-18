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

VITE_BACKEND_API=http://localhost:<PORT> <----- Same port as the backend env's PORT

# Run 
Start backend API (port(PORT)):
cd ..;
cd server; 
npm run dev   

Start Frontend (Port 5173):
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

# Usage

When navigating to the page this will show up
<img width="568" height="408" alt="{ECD43E91-FF15-4770-98DD-22C57FB42B13}" src="https://github.com/user-attachments/assets/63e36fc0-4224-4a1a-8915-fb9be55ef751" />

Enter a number between 8 and 14 digits
<img width="522" height="363" alt="{DD1F84E7-15D2-4488-A5DB-292850343A88}" src="https://github.com/user-attachments/assets/d8f2e49a-0138-4fe5-bf68-8a7fb54e6671" />

Then Request OTP
<img width="529" height="438" alt="{686029D4-84DE-4274-BEA3-C947B0AA3801}" src="https://github.com/user-attachments/assets/8cc7c434-96d1-4cb1-a277-84c4ecc702c8" />

Once done, Check the terminal of the Server (Used to mock sending to mobile)
<img width="917" height="205" alt="{153387D1-9AD2-440A-888B-62A31A3B3A33}" src="https://github.com/user-attachments/assets/4c79bc73-47da-4dd6-a8f6-d2c242349a64" />

Paste the number on the right into the input
This page will pop up when sucessfull

Dashboard
<img width="1559" height="631" alt="{3593452B-9315-41D9-95FA-911B31E9BE74}" src="https://github.com/user-attachments/assets/db2c8502-66fb-40aa-a0f7-74452d94c3cf" />

Transactions
<img width="334" height="126" alt="{51F14F5D-EE5B-4971-B216-F757AFAA56A8}" src="https://github.com/user-attachments/assets/43713769-e45c-4a76-a20b-e2b075fc0724" />

Admin
When clicking on admin without an admin acount you will be redirected to dashboard
to create and admin account navigate to the mongodb collection

<img width="916" height="366" alt="{BF323339-F0B5-4A85-9890-6C8B1E39DDBF}" src="https://github.com/user-attachments/assets/3162cdc6-4b6f-4569-afd0-3a0fdca7fc78" />

and set isAdmin to true for the desired user

Once done logout and back in as the same number set to isAdmin to refresh token.

<img width="1063" height="914" alt="{7EE6097A-DF0C-4063-9271-AFCF3650E1C4}" src="https://github.com/user-attachments/assets/38b49487-9b64-4870-9e82-23ed0af66af0" />

Once on the admin page the admin can view all created users
All Created Services
And Can create a service

When Creating services
<img width="1064" height="397" alt="{AD5988F1-2577-40FD-8882-CB24C4C2FF75}" src="https://github.com/user-attachments/assets/e99570ce-fafd-4c03-929b-ce2bb3c12d7b" />

The service should appear above thanks to Socket.io
<img width="1022" height="229" alt="{240DC305-371B-4D37-AD92-D2B84937E3C3}" src="https://github.com/user-attachments/assets/4d29f572-26a9-4e2f-88b2-6ff2acf837c8" />

Navigate back to the Dashboard to Subscribe to the servie
<img width="1117" height="550" alt="{38591527-179F-480E-AA63-6650CBE21E29}" src="https://github.com/user-attachments/assets/64af2d73-a7f6-4a28-a4b9-ece5ca49aaf2" />

Pick a payment method (Mock)
<img width="364" height="320" alt="{B0787232-4485-4F0C-BADF-1D91DEB345A3}" src="https://github.com/user-attachments/assets/cd9ed9b8-53f6-4b41-a3cb-773abc7552d5" />

Then you should be subscribed
<img width="1030" height="406" alt="{1C271468-3C50-4DDE-958D-67876BFF5FF0}" src="https://github.com/user-attachments/assets/9f347141-3483-4387-985e-f3d90c13afa4" />

Navigate to transactions and it should show that you have subscribed or unsubscribed
<img width="1016" height="245" alt="{CD07A386-BB7C-4121-99E2-C8EC211C45E9}" src="https://github.com/user-attachments/assets/55330036-53eb-44b8-90b9-5c73dae68557" />

Finally in the admin panel
in the users view
<img width="1017" height="237" alt="{4EFDCA75-3883-45BF-949F-0236F3B36558}" src="https://github.com/user-attachments/assets/815bb54a-7dff-4b38-b7be-4649d1671572" />

when clicking View on the right for a user 
<img width="821" height="390" alt="{EF4310DF-9B7A-4EC3-8D36-7B13DEFA7F85}" src="https://github.com/user-attachments/assets/90322856-233b-4ecf-8221-c964e4d35267" />

Admin can see all of their details and they are able to remove a service for that user

Admin dashboard with populated Data
<img width="886" height="958" alt="{A76D0301-CD71-477C-B50D-12B80177F1BD}" src="https://github.com/user-attachments/assets/5d3f6fd8-191e-4134-accf-8956698d3e0d" />

<img width="681" height="500" alt="{ED9C17EE-C3F2-411D-B31E-A825184D8C4B}" src="https://github.com/user-attachments/assets/e6a16479-7f80-44f4-b330-5f930f43ca24" />

Transactions with populated data
<img width="681" height="500" alt="{ED9C17EE-C3F2-411D-B31E-A825184D8C4B}" src="https://github.com/user-attachments/assets/e4d8d80d-9ead-41ed-a1bd-8c858f3d93a6" />

<img width="879" height="450" alt="{6849E31C-793B-4CC5-B9E3-FAFE63F73CB4}" src="https://github.com/user-attachments/assets/aea1d041-22a8-4d35-a27c-104289f0f435" />

Finally please note if the same user tries to send the otp 3 times in a row by navigating back to the welcome page this happens
<img width="568" height="416" alt="{DB529625-A7B2-4CC4-AA26-BE4464701C75}" src="https://github.com/user-attachments/assets/16ed1d5b-3e06-4e52-9d3d-ff09e5f033df" />










