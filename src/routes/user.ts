import express from 'express';
import { verifyToken } from './auth';
import { User } from '../db';

const router = express.Router();

router.get(
  '/user/current',
  verifyToken,
  async (request: AuthorizedExpressRequest, response: ExpressResponse) => {
    const user = await User.findOne(request.user).select({
      _id: 0,
      password: 0,
      __v: 0,
    });

    response.status(200).send(user);
  }
);

router.patch(
  '/user',
  verifyToken,
  async (request: AuthorizedExpressRequest, response: ExpressResponse) => {
    const userToUpdate = request.body.user;

    if (request.user.email !== userToUpdate.email) {
      return response.status(403).send('Forbidden to update another user');
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: request.user.email },
      userToUpdate,
      {
        new: true,
      }
    );

    response.status(200).send(updatedUser);
  }
);

export default router;
