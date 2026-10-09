import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/chats",
    withCredentials: true,
})


export const sendMessage = async ({ message, chatId }) => {
    const response = await api.post("/send-message", { message, chat: chatId })
    return response.data
}

export const getChats = async () => {
    const response = await api.get("/retrive-chats")
    return response.data
}

export const getMessages = async (chatId) => {
    const response = await api.get(`/retrive-msg/${chatId}`)
    return response.data
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/delete/${chatId}`)
    return response.data
}
