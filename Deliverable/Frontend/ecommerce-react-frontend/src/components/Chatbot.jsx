import React, { useState, useRef, useEffect } from 'react';

const initialMessages = [
  { sender: 'bot', text: 'Hello! How can I help you today?' }
];

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);  

  // Scroll to the bottom when the messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const getBotResponse = async (inputMessage) => {
    const trimmed = inputMessage.toLowerCase();
  
    // Check for hot deal queries
    if (trimmed.includes('hot deal')) {
      const vehicles = await fetchHotDeals();
      return vehicles;  // Return the fetched hot deals to the bot
    }
    if (trimmed.includes('model')) {
      // Extract model name from input (assuming the model is the second word after "model")
      const modelName = inputMessage.split('model')[1].trim();
      if (modelName) {
        const vehicles = await fetchVehiclesByModel(modelName);
        return vehicles;  // Return the fetched vehicles for that model
      } else {
        return "Please specify a model after 'model'. For example, 'model corolla'.";
      }
    }
  
    // Other predefined responses
    if (trimmed.includes('hi') || trimmed.includes('hello') ) {
      return "Hi! What can I do for you?";
    }

    if (trimmed.includes('loan')) {
      return "Our loan calculator provides estimated monthly payments. Check out the 'Try Loan Calculator' button on the Checkout page.";
    }
  
    if (trimmed.includes('compare')) {
      return "You can compare vehicles by adding them to your compare list and then visiting the Compare page.";
    }
  
    if (trimmed.includes('customization')) {
      return "On each vehicle's detail page, you can choose from various customization options.";
    }
  
    if (trimmed.includes('review')) {
      return "After signing in, you can leave reviews on any vehicle's detail page.";
    }
  
    if (trimmed.includes('contact')) {
      return "Feel free to visit our Contact Us page for further inquiries.";
    }
  
    // General response if no match found
      return `
      <div style="margin-bottom: 20px;">
      
        <div> I'm here to help! Could you please rephrase your question to mention any of the following?</div>
        
        <div> - Hot deal</div>
        <div> - Model [e.g. model mustang] </div>
        <div> - Loan </div>
        <div> - Compare </div>
        <div> - Customization </div>
        <div> - Review  </div>
        <div> - Contact </div>
      </div>
    `;
  };
  

  // Function to fetch hot deals from the backend API
  const fetchHotDeals = async () => {
    try {
      const response = await fetch('http://localhost:3000/vehicles/search-vehicles?isHotDeal=true');
      if (!response.ok) {
        throw new Error('Failed to fetch hot deals');
      }
      const data = await response.json();
  
      if (data.length === 0) {
        return 'No hot deals available at the moment.';
      } else {
        const formattedVehicleList = formatVehicleList(data); // Use the format function here
        return `Here are the hot deals:\n${formattedVehicleList}`;
      }
    } catch (error) {
      console.error('Error fetching hot deals:', error.message);
      return 'Sorry, there was an error fetching hot deals.';
    }
  };
  
  // Fetch vehicles by brand or model from the backend API
  const fetchVehiclesByModel = async (query) => {
    try {
      const response = await fetch(`http://localhost:3000/vehicles/search-vehicles?model=${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      const data = await response.json();

      if (data.length === 0) {
        return `No vehicles found for ${query}.`;
      } else {
        const formattedVehicleList = formatVehicleList(data); // Use the format function here
        return `Here are the vehicles for ${query}:\n${formattedVehicleList}`;
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error.message);
      return 'Sorry, there was an error fetching vehicles.';
    }
  };

  // Format the list of vehicles to show in the chatbot
  const formatVehicleList = (vehicles) => {
    return vehicles.map(vehicle => {
      return `
        <div style="margin-bottom: 20px;">
          <div><strong>Model:</strong> ${vehicle.brand} ${vehicle.model} (${vehicle.modelYear})</div>
          <div><strong>Price:</strong> $${vehicle.price.toLocaleString()}</div>
          <div><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} km</div>
          <div><strong>Link:</strong> <a href="/vehicle/${vehicle.vid}" target="_blank">View Vehicle</a></div>
        </div>
      `;
    }).join('');
  };
  

  const handleSend = async () => {
    if (input.trim() === '') return;
    const userMessage = { sender: 'user', text: input };
    const botMessage = { sender: 'bot', text: await getBotResponse(input) }; // Wait for bot response
    setMessages(prev => [...prev, userMessage, botMessage]);
    setInput('');
  };

  if (!isOpen) {
    return (
      <div className="chatbot-minimized" onClick={() => setIsOpen(true)}>
        Need Help?
      </div>
    );
  }

  return (
    <div className="chatbot-panel">
      <div className="chatbot-header" onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }}>
        <h3>Need Help?</h3>
      </div>
      <div className="chatbot-messages" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {/* Check if the message is from the bot and render HTML if so */}
            {msg.sender === 'bot' ? (
              <div dangerouslySetInnerHTML={{ __html: msg.text }} />
            ) : (
              msg.text // Display user messages as plain text
            )}
          </div>
        ))}
        {/* This div ensures the chat scrolls to the bottom */}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <input 
          type="text"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if(e.key === 'Enter') handleSend(); }}
        />
        <button className="button" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatBot;
