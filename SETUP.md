# Product APIs Setup

## Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB (local or Atlas)

## Setup Steps
1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up MongoDB and update the connection string in `.env`.
3. Start the server:
   ```sh
   npm start
   ```

## Environment Variables
Create a `.env` file with:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```
