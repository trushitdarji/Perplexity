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
  updateLastMessage,
  replaceChatId,
  updateChatTitle,
} from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);

  async function handleSendMessage({ message, chatId }) {
    dispatch(setLoading(true));

    if (!chatId) {
      const tempId = Date.now().toString();

      dispatch(
        createNewChat({
          chatId: tempId,
          title: "new chat",
        }),
      );
      dispatch(setCurrentChatId(tempId));
      chatId = tempId;
    }

    // user message show karne k liye
    dispatch(
      addNewMessage({
        chatId,
        content: message,
        role: "user",
      }),
    );

    // typing indecator show
    dispatch(
      addNewMessage({
        chatId,
        content: "",
        role: "ai",
      }),
    );

    try {
      const data = await sendMessage({
        message,
        chatId: chatId && chats[chatId] ? chatId : null,
      });

      const { chat, aiMessage } = data;

      if (chat && chat._id && chatId !== chat._id) {
        dispatch(
          replaceChatId({
            oldId: chatId,
            newId: chat._id,
          }),
        );

        dispatch(setCurrentChatId(chat._id));
        chatId = chat._id;
      }

      if (chat && chat._id) {
        dispatch(
          updateChatTitle({
            chatId: chat._id,
            title: chat.title,
          }),
        );
      }

      dispatch(
        updateLastMessage({
          chatId,
          content: aiMessage.content,
        }),
      );
    } catch (err) {
      dispatch(setError("failed to send message"));
    }

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
