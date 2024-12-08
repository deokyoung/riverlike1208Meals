const API_BASE_URL = 'https://open.neis.go.kr/hub/mealServiceDietInfo';
const ATPT_OFCDC_SC_CODE = 'J10';
const SD_SCHUL_CODE = '7531100';

const datePicker = document.getElementById('datePicker');
const searchBtn = document.getElementById('searchBtn');
const menuList = document.getElementById('menuList');
const originInfo = document.getElementById('originInfo');
const nutritionInfo = document.getElementById('nutritionInfo');

// 오늘 날짜를 기본값으로 설정
const today = new Date();
datePicker.value = today.toISOString().split('T')[0];

async function getMealInfo(date) {
    const formattedDate = date.replace(/-/g, '');
    const url = `${API_BASE_URL}?ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}&MLSV_YMD=${formattedDate}&Type=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // 급식 정보가 없는 경우 처리
        if (!data.mealServiceDietInfo) {
            throw new Error('해당 날짜의 급식 정보가 없습니다.');
        }

        const mealInfo = data.mealServiceDietInfo[1].row[0];
        displayMealInfo(mealInfo);
    } catch (error) {
        console.error('에러:', error);
        menuList.innerHTML = '<li>급식 정보가 없습니다.</li>';
        originInfo.innerHTML = '<p>정보 없음</p>';
        nutritionInfo.innerHTML = '<p>정보 없음</p>';
    }
}

function displayMealInfo(mealInfo) {
    // 메뉴 표시
    const dishes = mealInfo.DDISH_NM.split('<br/>');
    menuList.innerHTML = dishes
        .map(dish => `<li>${dish.trim()}</li>`)
        .join('');

    // 원산지 정보 표시
    if (mealInfo.ORPLC_INFO) {
        const orplcInfo = mealInfo.ORPLC_INFO.split('\n');
        originInfo.innerHTML = orplcInfo
            .map(info => `<p>${info.trim()}</p>`)
            .join('');
    } else {
        originInfo.innerHTML = '<p>원산지 정보 없음</p>';
    }

    // 영양 정보 표시
    if (mealInfo.CAL_INFO) {
        const nutInfo = mealInfo.CAL_INFO.split('\n');
        nutritionInfo.innerHTML = nutInfo
            .map(info => `<p>${info.trim()}</p>`)
            .join('');
    } else {
        nutritionInfo.innerHTML = '<p>영양 정보 없음</p>';
    }
}

searchBtn.addEventListener('click', () => {
    getMealInfo(datePicker.value);
});

// 페이지 로드 시 오늘 급식 정보 표시
window.addEventListener('load', () => {
    getMealInfo(datePicker.value);
});