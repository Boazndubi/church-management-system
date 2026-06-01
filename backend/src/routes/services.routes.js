import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticate, async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: { host: { select: { firstName: true, lastName: true } } },
      orderBy: { date: 'desc' }
    });
    res.json({ data: services, total: services.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, serviceType, date, startTime, endTime, venue, description } = req.body;
    const service = await prisma.service.create({
      data: { title, serviceType: serviceType || 'SUNDAY_SERVICE', date: new Date(date), startTime: new Date(startTime), endTime: new Date(endTime), venue, description, hostId: req.user.userId }
    });
    res.status(201).json(service);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
