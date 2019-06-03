const out = async (id) => {
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