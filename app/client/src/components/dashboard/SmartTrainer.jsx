import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { smarttrainerService } from '../../services/api';
import '../../styles/SmartTrainer.css';

const SmartTrainer = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'trainer',
      text: '¡Hola! Soy SmartTrainer, tu entrenador personal de IA. Estoy aquí para ayudarte con entrenamientos, nutrición, lesiones y bienestar. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && !isLoading) {
      const userMessage = {
        id: messages.length + 1,
        type: 'user',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, userMessage]);
      const currentMessage = newMessage;
      setNewMessage('');
      setIsLoading(true);
      
      try {
        // Debug: verificar token
        const token = localStorage.getItem('authToken');
        console.log('🔑 Token existe:', !!token);
        console.log('🔑 Token:', token ? token.substring(0, 20) + '...' : 'No token');

        // Preparar historial de conversación para la IA
        const conversationHistory = messages.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'model',
          content: msg.text
        }));

        console.log('📤 Enviando mensaje a SmartTrainer:', currentMessage);

        // Enviar mensaje a la IA
        const response = await smarttrainerService.chat(currentMessage, conversationHistory);
        
        console.log('📥 Respuesta recibida:', response);
        
        if (response.success) {
          const trainerResponse = {
            id: messages.length + 2,
            type: 'trainer',
            text: response.message,
            timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, trainerResponse]);
        } else {
          const errorMessage = {
            id: messages.length + 2,
            type: 'trainer',
            text: 'Lo siento, tuve un problema al procesar tu mensaje. Por favor, intenta de nuevo.',
            timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      } catch (error) {
        console.error('❌ Error al enviar mensaje:', error);
        console.error('❌ Error completo:', JSON.stringify(error, null, 2));
        console.error('❌ Error.response:', error.response);
        console.error('❌ Error.message:', error.message);
        
        const errorMessage = {
          id: messages.length + 2,
          type: 'trainer',
          text: `Error: ${error.message || 'Error de conexión'}. Verifica tu conexión a internet e intenta de nuevo.`,
          timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="smart-trainer-container">
      {/* Header del chat */}
      <div className="chat-header">
        <div className="trainer-info">
          <div className="trainer-avatar">
            <span>🤖</span>
          </div>
          <div className="trainer-details">
            <h3>Smart Trainer</h3>
            <span className="status">En línea</span>
          </div>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              <div className="message-text">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
              <span className="message-time">{message.timestamp}</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message trainer">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input para nuevo mensaje */}
      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="message-input"
          />
          <button type="submit" className="send-button" disabled={!newMessage.trim()}>
            <span>📤</span>
          </button>
        </div>
      </form>

      {/* Sugerencias rápidas */}
      <div className="quick-suggestions">
        <p>Sugerencias:</p>
        <div className="suggestions-list">
          <button className="suggestion-btn" onClick={() => setNewMessage('¿Puedes crear una rutina para principiantes?')}>
            Rutina principiante
          </button>
          <button className="suggestion-btn" onClick={() => setNewMessage('Necesito consejos de nutrición')}>
            Consejos nutrición
          </button>
          <button className="suggestion-btn" onClick={() => setNewMessage('¿Cómo puedo mejorar mi resistencia?')}>
            Mejorar resistencia
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartTrainer;