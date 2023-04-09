// 모바일 aside menu
let asideMenuButton = document.querySelector(".aside_menu_button");
let asideMenuBack = document.querySelector(".aside_menu_back");
let asideMenu = document.querySelector(".aside_menu");

// 검색 관련
let MobileSearchIcon = document.querySelector(".m_search_icon")
let PcSearchIcon = document.querySelector(".pc_search_icon")
let MobileSearchInput = document.querySelector(".m_header .search-input")
let PcSearchInput = document.querySelector(".container .search-input")

asideMenuButton.addEventListener("click", aside);
MobileSearchIcon.addEventListener("click", MobileSearchOn);
PcSearchIcon.addEventListener("click", PcSearchOn);


function aside() {
    asideMenuButton.classList.toggle("toggle");
    asideMenuBack.classList.toggle("toggle");
    asideMenu.classList.toggle("toggle");
}
function MobileSearchOn() {
    MobileSearchInput.classList.toggle("click");
}
function PcSearchOn() {
    PcSearchInput.classList.toggle("click");
}


// API
let news = [];
let title = document.querySelector(".title");
let menus = document.querySelectorAll(".menus button");
let searchButton = document.querySelector(".search-button");
let topicSearch = document.querySelector(".topic-search");


// 엔터 키 작동
topicSearch.addEventListener("keydown", function (e) {
    if (e.key === 'Enter') {
        getSearchedNews();
    }
})

// input에 focus 시 글자 초기화
topicSearch.addEventListener("focus", function () {
    topicSearch.value = "";
})

// title 클릭 시 처음으로
title.addEventListener("click", async () => {
    let url = new URL("http://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/news.json?query=%EB%89%B4%EC%8A%A4&display=10&start=1&sort=sim");
    let header = new Headers({
        // 'Content-Type' : 'application/json',
        'X-Naver-Client-Id': 'dJY23PNqY1zpYkvDqb5m',
        'X-Naver-Client-Secret': 'abNrXzzMLL',
    });

    let response = await fetch(url, { headers: header });
    let data = await response.json();
    news = data.items;
    console.log(data);

    render();
})

menus.forEach((menu) => menu.addEventListener("click", (event) => getNewsByTopic(event)));
searchButton.addEventListener("click", () => getSearchedNews())


const getLatestNews = async () => {
    let url = new URL("http://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/news.json?query=%EB%89%B4%EC%8A%A4&display=10&start=1&sort=sim");
    let header = new Headers({
        // 'Content-Type' : 'application/json',
        'X-Naver-Client-Id': 'dJY23PNqY1zpYkvDqb5m',
        'X-Naver-Client-Secret': 'abNrXzzMLL',
    });

    let response = await fetch(url, { headers: header });
    let data = await response.json();
    news = data.items;

    render();
};

// 메뉴 클릭
const getNewsByTopic = async (event) => {
    let topic = encodeURI(event.target.textContent);
    let target = event.target

    let url = new URL(`http://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/news.json?query=${topic}&display=10&start=1&sort=sim`);
    let header = new Headers({
        // 'Content-Type' : 'application/json',
        'X-Naver-Client-Id': 'dJY23PNqY1zpYkvDqb5m',
        'X-Naver-Client-Secret': 'abNrXzzMLL',
    });

    let response = await fetch(url, { headers: header });
    let data = await response.json();
    news = data.items;

    render();
}

// 검색
const getSearchedNews = async () => {
    let topic = encodeURI(topicSearch.value);
    let url = new URL(`http://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/news.json?query=${topic}&display=10&start=1&sort=sim`);
    let header = new Headers({
        // 'Content-Type' : 'application/json',
        'X-Naver-Client-Id': 'dJY23PNqY1zpYkvDqb5m',
        'X-Naver-Client-Secret': 'abNrXzzMLL',
    });

    let response = await fetch(url, { headers: header });
    let data = await response.json();
    news = data.items;

    render();
}


const render = () => {
    let newsHTML = ''

    newsHTML = news && news.map((item) => {
        return `<div class="row news">
                <div class="col-lg-12">
                    <h2>${item.title}</h2>
                    <p>
                        ${item.description}
                    </p>
                    <div class="link">
                        <p><a href="${item.link}" target="_blank"><span>바로가기</span> :  ${item.link}</a></p>
                    </div>
                    <div class ="date">
                        ${item.pubDate}
                    </div>
                </div>
            </div>`
    }).join("");

    document.getElementById("news-board").innerHTML = newsHTML
}

getLatestNews();