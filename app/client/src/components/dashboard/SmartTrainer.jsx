import { useState } from 'react';
import '../../styles/SmartTrainer.css';

const SmartTrainer = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'user',
      text: 'Hola',
      timestamp: '10:30'
    },
    {
      id: 2,
      type: 'trainer',
      text: '¡Hola! Soy Smart Trainer, tu entrenador personal inteligente. Estoy aquí para ayudarte a alcanzar tus objetivos de fitness y bienestar. Puedo asistirte con rutinas de ejercicio, consejos de nutrición, seguimiento de progreso y motivación diaria. ¿En qué te gustaría que te ayude hoy?',
      timestamp: '10:30'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        type: 'user',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, userMessage]);
      setNewMessage('');
      
      // Simular respuesta del trainer después de un breve delay
      setTimeout(() => {
        const trainerResponse = {
          id: messages.length + 2,
          type: 'trainer',
          text: getTrainerResponse(newMessage),
          timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, trainerResponse]);
      }, 1000);
    }
  };

  const getTrainerResponse = (userMessage) => {
    const responses = [
      'Excelente pregunta. Te puedo ayudar con eso. ¿Te gustaría que creemos un plan personalizado?',
      'Perfecto. Basándome en tu perfil, te recomiendo comenzar con ejercicios de intensidad moderada.',
      'Me parece una gran idea. ¿Cuántos días a la semana puedes dedicar al entrenamiento?',
      'Entiendo perfectamente. Vamos paso a paso para que logres tus objetivos de forma segura.',
      'Esa es una consulta muy común. Te voy a dar algunos consejos prácticos que puedes implementar hoy mismo.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
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