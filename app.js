console.log("Let's get this party started!");

$(document).ready(function() {
  // Function to make AJAX request to Giphy API
  function searchGif(searchTerm) {
    const apiKey = "MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym";
    const apiUrl = `http://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${apiKey}`;
    
    axios.get(apiUrl)
      .then(function(response) {
        // Log response data to console
        console.log(response.data);
        // Append GIF to page
        if (response.data.data.length > 0) {
          const gifUrl = response.data.data[0].images.original.url;
          const gifElement = `<img src="${gifUrl}" alt="GIF">`;
          $('#gifContainer').append(gifElement);
        } else {
          console.log("No GIFs found for the search term.");
        }
      })
      .catch(function(error) {
        console.log("Error fetching GIF:", error);
      });
  }

  // Event listener for form submission
  $('#searchForm').submit(function(event) {
    event.preventDefault();
    const searchTerm = $('#searchInput').val();
    searchGif(searchTerm);
    // Clear input field
    $('#searchInput').val('');
  });

  // Event listener for clear button
  $('#clearButton').click(function() {
    $('#gifContainer').empty();
  });
});
