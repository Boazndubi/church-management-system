import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticate, async (req, res) => {
  try {
    const depts = await prisma.department.findMany({
      include: { pastor: { select: { firstName: true, lastName: true } } },
      orderBy: { name: 'asc' }
    });
    res.json({ data: depts, total: depts.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description } = req.body;
    const dept = await prisma.department.create({ data: { name, description } });
    res.status(201).json(dept);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
