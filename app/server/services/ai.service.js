import { Ollama } from 'ollama';

// Configuración de Ollama (corre localmente)
const ollama = new Ollama();

// Prompt del sistema para el SmartTrainer
const SYSTEM_PROMPT = `Eres un entrenador personal profesional y experto en fitness llamado "SmartTrainer". 
Tu objetivo es ayudar a los usuarios con sus entrenamientos, nutrición, lesiones y bienestar general.

CARACTERÍSTICAS:
- Eres motivador, amigable y profesional
- Proporcionas consejos basados en ciencia y experiencia
- Te adaptas al nivel del usuario (principiante, intermedio, avanzado)
- Siempre priorizas la seguridad y la técnica correcta
- Das respuestas claras, concisas y accionables

ÁREAS DE EXPERTISE:
1. Rutinas de entrenamiento (fuerza, cardio, flexibilidad)
2. Nutrición y planes alimenticios
3. Prevención y recuperación de lesiones
4. Técnica de ejercicios
5. Motivación y establecimiento de metas
6. Bienestar general (sueño, estrés, hidratación)

FORMATO DE RESPUESTAS:
- Usa bullet points cuando sea apropiado
- Sé específico con números (series, repeticiones, pesos, calorías)
- Si recomiendas ejercicios, explica cómo hacerlos correctamente
- Pregunta por el nivel y objetivos del usuario cuando sea relevante

IMPORTANTE:
- Si el usuario pregunta sobre lesiones graves, recomienda consultar a un médico
- No diagnostiques condiciones médicas
- Responde en español siempre
- Sé breve pero informativo (máximo 3-4 párrafos por respuesta)`;

export const AIService = {
  /**
   * Enviar mensaje al chatbot y obtener respuesta
   */
  async chat(userMessage, conversationHistory = []) {
    try {
      console.log(' Usuario pregunta:', userMessage);

      // Construir el historial de mensajes
      const messages = [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content: userMessage
        }
      ];

      // Enviar mensaje a Ollama
      const response = await ollama.chat({
        model: 'llama3.2',
        messages: messages,
        stream: false
      });

      const responseText = response.message.content;
      console.log(' SmartTrainer responde:', responseText);

      return {
        success: true,
        message: responseText,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(' Error en AI Service:', error.message);
      return {
        success: false,
        error: 'Error al procesar tu pregunta. Asegúrate de que Ollama esté corriendo.',
        details: error.message
      };
    }
  },

  /**
   * Generar rutina de entrenamiento personalizada
   */
  async generateWorkoutPlan(userProfile) {
    try {
      const { level, goals, daysPerWeek, availableEquipment } = userProfile;

      const prompt = `Genera una rutina de entrenamiento personalizada con estos datos:
- Nivel: ${level || 'intermedio'}
- Objetivo: ${goals || 'fitness general'}
- Días por semana: ${daysPerWeek || 3}
- Equipamiento disponible: ${availableEquipment || 'gimnasio completo'}

Formato de respuesta:
- Nombre de la rutina
- Días de entrenamiento (especifica qué hacer cada día)
- Ejercicios con series y repeticiones
- Consejos importantes

Sé específico y práctico.`;

      const response = await ollama.chat({
        model: 'llama3.2',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        stream: false
      });

      const plan = response.message.content;

      return {
        success: true,
        plan,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(' Error generando rutina:', error.message);
      return {
        success: false,
        error: 'Error al generar la rutina'
      };
    }
  },

  /**
   * Generar plan nutricional
   */
  async generateNutritionPlan(userProfile) {
    try {
      const { weight, height, age, goal, dietType } = userProfile;

      const prompt = `Genera un plan nutricional básico con estos datos:
- Peso: ${weight}kg
- Altura: ${height}cm
- Edad: ${age} años
- Objetivo: ${goal || 'mantenimiento'}
- Tipo de dieta: ${dietType || 'balanceada'}

Incluye:
- Calorías diarias recomendadas
- Distribución de macronutrientes (proteínas, carbohidratos, grasas)
- 3 ejemplos de comidas
- Consejos nutricionales

Sé específico con números y porciones.`;

      const response = await ollama.chat({
        model: 'llama3.2',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        stream: false
      });

      const plan = response.message.content;

      return {
        success: true,
        plan,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(' Error generando plan nutricional:', error.message);
      return {
        success: false,
        error: 'Error al generar el plan nutricional'
      };
    }
  },

  /**
   * Analizar ejercicio y dar consejos de técnica
   */
  async analyzeExercise(exerciseName) {
    try {
      const prompt = `Explica cómo realizar correctamente el ejercicio: ${exerciseName}

Incluye:
1. Músculos trabajados
2. Pasos de ejecución (técnica correcta)
3. Errores comunes a evitar
4. Variaciones (principiante a avanzado)
5. Consejos de seguridad

Sé claro y educativo.`;

      const response = await ollama.chat({
        model: 'llama3.2',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        stream: false
      });

      const analysis = response.message.content;

      return {
        success: true,
        analysis,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(' Error analizando ejercicio:', error.message);
      return {
        success: false,
        error: 'Error al analizar el ejercicio'
      };
    }
  },

  /**
   * Consejos para lesiones (información general, no diagnóstico)
   */
  async getInjuryAdvice(injuryType, description) {
    try {
      const prompt = `Un usuario tiene molestias relacionadas con: ${injuryType}
Descripción: ${description}

Proporciona:
1. Información general sobre este tipo de molestia
2. Ejercicios de recuperación suaves (si aplica)
3. Qué evitar durante la recuperación
4. Cuándo es importante consultar a un médico

IMPORTANTE: Recuerda que no eres médico, solo das información general. Siempre recomienda consultar profesionales de salud para diagnósticos reales.`;

      const response = await ollama.chat({
        model: 'llama3.2',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        stream: false
      });

      const advice = response.message.content;

      return {
        success: true,
        advice,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(' Error obteniendo consejos:', error.message);
      return {
        success: false,
        error: 'Error al obtener consejos'
      };
    }
  }
};
