import { Router } from 'express';
import { createUser, getUserById } from '../models/User';

const userRouter = Router();

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
  const { name, email } = req.body;
  const user = await createUser(name, email);
  res.json({ id: user.id });
});

export default userRouter;