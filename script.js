const apiKey = 'b2d2acc0528e4646d46fd9cff194b1bd';
const apiUrl = 'http://api.themoviedb.org/3/';
let currentPage = 1;
let trendingMovies = []; // Global array to store trending movies

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const loadMoreMoviesButton = document.getElementById('load-more-movies-btn');
const clearButton = document.getElementById('close-search-btn');
const moviesContainer = document.getElementById('movies-grid');

searchForm.addEventListener('submit', handleFormSubmit);
loadMoreMoviesButton.addEventListener('click', loadMoreMovies);
clearButton.addEventListener('click', clearSearch);

window.addEventListener('DOMContentLoaded', fetchTrendingMovies);

// Displays the "Now Playing"/Trending movies
async function fetchTrendingMovies() {
  const url = `${apiUrl}trending/movie/week?api_key=${apiKey}&page=${currentPage}`;
  const response = await fetch(url);
  const data = await response.json();
  // Append new movies to the trendingMovies array
  trendingMovies = trendingMovies.concat(data.results); 
  displayMovies(trendingMovies);
}

// Displays the movies that are searched up
async function fetchMovies(searchQuery, page) {
  const url = `${apiUrl}search/movie?api_key=${apiKey}&query=${searchQuery}&page=${page}`;
  const response = await fetch(url);
  const data = await response.json();

  displayMovies(data.results, page !== 1);
}

// Handles poster/image logistics
function displayMovies(movies, append = false) {
  const fragment = document.createDocumentFragment();

  for (let movie of movies) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
        <img class="movie-poster" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"/>
        <div class = "ratings">
          <div class="movie-votes">Votes: ${movie.vote_average}</div>
          <h2 class="movie-title">${movie.title}</h2>
        </div>
    `;
    fragment.appendChild(movieCard);
  }

  if (append) {
    moviesContainer.appendChild(fragment);
  } else {
    moviesContainer.innerHTML = '';
    moviesContainer.appendChild(fragment);
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  const currentSearch = searchInput.value;
  currentPage = 1;
  moviesContainer.innerHTML = ''; // Clear the movies container
  trendingMovies = []; // Clear the trendingMovies array
  fetchMovies(currentSearch, currentPage);
}

async function loadMoreMovies(e) {
  e.preventDefault();
  currentPage++;
  const currentSearch = searchInput.value;

  if (currentSearch) {
    fetchMovies(currentSearch, currentPage);
  } else {
    fetchTrendingMovies();
  }
}

function clearSearch() {
  searchInput.value = '';
  currentPage = 1;
  moviesContainer.innerHTML = ''; // Clear the movies container
  trendingMovies = []; // Clear the trendingMovies array
  fetchTrendingMovies(); // Fetch and display trending movies
}