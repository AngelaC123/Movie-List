
const BASE_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const dataPanel = document.querySelector('#data-panel')

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))


// Render Movie List

renderMovieList(movies)


function renderMovieList(data) {
  //把api資料，render入html中
  // title, img
  let rawHTML = ''
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
                  <button class="btn btn-danger btn-remove" data-id="${element.id}">X</button>
                </div>
              </div>
            </div>
          </div>`
  });

  //expect result
  dataPanel.innerHTML = rawHTML
}



// add EventListener to 'click' button
// modal concat movie data from API

//to do
// add eventlistner to datapanel
// listen 'more' btn, click -> get api data -> render Modal


dataPanel.addEventListener('click', function (event) {

  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)

  } else if (event.target.matches('.btn-remove')) {
    removeFromFavorite(Number(event.target.dataset.id))

  }
})



function removeFromFavorite(id) {


  const movieIndex = movies.findIndex(function (movie) {
    console.log('id', id)
    console.log(movie)
    console.log('movie id', movie.id)
    console.log(movie.id === id)
    return movie.id === id

  })
  if (movieIndex === -1) return
  console.log(movies)
  console.log(movieIndex)

  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))

  //更新頁面
  renderMovieList(movies)

}



//把資料render進modal的函式
function showMovieModal(id) {
  // data we need: title, image, release date, description
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
