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
                .replace("%picture%", card.picture);
            $cardsContainer.append(c);
        });
    },
    error: function(richiesta,stato,errori){
        alert("Error");
    }
});

String.prototype.truncate = function(){
    var re = this.match(/^.{0,315}[\S]*/);
    var l = re[0].length;
    var re = re[0].replace(/\s$/,'');
    if(l < this.length)
        re = re + "&hellip;";
    return re;
}