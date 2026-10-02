import express, {
  type ErrorRequestHandler,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import mongoose from 'mongoose';
import { Activity } from './models/activity';
import { Leaderboard } from './models/leaderboard';
import { Team } from './models/team';
import { User } from './models/user';
import { Workout } from './models/workout';
import { createResourceRouter } from './routes/resource';

const app = express();

app.use((request: Request, response: Response, next: NextFunction) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }
  next();
});
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_request, response) => {
  const connected = mongoose.connection.readyState === 1;
  response.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'unavailable',
    service: 'octofit-api',
    database: connected ? 'connected' : 'disconnected',
  });
});

app.use('/api/users', createResourceRouter(User));
app.use('/api/teams', createResourceRouter(Team, { populate: ['members'] }));
app.use('/api/activities', createResourceRouter(Activity, { populate: ['user'] }));
app.use('/api/leaderboard', createResourceRouter(Leaderboard, {
  populate: ['user', 'team'],
  sort: { points: -1 },
}));
app.use('/api/workouts', createResourceRouter(Workout));

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found' });
});

const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (error instanceof mongoose.Error.ValidationError) {
    response.status(400).json({ error: error.message });
    return;
  }
  if (error instanceof mongoose.Error.CastError) {
    response.status(400).json({ error: 'Invalid resource identifier' });
    return;
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  ) {
    response.status(409).json({ error: 'A resource with this value already exists' });
    return;
  }
  if (
    error instanceof SyntaxError &&
    'status' in error &&
    error.status === 400
  ) {
    response.status(400).json({ error: 'Invalid JSON request body' });
    return;
  }

  console.error('API request failed:', error);
  response.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);

export default app;
