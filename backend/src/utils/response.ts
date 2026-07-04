import { Response } from 'express';

export function success<T = unknown>(res: Response, data: T, message = 'Success', status = 200) {
  return res.status(status).json({ status: 'success', message, data });
}

export function error(res: Response, message = 'Internal server error', status = 500) {
  return res.status(status).json({ status: 'error', message });
}
