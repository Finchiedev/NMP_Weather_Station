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
        <h1>Weather sensor data</h1>
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

interface WeatherAPI {
  clouds?: number;
  feels_like?: number;
  humidity?: number;
  temp?: number;
}

class WeatherComponent extends React.Component<WeatherAPI> {
  state: WeatherAPI = {
    clouds: 0,
    feels_like: 0,
    humidity: 0,
    temp: 0,
  };

  componentDidMount(): void {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
    
      const req = await window.fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`);
      const resp = JSON.parse(await req.text());
      
      this.setState(resp.current);
      console.log(resp.current);
    });
  }

  render(): JSX.Element {
    return(
      <div>
        <h1>Weather API data</h1>
        Clouds: {this.state.clouds}
        <br />
        Feels like: {this.state.feels_like}
        <br />
        Humidity: {this.state.humidity}
        <br />
        Temperature: {this.state.temp}
      </div>
    )
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
      <WeatherComponent />
    </div>
  );
}

export default App;
