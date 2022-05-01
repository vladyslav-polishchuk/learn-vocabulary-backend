import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';

const secret = 'my-32-character-ultra-secure-and-ultra-long-secret';

export const verifyToken = (
  req: Request & { user: any },
  res: Response,
  next: any
) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(403).send('You have to login to perform this operation');
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

export default function ({ User }: any) {
  const router = express.Router();

  router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).send('Missing username or password');
    }

    const user = (await User.findOne({ email })) as any;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send('Invalid Credentials');
    }

    user.token = jwt.sign({ user_id: user.id, email }, secret, {
      expiresIn: '2h',
    });
    user.save();

    res
      .cookie('access_token', user.token, {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .json(user);
  });

  router.post('/register', async (req: Request, res: Response) => {
    const { email, password, language } = req.body;
    if (!(email && password)) {
      return res.status(400).send('Not all registration data provided');
    }

    const userFromDb = await User.findOne({ email });
    if (userFromDb) {
      return res
        .status(409)
        .send(`User with login name ${email} already exists`);
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, secret, {
      expiresIn: '2h',
    });

    const user = new User({
      password: encryptedPassword,
      email,
      token,
      language,
    });
    user.save();

    res
      .cookie('access_token', token, {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
      })
      .status(201)
      .json(user);
  });

  router.post('/logout', async (req: Request, res: Response) => {
    res.clearCookie('access_token').status(200).send({});
  });

  return router;
}
