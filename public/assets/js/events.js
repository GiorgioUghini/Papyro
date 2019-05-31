$(document).ready(async function () {
  let events = await fetch("/api/events");
  events = await events.json();
  for(let event of events){
    let book = await fetch("/api/books/"+event.bookId);
    book = await book.json();
    event.book = book;
  }
  const $events = $("#events");
  const $event = $("#event").html();
  for(let event of events){
    let compiledEvent = $event;
    compiledEvent = compiledEvent
      .replace("%eventId%", event.id)
      .replace("%image%", event.book.picture)
      .replace("%bookName%", event.book.title)
      .replace("%date%", new Date(event.date).toDateString())
      .replace("%location%", event.location)
      .replace("%bookId%", event.bookId);
    $events.append(compiledEvent);
  }

  let maxHeight = 0;
  const $cards = $(".card");
  $cards.each(function(){
    let height = $(this).height();
    if(height > maxHeight) maxHeight = height;
  });
  maxHeight += 50;
  $cards.each(function(){
    $(this).height(maxHeight);
  });
});