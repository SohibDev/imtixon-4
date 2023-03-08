// const { Pagination } = require("swiper");

const elSearch = findElement('#search');
const loginBtn = findElement('#loginBtn');
const elTopList = findElement("#booksLists");
const elTopTemplate = findElement("#books-template")
const elPaginationList = findElement(".pagination");
const loader = findElement("#loader");
let token = localStorage.getItem('token');

let products = [];
let PageSize = 6;
let activePage = 1;
let allProductsCount = 0;

// if (!token) {
//   window.location.href = '../pages/admin.html'
// }

elSearch.addEventListener("input", () => {
    elTopList.textContent = null;
    const value = elSearch.value;
    let searchResultArray = products.items.filter((book) => {
        let searchWord = book.volumeInfo.title;
        if (searchWord.includes(value)) {
            return book;
        }
    });
    renderBooks(searchResultArray, elTopList, elTopTemplate);
});

if (token) {
    loginBtn.textContent = "Log out";
} else {
    loginBtn.textContent = "Log in";
} loginBtn.addEventListener("click", () => {
    let token = localStorage.getItem("token");

    if (token) {
        localStorage.removeItem("token");
        loginBtn.textContent = "Kirish";
        window.location.href = "file:///C:/Users/user/Desktop/Front-end/imtihon-4/pages/login.html";
    } else {
        window.location.href = "file:///C:/Users/user/Desktop/Front-end/imtihon-4/pages/login.html";
    }
});


const getData = async () => {
    try {
        changeLoading(true);
        const res = await fetch('https://www.googleapis.com/books/v1/volumes?q=search+terms&maxResults=40');
        if (res.status === 404) {
            throw new Error("xato ketdi");
        }
        const res2 = await res.json();
        allProductsCount = res2.items.length;
        elPaginationList.innerHTML = `
          <li id="prev" class="opacity-50 page-item page-link">
                                  &laquo;
                              </li>`;
        for (let i = 0; i < Math.ceil(allProductsCount / PageSize); i++) {
            let newLi = document.createElement("li");
            newLi.className = "page-item page-link page-number";
            newLi.textContent = i + 1;
            if (activePage === i + 1) {
                newLi.style.color = "#fff";
                newLi.style.backgroundColor = "blue";
            }
            elPaginationList.appendChild(newLi);
        }
        elPaginationList.innerHTML += `
    <li id="next" class="page-item page-link">
    &raquo;
    </li>`;

        products = res2;

        renderBooks(res2.items.slice(0, 6), elTopList, elTopTemplate);
    } catch (x) {
        alert(x);
    } finally {
        changeLoading(false);
    }
};

elPaginationList.addEventListener("click", (evt) => {
    elTopList.textContent = null;
    const prevBtn = document.querySelector("#prev");
    const nextBtn = document.querySelector("#next");

    if (evt.target.className.includes("page-number")) {
        const page = evt.target.textContent;

        activePage = page;

        renderBooks(products.items.slice(PageSize * (page - 1), PageSize * page), elTopList, elTopTemplate);
    }
    if (evt.target.id === "prev") {
        if (activePage != 1) {
            activePage--;
            
            renderBooks(products.items.slice(PageSize * (activePage - 1), PageSize * activePage), elTopList, elTopTemplate);
            products.items.slice(PageSize * activePage);
        }
    }
    if (evt.target.id === "next") {
        activePage++;

        renderBooks(products.items.slice(PageSize * (activePage - 1), PageSize * activePage), elTopList, elTopTemplate);
    }
    const lastPage = Math.ceil(products.items.length / PageSize);
    elPaginationList.innerHTML = `
          <li id="prev" class="${
        activePage == 1 ? "opacity-50" : " "
    }  page-item page-link">
                                  &laquo;
          </li>`;

    for (let i = 0; i < Math.ceil(allProductsCount / PageSize); i++) {
        let newLi = document.createElement("li");

        newLi.className = "page-item page-link page-number";
        newLi.textContent = i + 1;
        if (activePage == i + 1) {
            newLi.style.color = "#fff";
            newLi.style.backgroundColor = "blue";
        }
        elPaginationList.appendChild(newLi);
    }
    elPaginationList.innerHTML += `
                              <li id="next" class=" ${
        activePage == lastPage ? "opacity-50" : " "
    } page-item page-link" ${
        activePage == lastPage ? "disabled" : ""
    }>
                              &raquo;
                              </li>`;
});

getData();


const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', function() {
  body.classList.toggle('dark');
  body.classList.toggle('text-card');
  body.classList.toggle('booksBackground');
  elTopList.classList.toggle('background-color');
});

// bookmark

let id = localStorage.getItem("id");
const bookTemplate = findElement("#booksTemplate");
const card = findElement(".book-card");
let bookmarkArray = [];
console.log(id);
fetch(BASE_URL)
.then((res) => res.json())
.then((data) => {
    console.log(data.items);
    data.items.forEach(book => {
        if (book.id.includes(id)) {
            bookmarkArray.push(book);
            console.log(bookmarkArray);
            renderBookmark(bookmarkArray, card, bookTemplate)
        }
    });
  });