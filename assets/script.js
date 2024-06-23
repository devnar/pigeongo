document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const radioButtons = document.querySelectorAll('input[type="radio"][name="engine"]');
    const query = document.getElementById('query').value;
    let selectedEngine = null;

    for (let radio of radioButtons) {
        if (radio.checked) {
            selectedEngine = radio.value;
            break;
        }
    }

    if (selectedEngine) {
        const url = selectedEngine + query;
        window.location.href = url;
    } else {
        window.location.href = "search.html?#gsc.q=" + query + "&#gsc.tab=0";
    }
});

const apiUrl = "https://api.weatherapi.com/v1/current.json?q=Istanbul&key=ec7b315cf3694b0f801133734242206";

fetch(apiUrl)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then((data) => {
        const temperatureIcon = data.current.condition.icon;
        document.getElementById("weather-icon").src = temperatureIcon;
        const temperatureCelsius = data.current.temp_c;
        document.getElementById("weather-temp").innerText = ` ${temperatureCelsius} °C`;
    })
    .catch((error) => {
        console.error("Hava durumu bilgisi alınamadı", error);
        document.getElementById("weather-temp").textContent = "Hava durumu bilgisi alınamadı";
});

const radioButtons = document.querySelectorAll('input[type="radio"][name="engine"]');
const radioLabels = document.querySelectorAll('input[type="radio"][name="engine"] + label');

radioButtons.forEach(radio => {
  radio.addEventListener('change', function() {
    radioLabels.forEach(rl => {
      rl.classList.remove('badge-check');
    });

    if (this.checked) {
        document.querySelector(`label[for="${this.id}"]`).classList.add('badge-check');
    }
  });
});