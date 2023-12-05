function removeTypingCursor() {
  document.getElementById('typing-placeholder').style.display = 'none';
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const clockElement = document.getElementById('clock');
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;

  // Update the clock every second
  setTimeout(updateClock, 1000);
}

function initSearchBar() {
  const searchBar = document.getElementById('search-bar');

  searchBar.addEventListener('keydown', function (event) {
    // Check if Enter key is pressed (key code 13)
    if (event.keyCode === 13) {
      const query = encodeURIComponent(searchBar.value);
      const searchUrl = `https://www.startpage.com/do/dsearch?q=${query}`;
      window.open(searchUrl, '_blank');
    }
  });
}

// Initial call to start the clock
updateClock();

// Initialize the search bar
initSearchBar();