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

const country = localStorage.getItem('selectedCity');
const apiUrl = "https://api.weatherapi.com/v1/current.json?q=" + country + "&key=ec7b315cf3694b0f801133734242206";

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

function openNav() {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
}

function saveSelectedCity() {
    const selectElement = document.getElementById("country");
    const selectedCity = selectElement.options[selectElement.selectedIndex].value;
    localStorage.setItem('selectedCity', selectedCity);
}

function loadSelectedCity() {
    const selectedCity = localStorage.getItem('selectedCity');
    if (selectedCity) {
        const selectElement = document.getElementById("country");
        for (let i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].value === selectedCity) {
                selectElement.options[i].selected = true;
                break;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    loadSelectedCity();
});

document.getElementById("country").addEventListener('change', saveSelectedCity);