$(document).ready(async function () {
  const authorId = getIdFromPath("/authors");
  let author = await fetch("/api/authors/"+authorId);
  handleError(author);
  author = await author.json();

  $("#picture").attr("src", author.picture);
  $("#name").text(author.name);
  $("#bio").text(author.bio);

  const $book = $("#book").html();
  const $books = $("#books");
  for(let book of author.books){
    let compiledBook = $book;
    for(let prop of Object.keys(book)){
      compiledBook = compiledBook.replace("%"+ prop +"%", book[prop]);
    }
    $books.append(compiledBook);
  }
});