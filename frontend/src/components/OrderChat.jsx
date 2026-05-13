import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { MessageSquare, Send, X, User, ShieldCheck } from 'lucide-react';

const CHAT_SERVER = import.meta.env.VITE_SOCKET_URL ? import.meta.env.VITE_SOCKET_URL.replace(':4005', ':4008') : 'http://localhost:4008';

const OrderChat = ({ orderId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    socketRef.current = io(CHAT_SERVER);
    
    socketRef.current.emit('join_chat', orderId);

    socketRef.current.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
      setIsTyping(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [orderId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageData = {
      orderId,
      text: inputText,
      sender: 'customer'
    };

    socketRef.current.emit('send_message', messageData);
    setInputText('');
    
    // Simulate rider typing after 1 second
    setTimeout(() => {
      setIsTyping(true);
    }, 1000);
  };

  return (
    <div className="order-chat-container">
      {/* Floating Button */}
      {!isOpen && (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
          <MessageSquare size={24} />
          <span className="pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window animate-slideUp">
          <div className="chat-header">
            <div className="header-info">
              <div className="rider-avatar">
                <User size={16} />
              </div>
              <div>
                <h4>Delivery Rider</h4>
                <p className="online-status">Online</p>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages" ref={scrollRef}>
            <div className="system-msg">
              <ShieldCheck size={12} /> Secure chat with your rider
            </div>
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-bubble ${msg.sender === 'customer' ? 'sent' : 'received'}`}>
                <div className="msg-text">{msg.text}</div>
                <div className="msg-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-bubble received typing">
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          <form className="chat-input" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" disabled={!inputText.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .order-chat-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
        }
        .chat-toggle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--accent-gradient);
          color: white;
          border: none;
          box-shadow: 0 8px 32px rgba(255, 107, 53, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .chat-toggle:hover { transform: scale(1.1); }
        .pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--accent-primary);
          opacity: 0.6;
          animation: pulse-ring 2s infinite;
          z-index: -1;
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .chat-window {
          width: 350px;
          height: 480px;
          background: #11111a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          overflow: hidden;
          backdrop-filter: blur(20px);
        }
        .chat-header {
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .header-info { display: flex; align-items: center; gap: 12px; }
        .rider-avatar {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .header-info h4 { font-size: 14px; font-weight: 700; margin: 0; color: #f1f5f9; }
        .online-status { font-size: 11px; color: #22c55e; margin: 0; display: flex; align-items: center; gap: 4px; }
        .online-status::before { content: ''; width: 6px; height: 6px; background: #22c55e; border-radius: 50%; display: inline-block; }
        .close-btn { background: none; border: none; color: #64748b; cursor: pointer; }

        .chat-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .system-msg {
          text-align: center;
          font-size: 11px;
          color: #64748b;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
        .message-bubble {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.4;
          position: relative;
        }
        .message-bubble.sent {
          align-self: flex-end;
          background: var(--accent-gradient);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .message-bubble.received {
          align-self: flex-start;
          background: rgba(255,255,255,0.08);
          color: #e2e8f0;
          border-bottom-left-radius: 4px;
        }
        .msg-time { font-size: 9px; opacity: 0.6; margin-top: 4px; text-align: right; }

        .chat-input {
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          gap: 10px;
        }
        .chat-input input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 10px 14px;
          color: white;
          font-size: 14px;
          outline: none;
        }
        .chat-input button {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: var(--accent-gradient);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .chat-input button:disabled { opacity: 0.5; cursor: not-allowed; }

        .typing-dots { display: flex; gap: 4px; padding: 4px 0; }
        .typing-dots span {
          width: 6px; height: 6px; background: #94a3b8; border-radius: 50%;
          animation: typing-dot 1.4s infinite ease-in-out;
        }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.1); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default OrderChat;
