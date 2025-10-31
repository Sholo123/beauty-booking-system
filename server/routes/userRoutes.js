import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, removeUser} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile/:userId', getUserProfile);
userRouter.put('/updateprofile/:userId', updateUserProfile);
userRouter.delete('/remove/:userId', removeUser);


export default userRouter;