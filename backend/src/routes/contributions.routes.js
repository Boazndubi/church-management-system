import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticate, async (req, res) => {
  try {
    const contributions = await prisma.contribution.findMany({
      include: { member: { include: { user: { select: { firstName: true, lastName: true } } } } },
      orderBy: { contributedAt: 'desc' }
    });
    res.json({ data: contributions, total: contributions.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/stats', authenticate, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const result = await prisma.contribution.aggregate({
      where: { contributedAt: { gte: startOfMonth } },
      _sum: { amount: true }
    });
    res.json({ totalThisMonth: result._sum.amount || 0 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { memberId, amount, type, paymentMethod, notes } = req.body;
    const contribution = await prisma.contribution.create({
      data: { memberId, amount: parseFloat(amount), type, paymentMethod, notes, status: 'completed' }
    });
    res.status(201).json(contribution);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
