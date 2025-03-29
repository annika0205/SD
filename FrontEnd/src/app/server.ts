import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors'; // Import the cors package
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';

const AppServerModule = require('../main.server').default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export function app(): express.Express {
  const server = express();
  const serverDistFolder = __dirname;
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Middleware
  server.use(express.json());

  // Enable CORS for all routes
  server.use(cors()); // Add this line to allow cross-origin requests

  const users: User[] = [];

  server.post("/register", (req: Request, res: Response) => {
    console.log("Register request received", req.body);
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Username, password, and email are required' });
    }
    const userExists = users.some(user => user.username === username || user.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    const userId = Date.now().toString();
    const newUser: User = { id: userId, username, email, password };
    users.push(newUser);
    const token = `token_${userId}_${Date.now()}`;
    console.log("User registered successfully", newUser);
    return res.status(201).json({ token, userId });
  });

  server.post("/login", (req: Request, res: Response) => {
    console.log("Login attempt", req.body);
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      console.log("Login failed for", username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = `token_${user.id}_${Date.now()}`;
    console.log("Login successful for", username);
    return res.status(200).json({ token, userId: user.id });
  });

  server.get('/api/algorithms', (req: Request, res: Response) => {
    console.log("Algorithms API requested");
    res.json([ 
      { category: 'Sortieralgorithmen', algorithms: [{ name: 'Bubblesort', description: 'Ein einfacher Sortieralgorithmus' }] }
    ]);
  });

  server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error occurred:", err);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
