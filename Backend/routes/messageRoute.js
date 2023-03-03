import express from 'express';
import {protect} from '../middleware/auth.js';
import {allMessages, sendMessage } from '../controllers/messageController.js'
const router = express.Router();
router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);
export default router;