import { generateResponse, AiTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/msg.model.js";


export async function sendMessage(req, res) {

    const { message, chat: chatId } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({
            message: "Message is required"
        })
    }

    let title = null, chat = null;

    if (chatId) {
        const existingChat = await chatModel.findOne({
            _id: chatId,
            user: req.user.id
        })

        if (!existingChat) {
            return res.status(404).json({
                message: "Chat not found"
            })
        }
    } else {
        try {
            title = await AiTitle(message);
        } catch (err) {
            title = message.trim().slice(0, 40);
        }

        chat = await chatModel.create({
            user: req.user.id,
            title
        })
    }

    const activeChatId = chatId || chat._id;

    await messageModel.create({
        chat: activeChatId,
        content: message,
        role: 'user'
    })

    // full history (including the message just saved) so the AI has context
    const messages = await messageModel.find({ chat: activeChatId }).sort({ createdAt: 1 });

    const result = await generateResponse(messages);

    const Aimsg = await messageModel.create({
        chat: activeChatId,
        content: result,
        role: 'ai'
    })

    res.status(201).json({
        title,
        chat,
        Aimsg
    });
}

export async function retriveChats(req, res) {
    const user = req.user;

    const chats = await chatModel.find({ user: user.id }).sort({ updatedAt: -1 });

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats
    })
}

export async function retriveMessages(req, res) {
    const { chatId } = req.params;

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

    res.status(200).json({
        message: "Messages retrieved successfully",
        messages
    })
}

export async function deleteChats(req, res) {
    const { chatId } = req.params

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    await messageModel.deleteMany({
        chat: chatId
    })

    res.status(200).json({
        message: "Chat deleted successfully"
    })
}
