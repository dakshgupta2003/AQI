const errorLabel = document.querySelector("label[for='error-msg']")
const latInp = document.querySelector("#latitude")
const lonInp = document.querySelector("#longitude")
const airQuality = document.querySelector(".air-quality")
const airQualityStat = document.querySelector(".air-quality-status")
const srchBtn = document.querySelector(".search-btn")
const componentsEle = document.querySelectorAll(".component-val")
const airQualityStatmsg=document.querySelector(".side-msg")

const appId = "86f7bd91be9b7c943d9284e8220edc1d" // API Key from https://home.openweathermap.org/api_keys
const link = "https://api.openweathermap.org/data/2.5/air_pollution"	// API end point

const getUserLocation = () => {

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(onPositionGathered, onPositionGatherError)
	} 
	else {
		onPositionGatherError({ message: "Can't Access your location. Please enter your co-ordinates" })
	}
}

const onPositionGathered = (pos) => {
	let lat = pos.coords.latitude.toFixed(4), lon = pos.coords.longitude.toFixed(4)

	// Set values of Input for user to know
	latInp.value = lat
	lonInp.value = lon

	// Get Air data from weather API
	getAirQuality(lat, lon)
}

const getAirQuality = async (lat, lon) => {
	// Get data from api
	const rawData = await fetch(`${link}?lat=${lat}&lon=${lon}&appid=${appId}`).catch(err => {
		onPositionGatherError({ message: "Something went wrong. Check your internet conection." })
		console.log(err)
	})
	const airData = await rawData.json()
	setValuesOfAir(airData)
	setComponentsOfAir(airData)
}

const setValuesOfAir = airData => {
	const aqi = airData.list[0].main.aqi
	let airStat = "", color = "", msg=""

	// Set Air Quality Index
	if(aqi === 1){
		airQuality.innerText = "[0-50]";
	}
	else if(aqi=== 2){
		airQuality.innerText = "[50-100]";
	}
	else if(aqi=== 3){
		airQuality.innerText = "[101-200]";
	}
	else if(aqi=== 4){
		airQuality.innerText = "[201-300]";
	}
	else if(aqi=== 5){
		airQuality.innerText = ">300";
	}
	// else if(aqi === 6){
	// 	airQuality.innerText = "[401-500]";
	// }
	

	// Set status of air quality

	switch (aqi) {
		case 1:
			airStat = "GOOD"
			msg ="You can breathe fresh air"
			color = "rgb(19, 201, 28)"
			break
			case 2:
				airStat = "FAIR"
				msg ="You can step out in the breeze"
				color = "rgb(15, 134, 25)"
				break
			case 3:
				airStat = "MODERATE"
				msg ="Please be cautious, use of mask is suggested"
				color = "rgb(201, 204, 13)"
				break
			case 4:
				airStat = "POOR"
				msg ="High pollution level detected"
				color = "rgb(204, 83, 13)"
				break
		case 5:
			airStat = "VERY-POOR"
			msg ="Servere pollution level detected!!"
			color = "rgb(204, 13, 13)"
			break
		default:
			airStat = "Unknown"
	}

	airQualityStat.innerText = airStat
	airQualityStatmsg.innerText = msg
	airQualityStatmsg.style.color = color
	airQualityStat.style.color = color
}

const setComponentsOfAir = airData => {
	let components = {...airData.list[0].components}
	componentsEle.forEach(ele => {
		const attr = ele.getAttribute('data-comp')
		ele.innerText = components[attr] += " μg/m³"
	})
}

const onPositionGatherError = e => {
	errorLabel.innerText = e.message
}

srchBtn.addEventListener("click", () => {
	getAirQuality(parseFloat(latInp.value).toFixed(4), parseFloat(lonInp.value).toFixed(4))
})

getUserLocation()
