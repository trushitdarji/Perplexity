import { useSelector } from "react-redux";
import { initializeSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../service/chat.api";
import {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  createNewChat,
  addNewMessage,
  addMessages,
} from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);

  async function handleSendMessage({ message, chatId }) {
    dispatch(setLoading(true));
    const data = await sendMessage({ message, chatId });
    const { chat, aiMessage } = data;
    if (!chatId) {
      dispatch(
        createNewChat({
          chatId: chatId || chat._id,
          title: chat.title,
        }),
      );
    }

    dispatch(setCurrentChatId(chatId||chat._id));

    dispatch(
      addNewMessage({
        chatId: chatId || chat._id,
        content: message,
        role: "user",
      }),
    );
    dispatch(
      addNewMessage({
        chatId: chatId || chat._id,
        content: aiMessage.content,
        role: aiMessage.role,
      }),
    );
    dispatch(setLoading(false));
  }

  async function handleGetChats() {
    dispatch(setLoading(true));
    const data = await getChats();
    console.log(data);
    const { chats } = data;
    dispatch(
      setChats(
        chats.reduce((acc, chat) => {
          acc[chat._id] = {
            id: chat._id,
            title: chat.title,
            messages: [],
            lastUpdated: chat.updatedAt,
          };
          return acc;
        }, {}),
      ),
    );
    dispatch(setLoading(false));
  }

  async function handleOpenChat(chatId) {
    const existing = chats[chatId]?.messages?.length;

    if (!existing) {
      const data = await getMessages(chatId);
      const { messages } = data;

      dispatch(
        addMessages({
          chatId,
          messages: messages.map((msg) => ({
            content: msg.content,
            role: msg.role,
            timestamp: msg.createdAt,
          })),
        }),
      );
    }

    dispatch(setCurrentChatId(chatId));
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
  };
};
