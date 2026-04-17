import express from 'express';
import {
    createFeedback,
    updateFeedback,
    getFeedbacksByServiceId,
    getFeedbacksByUserId,
    getAllFeedbacks,
    deleteFeedback,
} from '../controllers/feedbackController.js';
import { requireAuth, requireAdmin, requireSelfOrAdmin } from '../middlewares/auth.js';

const feedbackRouter = express.Router();

// Public reads for a given service.
feedbackRouter.get('/get-service-feedback/:serviceId', getFeedbacksByServiceId);

// Self/admin reads.
feedbackRouter.get(
    '/get-user-feedback/:userId',
    requireAuth,
    requireSelfOrAdmin('userId'),
    getFeedbacksByUserId
);

// Authenticated owner actions.
feedbackRouter.post(
    '/create-feedback/:appointmentId/:userId/:serviceId',
    requireAuth,
    requireSelfOrAdmin('userId'),
    createFeedback
);
feedbackRouter.put(
    '/update-feedback/:feedbackId/:userId/:serviceId',
    requireAuth,
    requireSelfOrAdmin('userId'),
    updateFeedback
);

// Delete: authenticated; controller enforces owner-or-admin.
feedbackRouter.delete('/delete-feedback/:feedbackId', requireAuth, deleteFeedback);

// Admin-only.
feedbackRouter.get('/get-all-feedbacks', requireAuth, requireAdmin, getAllFeedbacks);

export default feedbackRouter;
