import React, { useState, useEffect, useRef, useCallback  } from 'react';
import { List, Input, Avatar } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import Bot from './image/bot.png';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const addBotMessage = async (text) => {
    const newMessages = [...messages, { text, user: false }];
    setMessages(newMessages);

    await new Promise(resolve => setTimeout(resolve, 1000)); 

    // try {
    //   const response = await axios.post('http://localhost:5000/api/message', { message: text });
    //   const botResponse = response.data.fulfillmentText;
    //   setMessages([...newMessages, { text: botResponse, user: false }]);
    // } catch (error) {
    //   console.error('Error sending message to backend:', error);
    // }
  };


  useEffect(() => {
    addBotMessage("Hi, what can I help you with?");
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { text: input, user: true }];
    setMessages(newMessages);
    setInput('');

    setTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    try {
      const response = await axios.post('https://customer-chatbot-mauve.vercel.app/api/message', { message: input });
      const botResponse = response.data.fulfillmentText;
      setMessages([...newMessages, { text: botResponse, user: false }]);
    } catch (error) {
      console.error('Error sending message to backend:', error);
    } finally {
      setTyping(false);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='parent'>
      <div className="chatbot-container">
        <div className="chat-header">
          <div className="avatar-container">
            <img src={Bot} alt="Bot" className="bot-avatar" />
            <span className="online-indicator"></span>
          </div>
          <div className="chat-header-info">
            <h2>Customer Assistance Bot</h2>
            <p>Online</p>
          </div>
        </div>
        <div className="messages-container">
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={item => (
              <List.Item className={item.user ? 'user' : 'bot'}>
                <List.Item.Meta
                  avatar={<Avatar icon={item.user ? <UserOutlined /> : <img src={Bot} alt="Bot" />} />}
                  title={null}
                  description={item.text}
                />
              </List.Item>
            )}
          />
          <div ref={messagesEndRef}></div>
          {typing && (
<div className='typer'>
<Avatar icon={<img src={Bot} alt="Bot" />} />
<div className="typing-indicator">
<div className="typing-balls"></div>
<div className="typing-balls"></div>
<div className="typing-balls"></div>
</div>
</div>
)}
        </div>
        
        <div className="input-container">
          <Input.Search
            placeholder="Type your message here"
            enterButton={<SendOutlined />}
            size="large"
            value={input}
            onChange={e => setInput(e.target.value)}
            onSearch={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
