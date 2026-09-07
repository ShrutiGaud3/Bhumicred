import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Sparkles, Send, Bot, User as UserIcon, ShieldAlert } from 'lucide-react';

export const BhumitraAiWidget = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Namaste${user?.name ? ' ' + user.name : ''}! I am **Bhumitra AI**, your sovereign agricultural and policy intelligence assistant. How can I assist you with your land, soil health, insurance quotes, or government schemes today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const role = user?.role || 'FARMER';

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = `Under your active role (${role}), I can assist you with understanding your land boundary regulations, tree insurance coverage terms, and soil laboratory analysis parameters. Please note: I provide read-only guidance and will never modify balances or bypass admin verification.`;

      if (input.toLowerCase().includes('insurance')) {
        aiResponseText = `Tree Insurance on BHUMICRED covers individual trees (like Teak, Sandalwood, Mango, Coconut) or plantation blocks against storm, fire, disease, and drought. Premium calculation depends on age, species count, and geo-location.`;
      } else if (input.toLowerCase().includes('soil')) {
        aiResponseText = `Soil testing requests allow an authorized laboratory partner to collect samples at your geo-tagged land. The standard panel tests for pH, Nitrogen (N), Phosphorus (P), Potassium (K), and Organic Carbon.`;
      } else if (input.toLowerCase().includes('scheme')) {
        aiResponseText = `Available schemes include PM Kisan Samman Nidhi, Paramparagat Krishi Vikas Yojana, and State Green Nursery Subsidies. You can apply directly through the Government Schemes module.`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponseText }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bhumitra AI Assistant"
      subtitle="Role-aware sovereign agricultural intelligence"
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col h-[480px]">
        {/* Role security badge */}
        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-800 mb-3">
          <div className="flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active Context: {role}</span>
          </div>
          <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-200">
            RBAC Enforced
          </span>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto space-y-4 p-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-100 text-emerald-900'
                }`}
              >
                {msg.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-800 text-white rounded-tr-none'
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <Sparkles className="w-3 h-3 animate-spin text-emerald-600" />
              Bhumitra AI is thinking...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask Bhumitra AI about ${role === 'FARMER' ? 'lands, insurance, soil...' : 'jurisdiction, campaigns...'}`}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
          />
          <Button type="submit" variant="primary" size="sm" icon={Send}>
            Ask
          </Button>
        </form>
      </div>
    </Modal>
  );
};
