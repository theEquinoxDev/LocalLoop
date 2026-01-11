import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Item from '../models/Item';
import User from '../models/User';
import cloudinary from '../config/cloudinary';
import { POINTS, calculateLevel } from '../utils/gamification';

export const createItem = async (req: Request, res: Response) => {
  const {
    title,
    description,
    type,
    category,
    latitude,
    longitude,
    radius,
    expiresAt,
  } = req.body;

  const typeValue = req.body.type?.toLowerCase() as 'lost' | 'found';

  if (
    !title ||
    !type ||
    !['lost', 'found'].includes(type) ||
    !category ||
    latitude == null ||
    longitude == null ||
    !expiresAt
  ) {
    return res.status(400).json({ message: 'Invalid or missing fields' });
  }
  

  let imageUrl;

  if (req.file) {
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      {
        folder: 'lost-and-found',
      }
    );
    imageUrl = result.secure_url;
  }

  const item = await Item.create({
    title,
    description,
    type,
    category,
    imageUrl,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
    radius,
    owner: (req as any).user.id,
    expiresAt,
  });

  // Award points for posting item
  const user = await User.findById((req as any).user.id);
  if (user) {
    user.points += POINTS.POST_ITEM;
    user.level = calculateLevel(user.points);
    user.itemsPosted += 1;
    await user.save();
  }

  // Populate owner before sending response
  await item.populate('owner', 'name email phone');

  res.status(201).json(item);
};


export const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find({
      isResolved: false,
    })
      .populate('owner', 'name email phone')
      .populate('claimer', 'name email phone');

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNearbyItems = async (req: Request, res: Response) => {
  const { lat, lng, radius = 2000 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: 'Latitude and longitude required' });
  }

  const items = await Item.find({
    isResolved: false,
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [Number(lng), Number(lat)],
        },
        $maxDistance: Number(radius),
      },
    },
  })
    .populate('owner', 'name email phone')
    .populate('claimer', 'name email phone');

  res.status(200).json(items);
};

export const getItemById = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid item ID format' });
  }

  const item = await Item.findById(id)
    .populate('owner', 'name email phone')
    .populate('claimer', 'name email phone');

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  res.status(200).json(item);
};

export const resolveItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid item ID format' });
  }

  const item = await Item.findById(id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  const userId = (req as any).user.id;
  const isOwner = item.owner.toString() === userId;
  const isClaimer = item.claimer?.toString() === userId;

  if (!isOwner && !isClaimer) {
    return res.status(403).json({ message: 'Not authorized. Only the finder or claimer can resolve this item.' });
  }

  item.isResolved = true;
  await item.save();

  const owner = await User.findById(item.owner);
  if (owner) {
    owner.points += POINTS.CONFIRM_RETURN;
    owner.level = calculateLevel(owner.points);
    owner.itemsReturned += 1;
    await owner.save();
  }

  if (item.claimer) {
    const claimer = await User.findById(item.claimer);
    if (claimer) {
      claimer.points += POINTS.CONFIRM_RETURN;
      claimer.level = calculateLevel(claimer.points);
      await claimer.save();
    }
  }

  res.status(200).json({ message: 'Item resolved' });
};

export const claimItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid item ID format' });
  }

  const item = await Item.findById(id).populate('owner', 'name email phone').populate('claimer', 'name email phone');

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  if (item.isResolved) {
    return res.status(400).json({ message: 'Item already resolved' });
  }

  if (item.claimer) {
    return res.status(400).json({ message: 'Item already claimed by someone else' });
  }

  if (item.owner.toString() === (req as any).user.id) {
    return res.status(400).json({ message: 'Cannot claim your own item' });
  }

  item.claimer = (req as any).user.id;
  item.claimedAt = new Date();
  await item.save();

  // Award points for claiming item
  const claimer = await User.findById((req as any).user.id);
  if (claimer) {
    claimer.points += POINTS.CLAIM_ITEM;
    claimer.level = calculateLevel(claimer.points);
    claimer.itemsClaimed += 1;
    await claimer.save();
  }

  // Populate claimer info for response
  await item.populate('claimer', 'name email phone');

  res.status(200).json(item);
};
