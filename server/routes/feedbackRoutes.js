import express from 'express';
import { 
     createFeedback,
     updateFeedback,
     getFeedbacksByServiceId,
     getFeedbacksByUserId,
     getAllFeedbacks,
     deleteFeedback
} from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

// Routes for feedback
feedbackRouter.post('/create-feedback/:appointmentId/:userId/:serviceId', createFeedback);
feedbackRouter.put('/update-feedback/:feedbackId/:userId/:serviceId', updateFeedback);
feedbackRouter.get('/get-service-feedback/:serviceId', getFeedbacksByServiceId);
feedbackRouter.get('/get-user-feedback/:userId', getFeedbacksByUserId);
feedbackRouter.get('/get-all-feedbacks', getAllFeedbacks);
feedbackRouter.delete('/delete-feedback/:feedbackId', deleteFeedback);

export default feedbackRouter;
