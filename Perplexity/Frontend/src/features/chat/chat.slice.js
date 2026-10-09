import { createSlice } from '@reduxjs/toolkit';

// Shape of the state:
// chats = {
//     [chatId]: {
//         id, title, lastUpdated,
//         messages: [ { role: "user" | "ai", content, time } ],
//         loaded: boolean   // true once the messages were fetched from the server
//     }
// }

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[ chatId ] = {
                id: chatId,
                title,
                messages: [],
                loaded: true,
                lastUpdated: new Date().toISOString(),
            }
        },
        // swaps a temporary chat id for the real one returned by the server
        renameChat: (state, action) => {
            const { from, to, title } = action.payload
            const chat = state.chats[ from ]
            if (!chat) return
            delete state.chats[ from ]
            state.chats[ to ] = { ...chat, id: to, title: title || chat.title }
            if (state.currentChatId === from) state.currentChatId = to
        },
        removeChat: (state, action) => {
            delete state.chats[ action.payload ]
            if (state.currentChatId === action.payload) state.currentChatId = null
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role, time } = action.payload
            const chat = state.chats[ chatId ]
            if (!chat) return
            chat.messages.push({ content, role, time })
            chat.lastUpdated = new Date().toISOString()
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload
            const chat = state.chats[ chatId ]
            if (!chat) return
            chat.messages = messages
            chat.loaded = true
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
    }
})

export const {
    setChats,
    setCurrentChatId,
    setLoading,
    setError,
    createNewChat,
    renameChat,
    removeChat,
    addNewMessage,
    addMessages,
} = chatSlice.actions
export default chatSlice.reducer
