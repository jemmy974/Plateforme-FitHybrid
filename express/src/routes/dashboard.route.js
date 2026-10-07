import { Router } from 'express';
import { getDashboardData, exportDashboardStats } from '../controllers/dashboard.controllers.js';
import { requireRole, verifyToken } from '../middlewares/auth.middleware.js';

const dashboard = Router();

dashboard.use(verifyToken);
dashboard.use(requireRole(2));

dashboard.get('/', getDashboardData);
dashboard.get('/export', exportDashboardStats);

export default dashboard;
