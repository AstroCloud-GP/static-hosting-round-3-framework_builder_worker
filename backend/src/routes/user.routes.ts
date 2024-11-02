import { Router } from 'express';
import { createUser, getUserById } from '../models/User';

const userRouter = Router();

userRouter.get('/', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

// Get user by id
userRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await getUserById(id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

userRouter.post('/', async (req, res) => {
  await createUser("atwa", "email")
  res.json({ message: 'User created' });
});


export default userRouter;