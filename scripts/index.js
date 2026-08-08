const API_KEY = typeof process !== 'undefined' && process.env ? process.env.TMDB_API_KEY : '03c4e3dc470296959d6bf68804146538'
const API_LANGUAGE = 'en-GB'
const BASE_URL_IMAGE = {
  original: 'https://image.tmdb.org/t/p/original',
  small: 'https://image.tmdb.org/t/p/w3840',
  fallback: 'https://image.tmdb.org/t/p/w1280',
  smallFallback: 'https://image.tmdb.org/t/p/w780'
}

const movies = []
let movieActive = ''
const moviesElement = document.getElementById('movies')

function getUrlMovie(movieId) {
  return `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=${API_LANGUAGE}&append_to_response=videos`
}

function getUrlTV(tvId) {
  return `https://api.themoviedb.org/3/tv/${tvId}?api_key=${API_KEY}&language=${API_LANGUAGE}&append_to_response=videos`
}

function getUrlMovieByImdbId(imdbId) {
  return `https://api.themoviedb.org/3/find/${imdbId}?api_key=${API_KEY}&external_source=imdb_id`
}

function changeButtonMenu() {
  const button = document.querySelector('.button__menu')
  const navigation = document.querySelector('.navigation')


  button.classList.toggle('active')
  navigation.classList.toggle('active')
}

function setMainMovie(movie) {
  const appImage = document.querySelector('.app__image img')
  const title = document.querySelector('.feature__movie h1')
  const description = document.querySelector('.feature__movie p')
  const info = document.querySelector('.feature__movie span')
  const rating = document.querySelector('.rating strong')
  const watchNowBtn = document.getElementById('watchNowBtn')

  
  watchNowBtn.setAttribute('data-trailer-key', movie.trailer_key);

  title.innerHTML = movie.title
  description.innerHTML = movie.overview
  rating.innerHTML = movie.vote_average
  info.innerHTML = movie.release + ' - ' + movie.genre + ' - ' + (movie.type || 'Film')

  appImage.setAttribute('src', movie.image.original)
  
  // Add error handling for main image with automatic fallback
  appImage.onerror = function() {
    if (movie.image.fallback) {
      this.src = movie.image.fallback;
    }
  };
}

function changeMovieActiveInList(newMovieActive) {
  const movieActiveCurrent = document.getElementById(movieActive)
  movieActiveCurrent.classList.remove('active-movie')

  const movieActiveNew = document.getElementById(newMovieActive)
  movieActiveNew.classList.add('active-movie')

  movieActive = newMovieActive
}

function changeMainMovie(movieId) {
  changeMovieActiveInList(movieId)

  const movie = movies.find(movie => movie.id === movieId)

  if(movie?.id) {
    setMainMovie(movie)
    changeButtonMenu()
  } else  {
    console.error(movies)
    console.error(`Could not find the movie with id ${movieId}`)
  }
}

function createButtonMovie(movieId) {
  const button = document.createElement('button')
  button.setAttribute('onclick', `changeMainMovie('${movieId}')`)
  button.innerHTML = '<img src="./assets/icon-play-button.png" alt="Play button icon" />'

  return button
}

function createImageMovie(movieImage, movieTitle) {
  const divImageMovie = document.createElement('div')
  divImageMovie.classList.add('movie__image')

  const image = document.createElement('img')

  image.setAttribute('src', movieImage)
  image.setAttribute('alt', `Image of the movie ${movieTitle}`)
  image.setAttribute('loading', 'lazy')

  // Add error handling for image loading with automatic fallback
  image.onerror = function() {
    const movie = movies.find(m => m.title === movieTitle);
    if (movie && movie.image.fallback) {
      this.src = movie.image.fallback;
    } else if (movie && movie.image.smallFallback) {
      this.src = movie.image.smallFallback;
    }
  };

  divImageMovie.appendChild(image)

  return divImageMovie
}

function addMovieInList(movie) {
  const movieElement = document.createElement('li')
  movieElement.classList.add('movie')

  movieElement.setAttribute('id', movie.id)

  const genre = `<span>${movie.genre}</span>`
  const title = `<strong>${movie.title}</strong>`

  movieElement.innerHTML = genre + title
  movieElement.appendChild(createButtonMovie(movie.id))
  movieElement.appendChild(createImageMovie(movie.image.small, movie.title))

  moviesElement.appendChild(movieElement)
}

