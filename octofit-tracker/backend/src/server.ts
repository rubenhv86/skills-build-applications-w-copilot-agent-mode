import app from './app';
import { connectDatabase, disconnectDatabase } from './config/database';

const port = Number(process.env.PORT ?? 8000);
const codespaceName = process.env.CODESPACE_NAME;

export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

async function startServer(): Promise<void> {
  await connectDatabase();

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit API listening at ${apiBaseUrl}`);
  });

  const shutdown = (signal: NodeJS.Signals): void => {
    console.log(`Received ${signal}; shutting down OctoFit API`);
    server.close((error) => {
      if (error) {
        console.error('Error closing HTTP server:', error);
        process.exitCode = 1;
      }
      void disconnectDatabase().catch((disconnectError: unknown) => {
        console.error('Error disconnecting from octofit_db:', disconnectError);
        process.exitCode = 1;
      });
    });
  };

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

void startServer().catch((error: unknown) => {
  console.error('Unable to start OctoFit API:', error);
  process.exitCode = 1;
});
