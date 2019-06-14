import getCards from "./getCards.js";
let alreadyInCart = null;

$(document).ready(async function () {
  const bookId = parseInt(/\d+$/g.exec(window.location.pathname)[0]);
  let book = await fetch("/api/books/"+bookId);
  handleError(book);
  book = await book.json();
  await getCards(bookId);
  const $author = $("#author").html();
  for(let author of book.authors){
    $("#authors").append($author.replace(/%authorId%/g, author.id).replace(/%authorName%/g, author.name));
  }
  $("#backgroundImage").attr("src", book.picture).attr("alt", book.title);
  $("#bookTitle").text(book.title);
  $("#name").text("Book: " + book.title);
  $("#abstract").text(book.abstract);
  $("#interview").text(book.interview);
  const genres = book.genres.join(", ");
  $("#genres").html("<b>Genres</b>: " + genres);
  const themes = book.themes.join(", ");
  $("#themes").html("<b>Themes</b>: " + themes);

  const $events = $("#events");
  if(book.events){
    const $event = $("#event").html();
    for(let event of book.events){
      let compiledEvent = $event
          .replace("%eventDate%", new Date(event.date).toDateString())
          .replace("%eventLocation%", event.location);
      $events.append(compiledEvent);
    }
  }else{
    $events.hide();
  }

  const $reviews = $("#reviews");
  const $review = $("#review").html();
  $("#noReviews").hide();
  if(book.reviews && book.reviews.length){
    for(let review of book.reviews){
      let compiledReview = $review
          .replace("%name%", review.name)
          .replace("%comment%", review.comment);
      $reviews.append(compiledReview);
    }
  }else{
    $("#noReviews").show();
  }


  const token = Cookies.get("token");
  if(token){
    let cart = await fetch("/api/reservations/cart", {
      method: "get",
      headers: new Headers({
        authorization: "Bearer " + token
      })
    });
    cart = await cart.json();
    alreadyInCart = cart.includes(bookId);
    updateBtnText();
  }

  $("#addToCartBtn").click(async function (e) {
    e.preventDefault();
    const token = Cookies.get("token");
    if(token) {
      const requestBody = {
        method: "post",
        body: JSON.stringify({
          bookId
        }),
        headers: new Headers({
          "Content-Type": "application/json",
          authorization: token
        })
      };
      if(alreadyInCart === null) return;

      const url = (alreadyInCart) ? "/api/reservations/removeFromCart" : "/api/reservations/addToCart";

      let result = await fetch(url, requestBody);
      if(result.ok){
        alreadyInCart = !alreadyInCart;
        updateBtnText();
      }
    } else {
      window.location.href = "/signin?orderBook=" + bookId;
    }

  })
});

function updateBtnText() {
  const btn =  $("#addToCartBtn");
  if(alreadyInCart){
    btn.text("Remove from cart");
  }else{
    btn.text("Add to Cart");
  }
}