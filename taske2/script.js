const apiKey = "AIzaSyAQhHA2dELE1P5MRdosJo5fpvM0tZouYfQ"; // Replace with your API key
const apiBaseUrl = `https://www.googleapis.com/books/v1/volumes`;

// Function to fetch books from Google Books API
async function fetchBooks(query, maxResults = 10) {
  const response = await fetch(`${apiBaseUrl}?q=${query}&maxResults=${maxResults}&key=${apiKey}`);
  const data = await response.json();
  return data.items || [];
}

// Function to render books into the UI
function renderBooks(bookList, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';  // Clear existing books

  bookList.forEach(book => {
    const bookInfo = book.volumeInfo;
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';

    bookCard.innerHTML = `
      <img src="${bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'https://via.placeholder.com/100x150'}" alt="${bookInfo.title}" />
      <h4>${bookInfo.title}</h4>
      <p>${bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown Author'}</p>
      <p>${bookInfo.publishedDate ? bookInfo.publishedDate.substring(0, 4) : 'N/A'}</p>
      <p>${bookInfo.averageRating ? bookInfo.averageRating : 'N/A'}/5</p>
      <button class="add-favorite-btn" data-title="${bookInfo.title}" data-authors="${bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown Author'}" data-image="${bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'https://via.placeholder.com/100x150'}">Add to Favorites</button>
    `;

    // Check if the book is already in favorites to update button state
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = favorites.some(book => book.title === bookInfo.title);
    const addFavoriteBtn = bookCard.querySelector('.add-favorite-btn');

    // Update button text based on favorite status
    if (isFavorite) {
      addFavoriteBtn.innerText = 'Remove from Favorites';
      addFavoriteBtn.classList.add('remove');
    }

    // Add event listener for the button
    addFavoriteBtn.addEventListener('click', () => toggleFavorite(bookInfo, addFavoriteBtn));

    container.appendChild(bookCard);
  });
}

// Function to toggle favorite status
function toggleFavorite(bookInfo, button) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const isAlreadyFavorite = favorites.some(book => book.title === bookInfo.title);
  
  if (!isAlreadyFavorite) {
    favorites.push({
      title: bookInfo.title,
      authors: bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown Author',
      image: bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'https://via.placeholder.com/100x150'
    });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    button.innerText = 'Remove from Favorites'; // Change to 'Remove'
    button.classList.add('remove'); // Add 'remove' class
  } else {
    favorites = favorites.filter(book => book.title !== bookInfo.title);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    button.innerText = 'Add to Favorites'; // Change back to 'Add'
    button.classList.remove('remove'); // Remove 'remove' class
  }

  // Refresh favorites on My Shelf page if applicable
  if (window.location.pathname.includes('my-shelf.html')) {
    loadFavorites();
  }
}

// Function to load favorites on My Shelf page
function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const container = document.getElementById('movieList'); // Assuming 'movieList' is the ID for favorites in my-shelf.html
  container.innerHTML = '';  // Clear existing favorites

  favorites.forEach(book => {
    const favoriteCard = document.createElement('div');
    favoriteCard.className = 'movie-card';
    favoriteCard.innerHTML = `
      <img src="${book.image}" alt="${book.title}" />
      <h4>${book.title}</h4>
      <p>${book.authors}</p>
      <button class="remove-btn">Remove</button>
    `;

    // Add event listener for the remove button
    const removeBtn = favoriteCard.querySelector('.remove-btn');
    removeBtn.addEventListener('click', () => {
      const updatedFavorites = favorites.filter(fav => fav.title !== book.title);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      loadFavorites(); // Refresh the list
    });

    container.appendChild(favoriteCard);
  });
}

// Function to handle book search
async function searchBooks() {
  const searchQuery = document.getElementById('searchInput').value;
  if (searchQuery.trim()) {
    const books = await fetchBooks(searchQuery);
    renderBooks(books, 'recommendedBooks');
  }
}

// Initial fetching of books (e.g., new arrivals)
async function loadInitialBooks() {
  const newArrivals = await fetchBooks('bestsellers');
  const recommended = await fetchBooks('web development');
  const historyBooks = await fetchBooks('technology');

  renderBooks(newArrivals, 'newArrivals');
  renderBooks(recommended, 'recommendedBooks');
  renderBooks(historyBooks, 'borrowHistory');
}

// Event listener for the search button
document.getElementById('searchBtn').addEventListener('click', searchBooks);

// Load initial books on page load
window.onload = loadInitialBooks;

// Load favorites on My Shelf page
if (window.location.pathname.includes('my-shelf.html')) {
  loadFavorites();
}
