window.onload = function () {

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
        console.log("click")
    }
    function PcSearchOn() {
        PcSearchInput.classList.toggle("click");
        console.log("click")
    }


    // API
    let news = [];
    let title = document.querySelector(".title")
    let menus = document.querySelectorAll(".menus button")
    
    title.addEventListener("click", async ()=>{
        let url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`)
        let header = new Headers({
            'x-api-key': 'yP5th8x9QkmsOQPkf9IhSLVXVW1QXJGID7-TlR7ZagA',
        });

        let response = await fetch(url, { headers: header });
        let data = await response.json();
        news = data.articles;
        console.log(news);

        render();
    })
    
    menus.forEach((menu) => menu.addEventListener("click", (event) => getNewsByTopic(event)));
    const getLatestNews = async () => {
        let url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`)
        let header = new Headers({
            'x-api-key': 'yP5th8x9QkmsOQPkf9IhSLVXVW1QXJGID7-TlR7ZagA',
        });

        let response = await fetch(url, { headers: header });
        let data = await response.json();
        news = data.articles;
        console.log(news);

        render();
    };

    const getNewsByTopic = async (event)=>{
        let topic = event.target.textContent.toLowerCase();
        let url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`)
        let header = new Headers({
            'x-api-key': 'yP5th8x9QkmsOQPkf9IhSLVXVW1QXJGID7-TlR7ZagA',
        });
        let response = await fetch(url, { headers: header });
        let data = await response.json();
        news = data.articles;
        console.log(news)

        render();
    }

    const render = () => {
        let newsHTML = ''
        
        newsHTML = news && news.map((item) => {
            return `<div class="row news">
                <div class="col-lg-4">
                    <img class="news-img-size"
                        src="${item.media}">
                </div>
                <div class="col-lg-8">
                    <h2>${item.title}</h2>
                    <p>
                        ${item.summary}
                    </p>
                    <div>
                        ${item.rights} * ${item.published_date}
                    </div>
                </div>
            </div>`
        }).join("");

        document.getElementById("news-board").innerHTML = newsHTML
    }

    getLatestNews();

}