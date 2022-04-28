import { handleBookGet, handleBookPost } from './book';
import { handleWordGet } from './word';
import { handleLogin, handleRegister } from './auth';
import type { Express, Request, Response } from 'express';
import type DataAccessLayer from '../db/DataAccessLayer';

export const endpoints = {
  book: {
    get: handleBookGet,
    post: handleBookPost,
  },
  word: {
    get: handleWordGet,
  },
  login: {
    post: handleLogin,
  },
  register: {
    post: handleRegister,
  },
};

export default function attachEndpoints(
  app: Express,
  dataAccessLayer: DataAccessLayer
) {
  for (let [endpointName, endpointHandlers] of Object.entries(endpoints)) {
    for (let [httpMethodName, handler] of Object.entries(endpointHandlers)) {
      app[httpMethodName as 'get' | 'post'](
        `/${endpointName}`,
        async (request: Request, response: Response) => {
          handler(request, response, dataAccessLayer);
        }
      );
    }
  }
}
