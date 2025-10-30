import { useState } from 'react';
import { RiRobot2Line } from 'react-icons/ri';
import { IoArrowUpCircle } from 'react-icons/io5';
import { smarttrainerService } from '../../services/api';
import '../../styles/SmartTrainer.css';

const SmartTrainer = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        const response = await smarttrainerService.chat(currentMessage, messages);
        
        const trainerResponse = {
          id: messages.length + 2,
          type: 'trainer',
          text: response.message || 'Lo siento, no pude procesar tu mensaje.',
          timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, trainerResponse]);
      } catch (error) {
        console.error('Error al obtener respuesta del trainer:', error);
        const errorMessage = {
          id: messages.length + 2,
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
              <p>{message.text}</p>
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
            <IoArrowUpCircle size={28} />
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