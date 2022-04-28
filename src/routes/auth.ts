import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import type DataAccessLayer from '../db/DataAccessLayer';

const secret = 'my-32-character-ultra-secure-and-ultra-long-secret';

export const verifyToken = (
  req: Request & { user: any },
  res: Response,
  next: any
) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

export default function (dataAccessLayer: DataAccessLayer) {
  const router = express.Router();

  router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).send('Missing username or password');
    }

    const [user] = (await dataAccessLayer.read('users', { email })) as any;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send('Invalid Credentials');
    }

    const token = jwt.sign({ user_id: user.id, email }, secret, {
      expiresIn: '2h',
    });
    const updatedUser = await dataAccessLayer.update('users', {
      ...user,
      token,
    });

    delete (updatedUser as any)?.password;

    res
      .cookie('access_token', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json(updatedUser);
  });

  router.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).send('Not all registration data provided');
    }

    const [userFromDb] = await dataAccessLayer.read('users', { email });
    if (userFromDb) {
      return res
        .status(409)
        .send(`User with login name ${email} already exists`);
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, secret, {
      expiresIn: '2h',
    });
    const user = await dataAccessLayer.create('users', {
      password: encryptedPassword,
      email,
      token,
    });

    delete (user as any)?.password;

    res
      .cookie('access_token', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
      })
      .status(201)
      .json(user);
  });

  return router;
}
