// import React from 'react';
// import logo from './logo.svg';
import './App.css';

const client = new WebSocket('ws://localhost:5001');
client.onmessage = async (msg): Promise<void> => {
  const message = await msg.data.text();
  let data = JSON.parse(message);
  console.log(data);
};

function App(): JSX.Element {
  return (
    <p>Hello there</p>
  );
}

export default App;
