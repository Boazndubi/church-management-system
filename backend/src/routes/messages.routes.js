import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticate, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      include: { sender: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' }, take: 50
    });
    res.json({ data: messages, total: messages.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { content, messageType } = req.body;
    const message = await prisma.message.create({
      data: { content, messageType: messageType || 'notification', senderId: req.user.userId }
    });
    res.status(201).json(message);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
