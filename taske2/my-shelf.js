// Function to add movie to the shelf
function addMovie() {
    const movieInput = document.getElementById('movieInput');
    const movieTitle = movieInput.value.trim();
    
    if (movieTitle) {
        const movieList = document.getElementById('movieList');
        
        // Create a new movie card
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <h4>${movieTitle}</h4>
            <button class="remove-btn">Remove</button>
        `;

        // Add event listener to remove button
        const removeBtn = movieCard.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            movieList.removeChild(movieCard);
        });

        // Append movie card to movie list
        movieList.appendChild(movieCard);
        
        // Clear input
        movieInput.value = '';
    } else {
        alert("Please enter a movie title.");
    }
}

// Event listener for the add movie button
document.getElementById('addMovieBtn').addEventListener('click', addMovie);
