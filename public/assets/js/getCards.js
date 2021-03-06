const out = async (id, showGenres) => {
  const url = id ? "/api/books/"+id : "/api/books";
  $.ajax({
    url,
    type: "GET",
    success: async function(result){
      let $card = $("#card");
      let $cardsContainer = $("#cards-container");
      if(id){
        result = result["Similar"];
        let i = 0;
        for(let b of result){
          let tmp = await fetch("/api/books/"+b.id);
          tmp = await tmp.json();
          result[i++] = tmp;
        }
      }
      result.forEach(card => {
        let c = $card.html().replace("%title%", card.title)
            .replace("%abstract%", card.abstract.truncate())
            .replace("%picture%", card.picture)
            .replace(/%bookId%/g, card.id);
        $cardsContainer.append(c);
        const $genres = $(".card[data-book-id="+ card.id +"]").find(".genres");
        if(showGenres){
          for(let genre of card.genres){
            const $genre = $($("#genreButton").html());
            $genre.html(genre);
            $genres.append($genre);
          }
        }else{
          $genres.hide();
        }
      });

      $(".card .findOutMore").click(function (e) {
        e.preventDefault();
        const id = $(this).data("bookId");
        window.location.href = "/ourbooks/"+id;
      });
    },
    error: function(req,status,err){
      alert(err);
      window.location.href = "/";
    }
  });
};

String.prototype.truncate = function(){
  let re = this.match(/^.{0,315}[\S]*/);
  let l = re[0].length;
  re = re[0].replace(/\s$/,'');
  if(l < this.length)
    re = re + "&hellip;";
  return re;
};

export default out;