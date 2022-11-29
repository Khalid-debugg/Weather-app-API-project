// Personal API Key for OpenWeatherMap API
const apiKey = "66d9db564ed146735a1198431b88e416&units=imperial";
/* Global Variables */
const genButton = document.getElementById("generate");

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

genButton.addEventListener('click',async ()=>{

    const temperature = await getTemperature();
    await sendEntryToServer(temperature,d);
    updateUI()
});


async function getTemperature(){

    const zipCode = document.getElementById("zip").value;
    if(!zipCode){
        alert("Please enter zipcode")
        return
    }
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}`;
    try{

    const rawResponse = await fetch (apiUrl);
    const response = await rawResponse.json();
    const temperature = response["main"]["temp"];

    return temperature

    }catch(err){
        console.log("error", error);
    }
}


async function sendEntryToServer(temperature,d){

    const feelings = document.getElementById("feelings").value;
    if(!feelings){
        alert("Please enter your feelings")
        return
    }
    await fetch("/postData",{
        method:"POST",
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({"date": d, "temp":temperature, "content":feelings})
    });
}

async function updateUI (){
    const request = await fetch('/getData');
    try {

    const allData = await request.json()
    if(!allData.zipCode && !allData.temp){
        return
    }
    console.log(allData)
    
    document.getElementById('temp').innerHTML = Math.round(allData.temp)+ ' degrees';
    document.getElementById('content').innerHTML = allData.content;
    document.getElementById("date").innerHTML =allData.date;
    }catch(error) {
    console.log("error", error);
    }
}
