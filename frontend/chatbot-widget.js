/**
 * Customer Support Chatbot Widget
 * Embed this script in any website to add chatbot functionality
 * 
 * Usage:
 * <script src="https://your-domain.com/chatbot-widget.js"></script>
 * <script>
 *   ChatbotWidget.init({
 *     apiUrl: 'https://api.your-domain.com',
 *     position: 'bottom-right', // or 'bottom-left', 'top-right', 'top-left'
 *     theme: 'light', // or 'dark'
 *     title: 'Support Chat'
 *   });
 * </script>
 */

(function() {
  const ChatbotWidget = {
    config: {
      apiUrl: 'http://localhost:8000',
      position: 'bottom-right',
      theme: 'light',
      title: 'Customer Support',
      autoOpen: false,
      animationDuration: 300
    },

    state: {
      isOpen: false,
      messages: [],
      conversationId: null,
      token: null
    },

    init(userConfig = {}) {
      this.config = { ...this.config, ...userConfig };
      this.createStyles();
      this.createHTML();
      this.attachEventListeners();
      this.loadConversation();
      console.log('Chatbot Widget initialized');
    },

    createStyles() {
      const style = document.createElement('style');
      style.textContent = `
        /* Chatbot Widget Styles */
        .chatbot-widget-container {
          position: fixed;
          ${this.config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
          ${this.config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          z-index: 9999;
        }

        .chatbot-widget-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .chatbot-widget-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .chatbot-widget-button.open {
          display: none;
        }

        .chatbot-widget-window {
          position: absolute;
          ${this.config.position.includes('bottom') ? 'bottom: 80px;' : 'top: 80px;'}
          ${this.config.position.includes('right') ? 'right: 0;' : 'left: 0;'}
          width: 380px;
          height: 500px;
          background: ${this.config.theme === 'dark' ? '#1e1e1e' : '#ffffff'};
          border-radius: 12px;
          box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
          display: none;
          flex-direction: column;
          overflow: hidden;
          animation: slideIn 0.3s ease-out;
        }

        .chatbot-widget-window.open {
          display: flex;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chatbot-widget-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chatbot-widget-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .chatbot-widget-close {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chatbot-widget-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: ${this.config.theme === 'dark' ? '#2d2d2d' : '#f5f5f5'};
        }

        .chatbot-widget-message {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }

        .chatbot-widget-message.user {
          justify-content: flex-end;
        }

        .chatbot-widget-message-content {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 12px;
          word-wrap: break-word;
          line-height: 1.4;
          font-size: 14px;
        }

        .chatbot-widget-message.bot .chatbot-widget-message-content {
          background: ${this.config.theme === 'dark' ? '#3d3d3d' : '#e0e0e0'};
          color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#333'};
        }

        .chatbot-widget-message.user .chatbot-widget-message-content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .chatbot-widget-input-area {
          padding: 15px;
          border-top: 1px solid ${this.config.theme === 'dark' ? '#3d3d3d' : '#e0e0e0'};
          display: flex;
          gap: 10px;
          background: ${this.config.theme === 'dark' ? '#1e1e1e' : '#ffffff'};
        }

        .chatbot-widget-input {
          flex: 1;
          border: 1px solid ${this.config.theme === 'dark' ? '#3d3d3d' : '#d0d0d0'};
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 14px;
          background: ${this.config.theme === 'dark' ? '#2d2d2d' : '#f9f9f9'};
          color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#333'};
          font-family: inherit;
          resize: none;
        }

        .chatbot-widget-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .chatbot-widget-send {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          padding: 10px 15px;
          cursor: pointer;
          font-size: 18px;
          transition: transform 0.2s;
        }

        .chatbot-widget-send:hover {
          transform: scale(1.05);
        }

        .chatbot-widget-send:active {
          transform: scale(0.95);
        }

        .chatbot-widget-loading {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .chatbot-widget-loading span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #667eea;
          animation: bounce 1.4s infinite;
        }

        .chatbot-widget-loading span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .chatbot-widget-loading span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* Responsive */
        @media (max-width: 480px) {
          .chatbot-widget-window {
            width: 100vw;
            height: 100vh;
            max-width: 100%;
            max-height: 100%;
            border-radius: 0;
            ${this.config.position.includes('right') ? 'right: 0;' : 'left: 0;'}
            ${this.config.position.includes('bottom') ? 'bottom: 0;' : 'top: 0;'}
          }
        }
      `;
      document.head.appendChild(style);
    },

    createHTML() {
      const container = document.createElement('div');
      container.className = 'chatbot-widget-container';
      container.innerHTML = `
        <button class="chatbot-widget-button" id="chatbot-toggle" title="Open Chat">
          💬
        </button>
        <div class="chatbot-widget-window" id="chatbot-window">
          <div class="chatbot-widget-header">
            <h3>${this.config.title}</h3>
            <button class="chatbot-widget-close" id="chatbot-close">×</button>
          </div>
          <div class="chatbot-widget-messages" id="chatbot-messages"></div>
          <div class="chatbot-widget-input-area">
            <textarea 
              class="chatbot-widget-input" 
              id="chatbot-input" 
              placeholder="Type a message..."
              rows="1"
            ></textarea>
            <button class="chatbot-widget-send" id="chatbot-send">📤</button>
          </div>
        </div>
      `;
      document.body.appendChild(container);
    },

    attachEventListeners() {
      const toggleBtn = document.getElementById('chatbot-toggle');
      const closeBtn = document.getElementById('chatbot-close');
      const sendBtn = document.getElementById('chatbot-send');
      const input = document.getElementById('chatbot-input');
      const window = document.getElementById('chatbot-window');

      toggleBtn.addEventListener('click', () => this.toggleWindow());
      closeBtn.addEventListener('click', () => this.closeWindow());
      sendBtn.addEventListener('click', () => this.sendMessage());
      
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

      // Auto-expand textarea
      input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 100) + 'px';
      });
    },

    toggleWindow() {
      const window = document.getElementById('chatbot-window');
      const button = document.getElementById('chatbot-toggle');
      
      if (this.state.isOpen) {
        this.closeWindow();
      } else {
        this.openWindow();
      }
    },

    openWindow() {
      const window = document.getElementById('chatbot-window');
      const button = document.getElementById('chatbot-toggle');
      
      window.classList.add('open');
      button.classList.add('open');
      this.state.isOpen = true;
      
      // Focus input
      setTimeout(() => {
        document.getElementById('chatbot-input').focus();
      }, 100);
    },

    closeWindow() {
      const window = document.getElementById('chatbot-window');
      const button = document.getElementById('chatbot-toggle');
      
      window.classList.remove('open');
      button.classList.remove('open');
      this.state.isOpen = false;
    },

    async sendMessage() {
      const input = document.getElementById('chatbot-input');
      const message = input.value.trim();

      if (!message) return;

      // Add user message to UI
      this.addMessageToUI(message, 'user');
      input.value = '';
      input.style.height = 'auto';

      // Show loading indicator
      this.showLoadingIndicator();

      try {
        // Send to backend
        const response = await fetch(`${this.config.apiUrl}/api/chat/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.state.token && { 'Authorization': `Bearer ${this.state.token}` })
          },
          body: JSON.stringify({
            message: message,
            conversation_id: this.state.conversationId
          })
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const data = await response.json();
        
        // Remove loading indicator
        this.removeLoadingIndicator();

        // Add bot response
        this.addMessageToUI(data.response, 'bot');

        // Save conversation ID
        if (data.conversation_id) {
          this.state.conversationId = data.conversation_id;
          localStorage.setItem('chatbot_conversation_id', data.conversation_id);
        }
      } catch (error) {
        console.error('Error:', error);
        this.removeLoadingIndicator();
        this.addMessageToUI('Sorry, I encountered an error. Please try again.', 'bot');
      }
    },

    addMessageToUI(text, sender) {
      const messagesContainer = document.getElementById('chatbot-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = `chatbot-widget-message ${sender}`;
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'chatbot-widget-message-content';
      contentDiv.textContent = text;
      
      messageDiv.appendChild(contentDiv);
      messagesContainer.appendChild(messageDiv);
      
      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    showLoadingIndicator() {
      const messagesContainer = document.getElementById('chatbot-messages');
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'chatbot-widget-message bot';
      loadingDiv.id = 'chatbot-loading';
      loadingDiv.innerHTML = `
        <div class="chatbot-widget-loading">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;
      messagesContainer.appendChild(loadingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    removeLoadingIndicator() {
      const loading = document.getElementById('chatbot-loading');
      if (loading) loading.remove();
    },

    loadConversation() {
      // Load previous conversation if it exists
      const conversationId = localStorage.getItem('chatbot_conversation_id');
      if (conversationId) {
        this.state.conversationId = conversationId;
      }
    }
  };

  // Expose to global scope
  window.ChatbotWidget = ChatbotWidget;

  // Auto-init if data attributes are present
  if (document.currentScript?.dataset.apiUrl) {
    const config = {};
    Array.from(document.currentScript.dataset).forEach(([key, value]) => {
      config[key] = value;
    });
    ChatbotWidget.init(config);
  }
})();
