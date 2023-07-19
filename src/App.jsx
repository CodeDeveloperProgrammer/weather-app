import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";

console.log(import.meta.env.VITE_API_KEY);
const API_WEATHER = "http://api.weatherapi.com/v1/current.json?key=8677e700743849a4b49153709231807&lang=es&q=";

export default function App() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    condition: "",
    conditionText: "",
    icon: "",
    temperature: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({
      error: false,
      message: "",
    });
    try {
      let citySearch = e.target.city.value.trim();
      
      if (!citySearch) throw { message: "Por favor ingrese una ciudad" };
      const res = await fetch(`${API_WEATHER}${city}`);
      const data = await res.json();
      if (data.error) throw { message: data.error.message };
      setWeather({
        city: data.location.name,
        country: data.location.country,
        condition: data.current.condition.code,
        conditionText: data.current.condition.text,
        icon: data.current.condition.icon,
        temperature: data.current.temp_c,
      });
    } catch (error) {
      console.log(error);
      setError({
        error: true,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="xs" sx={{ mt: 2 }}> 
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Weather App
        </Typography>

        <Box // Formulario
          sx={{ display: "grid", gap: 2 }}
          component="form"
          onSubmit={onSubmit}
        >
          <TextField // Campo de texto
            id="city"
            label="Ciudad o país"
            variant="outlined"
            size="small"
            fullWidth
            required
            value={city.toUpperCase()}
            onChange={(e) => setCity(e.target.value)}
            error={error.error}
            helperText={error.message}
            placeholder="Riobamba o Ecuador"
          />

          <LoadingButton // Boton de carga
            variant="contained"
            type="submit"
            loading={loading}
            loadingPosition="start"
            loadingIndicator="Cargando..."
          >
            Consultar
          </LoadingButton>
        </Box>

        {weather.city && (// Si hay una ciudad, mostrar el resultado
          <Box sx={{ display: "grid", gap: 2, mt: 2, textAlign: "center" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              {weather.city}, {weather.country}
            </Typography>
            <Box
              sx={{ margin: "0 auto"}}
              component="img"
              src={weather.icon}
              alt={weather.conditionText}
              width={100}
            />
            <Typography variant="h5" component="h2" gutterBottom>
              {weather.temperature} °C
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              {weather.conditionText}
            </Typography>
          </Box>
        )}
        <Typography textAlign="center" sx={{ mt: 2, fontSize: "10px" }}>
          Powered by:{" "}
          <a href="https://www.weatherapi.com/" title="Weather API">
            WeatherAPI.com
          </a>
        </Typography>
      </Container>
    </>
  );
}
