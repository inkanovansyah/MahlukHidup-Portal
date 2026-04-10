import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'qwen';
  timestamp: Date;
}

// Respon otomatis dari "Qwen"
const qwenResponses: Record<string, string> = {
  'halo': 'Halo! 👋 Senang bertemu denganmu! Ada yang bisa saya bantu hari ini?',
  'hai': 'Hai! 😊 Apa kabar? Saya siap membantu kamu!',
  'apa kabar': 'Saya baik-baik saja, terima kasih sudah bertanya! 😄 Bagaimana dengan kamu?',
  'siapa kamu': 'Saya adalah asisten virtual yang dibuat untuk menemani ngobrol kamu! 🤖✨',
  'terima kasih': 'Sama-sama! 😊 Senang bisa membantu!',
  'makasih': 'Sama-sama! Jangan ragu untuk tanya apa saja ya! 🙌',
  'default': 'Menarik! 🤔 Ceritakan lebih lanjut, saya di sini untuk mendengar dan membantu kamu! 😊',
};

function getQwenResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  for (const [key, response] of Object.entries(qwenResponses)) {
    if (key !== 'default' && lowerMessage.includes(key)) {
      return response;
    }
  }
  
  return qwenResponses['default'];
}

export default function VoiceChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Cek browser support
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    // Welcome message
    const welcomeMsg: Message = {
      id: Date.now().toString(),
      text: 'Halo! 👋 Saya Qwen Assistant. Kamu bisa ngobrol dengan mengetik atau menggunakan tombol mikrofon di bawah. Ada yang bisa saya bantu?',
      sender: 'qwen',
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);
    speakText(welcomeMsg.text);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Coba cari voice Indonesia
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(
        (v) => v.lang.startsWith('id') || v.lang.startsWith('ms')
      );
      if (idVoice) {
        utterance.voice = idVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // User message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Qwen response
    setTimeout(() => {
      const responseText = getQwenResponse(messageText);
      const qwenMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'qwen',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, qwenMsg]);
      speakText(responseText);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Browser Tidak Mendukung
          </h2>
          <p className="text-gray-600">
            Maaf, browser kamu tidak mendukung Web Speech API. Coba gunakan Chrome atau Edge untuk pengalaman terbaik.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              Q
            </div>
            {isSpeaking && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800">
              Qwen Voice Assistant 🎙️
            </h1>
            <p className="text-sm text-gray-500">
              {isSpeaking ? '🔊 Sedang berbicara...' : '✅ Siap ngobrol'}
            </p>
          </div>
          <button
            onClick={() => window.speechSynthesis.cancel()}
            disabled={!isSpeaking}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ⏹️ Stop
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Messages */}
          <div className="h-[60vh] overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.sender === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-400'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isListening && (
              <div className="flex justify-center">
                <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full animate-pulse">
                  🎤 Mendengarkan...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pesan atau klik mikrofon..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium"
              >
                Kirim
              </button>
              <button
                onClick={isListening ? stopListening : startListening}
                className={`px-4 py-3 rounded-xl transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={isListening ? 'Stop mendengarkan' : 'Mulai mendengarkan'}
              >
                {isListening ? '🎙️' : '🎤'}
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>💡 Tip: Klik 🎤 untuk berbicara menggunakan suara</p>
        </div>
      </div>
    </div>
  );
}
