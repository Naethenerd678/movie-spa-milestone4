let currentPage = 1;
let currentQuery = "";

const API_KEY = "796ef61929e36fe299d63b551c9a6eef";

function openTab(evt, tabID) {
  if (tabID === 'Search_Results') {
    $('#Collections').css('display','none');    
    $('#Search_Results').css('display','block');       
  } else {
    $('#Search_Results').css('display','none');    
    $('#Collections').css('display','block');          
  }
}

function searchButtonOnClick() {
  console.log('searchBtn');

  currentQuery = $("#searchInput").val();

  if (currentQuery.trim() === "") {
    alert("Please enter a movie title.");
    return;
  }

  currentPage = 1;
  searchMovies();
}

function searchMovies() {
  console.log('searchMovies();');

  $.ajax({
    url: "https://api.themoviedb.org/3/search/movie",
    method: "GET",
    data: {
      api_key: API_KEY,
      query: currentQuery,
      page: currentPage
    },
    success: function (data) {
      renderMovies(data.results);
      $("#pageInfo").text(`Page ${data.page} of ${data.total_pages}`);
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

// CLICK MOVIE → DETAILS
$(document).on("click", ".movie-card", function () {
  const id = $(this).data("id");

$.ajax({
  url: `https://api.themoviedb.org/3/movie/${id}`,
  data: { api_key: API_KEY },
  success: function (movie) {
    const template = $("#details-template").html();
    const html = Mustache.render(template, movie);    
    $("#details").html(html);
  },
  error: function(error) {
    console.error("Details failed:", error);
  }
});
  
// PAGINATION
$("#nextBtn").click(function () {
  currentPage++;
  searchMovies();
});

$("#prevBtn").click(function () {
  if (currentPage > 1) {
    currentPage--;
    searchMovies();
  }
});

// VIEW SWITCH
$("#gridBtn").click(() => {
  $("#results").removeClass("list-view").addClass("grid-view");
});

$("#listBtn").click(() => {
  $("#results").removeClass("grid-view").addClass("list-view");
});
