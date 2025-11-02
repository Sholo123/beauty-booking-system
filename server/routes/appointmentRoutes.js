

import express from 'express';
import { 
     createAppointment,
     getAllAppointments, 
     getAppointmentsByUserId, 
     updateAppointment, 
     acceptAppointment,
     rejectAppointment,
     cancelAppointment,
     deleteAppointment } from '../controllers/appointmentController.js';

const appointmentRouter = express.Router();

appointmentRouter.post('/create-appointment/:userId/:serviceId', createAppointment);
appointmentRouter.get('/get-all-appointments', getAllAppointments);
appointmentRouter.get('/get-appointments/:userId', getAppointmentsByUserId);
appointmentRouter.put('/update-appointment/:appointmentId/:userId/:serviceId', updateAppointment);
appointmentRouter.put('/accept-appointment/:appointmentId', acceptAppointment);
appointmentRouter.put('/reject-appointment/:appointmentId', rejectAppointment);
appointmentRouter.put('/cancel-appointment/:appointmentId/:userId', cancelAppointment);
appointmentRouter.delete('/delete-appointment/:appointmentId', deleteAppointment);

export default appointmentRouter;
