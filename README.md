# Website Health & Security Analyzer Dashboard

A full-stack web application that analyzes a given website's availability, performance, and basic security posture.

## Prerequisites
- Node.js (v16 or higher)
- Python (3.8 or higher)
- Docker (Optional)

---

## 🚀 How to Run Locally (Without Docker)

You need to run both the Backend and Frontend servers at the same time. Open two separate terminal windows (Command Prompt or PowerShell) to do this.

### Step 1: Run the Backend (Flask API)
1. Open a terminal and navigate to the project root:
   ```bash
   cd "c:\Users\manda\OneDrive\Desktop\Website Health Monitor\backend"
   ```
2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - On Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - On Mac/Linux:
     ```bash
     source venv/bin/activate
     ```
4. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
5. Start the Flask server:
   ```bash
   python app.py
   ```
*(Leave this terminal open. The backend runs on http://localhost:5000)*

---

### Step 2: Run the Frontend (React Vite)
1. Open a **NEW** terminal and navigate to the frontend folder:
   ```bash
   cd "c:\Users\manda\OneDrive\Desktop\Website Health Monitor\frontend"
   ```
2. Install the necessary Node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
*(Leave this terminal open. The frontend runs on http://localhost:5173)*

### Step 3: View the App
Once both servers are running, open your web browser and go to:
👉 **http://localhost:5173**

---

## 🐳 How to Run with Docker (Optional)
If you have Docker Desktop installed and running, you can start the entire project with a single command.

1. Open a terminal in the root folder (`Website Health Monitor`).
2. Run Docker Compose:
   ```bash
   docker-compose up --build -d
   ```
3. Open your browser and go to **http://localhost:5173**
4. To stop the servers later, run:
   ```bash
   docker-compose down
   ```
