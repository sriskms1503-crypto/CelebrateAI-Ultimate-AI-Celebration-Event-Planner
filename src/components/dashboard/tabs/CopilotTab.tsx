import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
  Loader2,
} from 'lucide-react';
import { EventPlan } from '../../../types/event';

interface CopilotTabProps {
  event: EventPlan;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const CopilotTab: React.FC<CopilotTabProps> = ({ event }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      text: `Hello! I am your CelebrateAI Copilot. I have context on "${event.name}" (${event.eventType} in ${event.city} for ${event.guestCount} guests). How can I assist with your planning today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    `Reduce ${event.name} budget by 15%`,
    'Prepare rain and power backup contingency plan',
    'Write traditional Telugu & English invitation text',
    'Vegetarian catering menu recommendations',
    'Create an hour-by-hour photo shoot shot list',
    'Suggest eco-friendly zero-waste return gifts',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          eventContext: {
            name: event.name,
            eventType: event.eventType,
            date: event.date,
            city: event.city,
            venue: event.venue,
            guestCount: event.guestCount,
            budget: event.budget,
            currency: event.currency,
            styleTheme: event.styleTheme,
          },
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        "I'm here to assist! We can refine your timeline, adjust budgets, or review vendor deliverables.";

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorReply: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I encountered an issue connecting to the planning server. Please check your network or try asking again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2D5C8] shadow-sm flex flex-col h-[700px] overflow-hidden">
      {/* Top Header */}
      <div className="p-4 px-6 border-b border-[#E8DDD2] flex items-center justify-between bg-[#FAF8F5]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4A154B] to-[#7C3AED] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2D1236]">Celebration Copilot</h3>
            <p className="text-[11px] text-[#7A6A7E]">
              Connected to context of "{event.name}" · Gemini 3.8 Flash
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'm-init',
                sender: 'assistant',
                text: `Conversation restarted. How can I help you organize "${event.name}"?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="text-xs text-[#7A6A7E] hover:text-purple-700 flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Chat</span>
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 px-6 bg-purple-50/50 border-b border-purple-100 flex items-center gap-2 overflow-x-auto text-xs">
        <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="text-[11px] font-semibold text-purple-900 shrink-0">Try asking:</span>
        {suggestedPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-[#5A4A5E] hover:text-purple-900 hover:border-purple-300 transition-colors whitespace-nowrap cursor-pointer text-[11px] disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 max-w-2xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                msg.sender === 'user'
                  ? 'bg-purple-700 text-white'
                  : 'bg-gradient-to-tr from-[#4A154B] to-[#7C3AED] text-amber-200'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`group relative rounded-2xl p-4 text-xs leading-relaxed shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-purple-700 text-white'
                  : 'bg-[#FAF8F5] text-[#2D1236] border border-[#E8DDD2]'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-black/5 text-[10px] text-[#7A6A7E]">
                <span>{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-xs text-[#7A6A7E] pl-2">
            <Loader2 className="w-4 h-4 animate-spin text-purple-700" />
            <span>CelebrateAI Copilot is formulating recommendations...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-4 border-t border-[#E8DDD2] bg-[#FAF8F5]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Ask Copilot about food, budget adjustments, decor, or schedules for ${event.name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
