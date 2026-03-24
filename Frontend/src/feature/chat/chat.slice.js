import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    isLoading: false,
    currentChatId: null,
    error: null,
  },
  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      state.chats[chatId] = {
        id: chatId,
        title,
        messages: [],
        lastUpdated: new Date().toISOString(),
      };
    },
    addNewMessage: (state, action) => {
      const { chatId, content, role } = action.payload;
      state.chats[chatId].messages.push({
        content,
        role,
        timestamp: new Date().toISOString(),
      });
    },
    addMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.chats[chatId].messages.push(...messages);
    },

    updateLastMessage: (state, action) => {
      const { content, chatId } = action.payload;

      const messages = state.chats[chatId].messages;
      if (!messages || messages.length === 0) return;

      const lastMsg = messages[messages.length - 1];
      lastMsg.content = content;
    },

    replaceChatId: (state, action) => {
      const { oldId, newId } = action.payload;

      if (!state.chats[oldId]) return;

      state.chats[newId] = state.chats[oldId];
      state.chats[newId].id = newId;

      delete state.chats[oldId];
    },

    updateChatTitle: (state, action) => {
      const { chatId, title } = action.payload;
      if(!state.chats[chatId]) return

      state.chats[chatId].title = title
    },

    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  addNewMessage,
  addMessages,
  updateLastMessage,
  replaceChatId,
  updateChatTitle
} = chatSlice.actions;
export default chatSlice.reducer;
