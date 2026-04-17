import express from 'express';
import {
    createAppointment,
    getAllAppointments,
    getAppointmentsByUserId,
    updateAppointment,
    acceptAppointment,
    rejectAppointment,
    cancelAppointment,
    deleteAppointment,
} from '../controllers/appointmentController.js';
import { requireAuth, requireAdmin, requireSelfOrAdmin } from '../middlewares/auth.js';

const appointmentRouter = express.Router();

// Authenticated user actions — must be the owner (or admin).
appointmentRouter.post(
    '/create-appointment/:userId/:serviceId',
    requireAuth,
    requireSelfOrAdmin('userId'),
    createAppointment
);
appointmentRouter.get(
    '/get-appointments/:userId',
    requireAuth,
    requireSelfOrAdmin('userId'),
    getAppointmentsByUserId
);
appointmentRouter.put(
    '/update-appointment/:appointmentId/:userId/:serviceId',
    requireAuth,
    requireSelfOrAdmin('userId'),
    updateAppointment
);
appointmentRouter.put(
    '/cancel-appointment/:appointmentId/:userId',
    requireAuth,
    requireSelfOrAdmin('userId'),
    cancelAppointment
);

// Admin-only actions.
appointmentRouter.get('/get-all-appointments', requireAuth, requireAdmin, getAllAppointments);
appointmentRouter.put('/accept-appointment/:appointmentId', requireAuth, requireAdmin, acceptAppointment);
appointmentRouter.put('/reject-appointment/:appointmentId', requireAuth, requireAdmin, rejectAppointment);
appointmentRouter.delete('/delete-appointment/:appointmentId', requireAuth, requireAdmin, deleteAppointment);

export default appointmentRouter;
