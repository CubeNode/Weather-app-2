
const apiKey = "cc54b62bfc57c805e8f7d1ee12965eb4";

const background = document.getElementsByTagName('body');
const userLocation = document.getElementById('location');
const temp = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const minMax = document.getElementById('min-max');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');
const d = document.getElementById('date');
const time = document.getElementById('time');
const dayOfWeek = document.getElementById('day');

//Get todays date
const days = [['Sunday', 'Sun'], ['Monday', 'Mon'], ['Tuesday', 'Tue'], ['Wednesday', 'Wed'], ['Thursday', 'Thu'], ['Friday', 'Fri'], ['Saturday', 'Sat']];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const date = new Date();
let day = date.getDate();
let dayNum = date.getDay();
let month = date.getMonth();
let curDate = `${months[month]}, ${day}`;
let curDay = `${days[dayNum][0]}`

//Get time
let hours = date.getHours();
let mins = date.getMinutes();
let curTime = `${hours > 12 ? hours % 12 : hours}:${mins < 10 ? `0${mins}` : mins}${hours >= 12 ? 'pm' : 'am'}`;

const url1 = `https://api.openweathermap.org/data/2.5/weather?`;
const locationURL2 = `http://api.openweathermap.org/geo/1.0/reverse?`;

dayOfWeek.textContent = `${curDay} ${curDate}, ${curTime}`;
//d.textContent = curDate;
//time.textContent = curTime;

function getLocationAndFetch(url) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            
            fetch(`${url}lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`)
                .then(res => res.json())
                .then(data => {
                    let unix_timestamp_sunrise = data.sys.sunrise;
                    let unix_timestamp_sunset = data.sys.sunset;
                    let sunrise = new Date(unix_timestamp_sunrise * 1000);
                    let sunset = new Date(unix_timestamp_sunset * 1000);
                    let sunset_hour = sunset.getHours();
                    let sunrise_hour = sunrise.getHours();

                    if(hours > sunset_hour) {
                        document.body.style.backgroundImage = "url('images/night-lake.jpg')";
                        document.getElementById('icon').src = "icons/moon.svg";
                    } else if(hours > sunrise_hour) {
                        document.body.style.backgroundImage = "url('images/sunny-waters.jpg')";
                        document.getElementById('icon').src = "icons/sunny.svg";
                    }

                    console.log(hours + ':' + sunset_hour);
                    userLocation.textContent = `${data.name}, ${data.sys.country}`;
                    temp.textContent = `${Math.floor(data.main.temp)}°F`;
                    humidity.textContent = `Humidity: ${data.main.humidity}%`;
                    minMax.textContent = `Min-Max: ${Math.floor(data.main.temp_min)}°F/${Math.floor(data.main.temp_max)}°F`;
                    wind.textContent = `Wind: ${data.wind.speed} mph`;
                    pressure.textContent = `Pressure: ${data.main.pressure}`;
                    description.textContent = `Feels like ${Math.floor(data.main.feels_like)}°F, ${data.weather[0].description}`;
                    console.log(data);
                })
                .catch(error => console.error("Error:", error));
        },
        (error) => {
            console.error("Error getting location", error);
        });
      } else { 
        console.log("Geolocation is not supported by this browser.");
    }
}

getLocationAndFetch(url1);