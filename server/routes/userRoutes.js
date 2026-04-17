import express from 'express';
import {
    registerUser,
    loginUser,
    isAdmin,
    getUserProfile,
    updateUserProfile,
    removeUser,
} from '../controllers/userController.js';
import { requireAuth, requireSelfOrAdmin } from '../middlewares/auth.js';

const userRouter = express.Router();

// Public
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Authenticated + authorization
userRouter.get('/is-admin/:userId', requireAuth, requireSelfOrAdmin('userId'), isAdmin);
userRouter.get('/profile/:userId', requireAuth, requireSelfOrAdmin('userId'), getUserProfile);
userRouter.put('/updateprofile/:userId', requireAuth, requireSelfOrAdmin('userId'), updateUserProfile);
userRouter.delete('/remove/:userId', requireAuth, requireSelfOrAdmin('userId'), removeUser);

export default userRouter;
