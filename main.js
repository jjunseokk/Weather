$(function () {
    setInterval(myTimer, 1000); // 1초마다 호출되게 한다.

    function myTimer() {
        let today = new Date(); //데이트객체생성
        let y = today.getFullYear();
        let m = today.getMonth() + 1;
        let d = today.getDate();
        let day = today.getDay();
        let weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        let t_time = today.toLocaleTimeString();

        $(".today-time .year").text(y);
        $(".today-time .month").text(m);
        $(".today-time .date").text(d);
        $(".day").text(weekday[today.getDay()]);
        $(".today-time .todayTimes").text(t_time);
    }

    let taskInput = $("#w-city"); // input값을 할당.

    $("#w-city").on("keydown", function (event) {
        if (event.keyCode === 13) {
            getNewsBykeyword()
        }
    });
});



// 현재 날씨
$.getJSON("https://api.openweathermap.org/data/2.5/weather?lat=37.5666805&lon=126.9784147&appid=1255e4aac90af2ff4a1905e43962ab4b&units=metric", function (result) {

    // 현재온도
    $(".temp").append(result.main.temp); //현재온도
    $(".max").append(result.main.temp_min); //최고온도
    $(".min").append(result.main.temp_max); //최저온도
    $(".wind").append(result.wind.speed); //바람
    $(".clouds").append(result.clouds.all); //구름
    $(".city").append(result.name); //도시이름

    // 현재온도 아이콘
    let wiconUrl = '<img src="http://openweathermap.org/img/wn/' + result.weather[0].icon + '.png" alt="' + result.weather[0].description + '">';
    $(".today-icon").html(wiconUrl);
    
    if (result.weather[0].main === "Clouds") {
        $("body").css({
            "background-image": "url('imges/weather.jpg')",
            "background-position": "center center",
            "background-repeat": "no-repeat",
            "background-size" : "cover"
        });
    } else if (result.weather[0].main === "Clear") {
        $("body").css({
            "background-image": "url('imges/clear.jpg')",
            "background-position": "center center",
            "background-repeat": "no-repeat",
            "background-size" : "cover"
        });
    } else if (result.weather[0].main === "Thunderstorm") {
        $("body").css({
            "background-image": "url('imges/Thunderstorm.jpg')",
            "background-position": "center center",
            "background-repeat": "no-repeat",
            "background-size" : "cover"
        });
    } else if (result.weather[0].main === "Drizzle") {
        $("body").css({
            "background-image": "url('imges/Drizzle.jpg')",
            "background-position": "center center",
            "background-repeat": "no-repeat",
            "background-size" : "cover"
        });
    } else if (result.weather[0].main === "Rain") {
        $("body").css({
            "background-image": "url('imges/rain.jpg')",
            "background-position": "center center",
            "background-repeat": "no-repeat",
            "background-size" : "cover"
        });
    } else if (result.weather[0].main === "Snow") {
        $("body").css({
            "background-image": "url('imges/snow.jpg')",
            "background-position": "center center",
            "background-repeat": "no-repeat",
            "background-size" : "cover"
        });
    } else if (result.weather[0].main === "Atmosphere") {
        $("body").css({
            "background-image": "url('imges/Atmosphere.jpg')",
            "background-position": "center center",
            "background-repeat": "no-repeat",
            "background-size" : "cover"
        });
    } else {
        $("body").css({
            "background-image": "url('imges/Atmosphere.jpg')",
            "background-position": "center center",
            "background-repeat": "no-repeat",
            "background-size" : "cover"
        });
    }
    // 뉴스

});

// 뉴스

// 메뉴 카테고리

let menus = document.querySelectorAll(".menus button");
let alink = document.querySelectorAll(".link");
console.log("menus", menus);
menus.forEach((menu) => menu.addEventListener("click", (event) => getNewsByTopic(event)));
alink.forEach((link) => link.addEventListener("click", (event) => getNewsByTopic(event)));


let searchButton = document.querySelector(".searchBtn");


let page = 1;
let total_page = 1;

// 각 함수에서 필요한 url을 만든다
let url;

