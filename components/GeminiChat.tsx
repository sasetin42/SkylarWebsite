
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, BrainCircuit, Paperclip, Image as ImageIcon, ChevronRight, ArrowRight } from 'lucide-react';
import { chatWithGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const SUGGESTIONS = [
  "Find GWO courses",
  "How do I get a USI?",
  "Campus locations",
  "Contact support"
];

const parseInlineMarkdown = (text: string) => {
  const parts: (string | React.ReactNode)[] = [];
  let remaining = text;
  let keyIdx = 0;
  
  while (remaining.length > 0) {
    const boldIndex = remaining.indexOf('**');
    const linkIndex = remaining.indexOf('[');
    
    if (boldIndex === -1 && linkIndex === -1) {
      parts.push(remaining);
      break;
    }
    
    if (boldIndex !== -1 && (linkIndex === -1 || boldIndex < linkIndex)) {
      if (boldIndex > 0) {
        parts.push(remaining.substring(0, boldIndex));
      }
      const endBold = remaining.indexOf('**', boldIndex + 2);
      if (endBold !== -1) {
        const boldText = remaining.substring(boldIndex + 2, endBold);
        parts.push(<strong key={`b-${keyIdx++}`} className="font-bold text-secondary">{boldText}</strong>);
        remaining = remaining.substring(endBold + 2);
      } else {
        parts.push(remaining.substring(boldIndex));
        break;
      }
    } else {
      if (linkIndex > 0) {
        parts.push(remaining.substring(0, linkIndex));
      }
      const endLabel = remaining.indexOf(']', linkIndex);
      const startUrl = remaining.indexOf('(', endLabel);
      const endUrl = remaining.indexOf(')', startUrl);
      
      if (endLabel !== -1 && startUrl === endLabel + 1 && endUrl !== -1) {
        const label = remaining.substring(linkIndex + 1, endLabel);
        const url = remaining.substring(startUrl + 1, endUrl);
        parts.push(
          <a 
            key={`a-${keyIdx++}`} 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:text-accent font-semibold underline transition-colors"
          >
            {label}
          </a>
        );
        remaining = remaining.substring(endUrl + 1);
      } else {
        parts.push(remaining.substring(linkIndex));
        break;
      }
    }
  }
  return parts.length > 0 ? parts : text;
};

const formatMessage = (text: string) => {
  if (!text) return null;
  const paragraphs = text.split(/\n\n+/);

  return paragraphs.map((para, pIdx) => {
    const trimmed = para.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('###')) {
      const headerText = trimmed.replace(/^###\s*/, '').trim();
      let icon = '💡';
      let iconBg = 'bg-yellow-500/10 text-yellow-600';
      if (headerText.toLowerCase().includes('usi')) {
        icon = '🆔';
        iconBg = 'bg-blue-500/10 text-blue-600';
      } else if (headerText.toLowerCase().includes('course') || headerText.toLowerCase().includes('safety') || headerText.toLowerCase().includes('train')) {
        icon = '🛡️';
        iconBg = 'bg-emerald-500/10 text-emerald-600';
      } else if (headerText.toLowerCase().includes('location') || headerText.toLowerCase().includes('campus') || headerText.toLowerCase().includes('campuses')) {
        icon = '📍';
        iconBg = 'bg-red-500/10 text-red-600';
      } else if (headerText.toLowerCase().includes('refund') || headerText.toLowerCase().includes('cancel') || headerText.toLowerCase().includes('policy')) {
        icon = '💳';
        iconBg = 'bg-amber-500/10 text-amber-600';
      }

      return (
        <div key={pIdx} className="mb-4 mt-2">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm shrink-0 ${iconBg}`}>
              {icon}
            </span>
            <h3 className="font-extrabold text-secondary text-sm md:text-[15px]">{headerText}</h3>
          </div>
          <div className="w-12 h-1 bg-accent/60 rounded-full" />
        </div>
      );
    }

    if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
      const lines = trimmed.split('\n');
      return (
        <ul key={pIdx} className="space-y-3.5 my-3 pl-1 bg-gray-50/70 p-3 rounded-2xl border border-gray-200/60 shadow-sm">
          {lines.map((line, lIdx) => {
            const cleanLine = line.trim();
            if (!cleanLine) return null;
            const lineText = cleanLine.replace(/^[-*\d.]+\s*/, '').trim();
            const parsedContent = parseInlineMarkdown(lineText);

            let bulletIcon: string | React.ReactNode = '•';
            let iconClass = 'text-primary font-extrabold shrink-0 mt-1';
            
            if (cleanLine.match(/^\d+\./)) {
              const num = cleanLine.match(/^\d+/)?.[0];
              bulletIcon = num || '•';
              iconClass = 'flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold shrink-0 mt-0.5';
            } else if (lineText.toLowerCase().includes('duration:')) {
              bulletIcon = '⏱️';
              iconClass = 'shrink-0 text-sm';
            } else if (lineText.toLowerCase().includes('cost:') || lineText.toLowerCase().includes('price:')) {
              bulletIcon = '💰';
              iconClass = 'shrink-0 text-sm';
            } else if (lineText.toLowerCase().includes('prereq') || lineText.toLowerCase().includes('must possess')) {
              bulletIcon = '📋';
              iconClass = 'shrink-0 text-sm';
            } else if (lineText.toLowerCase().includes('email:') || lineText.toLowerCase().includes('phone:') || lineText.toLowerCase().includes('address:')) {
              bulletIcon = '📞';
              iconClass = 'shrink-0 text-sm';
            } else if (lineText.toLowerCase().startsWith('hello') || lineText.toLowerCase().startsWith('hi')) {
              bulletIcon = '👋';
              iconClass = 'shrink-0 text-sm';
            } else if (lineText.startsWith('📑')) {
              bulletIcon = '📑';
              iconClass = 'shrink-0 text-sm';
            } else if (lineText.startsWith('🆔')) {
              bulletIcon = '🆔';
              iconClass = 'shrink-0 text-sm';
            } else if (lineText.startsWith('📍')) {
              bulletIcon = '📍';
              iconClass = 'shrink-0 text-sm';
            } else if (lineText.startsWith('💳')) {
              bulletIcon = '💳';
              iconClass = 'shrink-0 text-sm';
            }

            let finalContent = parsedContent;
            if (typeof bulletIcon === 'string' && ['📑', '🆔', '📍', '💳', '👋'].includes(bulletIcon)) {
              if (lineText.startsWith(bulletIcon)) {
                finalContent = parseInlineMarkdown(lineText.substring(bulletIcon.length).trim());
              }
            }

            return (
              <li key={lIdx} className="flex items-start gap-2.5 text-xs md:text-sm text-gray-700 leading-relaxed">
                {typeof bulletIcon === 'string' && bulletIcon === '•' ? (
                  <span className={iconClass}>•</span>
                ) : /^\d+$/.test(bulletIcon as string) ? (
                  <span className={iconClass}>{bulletIcon}</span>
                ) : (
                  <span className="shrink-0 mt-0.5 text-sm">{bulletIcon}</span>
                )}
                <span className="flex-1">{finalContent}</span>
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <p key={pIdx} className="text-xs md:text-sm text-gray-700 leading-relaxed mb-3">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });
};

export const GeminiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am the Skylar AI Assistant. I can help you find courses, check policies, or answer safety questions.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [useReasoning, setUseReasoning] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() && !attachedImage) return;

    // Create user message object
    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    const currentImage = attachedImage; // Capture current state
    
    // Optimistic UI update
    setMessages(prev => [...prev, { ...userMsg, text: textToSend || (currentImage ? "Analyze this image" : "") }]);
    
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);

    // Filter history for API (text only for context history to avoid complexity in this demo)
    const history = messages.map(m => ({ role: m.role, text: m.text }));
    
    // Call Service with Image if present
    const responseText = await chatWithGemini(
        history, 
        userMsg.text || "Please analyze this image.", 
        useReasoning, 
        currentImage || undefined
    );
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 group ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-gradient-to-r from-accent to-yellow-400 hover:scale-110'
        }`}
      >
        {isOpen ? <X className="text-white w-6 h-6" /> : <MessageCircle className="text-secondary w-8 h-8 group-hover:animate-pulse" />}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-24 w-[85vw] md:w-[410px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl z-50 overflow-hidden transition-all duration-300 transform origin-bottom-right flex flex-col border border-white/20 ${
        isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8 pointer-events-none'
      }`} style={{ maxHeight: 'calc(100vh - 110px)', height: '560px' }}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary to-primary p-5 flex justify-between items-center text-white shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/10">
                <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
                <h3 className="font-heading font-bold text-base leading-none">Skylar Assistant</h3>
                <span className="text-[10px] text-gray-300 flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Online
                </span>
            </div>
          </div>
          <button 
            onClick={() => setUseReasoning(!useReasoning)}
            className={`relative z-10 flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${useReasoning ? 'bg-accent text-secondary border-accent shadow-glow' : 'border-white/20 text-gray-300 hover:bg-white/10'}`}
            title="Enable Deep Thinking for complex queries"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            {useReasoning ? 'Thinking ON' : 'Thinking OFF'}
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm transition-all duration-300 animate-fade-in-up ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-primary to-blue-700 text-white rounded-br-sm' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
              }`}>
                {msg.role === 'user' ? msg.text : formatMessage(msg.text)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                <span className="text-xs text-gray-400 font-medium mr-2">Typing</span>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions Chips (Only show if not loading and input is empty) */}
        {!isLoading && messages.length < 4 && (
            <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
                {SUGGESTIONS.map((sug, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleSend(sug)}
                        className="whitespace-nowrap text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 px-3 py-1.5 rounded-full transition-colors"
                    >
                        {sug}
                    </button>
                ))}
            </div>
        )}

        {/* Preview Attachment */}
        {attachedImage && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-3 animate-fade-in">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                    <img src={attachedImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center">
                        <X className="text-white w-4 h-4" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-700 truncate">Image Attached</p>
                    <button onClick={() => setAttachedImage(null)} className="text-[10px] text-red-500 hover:underline">Remove</button>
                </div>
            </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-white relative z-20">
          <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-full px-2 py-2 shadow-inner focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                title="Upload image for analysis"
            >
                <Paperclip className="w-5 h-5" />
            </button>
            <input 
                id="chat-image-upload"
                name="chatImage"
                autocomplete="off"
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
            />
            
            <input
              id="chat-input"
              name="chatInput"
              autocomplete="off"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={attachedImage ? "Ask about this image..." : "Type a message..."}
              className="flex-1 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-sm placeholder-gray-400 text-gray-800"
            />
            
            <button 
              onClick={() => handleSend()}
              disabled={isLoading || (!input.trim() && !attachedImage)}
              className="p-2 bg-gradient-to-r from-primary to-blue-700 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all transform active:scale-95"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center mt-2">
             <a href="https://sasewebsolutions.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-400 hover:text-primary transition-colors">Powered by SaSe Web Solution AI</a>
          </div>
        </div>
      </div>
    </>
  );
};
