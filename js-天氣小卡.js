const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-578260AF-414E-4D8A-9767-1673420F0211';

let allData = '';
let data = '';

// 先把資料轉json格式
fetch(url)
	.then(response => response.json())
	.then(responseData => {
		console.log(responseData)
		data = responseData.records.location;
		oldData(data);
		renderWeatherCards();
	});

let cityCardAll = '';

// 縣市按照順序設一個新陣列
function myData() {
	cityCardAll = [
		[{ cityName: '臺北市' }, { cityName: '基隆市' }, { cityName: '新北市' }, { cityName: '宜蘭縣' }, { cityName: '新竹市' }, { cityName: '新竹縣' }, { cityName: '桃園市' }],
		[{ cityName: '苗栗縣' }, { cityName: '臺中市' }, { cityName: '彰化縣' }, { cityName: '南投縣' }, { cityName: '雲林縣' }],
		[{ cityName: '嘉義市' }, { cityName: '嘉義縣' }, { cityName: '臺南市' }, { cityName: '高雄市' }, { cityName: '屏東縣' }, { cityName: '澎湖縣' }],
		[{ cityName: '金門縣' }, { cityName: '連江縣' }],
		[{ cityName: '臺東縣' }, { cityName: '花蓮縣' }]
	];
}
// 在呼叫一次
myData();
console.log(cityCardAll)

// 用原本API的資料給新陣列中新增資料
function oldData(data) {
	data.forEach(detail => {
		const cityName = detail.locationName;
		// 使用新陣列做迴圈，正確的判斷我要新增資料的位置
		cityCardAll.forEach(region => {
			region.forEach(city => {
				if (city.cityName === cityName) {
					city.weatherElement = detail.weatherElement;
				}
			});
		});
	});
}

// 宣告畫面
const content = document.querySelector('#content');

function createWeatherCard(city) {
	let MaxTemperatureName = '';
	let PoP = '';
	let endTime = '';
	let startTime = '';
	let parameterName = '';
	let wx = '';
	let ci = '';
	let parameterValue = '';
	let parameterValueImg = '';
	city.weatherElement.forEach(element => {
		const Time = element.time[0];
		if (element.elementName === 'MaxT') {
			MaxTemperatureName = Time.parameter.parameterName;
		} else if (element.elementName === 'MinT') {
			endTime = Time.endTime;
			startTime = Time.startTime;
			parameterName = Time.parameter.parameterName;
		} else if (element.elementName === 'Wx') {
			wx = Time.parameter.parameterName;
			parameterValue = Time.parameter.parameterValue;
			if (parameterValue === Time.parameter.parameterValue && parameterValue < 10) {
				parameterValueImg = `https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/0${parameterValue}.svg`;
			} else if (parameterValue === Time.parameter.parameterValue && parameterValue > 10) {
				parameterValueImg = `https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/${parameterValue}.svg`;
			}
		} else if (element.elementName === 'CI') {
			ci = Time.parameter.parameterName;
		} else if (element.elementName === 'PoP') {
			PoP = Time.parameter.parameterName;
		}
	});

	// Extract only the time part (HH:mm) from startTime and endTime
	// 讓日期的部分不顯示，而且時間去掉後面的:00
	const cleanStartTime = startTime.split(' ')[1].slice(0, -3);
	const cleanEndTime = endTime.split(' ')[1].slice(0, -3);

	return `
        <div class="weather-card">
            <div class="city-name">${city.cityName}</div>
			<div class="temperature-all">
            	<div class="degree">
					<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFF55"><path d="M446.67-766.67V-920h66.66v153.33h-66.66ZM706-659.33l-46.33-46.34 108-109.66 46.66 47.66L706-659.33Zm60.67 212.66v-66.66H920v66.66H766.67ZM446.67-40v-153.33h66.66V-40h-66.66ZM253.33-660.67l-108-107 47-46.66L300.67-706l-47.34 45.33ZM768-145.33l-108.33-109L705-299.67l110 106-47 48.34ZM40-446.67v-66.66h153.33v66.66H40Zm153 301.34-47.33-47L253-299.67l24.33 22.34L301.67-254 193-145.33ZM480-240q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-66.67q72 0 122.67-50.66Q653.33-408 653.33-480t-50.66-122.67Q552-653.33 480-653.33t-122.67 50.66Q306.67-552 306.67-480t50.66 122.67Q408-306.67 480-306.67ZM480-480Z"/></svg> 
					<span class="MaxT" style="font-size: 40px;">${MaxTemperatureName}℃ /</span> <span class="MinT" style="font-size: 30px;">${parameterName}℃ </span>
				</div>
            	<div class="temperature" style="font-size: 25px;"> <i class="fa-solid fa-umbrella"></i> ${PoP} %</div>
			</div>
			<div class="under-card">
				<div class="test-2">
            		
            		<div class="comfort-index" style="font-size: 25px;">舒適度 : ${ci}</div>
					<img id="parameter-value" style="weight: 50px; height: 50px;" src="${parameterValueImg}" alt="">
				</div>
				<div class="timing-all">
					<div class="timing">
						<div class="degree">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#eee23e"><path d="M440-800v-120h80v120h-80Zm0 760v-120h80v120h-80Zm360-400v-80h120v80H800Zm-760 0v-80h120v80H40Zm708-252-56-56 70-72 58 58-72 70ZM198-140l-58-58 72-70 56 56-70 72Zm564 0-70-72 56-56 72 70-58 58ZM212-692l-72-70 58-58 70 72-56 56Zm268 452q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q67 0 113.5-46.5T640-480q0-67-46.5-113.5T480-640q-67 0-113.5 46.5T320-480q0 67 46.5 113.5T480-320Zm0-160Z"/></svg> ${cleanEndTime}
						</div>
						<div class="degree">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#8C1AF6"><path d="m734-556-56-58 86-84 56 56-86 86ZM80-160v-80h800v80H80Zm360-520v-120h80v120h-80ZM226-558l-84-86 56-56 86 86-58 56Zm71 158h366q-23-54-72-87t-111-33q-62 0-111 33t-72 87Zm-97 80q0-117 81.5-198.5T480-600q117 0 198.5 81.5T760-320H200Zm280-80Z"/></svg> ${cleanStartTime}
						</div>
					</div>
				</div>
			</div>
        </div>
    `;
}

