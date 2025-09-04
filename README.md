# Climate Project

This repository contains both the frontend (React/Next.js) and backend (Python) components for the Climate project.

## Problem Statement

Climate change poses significant risks to communities, including increased frequency and severity of natural disasters. There is a need for a centralized platform that enables users, administrators, and agents to monitor climate data, predict disasters, and manage responses efficiently.

## Feasible Solution

Develop a web-based climate management application that:
- Allows users to sign up, log in, and access personalized dashboards.
- Provides administrators with tools to monitor climate data, manage users, and oversee disaster prediction agents.
- Integrates disaster prediction and monitoring agents to analyze climate data and provide early warnings.
- Stores relevant data in a local database for quick access and analysis.

## What the Project Does

This project is a climate management web app with:
- User authentication (login/signup)
- User and admin dashboards
- Disaster prediction and monitoring agents
- Data visualization and management features for climate events
- Admin controls for user and agent management

## Tech Stack Used

- **Frontend:** React (Next.js), CSS Modules
- **Backend:** Python (Flask or similar, inferred from `backend.py`)
- **Database:** SQLite (`acms.db`)
- **Other:** Node.js (for Next.js), possibly REST API for backend communication

## Folder Structure


## Prerequisites



## Running the Frontend

1. Open a terminal and navigate to the project root:
   ```powershell
   cd C:\Users\royvi\Desktop\Climate
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```
4. The app will be available at `http://localhost:3000`.

If your main frontend is inside `acdms-dashboard/`, use:
   ```powershell
   cd acdms-dashboard
   npm install
   npm run dev
   ```

---

## Running the Backend

1. Ensure Python is installed.
2. In a terminal, navigate to the project root:
   ```powershell
   cd C:\Users\royvi\Desktop\Climate
   ```
3. Run the backend script:
   ```powershell
   python backend.py
   ```

---

## Notes
- Make sure to install any required Python packages for the backend (add instructions if you use requirements.txt).
- Update this README with more details as your project evolves.
