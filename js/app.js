
const searchInput = document.querySelector('#search');
const filmCardsWrapper = document.querySelector('#rowContainer');

document.addEventListener('DOMContentLoaded',()=>showPopularFilms());

searchInput.addEventListener('input',event =>{

    const {value} = event.target;
    if(value.length == 0){
      showPopularFilms();
    } else if (value.length < 3){
      return; 
    }
    
    getFilmsByTitle(value)
    .then(data => addFilmsOnPage(data))
    .catch(error => console.error(error));
    });


function showPopularFilms(){
    getPopularFilms()
    .then(data => addFilmsOnPage(data.data))
    .catch(error => console.log(error));
}

async function getFilmsByTitle(searchTitle){
        const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${searchTitle}`);
        return response.data;
}

async function getPopularFilms(){
        const response = await axios.get(`https://api.tvmaze.com/shows`);
        return response;
}

function addFilmsOnPage(films){
    filmCardsWrapper.innerHTML='';

    for(let film of films){
        addFilmOnPage(film);
    }
}

function addFilmOnPage(film){
    const filmContainer = document.createElement('div');
    filmContainer.classList.add('col', 'shadow-sm', 'card');

    const {name, summary, image, url} = film.show? film.show : film;
    let imgSrc = image? image.original : 'https://img.freepik.com/free-photo/movie-background-collage_23-2149876016.jpg';
    filmContainer.innerHTML = `
                <img class="image"  src="${imgSrc}"/>
                <div class="card-body show">
                  <h3>${name}</h3>
                  <div class="summaryWrapper">
                  <p class="card-text">${summary}</p>
                  </div>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <a class="btn btn-sm btn-outline-secondary"  href="${url}" role="button">Visit site</a>
                    </div>
                    <div class="rating-container">
                    <span class="fa fa-star text-success"></span>
                    <span class="fa fa-star text-success"></span>
                    <span class="fa fa-star text-success"></span>
                    <span class="fa fa-star text-success"></span>
                    <span class="fa fa-star text-success"></span>
                    </div>
                  </div>
                </div>
              </div>
    `;
    
    filmCardsWrapper.appendChild(filmContainer);
    if(film.score){
      setRating(film.score, filmContainer);
    } else {
      setRating(film.rating.average/10, filmContainer);
    }
}

function setRating(ratingValue, container) {
  const stars = container.querySelectorAll(".fa-star");
  stars.forEach((star, index) => {
    const percentFilled = ratingValue - index * 0.2;
    if (percentFilled >= 0.2) {
      star.style.width = "100%";
    } else if (percentFilled <= 0) {
      star.style.width = "0%";
    } else {
      star.style.width = `${(percentFilled * 100)/0.2}%`;
    }
  });
}