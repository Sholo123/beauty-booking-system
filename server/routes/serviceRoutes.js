import express from 'express';
import { createService, getAllServices, getServiceById, 
        updateService, deleteService, addServiceImage, deleteServiceImage } from '../controllers/serviceController.js';

const serviceRouter = express.Router();

serviceRouter.post('/create-service', createService);
serviceRouter.get('/get-services', getAllServices);
serviceRouter.get('/get-service/:serviceId', getServiceById);
serviceRouter.put('/update-service/:serviceId', updateService);
serviceRouter.post('/add-service-image/:serviceId', addServiceImage);
serviceRouter.delete('/delete-service-image/:imageId', deleteServiceImage);
serviceRouter.delete('/delete-service/:serviceId', deleteService);



export default serviceRouter;
