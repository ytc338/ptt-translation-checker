import express from 'express';
import cors from 'cors';
import apiRouter from './api';
import { errorHandler } from './middleware/errorMiddleware';
import { logger } from './middleware/logger';

const app = express();
const port = process.env.PORT || 3001;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(express.json()); // Enable JSON body parser
app.use(cors({ origin: frontendUrl })); // Enable CORS for frontend
app.use(logger); // Use logger middleware
app.use('/api', apiRouter); // Mount the API router

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.use(errorHandler); // Use error handling middleware

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
