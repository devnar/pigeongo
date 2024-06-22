function search() {
    const radioButtons = document.querySelectorAll('input[type="radio"][name="engine"]');
    const query = document.getElementById('query').value;

    let selectedEngine = null;
    radioButtons.forEach(radio => {
        if (radio.checked) {
            selectedEngine = radio.value;
            if (selectedEngine == "duckduckgo") {
                const url = "https://" + selectedEngine + ".com/?q=" + query;
                window.open(url);
            } else if (selectedEngine == "yahoo") {
                const url = "https://search." + selectedEngine + ".com/search?q=" + query;
                window.open(url);
            } else {
                const url = "https://" + selectedEngine + ".com/search?q=" + query;
                window.open(url);
            }
        }
    });
}

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
        document.querySelector(`label[for="${this.value}"]`).classList.add('badge-check');
    }
  });
});