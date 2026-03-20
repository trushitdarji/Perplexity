import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { useEffect, useState, useRef } from "react";
import { initializeSocketConnection } from "../service/chat.socket";

const Dashboard = () => {
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [themeAnimating, setThemeAnimating] = useState(false);
  const messagesEndRef = useRef(null);

  const chat = useChat();
  const user = useSelector((state) => state.auth);

  const theme = {
    base: isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900",
    panel: isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900",
    hover: isDark ? "hover:bg-slate-800" : "hover:bg-slate-100",
    border: isDark ? "border-slate-800" : "border-slate-200",
    card: isDark ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900",
    textMuted: isDark ? "text-slate-400" : "text-slate-500",
  };

  const modeClass = (light, darkValue) => (isDark ? darkValue : light);

  const handleThemeToggle = () => {
    setThemeAnimating(true);
    setIsDark(!isDark);
    setTimeout(() => setThemeAnimating(false), 300);
  };

  useEffect(() => {
    chat.initializeSocketConnection();
  }, [isDark]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        content:
          "This is a simulated AI response. Connect this to your backend for real functionality.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedPrompts = [
    { title: "Code", description: "Ask for code", icon: "</>" },
    { title: "Learn", description: "Learn something new", icon: "📚" },
    { title: "Write", description: "Writing assistance", icon: "✍️" },
    { title: "Analyze", description: "Data analysis", icon: "📊" },
  ];

  const recentChats = [
    "Online internship interview prepa...",
    "Frontend-backend integration aur...",
    "Fullstack development schedule...",
    "Script Of TrushitCodes",
  ];

  return (
    <div
      className={`flex h-screen ${theme.base} theme-container ${themeAnimating ? "theme-transition" : ""}`}
      style={{
        backgroundColor: isDark ? "#03071e" : "#ffffff",
        color: isDark ? "#f8fafc" : "#0f172a",
      }}
    >
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-0"} ${theme.panel} border-r ${theme.border} flex flex-col transition-all duration-300 overflow-hidden theme-element`}
        style={{
          backgroundColor: isDark ? "#0b1222" : "#ffffff",
          color: isDark ? "#f8fafc" : "#0f172a",
        }}
      >
        {/* Logo */}
        <div className={`p-5 border-b ${theme.border}`}>
          <h1
            className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Perplexity
          </h1>
        </div>

        <div
          className={`h-px ${modeClass("bg-slate-200", "bg-slate-800")}`}
        ></div>

        {/* Recents */}
        <div className="my-6">
          <p
            className={`px-4 py-2 text-xs font-semibold ${modeClass("text-slate-500", "text-slate-400")} uppercase`}
          >
            Recents
          </p>
          <div className="space-y-1 mt-2">
            {recentChats.map((chatName, idx) => (
              <button
                key={idx}
                onClick={() => setActiveChat(idx)}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${modeClass("text-slate-700", "text-slate-400")} ${theme.hover} transition-colors text-left group`}
              >
                <span>📝</span>
                <span className="text-sm truncate flex-1">{chatName}</span>
                <span className="opacity-0 group-hover:opacity-100 text-slate-400">
                  ⋯
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div
          className={`pb-5  ${modeClass("border-slate-200", "border-slate-800")} flex fixed bottom-0`}
        >
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors  ${theme.hover}`}
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${modeClass("text-slate-900", "text-white")} truncate`}
              >
                {user?.name || "User"}
              </p>
              <p
                className={`text-xs ${modeClass("text-slate-500", "text-slate-400")}`}
              >
                Free plan
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${theme.panel} theme-element`}
        style={{
          backgroundColor: isDark ? "#03071e" : "#ffffff",
          color: isDark ? "#f8fafc" : "#0f172a",
        }}
      >
        {/* Header */}
        <header
          className={`border-b ${theme.border} px-6 py-4 flex items-center justify-between theme-element`}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-lg transition-colors ${theme.hover}`}
          >
            <svg
              className={`w-5 h-5 ${modeClass("text-slate-700", "text-slate-300")}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleThemeToggle}
              className={`p-2 rounded-lg transition-colors ${theme.hover}`}
              title="Toggle dark mode"
            >
              {isDark ? (
                <svg
                  className="w-5 text-amber-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z"></path>
                </svg>
              ) : (
                <svg
                  className="w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 21.9967C6.47715 21.9967 2 17.5196 2 11.9967C2 6.47386 6.47715 1.9967 12 1.9967C17.5228 1.9967 22 6.47386 22 11.9967C22 17.5196 17.5228 21.9967 12 21.9967ZM5.32889 16.422C6.76378 18.5675 9.20868 19.9803 11.9836 19.9803C16.4018 19.9803 19.9836 16.3985 19.9836 11.9803C19.9836 9.2053 18.5707 6.76034 16.4251 5.32547C17.2705 8.35324 16.5025 11.7369 14.1213 14.1181C11.7401 16.4993 8.3566 17.2672 5.32889 16.422Z"></path>
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            // Empty State
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="mb-8">
                <div className="text-6xl mb-4">✨</div>
                <h2
                  className={`text-3xl font-bold ${modeClass("text-slate-900", "text-white")} mb-4`}
                >
                  Hey there, {user?.name?.split(" ")[0] || "friend"}
                </h2>
                <p
                  className={`${modeClass("text-slate-600", "text-slate-400")} mb-8 max-w-md`}
                >
                  Start a conversation, ask questions, or let me help you with
                  anything.
                </p>

                {/* Suggested Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      className={`p-4 rounded-lg border ${modeClass("border-slate-200", "border-slate-800")} ${theme.hover} ${modeClass("bg-slate-50", "bg-slate-900")} transition-all text-left`}
                      onClick={() =>
                        setInputValue(
                          `Tell me about ${prompt.title.toLowerCase()}`,
                        )
                      }
                    >
                      <div className="text-2xl mb-2">{prompt.icon}</div>
                      <p
                        className={`font-semibold ${modeClass("text-slate-900", "text-white")} text-sm`}
                      >
                        {prompt.title}
                      </p>
                      <p
                        className={`text-xs ${modeClass("text-slate-600", "text-slate-400")} mt-1`}
                      >
                        {prompt.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan Banner */}
              <div
                className={`mt-12 p-4 ${modeClass("bg-slate-100", "bg-slate-900")} rounded-lg border ${modeClass("border-slate-200", "border-slate-800")}`}
              >
                <p
                  className={`text-sm ${modeClass("text-slate-600", "text-slate-400")}`}
                >
                  Free plan • Responses may vary • Always verify important
                  information
                </p>
              </div>
            </div>
          ) : (
            // Messages
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-2xl rounded-lg p-4 ${
                      msg.sender === "user"
                        ? modeClass(
                            "bg-blue-600 text-white",
                            "bg-blue-700 text-white",
                          )
                        : modeClass(
                            "bg-slate-100 text-slate-900",
                            "bg-slate-800 text-white",
                          )
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        msg.sender === "user"
                          ? "text-blue-100"
                          : modeClass("text-slate-500", "text-slate-400")
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className={`${modeClass("bg-slate-100", "bg-slate-800")} rounded-lg p-4 space-y-2`}
                  >
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div
          className={`border-t ${modeClass("border-slate-200", "border-slate-800")} ${modeClass("bg-white", "bg-slate-950")} p-6`}
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-3">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="How can I help you today?"
                rows="1"
                className={`flex-1 px-4 py-3 rounded-lg border ${modeClass("border-slate-300", "border-slate-700")} ${modeClass("bg-slate-50", "bg-slate-900")} ${modeClass("text-slate-900", "text-white")} ${modeClass("placeholder-slate-500", "placeholder-slate-400")} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`p-3 ${modeClass("bg-blue-600", "bg-blue-700")} text-white rounded-lg ${modeClass("hover:bg-blue-700", "hover:bg-blue-800")} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                title="Send message"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16683022 C3.34915502,0.9097328 2.40734225,0.975599095 1.77946707,1.4469212 C0.994623095,2.07429204 0.837654326,3.16346272 1.15159189,3.94894965 L3.03521743,10.5728304 C3.03521743,10.7299278 3.03521743,10.8870252 3.50612381,10.8870252 L16.6915026,11.6725121 C16.6915026,11.6725121 17.1624089,11.6725121 17.1624089,11.0893735 L17.1624089,12.0319579 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
                </svg>
              </button>
            </div>

            <p
              className={`text-xs ${modeClass("text-slate-500", "text-slate-400")} mt-3 text-center`}
            >
              Free plan • Responses may vary
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden z-10"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;
