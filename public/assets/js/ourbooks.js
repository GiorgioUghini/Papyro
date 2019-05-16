$.ajax({
    url:"/api/books",
    type: "GET",
    success:function(result){
        let $card = $("#card");
        let $cardsContainer = $("#cards-container");
        result.forEach(card => {
            let c = $card.html().replace("%title%", card.title)
                .replace("%abstract%", card.abstract)
                .replace("%theme%", card.themes.join(" "))
                .replace("%picture%", card.picture);
            $cardsContainer.append(c);
        });
    },
    error: function(richiesta,stato,errori){
        alert("Error");
    }
});