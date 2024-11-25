const form = document.querySelector('form')
const inp = document.querySelector('#inp')
const output = document.querySelector('.output')
const weather_info = document.querySelector('.wether_info')

const API = 'https://api.openweathermap.org/data/2.5/weather?q='
const key = '&appid=f406001620042529557e8be00d69d1fc'

const getCityWether = async () => {
	if (!inp.value.trim().length) return

	const req = await fetch(API + inp.value + key)
	const res = await req.json()
	renderWether(res)
	renderMap(res.coord)
}

const renderWether = data => {
	console.log(data)
	output.innerHTML = ''
	weather_info.innerHTML = ''

	if (data?.cod && data?.cod == '404') {
		const massage = document.createElement('h2')
		massage.textContent = data?.message
		output.append(massage)
		return
	}

	const { name, sys, main } = data
	const cityName = document.createElement('h1')
	cityName.textContent = name

	const countryCode = document.createElement('h2')
	countryCode.textContent = `Country: ${sys.country}`

	const celsiusDiv = document.createElement('div')
	const minTemp = document.createElement('h3')
	minTemp.textContent = `Celsius: ${Math.floor(main.temp_min - 273.15)}`
	const maxTemp = document.createElement('h3')
	maxTemp.textContent = `Fahrenheit: ${Math.floor(
		(main.temp_max - 273.15) * 1.8 + 32
	)}`
	celsiusDiv.append(minTemp, maxTemp)

	const sunrise = document.createElement('h4')
	sunrise.textContent = `Sunrise: ${new Date(
		sys.sunrise * 1000
	).getHours()}-часов : ${new Date(sys.sunrise * 1000).getMinutes()}-минут`

	const sunset = document.createElement('h4')
	sunset.textContent = `Sunset: ${new Date(
		sys.sunset * 1000
	).getHours()}-часов : ${new Date(sys.sunset * 1000).getMinutes()}-минут`

	weather_info.append(cityName, countryCode, celsiusDiv, sunrise, sunset)
	output.append(weather_info)
}

form.addEventListener('submit', e => {
	e.preventDefault()
	getCityWether()
})

const renderMap = ({ lat, lon }) => {
	let map = document.createElement('div')
	map.id = 'map'

	DG.then(function () {
		map = DG.map('map', {
			center: [lat, lon],
			zoom: 13,
		})

		DG.marker([lat, lon]).addTo(map).bindPopup('Вы кликнули по мне!')
	})
	output.append(map)
}