let screen = '';
// 使用新陣列找到所有城市
function renderWeatherCards() {
	screen = '';
	cityCardAll.forEach(region => {
		region.forEach(city => {
			if (city.weatherElement) {
				screen += createWeatherCard(city);
			}
		});
	});
	content.innerHTML = screen;
}
// 新陣列找到各大區域縣市
function renderRegionWeatherCards(region) {
	screen = '';
	region.forEach(city => {
		if (city.weatherElement) {
			screen += createWeatherCard(city);
		}
	});
	content.innerHTML = screen;
}
// 讓地圖的按鈕找到其中一個城市
function renderSingleCityWeatherCard(cityName) {
	screen = '';
    cityCardAll.forEach(region => {
        region.forEach(city => {
			console.log(city);
            if (city.cityName === cityName && city.weatherElement) {
                screen = createWeatherCard(city);
            }
        });
    });
    content.innerHTML = screen;
}

// 為地圖上的每個區域添加點擊事件
document.querySelectorAll('#map a').forEach(area => {
    area.addEventListener('click', function(e) {
        e.preventDefault(); // 防止默認的錨點行為
        const cityName = this.id;
        renderSingleCityWeatherCard(cityName);
    });
});

// 找到全臺按鈕
const allTaiwan = document.querySelector('#all-Taiwan');
allTaiwan.addEventListener('click', function () {
	renderWeatherCards();
})

// 找到北部按鈕
const north = document.querySelector('#north');
north.addEventListener('click', function () {
	renderRegionWeatherCards(cityCardAll[0]);
});

// 找到中部按鈕
const central = document.querySelector('#central');
central.addEventListener('click', function () {
	renderRegionWeatherCards(cityCardAll[1]);
});

// 找到南部按鈕
const south = document.querySelector('#south');
south.addEventListener('click', function () {
	renderRegionWeatherCards(cityCardAll[2]);
});

// 找到東部按鈕
const east = document.querySelector('#east');
east.addEventListener('click', function () {
	renderRegionWeatherCards(cityCardAll[4]);
});

// 找到外島按鈕
const outlingIslands = document.querySelector('#outling-islands');
outlingIslands.addEventListener('click', function () {
	renderRegionWeatherCards(cityCardAll[3]);
})


// 地圖
// const north = document.querySelector('')
// 監聽地圖上的每個超連結
$(document).ready(function () {
	$('a').on('click', function () {
		const theID = $(this).attr('id');
		$('select').val(theID);
		$('a').removeClass('active');
		$(this).addClass('active');
		renderSingleCityWeatherCard(theID);
	});
	// 監聽下拉式選單，選中的a標籤的id
	$('#city').on('change', function () {
		const valID = $(this).val();
		$('a').removeClass('active');
		$('#' + valID).addClass('active');
	});


});

$(document).ready(function () {
	// 定義區域和城市的對應關係
	const regions = {
		'全臺': ['基隆市', '臺北市', '新北市', '桃園市', '新竹縣', '宜蘭縣', '苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'],
		'北部': ['基隆市', '臺北市', '新北市', '桃園市', '新竹縣', '宜蘭縣'],
		'中部': ['苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣'],
		'南部': ['嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '澎湖縣'],
		'東部': ['花蓮縣', '臺東縣'],
		'外島': ['金門縣', '連江縣']
	};

	$('a').on('click', function () {
		const theID = $(this).attr('id');
		$('select').val(theID);
		updateSelection(theID);
	});

	$('#city').on('change', function () {
		const valID = $(this).val();
		updateSelection(valID);
	});

	function updateSelection(selection) {
		$('a').removeClass('active');
		if (regions[selection]) {
			// 如果選擇的是區域
			regions[selection].forEach(city => {
				$('#' + city).addClass('active');
			});
		} else {
			// 如果選擇的是單一城市
			$('#' + selection).addClass('active');
		}
	}

	// 為全臺、北部、中部、南部、東部、外島按鈕添加點擊事件
	$('#all-Taiwan, #north, #central, #south, #east, #outling-islands').on('click', function () {
		const region = $(this).attr('id');
		const regionName = {
			'all-Taiwan': '全臺',
			'north': '北部',
			'central': '中部',
			'south': '南部',
			'east': '東部',
			'outling-islands': '外島'
		}[region];

		$('select').val(regionName);
		updateSelection(regionName);
	});
});

// 時鐘
const padStartToTwo = (time) => {
	return `${time}`.padStart(2, '0');
}

const year = new Date().getFullYear();
const month = padStartToTwo(new Date().getMonth() + 1);
const date = padStartToTwo(new Date().getDate());


const nowTime = `${year} / ${month} / ${date}`;
const clockData = document.querySelector('.date');
clockData.textContent = nowTime;


const clock = document.querySelector('.clock');
const printTimeIng = setInterval(() => {
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);

	const ranbowAll = `rgb(${r}, ${g}, ${b})`;
	const hours = padStartToTwo(new Date().getHours());
	const minutes = padStartToTwo(new Date().getMinutes());
	const seconds = padStartToTwo(new Date().getSeconds());

	clock.textContent = `${hours} : ${minutes} : ${seconds}`;
	clock.style.color = ranbowAll;
}, 1000);
