Folio: An Online Marketplace for Digital Books
Folio is an online marketplace for buying and selling digital books. This repository contains both the React-based client application and the Node.js backend services, designed for deployment on Azure.

Project Structure
plaintext
Copy code
Folio/
├── client/            # Frontend React application
│   ├── src/           # Source code for the React app
│   ├── public/        # Public assets
│   ├── package.json   # Frontend dependencies
│   └── README.md      # React-specific README
├── server/            # Backend Node.js application
│   ├── src/           # API endpoints and services
│   ├── config/        # Configuration files
│   ├── package.json   # Backend dependencies
│   └── README.md      # Backend-specific README
├── .env               # Environment variables
├── .gitignore         # Git ignored files
├── README.md          # Project-level README (you are here)
└── package.json       # Shared dependencies
Getting Started
Prerequisites
Node.js (v14 or later)
npm or yarn
Azure CLI (for deployment)
Azure Subscription (for hosting)
Installation
Clone the Repository
bash
Copy code
git clone https://github.com/craigmaddux/Folio.git
cd Folio
Install Dependencies
For the Frontend:
bash
Copy code
cd client
npm install
For the Backend:
bash
Copy code
cd ../server
npm install
Running the Application Locally
Start the Backend Server
Navigate to the server folder:
bash
Copy code
cd server
Start the server:
bash
Copy code
npm start
The backend server runs on http://localhost:5000 (default).
Start the Frontend Client
Navigate to the client folder:
bash
Copy code
cd client
Start the client:
bash
Copy code
npm start
The client app runs on http://localhost:3000 (default).
Deployment
Frontend: React Client
The frontend is deployed to an Azure Static Web App. To deploy:

Build the React app:
bash
Copy code
npm run build
Deploy using the Azure CLI:
bash
Copy code
az staticwebapp create --source ./build --name "FolioClient" --resource-group <YourResourceGroup>
Backend: Node.js Server
The backend is deployed as an Azure Web App. To deploy:

Zip the backend files (excluding node_modules):
bash
Copy code
zip -r server.zip .
Deploy using the Azure CLI:
bash
Copy code
az webapp deployment source config-zip --resource-group <YourResourceGroup> --name "FolioServer" --src server.zip
Environment Variables
Frontend (client/.env)
Configure environment variables for the React app:

env
Copy code
REACT_APP_API_BASE_URL=http://localhost:5000
Backend (server/.env)
Configure environment variables for the Node.js app:

env
Copy code
PORT=5000
DB_CONNECTION_STRING=<your_database_connection_string>
Features
Frontend:

User-friendly interface for browsing and purchasing books.
Built with React and deployed as a static web app on Azure.
Backend:

RESTful API for user management, book listings, and order processing.
Node.js + Express backend with integration to a database.
You can now copy and paste this into the README.md file in your GitHub repository! Let me know if you’d like further edits or additions. 😊






