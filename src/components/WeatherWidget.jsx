import { useEffect, useState } from "react";
import { weatherService } from "../services/weatherService";

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeather() {
      try {
        const { lat, lon } = await weatherService.getLocation();
        const data = await weatherService.getCurrentWeather(lat, lon);
        setWeather(data);
      } catch (err) {
        setError(err.message || "Unable to load weather.");
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, []);

  if (loading) {
    return (
      <div className="weather-widget action-panel mb-4">
        <p className="text-muted mb-0">Loading weather...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget action-panel mb-4">
        <p className="text-muted mb-0">{error}</p>
      </div>
    );
  }

  return (
    <div className="weather-widget action-panel mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h2 className="h5 mb-1">Weather in {weather.location}</h2>
          <p className="text-muted small mb-0 text-capitalize">{weather.description}</p>
        </div>
        {weather.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            width="60"
            height="60"
          />
        )}
      </div>
      <div className="row g-2 mt-2">
        <div className="col-4">
          <span className="small text-muted d-block">Temp</span>
          <strong>{weather.temp}°C</strong>
        </div>
        <div className="col-4">
          <span className="small text-muted d-block">Feels like</span>
          <strong>{weather.feels_like}°C</strong>
        </div>
        <div className="col-4">
          <span className="small text-muted d-block">Humidity</span>
          <strong>{weather.humidity}%</strong>
        </div>
      </div>
    </div>
  );
}

export default WeatherWidget;