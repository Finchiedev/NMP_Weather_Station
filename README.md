# Weather Telemetry: Ultimate Mega Jank Edition

*Always wondered what would happen when you leave a backend developer in charge of developing a website? Well, here you go!*

## Features
- Basic sensor range validation
- Able to store the last known good value of sensor
- Displays sensor readings to the screen
- Can start/stop the readings

## How to use?
First make sure there is a file `ui/.env` with the contents:
```
REACT_APP_WEATHER_API_KEY=key
```

You will need to start 3 processes. First, `cd` into the following directories:
```
server
ui
websockets
```
And run `npm start` in each (assuming you have run `npm install` already). And that's it! :)

## UI
https://www.figma.com/file/9A2h016VyHS3fuCHzpXLnI/Weather-Telemetry-(Redback)?node-id=0%3A1