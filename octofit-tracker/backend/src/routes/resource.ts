import { Router, type Request, type Response, type NextFunction } from 'express';
import type { Model } from 'mongoose';

interface ResourceOptions {
  populate?: string[];
  sort?: Record<string, 1 | -1>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasSafeFieldNames(value: Record<string, unknown>): boolean {
  return Object.keys(value).every(
    (key) => !key.startsWith('$') && !key.includes('.'),
  );
}

export function createResourceRouter<T>(
  resourceModel: Model<T>,
  options: ResourceOptions = {},
): Router {
  const router = Router();

  router.get(
    '/',
    async (_request: Request, response: Response, next: NextFunction) => {
      try {
        let query = resourceModel.find().sort(options.sort ?? { createdAt: -1 });
        for (const path of options.populate ?? []) {
          query = query.populate(path);
        }
        response.json(await query.exec());
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    '/',
    async (request: Request, response: Response, next: NextFunction) => {
      if (!isRecord(request.body) || !hasSafeFieldNames(request.body)) {
        response.status(400).json({ error: 'Request body must be a valid object' });
        return;
      }

      try {
        response
          .status(201)
          .json(await resourceModel.create(request.body as T));
      } catch (error) {
        next(error);
      }
    },
  );

  router.get(
    '/:id',
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const record = await resourceModel.findById(request.params.id).exec();
        if (!record) {
          response.status(404).json({ error: 'Resource not found' });
          return;
        }
        response.json(record);
      } catch (error) {
        next(error);
      }
    },
  );

  router.patch(
    '/:id',
    async (request: Request, response: Response, next: NextFunction) => {
      if (!isRecord(request.body) || !hasSafeFieldNames(request.body)) {
        response.status(400).json({ error: 'Request body must be a valid object' });
        return;
      }

      try {
        const record = await resourceModel
          .findByIdAndUpdate(request.params.id, request.body, {
            new: true,
            runValidators: true,
          })
          .exec();
        if (!record) {
          response.status(404).json({ error: 'Resource not found' });
          return;
        }
        response.json(record);
      } catch (error) {
        next(error);
      }
    },
  );

  router.delete(
    '/:id',
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const record = await resourceModel
          .findByIdAndDelete(request.params.id)
          .exec();
        if (!record) {
          response.status(404).json({ error: 'Resource not found' });
          return;
        }
        response.status(204).end();
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
