import React from 'react';
// import logo from './logo.svg';
import './App.css';

interface WeatherData {
  ambient_temp?: number,
  track_temp?: number,
  humidity?: number,
  precipitation?: number,
  wind_speed?: number,
  wind_dir?: number,
}

class SensorReadings extends React.Component<WeatherData> {
  state: WeatherData = {
    ambient_temp: 0,
    track_temp: 0,
    humidity: 0,
    precipitation: 0,
    wind_speed: 0,
    wind_dir: 0,
  };

  componentDidMount(): void {
    const client = new WebSocket('ws://localhost:5001');
    client.onmessage = async (msg): Promise<void> => {
      const message = await msg.data.text();
      this.setState(JSON.parse(message));
    };
  }

  render(): JSX.Element {
    return (
      <div>
        Ambient temperature: {this.state.ambient_temp}
        <br />
        Track temperature: {this.state.track_temp}
        <br />
        Humidity: {this.state.humidity}
        <br />
        Precipitation: {this.state.precipitation}
        <br />
        Wind speed: {this.state.wind_speed}
        <br />
        Wind direction: {this.state.wind_dir}
        <br />
      </div>
    );
  }
}

function apiToggle(): void {
  let button = document.getElementById('apiToggle');
  if (!button) {
    return;
  }

  if (button?.innerHTML == 'Start') {
    window.fetch('http://localhost:8000/api/start');
    button.innerHTML = 'Stop';
  } else {
    window.fetch('http://localhost:8000/api/stop');
    button.innerHTML = 'Start';
  }
}

function App(): JSX.Element {
  return (
    <div>
      <SensorReadings />
      <div>
        <button id='apiToggle' onClick={apiToggle}>Start</button>
      </div>
    </div>
  );
}

export default App;
