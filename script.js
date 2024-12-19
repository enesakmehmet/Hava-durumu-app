// OpenWeatherMap API anahtarınızı buraya ekleyin
const apiKey = "94c1a74b50a14268c993e8fe2a4c059c";

// Hava durumu verilerini alma
function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        alert("Lütfen bir şehir adı girin.");
        return;
    }

    // Şehir koordinatlarını almak için API çağrısı
    const cityApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=tr`;

    fetch(cityApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Şehir bulunamadı.");
            }
            return response.json();
        })
        .then(data => {
            const { coord } = data;
            displayCurrentWeather(data); // Mevcut hava durumunu göster
            get8DayForecast(coord.lat, coord.lon); // 8 günlük tahmin verilerini al
        })
        .catch(error => {
            document.getElementById("weatherResult").innerHTML = `<p>${error.message}</p>`;
        });
}

// 8 günlük tahmini almak için One Call API kullanma
function get8DayForecast(lat, lon) {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=metric&lang=tr`;

    fetch(forecastApiUrl)
        .then(response => response.json())
        .then(data => {
            display8DayForecast(data.daily); // 8 günlük tahmini göster
        })
        .catch(error => {
            console.error("8 günlük tahmin alınamadı:", error);
        });
}

// Mevcut hava durumunu gösterme
function displayCurrentWeather(data) {
    const { name, main, weather } = data;
    const temp = main.temp.toFixed(1);
    const description = weather[0].description;
    const icon = weather[0].icon;

    document.getElementById("weatherResult").innerHTML = `
        <h2>${name}</h2>
        <p>Sıcaklık: ${temp}°C</p>
        <p>Hava Durumu: ${description}</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
        <div id="forecast"></div> <!-- 8 günlük tahmin burada gösterilecek -->
    `;
}

// 8 günlük tahmin verilerini gösterme
function display8DayForecast(dailyForecast) {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = ""; // Eski tahminleri temizle

    dailyForecast.slice(1, 9).forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString("tr-TR", {
            weekday: "long",
            day: "numeric",
            month: "long"
        });
        const tempDay = day.temp.day.toFixed(1);
        const tempNight = day.temp.night.toFixed(1);
        const icon = day.weather[0].icon;
        const description = day.weather[0].description;

        // Tahmin kartını oluştur
        const forecastDay = document.createElement("div");
        forecastDay.classList.add("forecast-day");
        forecastDay.innerHTML = `
            <h3>${date}</h3>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
            <p>Gündüz: ${tempDay}°C</p>
            <p>Gece: ${tempNight}°C</p>
            <p>${description}</p>
        `;

        forecastContainer.appendChild(forecastDay);
    });
}
