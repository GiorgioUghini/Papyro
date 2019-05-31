$("document").ready(async function () {
  let authors = await fetch("/api/authors");
  authors = await authors.json();
  const $authorLeft = $("#author-left").html();
  const $authorRight = $("#author-right").html();
  let i = 0;
  for(let author of authors){
    let compiledAuthor = (i%2===0) ? $authorLeft : $authorRight;
    for(let prop of Object.keys(author)){
      compiledAuthor = compiledAuthor.replace("%"+prop+"%", author[prop]);
    }
    $("#authors").append(compiledAuthor);
    i++;
  }
});