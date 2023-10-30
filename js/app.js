
const getShowsAPI = `https://api.tvmaze.com/shows`;
const getShowsByTitleAPI = `https://api.tvmaze.com/search/shows?q=`
const templateMovieImage = 'https://img.freepik.com/free-photo/movie-background-collage_23-2149876016.jpg';

const beginSearchFromValueLength = 3;
const ratingStarsAmount = 5;
const itemsPerPage = 12;

const searchInput = document.querySelector('#search');
const filmCardsWrapper = document.querySelector('#rowContainer');
const pagination = document.querySelector('#pagination');

const popularFilmsArr = [];
const toast = new bootstrap.Toast(document.querySelector('#toast'));

document.addEventListener('DOMContentLoaded',()=>showPopularFilms());

searchInput.addEventListener('input',event =>{ 
  const {value} = event.target;

  if(value.length == 0){
    showPopularFilms();
  } else if (value.length < beginSearchFromValueLength){
    return; 
  } else { 
    showFilmsByTitle(value);
  }
});

async function showPopularFilms(){

  if(popularFilmsArr.length == 0){

    try{
      const response = await axios.get(getShowsAPI);
      popularFilmsArr.push(...response.data);
      addFilmsOnPage(response.data);
    } catch(error){
      console.log(error)
    };

  } else {
    addFilmsOnPage(popularFilmsArr);
  }
}
  
async function showFilmsByTitle(title){
  try{
    const response = await axios.get(getShowsByTitleAPI + title);
    removePagination();
    addFilmsOnPage(response.data);
  } catch(error){
    console.error(error);
  };
}
  
function removePagination(){
  pagination.innerHTML='';
}

function addFilmsOnPage(films){
    
  filmCardsWrapper.innerHTML='';
  toast.hide();

  if(films.length === 0){ 
    toast.show();
  } else if(films.length <= itemsPerPage){
    for(let film of films){
      addFilmOnPage(film);
    }
  } else {
    addFilmsOnPageWithPagination(films);
  }
}
  
function addFilmOnPage(film){
  const filmContainer = document.createElement('div');
  filmContainer.classList.add('col', 'shadow-sm', 'card');
    
  const {name, summary, image, url} = film.show ? film.show : film;
  let imgSrc = image ? image.original : templateMovieImage;
  
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
  
    function setRating(ratingValue, container) {
    const ratingContainer = container.querySelector(".rating-container");
    for(let i = 0; i < ratingStarsAmount; i++) {
      const starContainer = document.createElement('div');
      const star = document.createElement('span');
      star.classList.add('fa', 'fa-star', 'text-success', 'real-star');
      const emptyStar = document.createElement('span');
      emptyStar.classList.add('fa', 'fa-star-o', 'empty-star');
      starContainer.appendChild(emptyStar);
      
      const perStarRating = 1 / ratingStarsAmount;
      const percentFilled = (ratingValue - i * perStarRating) - perStarRating;
      if (percentFilled >= perStarRating) {
        star.style.width = "100%";
      } else if (percentFilled <= 0) {
        star.style.width = "0%";
      } else {
        star.style.width = `${(percentFilled * 100)/perStarRating}%`;
      }
      starContainer.appendChild(star);
      ratingContainer.appendChild(starContainer);
    };
  }
}


function addFilmsOnPageWithPagination(films){

  const totalPages = Math.ceil(films.length / itemsPerPage);
  let currentPage = 1;
  
  function displayItems(page){
    addFilmsOnPage(films.slice((page - 1) * itemsPerPage, page * itemsPerPage));
    updateButtons(page);
  };
  
  displayItems(currentPage);

  function updateButtons(page){
    removePagination();
      
    const lastPage = (totalPages - page) > 3 ? (2 + page) : totalPages; 
  
    const firstPage = (page - 2) <= 0 ? 1 : (page - 2);
  
    for(let i = firstPage ; i<=lastPage; i++){
      const li = document.createElement('li');
      li.classList.add('page-item');
      if(i=== page){
        li.classList.add('active');
      }
      const button = document.createElement('button');
      button.classList.add('page-link');
      button.textContent = i;
      button.addEventListener('click',() => {
        displayItems(i);
        window.scrollTo({
          top: 0,
          behavior: "instant",
        });
      });
          
      li.appendChild(button);
      pagination.appendChild(li);
    }
  };
};

