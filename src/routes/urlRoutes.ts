import { Router } from 'express';
import  URLController  from '../controllers/URLController';

const router = Router();

// Define routes
router.post('/', URLController.processURL);

export default router;