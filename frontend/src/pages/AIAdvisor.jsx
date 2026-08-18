import { useState, useRef, useEffect } from "react";
import { aiAPI } from "../services/api";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AIAdvisor() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("msme_ai_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        role: "ASSISTANT",
        content: "Hi there! I am SmartBiz AI, your personal business advisor. How can I help you analyze your business performance today?",
      }
    ];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("msme_ai_history", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Optimistic UI update
    const newHistory = [...messages, { role: "USER", content: userMessage }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // Backend expects { message, history }
      // History format: [{ role, content }]
      // But we shouldn't pass the current user message in history to avoid duplication,
      // and we shouldn't pass the initial greeting if we don't want it interfering, though it's harmless.
      
      const payload = {
        message: userMessage,
        history: messages.filter(m => m.role === 'USER' || m.role === 'ASSISTANT'),
      };

      const { data } = await aiAPI.chat(payload);

      setMessages((prev) => [
        ...prev,
        { role: "ASSISTANT", content: data.message || "No response received." },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "ASSISTANT", content: "**Error:** " + (error.response?.data?.error || "Failed to reach AI. Please try again.") },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear the conversation history?")) {
      const initial = [{
        role: "ASSISTANT",
        content: "Hi there! I am SmartBiz AI, your personal business advisor. How can I help you analyze your business performance today?",
      }];
      setMessages(initial);
      localStorage.setItem("msme_ai_history", JSON.stringify(initial));
    }
  };

  return (
    <div className="ai-advisor-container">
      <div className="page-header ai-header">
        <div>
          <h1><Sparkles className="title-icon" size={24} /> AI Business Advisor</h1>
          <p>Get actionable insights directly from your data</p>
        </div>
        <button className="btn-secondary" onClick={handleClearHistory} disabled={isLoading}>
          Clear History
        </button>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble-wrapper ${msg.role === 'USER' ? 'user' : 'assistant'}`}>
              <div className="chat-avatar">
                {msg.role === 'USER' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="chat-bubble">
                {msg.role === 'USER' ? (
                   msg.content
                ) : (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-bubble-wrapper assistant">
              <div className="chat-avatar"><Bot size={20} /></div>
              <div className="chat-bubble loading">
                <Loader2 className="spinner" size={20} /> Generating insights...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask about your revenue, expenses, stock, or business trends..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="chat-submit-btn" disabled={!input.trim() || isLoading}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
