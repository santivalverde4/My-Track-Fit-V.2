import { useState, useEffect } from 'react';
import { RiRobot2Line } from 'react-icons/ri';
import { IoArrowUpCircle } from 'react-icons/io5';
import { FaRegTrashAlt } from "react-icons/fa";
import ReactMarkdown from 'react-markdown';
import { smarttrainerService } from '../../services/api';
import '../../styles/SmartTrainer.css';

const CHAT_STORAGE_KEY = 'smarttrainer_conversation';

const SmartTrainer = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Cargar conversación guardada al montar el componente
  useEffect(() => {
    const savedConversation = localStorage.getItem(CHAT_STORAGE_KEY);
    if (savedConversation) {
      try {
        const parsedMessages = JSON.parse(savedConversation);
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error cargando conversación guardada:', error);
        localStorage.removeItem(CHAT_STORAGE_KEY);
      }
    }
  }, []);

  // Guardar conversación cada vez que cambian los mensajes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && !isLoading) {
      const userMessage = {
        id: Date.now(), // Usar timestamp para IDs únicos
        type: 'user',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, userMessage]);
      const currentMessage = newMessage;
      setNewMessage('');
      setIsLoading(true);
      
      try {
        const response = await smarttrainerService.chat(currentMessage, messages);
        
        const trainerResponse = {
          id: Date.now() + 1,
          type: 'trainer',
          text: response.message || 'Lo siento, no pude procesar tu mensaje.',
          timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, trainerResponse]);
      } catch (error) {
        console.error('Error al obtener respuesta del trainer:', error);
        const errorMessage = {
          id: Date.now() + 1,
          type: 'trainer',
          text: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo.',
          timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Función para limpiar la conversación
  const handleClearConversation = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar toda la conversación?')) {
      setMessages([]);
      localStorage.removeItem(CHAT_STORAGE_KEY);
    }
  };

  return (
    <div className="smart-trainer-container">
      {/* Header del chat */}
      <div className="chat-header">
        <div className="trainer-info">
          <div className="trainer-avatar">
            <RiRobot2Line size={32} />
          </div>
          <div className="trainer-details">
            <h3>Smart Trainer</h3>
            <span className="status">En línea</span>
          </div>
        </div>
        {messages.length > 0 && (
          <button 
            className="clear-chat-btn"
            onClick={handleClearConversation}
            title="Limpiar conversación"
            aria-label="Limpiar conversación"
          >
            <FaRegTrashAlt />
          </button>
        )}
      </div>

      {/* Área de mensajes */}
      <div 
        className="chat-messages"
        role="log"
        aria-live="polite"
        aria-label="Historial de conversación con Smart Trainer"
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.type}`}
            role="article"
            aria-label={`${message.type === 'user' ? 'Tú' : 'Smart Trainer'} a las ${message.timestamp}`}
          >
            <div className="message-content">
              {message.type === 'trainer' ? (
                <div className="markdown-content">
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
              ) : (
                <p>{message.text}</p>
              )}
              <span className="message-time">{message.timestamp}</span>
            </div>
          </div>
        ))}
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
            aria-label="Escribir mensaje para Smart Trainer"
          />
          <button 
            type="submit" 
            className="send-button" 
            disabled={!newMessage.trim() || isLoading}
            aria-label="Enviar mensaje"
          >
            <IoArrowUpCircle size={48} />
          </button>
        </div>
      </form>

      {/* Sugerencias rápidas */}
      <div className="quick-suggestions">
        <p>Sugerencias:</p>
        <div className="suggestions-list">
          <button 
            className="suggestion-btn" 
            onClick={() => setNewMessage('¿Puedes crear una rutina para principiantes?')}
            aria-label="Usar sugerencia: Rutina para principiantes"
          >
            Rutina principiante
          </button>
          <button 
            className="suggestion-btn" 
            onClick={() => setNewMessage('Necesito consejos de nutrición')}
            aria-label="Usar sugerencia: Consejos de nutrición"
          >
            Consejos nutrición
          </button>
          <button 
            className="suggestion-btn" 
            onClick={() => setNewMessage('¿Cómo puedo mejorar mi resistencia?')}
            aria-label="Usar sugerencia: Mejorar resistencia"
          >
            Mejorar resistencia
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartTrainer;