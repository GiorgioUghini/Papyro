$(document).ready(async function(){
  const eventId = /\d+$/g.exec(window.location.pathname)[0];
  let event = await fetch("/api/events/"+eventId);
  handleError(event);
  event = await event.json();
  const bookId = event.bookId;
  let book = await fetch("/api/books/"+bookId);
  book = await book.json();

  $("#picture").attr("src", book.picture);
  $("#bookDetails").attr("href", "/ourbooks/"+bookId);
  $("#title").text(book.title + " - Presentation event");
  $("#location").text(event.location);
  $("#date").text(new Date(event.date).toDateString());
});