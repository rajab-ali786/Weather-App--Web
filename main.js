let searchBtn=document.getElementById("searchBtn");
let mainIcon=document.getElementById("mainIcon");
mainIcon.src="duplicateWeather.jpg";
let loading_spinner=document.getElementById("loading-spinner");

//============================------SEARCH SECTION==================================//
async function detaUpdate(event){
let inputSearch=document.getElementById("cityName").value;
if(inputSearch ===""){
  popupAlert("Please enter a city name to search for weather details.");
  return;
}
try{
  loading_spinner.classList.remove("hidden");
let weatherAppMain= await fetch(`https:api.openweathermap.org/data/2.5/forecast?q=${inputSearch},IND&APPID=614f0d47601958392433c668871c7833&units=metric`);
let weatherappJSON= await weatherAppMain.json();

if(weatherappJSON.cod==="404"){
   popupAlert(`
      We couldn't find weather info for this location.Please check the spelling and try again.`);
   return;
}
forcastWeather(weatherappJSON);
updateDOM(weatherappJSON);
hourlyDATAweather(weatherappJSON);
}
catch(error){
  popupAlert("Please check your network connection and try again.");
}
loading_spinner.classList.add("hidden")
}
// use location + navigator geolocation
let useLocation=document.getElementById("useLocation");
 async function useMyLocation(){
   if(!navigator.geolocation){
     popupAlert("Geolocation is not supported by your browser");
     return;
   }
  navigator.geolocation.getCurrentPosition(async(position)=>{
    let lat=position.coords.latitude;
    let lon=position.coords.longitude;
    try{
      loading_spinner.classList.remove("hidden")
    let weatherAppMain= await fetch(`https:api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=614f0d47601958392433c668871c7833&units=metric`);
    let weatherJSON_data= await weatherAppMain.json();
     if(weatherJSON_data.cod==="400"){
       popupAlert("Please allow location access in your browser settings, or search for your city manually");
       return;
     }
forcastWeather(weatherJSON_data);
updateDOM(weatherJSON_data);
hourlyDATAweather(weatherJSON_data);
}
catch(error){
  popupAlert("Unable to retrieve your current location. Please check your device's GPS or network connection");
}
loading_spinner.classList.add("hidden");
},
(error)=>{
  popupAlert("Location Access Denied. Please allow permission in browser settings, or search manually");
}
  );
}
//DOU BUTTON CLICK EVENT SEARCH AND GPS ----------------------------------
searchBtn.addEventListener("click",detaUpdate);
useLocation.addEventListener("click",useMyLocation)

///--------work---place **********
const tempUpdate = (data, img) => {
  let iconSvg=data.icon;
  let iconURL=`https://openweathermap.org/img/wn/${iconSvg}@2x.png`;
  img.src=iconURL;
}
//********************************UPDATE MAIN FORECAST DASHBOARD-----------------------//
const updateDOM =(API)=>{
  document.getElementById("city").innerText =API.city.name;
document.getElementById("temp").innerText = Math.round(API.list[0].main.temp) + "°";
let weatherType = API.list[0].weather[0];
document.getElementById("typeWeather").innerText = weatherType.main;
document.getElementById("feels-like").innerText = Math.round(API.list[0].main.feels_like);
document.getElementById("weatherHumidity").innerHTML = API.list[0].main.humidity + "%";
document.getElementById("weatherWind").innerHTML = Math.round(API.list[0].wind.speed);
document.getElementById("pressure").innerHTML = API.list[0].main.pressure;

tempUpdate(weatherType,mainIcon);
} 

//************************HOURLY-FORECAST----------------------------------------------
const hourlyDATAweather=(hourly)=>{
  let hourly_container=document.getElementById("hourly-forcast");
 hourly_container.innerHTML="";
  hourly.list.slice(1,11).forEach((data,index)=>{
    let hour_random_txt=new Date(data.dt_txt);
    const hour_time=hour_random_txt.toLocaleTimeString([],{
      hour:'numeric',
      hour12:true
    });
    let now_DATA=(index===0) ? "Now":hour_time;
  let temp_hourly=Math.round(data.main.temp)+ "°";
  let passIcon=data.weather[0].icon;
  let iconUrl=`https://openweathermap.org/img/wn/${passIcon}@2x.png`;
  let class_actived=(index===0)? "hour active":"hour";
  hourly_container.innerHTML+=`
  <div class="${class_actived}">
  <p>${now_DATA}</p>
          <img src="${iconUrl}">
          <strong>${temp_hourly}</strong</div>`;
  });
}
//*************-*********POPUP ALERT----------------*********************//
const popupAlert=(text)=>{
  let weatherPopup=document.getElementById("weatherPopup");
  weatherPopup.classList.add("show");
  let domDisplay=document.getElementById("display-msg");
  domDisplay.innerHTML=`<p>${text}</p>`;
  let popupOkay=document.getElementById("popupOkay");
  popupOkay.addEventListener("click",()=>{weatherPopup.classList.remove("show")});
  let closePopup=document.getElementById("closePopup");
  closePopup.addEventListener("click",()=>{weatherPopup.classList.remove("show")});
}
//****************************************************************************************

//-------------------5 DAY FORECAST------********************************************
const forcastWeather=(apiData)=>{
loading_spinner.classList.add("hidden");

  let weeks=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let forecastShow=document.getElementById("forecast-show");
  forecastShow.innerHTML="";
  for(let index=0;index<apiData.list.length;index+=8){
  let data=apiData.list[index];
  let passIcon=data.weather[0].icon;
  let iconUrl=`https://openweathermap.org/img/wn/${passIcon}@2x.png`;
  
      let dateObj=new Date(data.dt_txt);
      let daysObj=weeks[dateObj.getDay()];
      let cardDay=daysObj;
      let cardClass=(index===0) ? "forecast-card today":"forecast-card";
      if(index===0) cardDay="Today";
      if(index===8) cardDay="Tomorrow";
      if(index>8) cardDay=daysObj;
      
      forecastShow.innerHTML+=`
      <div class="${cardClass}">
          <div>
            <strong>${cardDay}</strong>
            <small>${data.weather[0].main}</small>
          </div>
          <img src="${iconUrl}">
          <div class="temps">
            <strong>${Math.round(data.main.temp_max)}°</strong>
            <small>${Math.round(data.main.temp_min)}°</small>
          </div>
        </div>
      `;
  }
}
/////----THE END ALL FUNCTIONS ***********************************************************