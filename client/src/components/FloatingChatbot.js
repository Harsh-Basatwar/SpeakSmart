import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Volume2, Bot, User, Minimize2 } from 'lucide-react';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your English learning assistant. Ask me anything about grammar, vocabulary, or practice conversation!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! Ready to practice English? I can help with grammar, vocabulary, pronunciation, or just have a conversation!";
    } else if (lowerMessage.includes('grammar')) {
      return "Grammar questions are my specialty! Whether it's tenses, sentence structure, or punctuation - what would you like to learn?";
    } else if (lowerMessage.includes('vocabulary')) {
      return "Let's expand your vocabulary! I can explain word meanings, suggest synonyms, or help you use new words in sentences. What word interests you?";
    } else if (lowerMessage.includes('pronunciation')) {
      return "Pronunciation practice is excellent for fluency! Try using the voice button to speak, and I'll help you with any sounds you find challenging.";
    } else if (lowerMessage.includes('practice') || lowerMessage.includes('conversation')) {
      return "Perfect! Let's chat. Tell me about your hobbies, your goals, or ask me about English-speaking countries. What interests you most?";
    } else if (lowerMessage.includes('help')) {
      return "I'm here to help! I can assist with: 📚 Grammar rules, 📖 Vocabulary building, 🗣️ Pronunciation tips, 💬 Conversation practice, and 📝 Writing skills. What would you like to work on?";
    } else {
      return "That's interesting! Can you tell me more? Remember, making mistakes is part of learning - keep practicing and you'll improve quickly!";
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000
      }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--purple)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
            transition: 'all 0.3s ease',
            animation: 'pulse 2s infinite'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 20px rgba(147, 51, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(147, 51, 234, 0.3)';
          }}
        >
          <MessageCircle size={24} />
        </button>
        <style jsx>{`
          @keyframes pulse {
            0% { box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3); }
            50% { box-shadow: 0 4px 12px rgba(147, 51, 234, 0.6); }
            100% { box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: '350px',
      height: isMinimized ? '60px' : '500px',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '1rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      border: '1px solid var(--border)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        backgroundColor: 'var(--purple)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bot size={20} />
          <span style={{ fontWeight: '600' }}>English Assistant</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <Minimize2 size={16} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {messages.map(message => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  backgroundColor: message.sender === 'bot' ? 'var(--purple)' : 'var(--success)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {message.sender === 'bot' ? <Bot size={12} /> : <User size={12} />}
                </div>
                
                <div style={{
                  maxWidth: '75%',
                  backgroundColor: message.sender === 'user' ? 'var(--purple)' : 'var(--bg-secondary)',
                  color: message.sender === 'user' ? 'white' : 'var(--text-primary)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  position: 'relative'
                }}>
                  <p style={{ margin: 0, lineHeight: '1.4' }}>{message.text}</p>
                  {message.sender === 'bot' && (
                    <button
                      onClick={() => speakText(message.text)}
                      style={{
                        position: 'absolute',
                        top: '0.25rem',
                        right: '0.25rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        padding: '0.125rem'
                      }}
                    >
                      <Volume2 size={10} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--purple)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bot size={12} />
                </div>
                <div style={{
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  gap: '0.25rem'
                }}>
                  <div style={{
                    width: '0.25rem',
                    height: '0.25rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--text-secondary)',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }} />
                  <div style={{
                    width: '0.25rem',
                    height: '0.25rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--text-secondary)',
                    animation: 'pulse 1.5s ease-in-out infinite 0.2s'
                  }} />
                  <div style={{
                    width: '0.25rem',
                    height: '0.25rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--text-secondary)',
                    animation: 'pulse 1.5s ease-in-out infinite 0.4s'
                  }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '0.75rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-end'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask me anything..."
                style={{
                  width: '100%',
                  minHeight: '2rem',
                  maxHeight: '4rem',
                  padding: '0.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  resize: 'none',
                  fontSize: '0.8rem'
                }}
              />
            </div>
            
            <button
              onClick={isListening ? () => setIsListening(false) : startListening}
              style={{
                backgroundColor: isListening ? 'var(--error)' : 'var(--purple)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                cursor: 'pointer',
                minWidth: 'auto'
              }}
            >
              {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
            
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              style={{
                backgroundColor: 'var(--purple)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                cursor: 'pointer',
                minWidth: 'auto',
                opacity: (!inputText.trim() || isLoading) ? 0.5 : 1
              }}
            >
              <Send size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FloatingChatbot;