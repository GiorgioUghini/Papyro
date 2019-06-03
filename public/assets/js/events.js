$(document).ready(async function () {
  let events = await fetch("/api/events");
  handleError(events);
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
      .replace(/%eventId%/g, event.id)
      .replace("%image%", event.book.picture)
      .replace("%bookName%", event.book.title)
      .replace("%date%", new Date(event.date).toDateString())
      .replace("%location%", event.location)
      .replace("%bookId%", event.bookId);
    $events.append(compiledEvent);
  }

  let eventsThisMonth = null;
  $("#checkThisMonth").click(async function () {
    const checked = $(this).prop("checked");
    if(checked && !eventsThisMonth){
      const today = new Date();
      const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 1);
      eventsThisMonth = await fetch(`/api/events?startDate=${firstOfMonth.toLocaleDateString()}&endDate=${lastOfMonth.toLocaleDateString()}`);
      eventsThisMonth = await eventsThisMonth.json();
    }
    const $cardContainers = $(".card-container");
    if(checked){
      $cardContainers.each(function(){
        const eventId = parseInt($(this).children(".card").data("event-id"));
        let hide = true;
        for(let e of eventsThisMonth){
          if(e.id === eventId){
            hide = false;
          }
        }
        if(hide){
          $(this).hide();
        }
      });
    }else{
      $cardContainers.each(function () {
        $(this).show();
      })
    }
  });
});