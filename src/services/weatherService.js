const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const weatherService = {
  async getCurrentWeather(lat, lon) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Unable to fetch weather data.");
    }
    const data = await response.json();
    return {
      location: data.name,
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0]?.description,
      icon: data.weather[0]?.icon,
      wind_speed: data.wind?.speed,
      rain_chance: data.clouds?.all
    };
  },

  getLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ lat: position.coords.latitude, lon: position.coords.longitude }),
        () => reject(new Error("Location access denied. Enable location to see weather.")),
        { timeout: 10000 }
      );
    });
  }
};