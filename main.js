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

let url;

// pagination
let page = 1;
let totalPages = 0;
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
    try{
        let header = new Headers({
            // 'Content-Type' : 'application/json',
            'X-Naver-Client-Id': 'dJY23PNqY1zpYkvDqb5m',
            'X-Naver-Client-Secret': 'abNrXzzMLL',
        });
        
        pageStart = page
        let pageStart2 = pageStart
        url.searchParams.set('start', (pageStart2 * 10) - 9);

        let response = await fetch(url, { headers: header });
        let data = await response.json();

        news = data.items;


        if(response.status == 200 ){
            if(news.length <= 0){
                throw new Error("검색된 결과값이 없습니다.")
            }
            
            news = data.items;
            render();
            pagination();

        }
        else{
            throw new Error(data.errorMessage)
        }
    }

    catch(error){
        console.log("잡힌 에러는", error.message)
        errorRender(error.message);
    }

}



// title 클릭 시 처음으로
title.addEventListener("click", async () => {
    url = new URL("https://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/news.json?query=%EB%89%B4%EC%8A%A4&display=10&sort=sim");
    getNews();
})

menus.forEach((menu) => menu.addEventListener("click", (event) => getNewsByTopic(event)));
searchButton.addEventListener("click", () => getSearchedNews())

const getLatestNews = async () => {
    url = new URL("https://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/news.json?query=%EB%89%B4%EC%8A%A4&display=10&sort=sim");
    getNews();
};

// 메뉴 클릭
const getNewsByTopic = async (event) => {
    let topic = encodeURI(event.target.textContent);

    url = new URL(`https://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/news.json?query=${topic}&display=10&sort=sim`);
    getNews();
}

// 검색
const getSearchedNews = async () => {
    let topic = encodeURI(topicSearch.value);
    url = new URL(`https://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/news.json?query=${topic}&display=10&sort=sim`);
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
                        <p><span>바로가기</span> :  <a href="${item.link}" target="_blank">${item.link}</a></p>
                    </div>
                    <div class ="date">
                        ${item.pubDate}
                    </div>
                </div>
            </div>`
    }).join("");

    document.getElementById("news-board").innerHTML = newsHTML
    console.log("lastPage", page)

}

const errorRender = (message) => {
    let errorHTML = 
    `<div class="alert alert-danger text-center" role="alert">
        ${message}
    </div>`
    document.getElementById("news-board").innerHTML = errorHTML
}

const pagination = () => {
    let paginationHTML = ``;
    // total-page
    // page
    // page group
    let pageGroup = Math.ceil(page/5);
    // last page
    let last = pageGroup*5
    // first page
    let first = last - 4
    // first ~ last page print

    paginationHTML = 
    `
    <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        </a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous" onClick="moveToPage(${page-1})">
        <span aria-hidden="true">&lt</span>
      </a>
    </li>
    `
    for(let i = first; i<=last; i++){
        paginationHTML +=
            `
            <li class="page-item ${page == i? "active" :""}"><a class="page-link" href="#" onClick="moveToPage(${i})">${i}</a></li>
            `

    }
    paginationHTML +=
    `
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next" onClick="moveToPage(${page+1})">
        <span aria-hidden="true">&gt;</span>
      </a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
    `
    document.querySelector(".pagination").innerHTML = paginationHTML;

};

const moveToPage = (pageNum) => {
    if(pageNum <= 0){
        return
    }
    else{
        // 이동하고 싶은 페이지 확인
        page = pageNum
        
        // 이동하고 싶은 페이지를 가지고 api 재호출
        getNews();

    }
}

getLatestNews();