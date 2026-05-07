alert("script connected");
let currentPage = 1;
let currentQuery = "";

const API_KEY = "796ef61929e36fe299d63b551c9a6eef";

// TAB SWITCHING
function openTab(evt, tabID) {

  if (tabID === 'Search_Results') {
    $('#Collections').hide();
    $('#Search_Results').show();
  } else {
    $('#Search_Results').hide();
    $('#Collections').show();
  }

}

// SEARCH BUTTON
function searchButtonOnClick() {

  currentQuery = $("#searchInput").val();

  if (currentQuery.trim() === "") {
    alert("Please enter a movie title.");
    return;
  }

  currentPage = 1;

  searchMovies();

}

// SEARCH MOVIES
function searchMovies() {

  $.ajax({

    url: "https://api.themoviedb.org/3/search/movie",

    method: "GET",

    data: {
      api_key: API_KEY,
      query: currentQuery,
      page: currentPage
    },

    success: function(data) {

      console.log("Current Page:", currentPage);

      renderMovies(data.results);

      $("#pageInfo").text(
        `Page ${data.page} of ${data.total_pages}`
      );

    },

    error: function(error) {
      console.error("Search failed:", error);
    }

  });

}

// RENDER MOVIES
function renderMovies(movies) {

  const template = $("#movie-template").html();

  let html = "";

  movies.forEach(movie => {
    html += Mustache.render(template, movie);
  });

  $("#results").html(html);

}

// MOVIE DETAILS
$(document).on("click", ".movie-card", function () {

  const id = $(this).data("id");

  $.ajax({

    url: `https://api.themoviedb.org/3/movie/${id}`,

    data: {
      api_key: API_KEY
    },

    success: function(movie) {

      const template = $("#details-template").html();

      const html = Mustache.render(template, movie);

      $("#details").html(html);

    },

    error: function(error) {
      console.error("Details failed:", error);
    }

  });

});

// PAGE + VIEW BUTTONS
$(document).ready(function () {

  // NEXT PAGE
  $("#nextBtn").click(function () {

    currentPage++;

    searchMovies();

  });

  // PREVIOUS PAGE
  $("#prevBtn").click(function () {

    if (currentPage > 1) {

      currentPage--;

      searchMovies();

    }

  });

  // GRID VIEW
  $("#gridBtn").click(function () {

    $("#results")
      .removeClass("list-view")
      .addClass("grid-view");

  });

  // LIST VIEW
  $("#listBtn").click(function () {

    $("#results")
      .removeClass("grid-view")
      .addClass("list-view");

  });

});
