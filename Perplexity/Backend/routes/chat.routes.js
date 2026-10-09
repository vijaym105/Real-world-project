import { Router } from "express";
import {userAuth} from "../middleware/auth.middleware.js";
import { deleteChats, retriveChats, retriveMessages, sendMessage } from "../controller/message.contoller.js";

const chatRouter = Router();

///** @route POST api/chat/send-message
// * @desc Send a message in a chat
 //* @access Private  

chatRouter.post('/send-message', userAuth, sendMessage);

chatRouter.get('/retrive-chats', userAuth, retriveChats);

chatRouter.get('/retrive-msg/:chatId', userAuth, retriveMessages);

chatRouter.delete('/delete/:chatId', userAuth, deleteChats)

export default chatRouter;  