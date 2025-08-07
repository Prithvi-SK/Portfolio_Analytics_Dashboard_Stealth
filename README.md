# Portfolio Analytics Dashboard

This project is a full-stack Portfolio Analytics Dashboard, which provides a set of RESTful API endpoints for portfolio data and a modern, interactive frontend for portfolio visualization and management. The assignment requirements are outlined and satisfied as per the provided [Full-Stack Developer Intern Assignment](./Full-Stack%20Developer%20Intern%20Assignment.pdf).

---

## Table of Contents

- [Project Structure](#project-structure)
- [Backend (API)](#backend-api)
  - [Endpoints](#endpoints)
  - [Business Logic & Calculations](#business-logic--calculations)
  - [Database ORM](#database-orm)
  - [Backend Requirement Satisfaction](#backend-requirement-satisfaction)
- [Frontend (Dashboard UI)](#frontend-dashboard-ui)
  - [Component Features](#component-features)
  - [API & Endpoint Folder Structure](#api--endpoint-folder-structure)
  - [Frontend Requirement Satisfaction](#frontend-requirement-satisfaction)
- [Docker Support](#docker-support)
- [Requirements Satisfaction](#requirements-satisfaction)
- [Setup and Usage](#setup-and-usage)
- [License](#license)

---

## Project Structure

```
Portfolio_Analytics_Dashboard_Stealth/
│
├── backend/
│   ├── api/                # Contains API logic and endpoint routers
│   ├── endpoints/          # Separates endpoint definitions for modularity
│   ├── formulas.py         # All portfolio math/calculations here
│   ├── models.py           # ORM models for DB interaction
│   └── ...
│
├── frontend/
│   ├── components/         # Each dashboard feature as a separate component
│   ├── api/                # Frontend API fetch logic, mirroring backend endpoints
│   ├── ...
│
├── docker-compose.yml      # Docker Compose config for full-stack setup
├── Dockerfile.backend      # Backend Dockerfile
├── Dockerfile.frontend     # Frontend Dockerfile
├── Full-Stack Developer Intern Assignment.pdf
├── README.md
└── ...
```

---

## Backend (API)

### Endpoints

The backend exposes multiple endpoints to serve portfolio analytics data as per the assignment:

1. **Portfolio Holdings Endpoint**
   - `GET /api/holdings`
   - Returns a list of current asset holdings, quantities, prices, and values.

2. **Portfolio Allocation Endpoint**
   - `GET /api/allocation`
   - Returns the allocation breakdown by asset class, sector, etc.

3. **Performance Comparison Endpoint**
   - `GET /api/performance`
   - Returns historical returns of the portfolio vs. benchmarks.

4. **Portfolio Summary Endpoint**
   - `GET /api/summary`
   - Returns key portfolio metrics (total value, risk metrics, etc.)

All endpoints are organized in the `backend/api/` and `backend/endpoints/` folders for clarity and modularity.

### Business Logic & Calculations

- All financial calculations (returns, allocations, risk metrics, etc.) are implemented in `formulas.py`.
- Endpoints import and use functions from `formulas.py` for accurate, testable, and maintainable analytics.

### Database ORM

- ORM models are defined in `models.py`.
- The backend uses an ORM (like SQLAlchemy or Django ORM) for all database interactions, ensuring safe, scalable, and abstracted data access.

### Backend Requirement Satisfaction

This project satisfies **all backend requirements** as outlined in the assignment PDF:

- **Separate endpoints** are provided for holdings, allocation, performance, and summary, matching the required specifications.
- **Business logic** and all portfolio calculation formulas are centralized in `formulas.py` and not duplicated elsewhere.
- **ORM** is used for all database operations, with models defined in one place (`models.py`).
- **API folder structure** cleanly separates endpoint logic (`api/`) and endpoint definitions (`endpoints/`), making the code modular and maintainable.
- **Sample data** and dummy portfolios are provided for demo/testing as required.

---

## Frontend (Dashboard UI)

The frontend is built as a responsive, modular dashboard.

### Component Features

- **Portfolio Overview Cards**
  - Display summary KPIs: total value, number of assets, portfolio growth, etc.

- **Asset Allocation Visualizations**
  - Interactive pie/bar charts showing allocation across asset classes, sectors, and more.

- **Holdings Table/Grid**
  - Dynamic, sortable table of all portfolio holdings with live data.

- **Performance Comparison Chart**
  - Line/bar charts to compare portfolio vs. benchmarks over selectable periods.

- **Top Performers Section**
  - Highlights best/worst performing assets in the portfolio.

Each feature is implemented in its own component inside the `frontend/components/` directory for scalability and reusability.

### API & Endpoint Folder Structure

- The frontend fetches data via a dedicated `frontend/api/` folder.
- Each frontend API file maps directly to a backend endpoint, ensuring clear separation of concerns and easy maintenance.

### Frontend Requirement Satisfaction

This project satisfies **all frontend requirements** listed in the assignment PDF:

- **Dashboard features** are each implemented as a separate, reusable component, as required.
- **Portfolio overview**, **allocation visualization**, **holdings table**, **performance comparison**, and **top performers** sections are all present and functional.
- **API logic** is separated into a dedicated `frontend/api/` folder, mirroring the backend structure and keeping the code organized.
- **Component-based approach** ensures each feature is encapsulated, making it easy to extend and maintain.
- **Live demo and sample data** are provided for immediate testing and demonstration.
- **Responsive UI** ensures usability across devices.

---

## Docker Support

This project leverages Docker to make setup, deployment, and development seamless and reproducible. The repository includes:

- **docker-compose.yml**  
  Orchestrates the backend and frontend containers, and any supporting services (like a database).
- **Dockerfile.backend**  
  Defines the backend service image.
- **Dockerfile.frontend**  
  Defines the frontend service image.

**How Docker is used:**
- Developers can spin up the entire stack with a single `docker-compose up` command.
- Ensures consistency across environments, easy onboarding for new contributors, and effortless deployment to any infrastructure supporting Docker.

---

## Requirements Satisfaction

All requirements from the [Full-Stack Developer Intern Assignment](./Full-Stack%20Developer%20Intern%20Assignment.pdf) are met:

- **Separate endpoints** for holdings, allocation, performance, and summary.
- **Business logic and calculations** are centralized in `formulas.py`.
- **ORM** is used for all DB operations.
- **Frontend components** are modular and feature-rich as specified.
- **API and endpoint folders** are clearly separated on both backend and frontend.
- **Dockerized** for easy setup and deployment.
- **Sample data** and demo workflows are supported.
- **Documentation and working demo** provided in this repository.

---

## Setup and Usage

1. **With Docker (Recommended)**
   - Ensure you have Docker and Docker Compose installed.
   - Run:  
     ```
     docker-compose up --build
     ```
   - Access the dashboard at `http://localhost:3000` (or as configured).

2. **Manual Setup (for development)**
   - **Backend**
     - Install requirements: `pip install -r backend/requirements.txt`
     - Run backend server: `cd backend && uvicorn main:app --reload` (or applicable command)
   - **Frontend**
     - Install dependencies: `npm install` or `yarn`
     - Run development server: `npm start` or `yarn start`
   - Access at `http://localhost:3000` (or specified port).

---

## License

See [LICENSE](./LICENSE) for details.