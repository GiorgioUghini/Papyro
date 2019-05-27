$.ajax({
    url:"/api/books",
    type: "GET",
    success:function(result){
        let $card = $("#card");
        let $cardsContainer = $("#cards-container");
        result.forEach(card => {
            let c = $card.html().replace("%title%", card.title)
                .replace("%abstract%", card.abstract.truncate())
                .replace("%maintheme%", card.themes[0])
                .replace("%maingenre%", card.genres[0])
                .replace("%picture%", card.picture)
                .replace(/%bookId%/g, card.id);
            $cardsContainer.append(c);
        });
      $(".card .findOutMore").click(function (e) {
        e.preventDefault();
        const id = $(this).data("bookId");
        window.location.href = "/ourbooks/"+id;
      });
    },
    error: function(richiesta,stato,errori){
        alert("Error");
    }
});

$(document).ready(async function(){
  await Promise.all([
    getAuthors(),
    getThemes(),
    getGenres()
  ]);
  $("#submitFiltersBtn").click(async function () {
    const queryString = $.param({
      authors: $("#authorsSelect").val(),
      themes: $("#themesSelect").val(),
      genres: $("#genresSelect").val(),
      isFavorite: $("#isFavoriteCheck").prop("checked"),
      bestSeller: $("#bestSellersCheck").prop("checked")
    });
    let books = await fetch("/api/books?"+queryString);
    books = await books.json();
    const bookIds = books.map(b => b.id);
    $(".card").each(function () {
      $(this).show();
      const bookId = $(this).data("book-id");
      if(!bookIds.includes(bookId)){
        $(this).hide();
      }
    })
  })
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


String.prototype.truncate = function(){
    var re = this.match(/^.{0,315}[\S]*/);
    var l = re[0].length;
    var re = re[0].replace(/\s$/,'');
    if(l < this.length)
        re = re + "&hellip;";
    return re;
}