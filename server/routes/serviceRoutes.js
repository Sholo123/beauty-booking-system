import express from 'express';
import { createService, getAllServices, getServiceById, updateService, deleteService } from '../controllers/serviceController.js';

const serviceRouter = express.Router();

serviceRouter.post('/create-service', createService);
serviceRouter.get('/get-services', getAllServices);
serviceRouter.get('/get-service/:serviceId', getServiceById);
serviceRouter.put('/update-service/:serviceId', updateService);
serviceRouter.delete('/delete-service/:serviceId', deleteService);

export default serviceRouter;
