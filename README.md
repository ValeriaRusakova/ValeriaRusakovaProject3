# Valeria Rusakova Project 3

Full-stack vacation platform with a Node.js + TypeScript backend, MySQL, and a React + Vite frontend.

## Project Structure

- `src/` - backend source code
- `frontend/` - React frontend
- `docker-compose .yml` - MySQL + phpMyAdmin + backend container stack
- `postman-collection.json` - ready-to-import Postman collection
- `postman-environment.json` - Postman environment with token variables

## Backend Run

### With Docker

1. Make sure Docker Desktop is running.
2. From the project root, run:

```bash
docker compose -f "docker-compose .yml" up -d --build
```

3. Backend URL:
- `http://localhost:3001`

4. phpMyAdmin URL:
- `http://localhost:8080`

### Local backend only

```bash
npm install
npm run build
npm start
```

## Frontend Run

1. Open a new terminal.
2. Go to the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

3. Frontend URL:
- `http://localhost:5173`

## Login Details For Testing

### Admin

- Email: `admin@example.com`
- Password: `admin123`

### Regular user

- First create a user with the Register form or with Postman.
- Then log in with the same email and password.

## What The Frontend Includes

- Login and register
- Vacation feed with pagination and filters
- Like / unlike vacations
- Admin vacation create / update / delete by selected card
- Admin reports and CSV download link
- AI recommendation box
- MCP question box

## Postman Usage

Import both files into Postman:

- `postman-collection.json`
- `postman-environment.json`

Use:
- `userToken` for vacations, likes, AI, and MCP
- `adminToken` for reports and CSV

## Notes

- The backend expects the JWT token in the `Authorization` header as `Bearer <token>`.
- The frontend talks to the backend at `http://localhost:3001/api`.
- The `dist/` folder and local dependency folders are ignored by Git.