async function getMovieData(movieId, type = 'movie') {
  const imdbId = movieId;
  const isMovieInList = movies.findIndex(movie => movie.id === imdbId)

  if(isMovieInList === -1) {
    try {
      let findResponse = await fetch(getUrlMovieByImdbId(imdbId));
      let findData = await findResponse.json();

      // Check if it's a movie or TV series
      const isTV = type === 'tv' || (findData.tv_results && findData.tv_results.length > 0);
      const results = isTV ? findData.tv_results : findData.movie_results;

      if (results.length === 0) {
        throw new Error(`${isTV ? 'TV series' : 'Film'} with IMDb ID ${imdbId} not found.`);
      }
      const tmdbId = results[0].id;

      // Fetch data from appropriate endpoint
      let data;
      if (isTV) {
        data = await fetch(getUrlTV(tmdbId));
        data = await data.json();
      } else {
        data = await fetch(getUrlMovie(tmdbId));
        data = await data.json();
      }

      // Check for backdrop image
      if (!data.backdrop_path) {
        throw new Error(`${isTV ? 'TV series' : 'Film'} "${data.title || data.name}" does not have a backdrop image and will not be added.`);
      }

      // Get videos/trailers
      const videos = data.videos ? data.videos.results : [];
      const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
                      videos.find(v => v.type === 'Teaser' && v.site === 'YouTube') ||
                      videos.find(v => v.site === 'YouTube');

      // Determine title and release date based on type
      const title = data.title || data.name;
      const releaseDate = data.release_date || data.first_air_date || 'N/A';
      const releaseYear = releaseDate !== 'N/A' ? releaseDate.split('-')[0] : 'N/A';

      // Build image URLs with automatic fallback to best available quality
      const backdropPath = data.backdrop_path;
      const imageUrls = {
        original: BASE_URL_IMAGE.original + backdropPath,
        small: BASE_URL_IMAGE.small + backdropPath,
        fallback: BASE_URL_IMAGE.fallback + backdropPath,
        smallFallback: BASE_URL_IMAGE.smallFallback + backdropPath
      };

      const movieData = {
        id: imdbId,
        title: title,
        overview: data.overview,
        vote_average: data.vote_average,
        genre: data.genres && data.genres.length > 0 ? data.genres[0].name : 'General',
        release: releaseYear,
        type: isTV ? 'TV Series' : 'Film',
        image: {
          original: imageUrls.original,
          small: imageUrls.small,
          fallback: imageUrls.fallback,
          smallFallback: imageUrls.smallFallback
        }
      };
      movieData.trailer_key = trailer ? trailer.key : '';
      movies.push(movieData);

      return movieData
    } catch(error) {
      console.error('Error fetching data:', error.message)
    }
  }

  return null
}

function loadMovies() {

  const LIST_MOVIES = [
    // Chronological Order by Release Date
    'tt0143145', // Cinderella (1950) - February 15, 1950
    'tt0053285', // Sleeping Beauty (1959) - January 29, 1959
    'tt0097757', // The Little Mermaid (1989) - November 17, 1989
    'tt0103776', // Beauty and the Beast (1991) - November 22, 1991
    'tt0110357', // The Lion King (1994) - June 24, 1994
    'tt0114709', // Toy Story 1 (1995) - November 22, 1995
    'tt0120281', // Mulan (1998) - June 19, 1998
    'tt0120363', // Toy Story 2 (1999) - November 24, 1999
    'tt0198781', // Monsters, Inc. (2001) - November 2, 2001
    'tt0145487', // Spider-Man (2002) - May 3, 2002
    'tt0316654', // Spider-Man 2 (2004) - June 30, 2004
    'tt0475293', // High School Musical 1 (2006) - January 20, 2006
    'tt0493093', // Hannah Montana — TV Series (2006) - March 24, 2006
    'tt0413300', // Spider-Man 3 (2007) - May 4, 2007
    'tt0810900', // High School Musical 2 (2007) - August 17, 2007
    'tt1055366', // Camp Rock (2008) - June 20, 2008
    'tt0962726', // High School Musical 3 (2008) - October 24, 2008
    'tt0374554', // Bolt (2008) - November 21, 2008
    'tt1114677', // Hannah Montana: The Movie (2009) - April 10, 2009
    'tt1327801', // Glee — TV Series (2009) - May 19, 2009
    'tt1201687', // Toy Story 3 (2010) - June 18, 2010
    'tt1252380', // Camp Rock 2: The Final Jam (2010) - September 3, 2010
    'tt0948470', // The Amazing Spider-Man (2012) - July 3, 2012
    'tt2325989', // Teen Beach Movie (2013) - July 19, 2013
    'tt2294629', // Frozen 1 (2013) - November 27, 2013
    'tt1872181', // The Amazing Spider-Man 2 (2014) - May 2, 2014
    'tt1049413', // Big Hero 6 (2014) - November 7, 2014
    'tt3764966', // Teen Beach Movie 2 (2015) - June 26, 2015
    'tt2948356', // Zootopia (2016) - March 4, 2016
    'tt3498820', // Captain America: Civil War (2016) - May 6, 2016
    'tt2250912', // Spider-Man: Homecoming (2017) - July 7, 2017
    'tt4154756', // Avengers: Infinity War (2018) - April 27, 2018
    'tt4633694', // Spider-Man: Into the Spider-Verse (2018) - December 14, 2018
    'tt4154796', // Avengers: Endgame (2019) - April 26, 2019
    'tt1979376', // Toy Story 4 (2019) - June 21, 2019
    'tt6320628', // Spider-Man: Far From Home (2019) - July 2, 2019
    'tt8510382', // High School Musical: The Musical: The Series (2019) - November 12, 2019
    'tt4520988', // Frozen 2 (2019) - November 22, 2019
    'tt10872600', // Spider-Man: No Way Home (2021) - December 17, 2021
    'tt9362722', // Spider-Man: Across the Spider-Verse (2023) - June 2, 2023
    'tt22022452', // Inside Out 2 (2024) - June 14, 2024
  ];
  
  LIST_MOVIES.map(async (movie, index) => {
    const movieData = await getMovieData(movie)
    
    if (movieData) {
      addMovieInList(movieData)
  
      if(index === 0) {
        setMainMovie(movieData)
        movieActive = movieData.id
  
        const movieActiveNew = document.getElementById(movieActive)
        movieActiveNew.classList.add('active-movie')
      }
    }
  })
}

const buttonAddMovie = document.getElementById('add__movie')

function formattedMovieId(movieId) {
  if(movieId.includes('https://www.imdb.com/title/')) {
    const id = movieId.split('/')[4]
    return id
  }
  
  return movieId
}

buttonAddMovie.addEventListener('submit', async function(event) {
  event.preventDefault()

  const newMovieId = formattedMovieId(event.target['movie'].value)
  const newMovie = await getMovieData(newMovieId)

  if(newMovie?.id) {
    addMovieInList(newMovie)
  }

  event.target['movie'].value = ''
})

loadMovies()
