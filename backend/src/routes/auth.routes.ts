import passport from 'passport';
import { Strategy } from 'passport-github2';
import { Request, Response, Router } from 'express';
import StatusCodes from 'http-status-codes';
import session from 'express-session';
import { getUserById, createUser } from '../models/User';
import { User } from '@prisma/client';
import { access } from 'fs';
const router = Router();
router.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  })
);
router.use(passport.initialize());
router.use(passport.session());
passport.use(
  new Strategy(
    {
      clientID: 'Ov23li2yQhm9o4wc9wEk',
      // process.env.GITHUB_CLIENT_ID ||
      clientSecret: '7a6ec1f0c3d1e568cebbcde774a02bdb8bd3553d',
      //  || process.env.GITHUB_SECRET_KEY,
      callbackURL: 'http://localhost:3056/auth/callback',
      //  process.env.GITHUB_CALLBACK_URL!,
    },
    async (
      accesToken: string,
      refresToken: string,
      profile: { id: string; username: string },
      cb: (error: any, data: any) => {}
    ) => {
      try {
        const user = await getUserById(Number(profile.id));
        if (!user) {
          createUser(profile.username);
        }
        console.log('GitHub Profile:', profile);
        cb(null, profile);
      } catch (error) {
        console.error('Error obtaining access token:', error);
        cb(error, null);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user: User, done) => {
  console.log(user);
  done(null, user);
});
router.get(
  '/login',
  (req, res, next) => {
    console.log(process.env.GITHUB_CLIENT_ID);
    console.log('executed');
    next();
  },
  passport.authenticate('github', { scope: ['user:email'] })
);
router.get(
  '/callback',
  passport.authenticate('github', { failureRedirect: '/auth/error' }),
  (req: Request, res: Response) => {
    const { code } = req.query;

    res.status(StatusCodes.OK).json({
      message: 'user has signed up successfuly',
      access_token: code,
      user: req.user,
    });
  }
);
router.get('/error', (req: Request, res: Response) => {
  res.status(StatusCodes.FORBIDDEN).json({ message: 'Could not login user.' });
});
router.get('/logout', (req: Request, res: Response) => {
  req.logout(() => {
    res.redirect('/');
  });
});
export default router;
