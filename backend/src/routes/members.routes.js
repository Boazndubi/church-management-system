import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/members
router.get('/', authenticate, async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true } }, department: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: members, total: members.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/members/stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    const total = await prisma.member.count();
    res.json({ total, todayAttendance: 0 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/members
router.post('/', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, gender, departmentId } = req.body;
    const hash = await bcrypt.hash('Member@1234', 10);
    const member = await prisma.member.create({
      data: {
        user: { create: { firstName, lastName, email, phoneNumber, password: hash, role: 'MEMBER' } },
        ...(gender && { gender }),
        ...(departmentId && { departmentId })
      },
      include: { user: true }
    });
    res.status(201).json(member);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/members/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await prisma.member.delete({ where: { id: req.params.id } });
    res.json({ message: 'Member deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
