import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticate, async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: { department: { select: { name: true } } },
      orderBy: { startDate: 'asc' }
    });
    res.json({ data: events, total: events.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, departmentId } = req.body;
    const event = await prisma.event.create({
      data: { title, description, startDate: new Date(startDate), endDate: endDate ? new Date(endDate) : null, location, departmentId }
    });
    res.status(201).json(event);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
