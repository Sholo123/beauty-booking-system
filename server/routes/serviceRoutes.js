import express from 'express';
import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
    addServiceImage,
    deleteServiceImage,
} from '../controllers/serviceController.js';
import { upload } from '../middlewares/multer.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';

const serviceRouter = express.Router();

// Public reads
serviceRouter.get('/get-services', getAllServices);
serviceRouter.get('/get-service/:serviceId', getServiceById);

// Admin-only writes
serviceRouter.post('/create-service', requireAuth, requireAdmin, createService);
serviceRouter.put('/update-service/:serviceId', requireAuth, requireAdmin, updateService);
serviceRouter.post(
    '/add-service-image/:serviceId',
    requireAuth,
    requireAdmin,
    upload.single('image'),
    addServiceImage
);
serviceRouter.delete('/delete-service-image/:imageId', requireAuth, requireAdmin, deleteServiceImage);
serviceRouter.delete('/delete-service/:serviceId', requireAuth, requireAdmin, deleteService);

export default serviceRouter;
