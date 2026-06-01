import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticate, async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      include: {
        member: { include: { user: { select: { firstName: true, lastName: true } } } },
        service: { select: { title: true } }
      },
      orderBy: { timestamp: 'desc' }, take: 100
    });
    res.json({ data: records, total: records.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { memberId, serviceId, status } = req.body;
    const record = await prisma.attendance.create({
      data: { memberId, serviceId, status: status || 'PRESENT' }
    });
    res.status(201).json(record);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
