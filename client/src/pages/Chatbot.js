import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI English learning assistant. Ask me anything about English grammar, vocabulary, or practice conversation with me!",
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
    scrollToBottom();
  }, [messages]);

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

  const generateBotResponse = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Specific educational responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      const greetings = [
        "Hello! I'm excited to help you learn English today. What would you like to practice?",
        "Hi there! Ready to improve your English skills? I'm here to help!",
        "Welcome! Let's make your English learning journey fun and effective."
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    if (lowerMessage.includes('grammar')) {
      return "Grammar is the foundation of clear communication! For example, 'I am going' (present continuous) vs 'I go' (simple present). What grammar topic would you like to learn?";
    }
    
    if (lowerMessage.includes('vocabulary') || lowerMessage.includes('word')) {
      return "Building vocabulary is key to fluency! Try learning 5 new words daily. For example: 'abundant' means plentiful or existing in large quantities. What words interest you?";
    }
    
    if (lowerMessage.includes('pronunciation')) {
      return "Pronunciation tip: Practice the 'th' sound by placing your tongue between your teeth. Try saying 'think' and 'this'. What sounds would you like to practice?";
    }
    
    if (lowerMessage.includes('tense')) {
      return "English has 12 main tenses! Present simple: 'I eat', Past simple: 'I ate', Future: 'I will eat'. Which tense confuses you most?";
    }
    
    if (lowerMessage.includes('article') || lowerMessage.includes('a') || lowerMessage.includes('an') || lowerMessage.includes('the')) {
      return "Articles: Use 'a' before consonant sounds (a book), 'an' before vowel sounds (an apple), 'the' for specific things (the book on the table). Try making sentences!";
    }
    
    if (lowerMessage.includes('preposition')) {
      return "Prepositions show relationships: 'in' (inside), 'on' (surface), 'at' (specific point). Example: 'I'm at school, sitting on a chair, in the classroom.' Practice with locations!";
    }
    
    if (lowerMessage.includes('conversation') || lowerMessage.includes('talk')) {
      return "Great! Let's practice conversation. Tell me: What did you do today? Or ask me about English culture, food, or traditions. The more you speak, the better you get!";
    }
    
    if (lowerMessage.includes('question')) {
      return "Questions in English: Use 'do/does' for present (Do you like pizza?), 'did' for past (Did you go?), 'will' for future (Will you come?). Try asking me a question!";
    }
    
    if (lowerMessage.includes('plural')) {
      return "Plurals: Add 's' (cat→cats), 'es' after s,x,z,ch,sh (box→boxes), 'ies' after consonant+y (city→cities). Irregular: child→children, mouse→mice. Practice with examples!";
    }
    
    if (lowerMessage.includes('adjective')) {
      return "Adjectives describe nouns: 'beautiful flower', 'tall building'. Order: opinion-size-age-color-origin-material-purpose. Example: 'a beautiful small old red Chinese silk evening dress'. Try describing something!";
    }
    
    // Default educational responses
    const educationalResponses = [
      "That's interesting! Can you give me more details? Remember, practice makes perfect in English learning.",
      "Great question! In English, we often say it differently. What specific area would you like me to explain?",
      "I'd love to help you with that! English has many rules and exceptions. What confuses you most?",
      "Excellent! Keep asking questions - that's how you improve. What English topic interests you today?",
      "Perfect practice opportunity! Try explaining that in English, and I'll help you improve it."
    ];
    
    return educationalResponses[Math.floor(Math.random() * educationalResponses.length)];
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    const messageText = inputText;
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    const botResponseText = await generateBotResponse(messageText);
    const botResponse = {
      id: Date.now() + 1,
      text: botResponseText,
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botResponse]);
    setIsLoading(false);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            AI English Assistant
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Practice English conversation with our AI assistant. Use voice input and get instant feedback.
          </p>
        </div>

        <div className="card" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '1rem 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map(message => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  backgroundColor: message.sender === 'bot' ? 'var(--primary)' : '#10b981',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {message.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                
                <div style={{
                  maxWidth: '70%',
                  backgroundColor: message.sender === 'user' ? 'var(--primary)' : 'var(--bg-secondary)',
                  color: message.sender === 'user' ? 'white' : 'var(--text-primary)',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  position: 'relative'
                }}>
                  <p style={{ margin: 0, lineHeight: '1.5' }}>{message.text}</p>
                  {message.sender === 'bot' && (
                    <button
                      onClick={() => speakText(message.text)}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        padding: '0.25rem'
                      }}
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bot className="w-4 h-4" />
                </div>
                <div style={{
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  color: 'var(--text-secondary)'
                }}>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ 
            borderTop: '1px solid var(--border)', 
            padding: '1rem 0 0',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-end'
          }}>
            <div style={{ flex: 1 }}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about English grammar, vocabulary, or practice conversation..."
                style={{
                  width: '100%',
                  minHeight: '2.5rem',
                  maxHeight: '6rem',
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  resize: 'none',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            
            <button
              onClick={isListening ? stopListening : startListening}
              className="btn"
              style={{
                backgroundColor: isListening ? '#ef4444' : 'var(--primary)',
                color: 'white',
                padding: '0.75rem',
                minWidth: 'auto'
              }}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              className="btn btn-primary"
              style={{
                padding: '0.75rem',
                minWidth: 'auto',
                opacity: (!inputText.trim() || isLoading) ? 0.5 : 1
              }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;