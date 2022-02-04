
const BASE_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const dataPanel = document.querySelector('#data-panel')
const paginator = document.querySelector('#paginator')
const searchForm = document.querySelector('#search-form')
const layoutSwitch = document.querySelector('.layout-switch')
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = []

let currentPage = 1


// Render Movie List
axios
  .get(INDEX_URL)
  .then((response) => {

    movies.push(...response.data.results)
    renderMovieList(getMovieByPage(1))
    renderPaginator(movies.length)

  })
  .catch((err) => console.log(err))


// 處理movie list 資料的函式
function renderMovieList(data, mode) {
  mode = dataPanel.dataset.mode
  let rawHTML = ''

  if (mode === 'bars') {  // when bar mode, render table style 
    data.forEach(function (element) {
      rawHTML +=
        `<tr>
          <td class = "d-flex justify-content-between my-2" >
          <h4>${element.title}</h4>
          <div>
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${element.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${element.id}">+</button>
          </div>
          </td> 
        </tr>`
    })

    rawHTML = '<table class="table">' + rawHTML + '</table>'
    dataPanel.innerHTML = rawHTML


  } else { // card mode
    data.forEach(element => {
      rawHTML +=
        `  <div class="col-sm-3">
            <div class="mb-2">
              <div class="card">
                <img src="${POSTER_URL + element.image}" class="card-img-top" alt="Movie Poster">
                <div class="card-body">
                  <h5 class="card-title">${element.title}</h5>
                </div>
                <div class="card-footer text-muted">
                  <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${element.id}">More</button>
                  <button class="btn btn-info btn-add-favorite" data-id="${element.id}">+</button>
                </div>
              </div>
            </div>
          </div>`
    });

    dataPanel.innerHTML = rawHTML
  }

}


//監聽data panel -> 
//1. click 'more' button show modal : movie info
//2. click '+' button, add movie to 'Favorite' page
dataPanel.addEventListener('click', function renderModal(event) {

  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)

  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})


// 將電影加到收藏清單的函式
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)  //用id找到movies中相同id的那一部電影

  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已在收藏清單中')
  }


  list.push(movie)//放入清單中
  localStorage.setItem('favoriteMovies', JSON.stringify(list)) //整批list的array資料轉成文字，存入local storage

}


//把資料render進modal的函式
function showMovieModal(id) {

  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  //先清空，避免殘影
  modalTitle.innerText = ''
  modalImage.innerHTML = ''
  modalDate.innerText = ''
  modalDescription.innerText = ''


  //get data
  axios
    .get(INDEX_URL + id)
    .then((response) => {

      const data = response.data.results
      modalTitle.innerText = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="Movie Poster" class="img-fluid">`
      modalDate.innerText = 'release date: ' + data.release_date
      modalDescription.innerText = data.description
    })
}


//監聽顯示模式切換： Card Mode <-> List Mode
layoutSwitch.addEventListener('click', function onSwitchMode() {
  if (event.target.tagName !== 'I') {
    return
  }
  const mode = event.target.id
  selectMode(mode)
  renderMovieList(getMovieByPage(currentPage))
})


//設定目前顯示模式的函式
function selectMode(mode) {
  if (mode === dataPanel.dataset.mode) return
  dataPanel.dataset.mode = mode
}





//Search Bar
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()

  const searchInput = document.querySelector('#search-input')
  const keywords = searchInput.value.trim().toLowerCase()


  filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keywords))

  if (filteredMovies.length === 0) {
    return alert(`查無關鍵字 "${keywords}" 相關電影作品 `)
  }
  currentPage = 1
  renderMovieList(getMovieByPage(currentPage))
  renderPaginator(filteredMovies.length)
})


// Paginator

//監聽pagination
paginator.addEventListener('click', function onPaginationClick(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  currentPage = page
  renderMovieList(getMovieByPage(currentPage))
})


// 取得預設頁數的12筆電影資料的函式。（目前設定一頁顯示12部電影）
function getMovieByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}


// render paginator的函式
function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHtml = ''
  for (page = 1; page <= numberOfPage; page++) {
    rawHtml += `<li class="page-item"><a class="page-link" href="#" data-page = ${page}>${page}</a></li>`
  }
  paginator.innerHTML = rawHtml
}









