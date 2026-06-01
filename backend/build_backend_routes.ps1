# ============================================================
# Church Management System - Backend Routes Builder
# Run from: C:\Users\BOAZ\Projects\church-management-system\backend
# ============================================================

Write-Host "Building backend routes..." -ForegroundColor Cyan

# ---- src/routes/auth.routes.js ----
Set-Content "src/routes/auth.routes.js" @'
import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, email: true, firstName: true, lastName: true, role: true } });
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
'@

# ---- src/middleware/auth.middleware.js ----
Set-Content "src/middleware/auth.middleware.js" @'
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
'@

# ---- src/routes/members.routes.js ----
Set-Content "src/routes/members.routes.js" @'
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
'@

# ---- src/routes/services.routes.js ----
Set-Content "src/routes/services.routes.js" @'
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
'@

# ---- src/routes/attendance.routes.js ----
Set-Content "src/routes/attendance.routes.js" @'
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
'@

# ---- src/routes/departments.routes.js ----
Set-Content "src/routes/departments.routes.js" @'
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
'@

# ---- src/routes/contributions.routes.js ----
Set-Content "src/routes/contributions.routes.js" @'
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
'@

# ---- src/routes/events.routes.js ----
Set-Content "src/routes/events.routes.js" @'
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
'@

# ---- src/routes/messages.routes.js ----
Set-Content "src/routes/messages.routes.js" @'
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
'@

Write-Host "✅ All routes created!" -ForegroundColor Green
Write-Host ""
Write-Host "Now update server.js to register the routes." -ForegroundColor Yellow
