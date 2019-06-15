import getCards from "./getCards.js";
$(document).ready(async function(){
  await getCards(null, true);

  $("#noBooks").hide();
  await Promise.all([
    getAuthors(),
    getThemes(),
    getGenres()
  ]);

$('body').on('click', '.genre', function (){
    const selectedGenre = $(this).html();
    if(selectedGenre){
        $("#genresSelect").children().each(function () {
            if($(this).text()===selectedGenre){
                $("#genresSelect").val($(this).val());
                $("#submitFiltersBtn").click();
            }
        });
    }
});

  $("#submitFiltersBtn").click(async function () {
    $("#noBooks").hide();
    const $cards = $(".card");
    const queryString = $.param({
      authors: $("#authorsSelect").val(),
      themes: $("#themesSelect").val(),
      genres: $("#genresSelect").val(),
      isFavorite: $("#isFavoriteCheck").prop("checked"),
      bestSeller: $("#bestSellersCheck").prop("checked")
    });
    let books = await fetch("/api/books?"+queryString);
    if(books.status === 404){
      $("#noBooks").show();
      $cards.each(function(){
        $(this).parent().hide();
      });
      return;
    }
    handleError(books);
    books = await books.json();
    const bookIds = books.map(b => b.id);
    $cards.each(function () {
      $(this).parent().show();
      const bookId = $(this).data("book-id");
      if(!bookIds.includes(bookId)){
        $(this).parent().hide();
      }
    })
  });
});

function getAuthors(){
  return new Promise(function(resolve, reject){
    fetch("/api/authors")
        .then(async function(authors){
          authors = await authors.json();
          for(let author of authors){
            $("#authorsSelect").append(`<option value="${author.id}">${author.name}</option>`);
          }
          resolve();
        })
        .catch(reject);
  });
}

function getThemes(){
  return new Promise(function(resolve, reject){
    fetch("/api/themes")
        .then(async function(themes){
          themes = await themes.json();
          for(let theme of themes){
            $("#themesSelect").append(`<option value="${theme.id}">${theme.name}</option>`);
          }
          resolve();
        })
        .catch(reject);
  });
}

function getGenres(){
  return new Promise(function(resolve, reject){
    fetch("/api/genres")
        .then(async function(genres){
          genres = await genres.json();
          for(let genre of genres){
            $("#genresSelect").append(`<option value="${genre.id}">${genre.name}</option>`);
          }
          resolve();
        })
        .catch(reject);
  });
}