// api 호출 함수를 부른다.
const getNews = async () => {
    try {
        let header = new Headers({ 'x-api-key': 'HpMrmb5OOah-65i0d7hVNMpLNdy6qobbzTtFkp5BKR4' });

        url.searchParams.set('page', page); //page 움직일때 키를 준다.
        let response = await fetch(url, { headers: header }); //ajax, http, fetch /*await은 이 일이 끝날때까지 기다려라 라는 뜻.*/
        let data = await response.json(); //json은 서버통신에서 많이 쓰이는 데이터 타입
        if (response.status == 200) {
            if (data.total_hits == 0) {
                throw new Error("검색된 결과 값이 없습니다.")
            }
            console.log("받는데이터", data);
            news = data.articles;
            total_page = data.total_pages;
            page = data.page;
            console.log(news);
            render();
            pagenation();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        errorRender(error.message);
    }
};

let news = [];
// api
// 새로운 뉴스 불러오기
const getLatestNews = async () => { //async와 await은 세트다.
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`);
    getNews();
}
// 선택한 카테고리별 뉴스 불러오기
const getNewsByTopic = async (event) => {
    let topic = event.target.textContent.toLowerCase();
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);
    getNews();
};

// 버튼을 눌렀을 때 카테고리별 검색
const getNewsBykeyword = async () => {
    //1. 검색 키워드 읽어오기
    let keyword = document.getElementById("w-city").value;
    console.log(keyword);

    //2. 이걸 가지고 url에 검색 키워드 붙이기
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`);
    getNews();
};


// 뉴스 저장한 함수.
const render = () => {
    let newsHTML = ``;
    newsHTML = news.map(item => {
        return `<div class="row news font-color">
            <div class="col-lg-4">
                <img class="news-img-size" src="${item.media}" alt="" style="width:100%">
            </div>
            <div class="col-lg-8">
                <h3>${item.title}</h3>
                <p>
                    ${item.summary}
                </p>
                <div>
                    ${item.rights}*${item.published_date}
                </div>
            </div>
        </div>`
    }).join(''); // join()은 배열을 스트링으로 바꿔주는 것

    document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (message) => {
    let errorHTML = `<div class="alert alert-danger text-center">${message}</div>`;
    document.getElementById("news-board").innerHTML = errorHTML;
};

const pagenation = () => {
    // page
    // page group
    let pagenationHTML = "";
    let pageGroup = Math.ceil(page / 5);
    // last
    let last = pageGroup * 5;

    // total page 3일 경우 페이지만 프린트 하는법 last, first
    if (last > total_page) {
        last = total_page;
    }
    // first
    let first = last - 4 <= 0 ? 1 : last - 4;
    if (first >= 6) {
        pagenationHTML = `<li class="page-item">
            <a class="page-link" href="#" aria-label="Previous" onclick="pageClick(1)">
              <span aria-hidden="true">&lt;&lt;</span>
            </a>
            </li>
            <li class="page-item">
            <a class="page-link" href="#" aria-label="Previous" onclick="moveTopage(${page - 1})">
              <span aria-hidden="true">&lt;</span>
            </a>
            </li>`;
    };



    // << >> 이 버튼 만들어주기. 맨처음, 맨끝으로 가는 버튼 만들기

    // 내가 그룹 1 일때 << < 이 버튼이 없고

    // 내가 마지막 그룹일때 > >> 버튼이 없다.

    for (let i = first; i <= last; i++) {
        pagenationHTML += `<li class="page-item ${page == i ? "active" : ""}" ><a class="page-link" onclick="moveTopage(${i})" href="#">${i}</a></li>`;
    };
    if (last > page) {
        pagenationHTML += `<li class="page-item">
            <a class="page-link" href="#" aria-label="Next" onclick="moveTopage(${page + 1})">
              <span aria-hidden="true">&gt;</span>
            </a>
          </li><li class="page-item">
          <a class="page-link" href="#" aria-label="Next" onclick="pageClick(${total_page})">
            <span aria-hidden="true">&gt;&gt;</span>
          </a>
        </li>`
    }


    document.querySelector(".pagination").innerHTML = pagenationHTML;
};
const pageClick = (pageNum) => {
    //7.클릭이벤트 세팅
    page = pageNum;
    window.scrollTo({ top:0, behavior: "smooth" });
    getNews();
};

const moveTopage = (pageNum) => {
    // 1. 이동하고 싶은 페이지를 알아야한다.
    page = pageNum

    // 2. 이동하고 싶은 페이지를 가지고 api를 다시 호출
    getNews();
};
searchButton.addEventListener("click", getNewsBykeyword); //여기로 위치한 이유는 호이스팅 떄문이다.
getLatestNews();



// 제이쿼리
// 햄버거 박스 누를 때 메뉴바.
$(function () {
    $(".buggerBtn").on("click", function () {
        $(".sidenav").animate({
            left: "0px"
        }, 200)
    });

    $(".closebtn").on("click", function () {
        $(".sidenav").animate({
            left: "-450px"
        }, 200)
    })


    // 검색 버튼 누를면 나오고 다시 한번 누르면 없어진다.
    $(".search-icon").on("click", function () {
        $(".search-area").toggleClass("search-area-off search-area-on");
    });
});
