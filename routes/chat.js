import { Router } from 'express';
import { ChatController } from '../controllers/chat.js';
import { authMiddleware } from '../middlewares/auth.js';

export const createChatRouter = ({ chatModel }) => {

    const chatRouter = Router();
    const chatController = new ChatController({ chatModel });

    chatRouter.get('/', authMiddleware ,chatController.getAllMyChats);
    
    return chatRouter;
}
