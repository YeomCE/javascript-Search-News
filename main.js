
// 모바일 aside menu
let asideMenuButton = document.querySelector(".aside_menu_button");
let asideMenuBack = document.querySelector(".aside_menu_back");
let asideMenu = document.querySelector(".aside_menu");

// 검색 관련
let searchInput = document.querySelector(".container .search-input")
let searchButton = document.querySelector(".search-button");

asideMenuButton.addEventListener("click", aside);


function aside() {
    asideMenuButton.classList.toggle("toggle");
    asideMenuBack.classList.toggle("toggle");
    asideMenu.classList.toggle("toggle");
}

// API
let news = [];
let title = document.querySelector(".title");
let menus = document.querySelectorAll(".aside_menu button");
let mobileMenus = document.querySelectorAll(".menus button");
let topicSearch = document.querySelector(".topic-search");


let url;

const BASE_URL = "https://cors-anywhere.herokuapp.com/https://openapi.naver.com/"

// pagination
let page = 1;
let totalPage = 0;
let pageNum;
let pageStart;


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

// api 호출 함수
const getNews = async () => {
    try {
        document.getElementById("news-board").innerHTML =
            `
        <div class="alert alert-info text-center" role="alert">
            로딩 중입니다.
        </div>
        `
        let header = new Headers({
            'X-Naver-Client-Id': 'dJY23PNqY1zpYkvDqb5m',
            'X-Naver-Client-Secret': 'abNrXzzMLL',
        });

        pageStart = page
        url.searchParams.set('start', (pageStart * 10) - 9);

        let response = await fetch(url, { headers: header });
        let data = await response.json();

        news = data.items;


        if (response.status == 200) {
            if (news.length <= 0) {
                throw new Error("검색된 결과값이 없습니다.")
            }

            news = data.items;
            totalPage = Math.ceil(data.total / 10);
            dataTotal = data.total;
            page = 1
            render();
            pagination();

        }
        else {
            throw new Error(data.errorMessage)
        }
    }

    catch (error) {
        console.log("잡힌 에러는", error.message)
        errorRender(error.message);

        
    }

}


// title 클릭 시 처음으로
title.addEventListener("click", async () => {
    url = new URL(`${BASE_URL}v1/search/news.json?query=%EB%89%B4%EC%8A%A4&display=10&sort=sim`);
    getNews();
})

menus.forEach((menu) => menu.addEventListener("click", (event) => getNewsByTopic(event)));
mobileMenus.forEach((menu) => menu.addEventListener("click", (event) => getNewsByTopic(event)));
searchButton.addEventListener("click", () => getSearchedNews());

const getLatestNews = async () => {
    url = new URL(`${BASE_URL}v1/search/news.json?query=%EB%89%B4%EC%8A%A4&display=10&sort=sim`);
    getNews();
};

// 메뉴 클릭
const getNewsByTopic = async (event) => {
    let topic = encodeURI(event.target.textContent);

    url = new URL(`${BASE_URL}v1/search/news.json?query=${topic}&display=10&sort=sim`);
    page = 1;
    getNews();
    asideMenuButton.classList.remove("toggle");
    asideMenuBack.classList.remove("toggle");
    asideMenu.classList.remove("toggle");
}

// 검색
const getSearchedNews = async () => {
    let topic = encodeURI(topicSearch.value);
    url = new URL(`${BASE_URL}v1/search/news.json?query=${topic}&display=10&sort=sim`);
    page = 1;
    getNews();
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
                        <p><a href="${item.link}" target="_blank">뉴스 바로가기</a></p>
                    </div>
                    <div class ="date">
                        ${item.pubDate}
                    </div>
                </div>
            </div>`
    }).join("");

    document.getElementById("news-board").innerHTML = newsHTML

}

// 에러메세지
const errorRender = (message) => {
    console.log('message',message)
    // let errorHTML =
    //     `<div class="alert alert-danger text-center" role="alert">
    //         cors-anywhere.herokuapp.com에 접속하여 버튼을 클릭해 주십시오.
    //     </div>`
    // document.getElementById("news-board").innerHTML = errorHTML
    let errorHTML =
        `<div class="alert alert-danger text-center" role="alert">
            ${message}
        </div>`
    document.getElementById("news-board").innerHTML = errorHTML
}

const pagination = () => {
    let paginationHTML = ``;
    let pageGroup = Math.ceil(page / 5);
    let last = pageGroup * 5
    let dataLast = 100
    if (dataTotal < 1000) {
        dataLast = totalPage;
    }
    let first = last - 4 <= 0 ? 1 : last - 4;

    if (totalPage - first < 4) {
        last = totalPage;
    }


    if (first >= 6) {
        paginationHTML +=
            `
    <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onClick="moveToPage(1)">
        <span aria-hidden="true">&lt;&lt;</span>
        </a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous" onClick="moveToPage(${page - 1})">
        <span aria-hidden="true">&lt;</span>
      </a>
    </li>
    `
    }

    for (let i = first; i <= last; i++) {

        paginationHTML +=
            `
            <li class="page-item ${page == i ? "active" : ""}"><a class="page-link" href="#" onClick="moveToPage(${i})">${i}</a></li>
            `

    }

    if (last == totalPage) {
        paginationHTML +=
            ``
    }
    else if (last < 100) {
        paginationHTML +=
            `
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Next" onClick="moveToPage(${page + 1})">
                    <span aria-hidden="true">&gt;</span>
                </a>
            </li>
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Next" onClick="moveToPage(${dataLast})">
                    <span aria-hidden="true">&gt;&gt;</span>
                </a>
            </li>
    `
    }
    document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
    if (pageNum <= 0) {
        return
    }
    else {
        page = pageNum
        getNews();

    }
}

getLatestNews();