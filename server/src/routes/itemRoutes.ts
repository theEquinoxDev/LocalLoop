import { Router } from 'express';
import {
  createItem,
  getAllItems,
  getNearbyItems,
  getItemById,
  resolveItem,
  claimItem,
} from '../controllers/itemController';
import { protect } from '../middlewares/authMiddleware';
import upload from '../middlewares/upload.middleware';


const router = Router();

router.get('/', protect, getAllItems);
router.post('/', protect, upload.single('image'), createItem);
router.get('/nearby', protect, getNearbyItems);
router.get('/:id', protect, getItemById);
router.patch('/:id/claim', protect, claimItem);
router.patch('/:id/resolve', protect, resolveItem);

export default router;
