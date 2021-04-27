// Non-reusable code for very specific project
const autoCompleteConfig = {
    renderOption: (movie) => {
        // checking if the image has no link in the API then to return only title with no image 
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        // adding the movies to the poster n title
        return `
         <img src="${imgSrc}"/>
         ${movie.Title}(${movie.Year})  
         `;
    },
    inputValue: (movie) => {
        return movie.Title;
    },
    // same as above it is a function but property of the object
    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '666e5b13',
                s: searchTerm
            }
        });
        if (response.data.Error) {
            return [];
        }
        return response.data.Search;
    }
};
createAutoComplete({
    // ... means make a copy of everything from autocomplete 
    // and through them in this object and include the root as well
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect: (movie) => {
        // to hide the tutorial block from html on selection 
        document.querySelector('.tutorial').classList.add('is-hidden');

        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    },

});

createAutoComplete({
    // ... means make a copy of everything from autocomplete 
    // and through them in this object and include the root as well
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect: (movie) => {
        // to hide the tutorial block from html on selection 
        document.querySelector('.tutorial').classList.add('is-hidden');

        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },

});
let leftMovie;
let rightMovie;

// calling the api with the param i for details of the movie 
const onMovieSelect = async(movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '666e5b13',
            i: movie.imdbID
        }
    });
    //console.log(response.data)
    //linking the html and js 
    summaryElement.innerHTML = movieTemplate(response.data);
    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }
    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    // selecting all the articles 
    // wrapper div left-summary . notification for left side stats and same for right side 
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');
    //we can itrate over any of the above stat
    // we are doing leftstat here
    // leftStat is a article element which is going to have that dataset value
    // idex to retrive the corresponding the dataset value of the right side stats
    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];
        // dataset property is another name for the data property on that element in our case it is value so we wire it with dataset
        // converting them to integr as they are string in DOM
        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);
        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });
}

//helper function to render the response on the html page
const movieTemplate = (movieDetail) => {
    // changing string to int after removing the the $ n ,
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    // changing string to int
    const metascore = parseInt(movieDetail.Metascore);
    // changing to string with decimal to full number 
    const imdbScore = parseFloat(movieDetail.imdbRating);
    // changing the string to number after removing the ,
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    let count = 0;
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);
        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);
    return `
    <article class="media">
    <figure class="media-left">
    <p class="image">
    <img src="${movieDetail.Poster}" />
</p>
</figure>
<div class="media-content">
<h1>${movieDetail.Title}</h1>
<h4>${movieDetail.Genre}</h4>
<p>${movieDetail.Plot}</p>
</div>
</div>
</article>
<article data-value=${awards} class="notification is-primary">
<p class="title">${movieDetail.Awards}</p>
<p class="subtitle">Awards</p>
</article>
<article data-value=${dollars} class="notification is-primary">
<p class="title">${movieDetail.BoxOffice}</p>
<p class="subtitle">Box Office</p>
</article>
<article data-value=${metascore} class="notification is-primary">
<p class="title">${movieDetail.Metascore}</p>
<p class="subtitle">Metascore</p>
</article>
<article data-value=${imdbScore} class="notification is-primary">
<p class="title">${movieDetail.imdbRating}</p>
<p class="subtitle">IMDB Rating</p>
</article>
<article data-value=${imdbVotes} class="notification is-primary">
<p class="title">${movieDetail.imdbVotes}</p>
<p class="subtitle">IMDB Votes</p>
</article>
 `;
};