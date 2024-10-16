const resultNav = $('.result-nav');
const favoritesNav = $('.favorites-nav');
const cardContainer = $('.card-container');
const saveConfirmed = $('.save-confirmed');
const loader = $('.loader');


const count = 10;
const apiKey = 'DEMO_KEY';
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;


let resultArr = [];
let favorites = {};


const showContent = (page) => {
    loader.addClass('hidden');
    if (page === 'results') {
        resultNav.removeClass('hidden');
        favoritesNav.addClass('hidden');
    } else {
        favoritesNav.removeClass('hidden');
        resultNav.addClass('hidden');
    }
}


const createDOM = (page) => {
    const currentArr = page === 'results' ? resultArr : Object.values(favorites);
    currentArr.forEach(result => {
        const card = $('<div>').addClass('card');
        const link = $('<a>')
            .attr('href', result.hdurl)
            .attr('title', 'View Full Image')
            .attr('target', '_blank');
        const img = $('<img>')
            .attr('src', result.url)
            .attr('alt', "NASA Picture of the Day")
            .attr('loading', 'lazy')
            .addClass('card-img');
        const cardBody = $('<div>').addClass('card-body');
        const cardTitle = $('<h5>').addClass('card-title').text(result.title);
        const saveText = $('<a>').text(page === 'results' ? 'Add To Favorites' : 'Remove From Favorites');
        const cardText = $('<p>').addClass('card-text').text(result.explanation);
        const footer = $('<small>').addClass('text-muted');
        const date = $('<strong>').text(result.date);
        const copyright = $('<span>').text(result.copyright || '');

        cardContainer.append(card);
        card.append(link, cardBody);
        link.append(img);
        cardBody.append(cardTitle, saveText, cardText, footer);
        footer.append(date, copyright);

        if (page === 'results') {
            saveText.on('click', () => saveFavorites(result.url));
        } else {
            saveText.on('click', () => removeFavorites(result.url));
        }
    });
}


const updateDOM = (page) => {
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    cardContainer.empty();
    showContent(page);
    createDOM(page);
}

const getNasaPictures = () => {
    loader.removeClass('hidden');
    $.ajax({
        url: apiURL,
        method: 'GET',
        success: (data) => {
            resultArr = data;
            updateDOM('results');
        },
        error: (err) => {
            console.log(err);
        }
    });
}

const saveFavorites = (itemUrl) => {
    resultArr.forEach(result => {
        if (result.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = result;
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
            showConfirmation();
        }
    });
}

const showConfirmation = () => {
    saveConfirmed.show();
    setTimeout(() => {
        saveConfirmed.hide();
    }, 2000);
}

const removeFavorites = (itemUrl) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}


getNasaPictures();
