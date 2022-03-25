import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dgram from 'dgram';
import { Buffer } from 'buffer';
import HttpError from './httpError';
import { generate_weather_data } from '../../emulator/src/weather_output';

const HOSTNAME = 'localhost';
const API_PORT = 8000;

let api_enable = true;

// Generic interface for valid weather data
// All of these types are optional to include case where sensor reading is invalid
interface WeatherData {
  ambient_temp?: number,
  track_temp?: number,
  humidity?: number,
  precipitation?: number,
  wind_speed?: number,
  wind_dir?: number,
}

function validate_within_range(min: number, max: number, value: number | null | Function) {
  if (typeof value === "function" || value == null || !value) {
    console.warn(`Discarding value due to bad type! Got: ${value}`);
    return false;
  }

  if (min <= value && value <= max) {
    return true;
  } else {
    console.warn(`Discarding value due to out-of-range! Got: ${value}`);
    return false;
  }
}

// ------------------------ Data validation ------------------------
function get_weather_data() {
  let generated_data: Object = generate_weather_data();
  let weather_data: WeatherData = {};

  // Validate the known items and nullify everything else
  // This could be made a lot smarter by analyzing previous values
  for (const key in generated_data) {
    const sensor_reading = generated_data[key as keyof Object];
    let is_valid: boolean = false;

    switch(key) {
      case "ambient_temp": {
        is_valid = validate_within_range(0, 50, sensor_reading);
        break;
      }
      case "track_temp": {
        is_valid = validate_within_range(0, 100, sensor_reading);
        break;
      }
      case "humidity": {
        is_valid = validate_within_range(0, 1, sensor_reading);
        break;
      }
      case "precipitation": {
        is_valid = validate_within_range(0, 200, sensor_reading);
        break;
      }
      case "wind_speed": {
        is_valid = validate_within_range(0, 100, sensor_reading);
        break;
      }
      case "wind_dir": {
        is_valid = validate_within_range(0, 360, sensor_reading);
        break;
      }
      default: {
        throw new RangeError(`Unknown weather reading! Got ${key}`);
      }
    }

    if (is_valid && typeof sensor_reading === 'number') {
      const valid_reading: number = sensor_reading;
      weather_data[key as keyof WeatherData] = valid_reading;
    }
  }

  return weather_data;
}

// ----------------- Set up the express API server -----------------
const api = express();

api.use(cors());
api.use(express.json({ limit: '50mb' }));
api.use(express.urlencoded({ extended: true, limit: '50mb' }));
api.use((req, res, next) => {
  console.log(req.originalUrl);
  next();
});

api.get('/', async (req, res) => {
  const val = await Promise.resolve('Hello World!');
  res.send(val);
});

api.get('/api/start', async (req, res) => {
  api_enable = true;
});

api.get('/api/stop', async (req, res) => {
  api_enable = false;
});

// Error handler
api.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).send(err.message);
});

// ----------------- Set up a UDP socket -----------------
const socket = dgram.createSocket('udp4');

async function sendData(): Promise<void> {
  if (api_enable) {
    const data = Buffer.from(JSON.stringify(get_weather_data()));
    socket.send(data, 0, data.length, 5000, 'localhost', (err) => {});
  }
}

socket.bind(4500);

// -------------------------------------------------------

setInterval(sendData, 1000);

api.listen(API_PORT, () =>
  console.log(
    `Weather Station API server running at http://${HOSTNAME}:${API_PORT}`,
  ),
);

export { WeatherData };