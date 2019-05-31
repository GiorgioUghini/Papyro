import getCards from "./getCards.js";
let alreadyInCart = null;

$(document).ready(async function () {
  const bookId = parseInt(/\d+$/g.exec(window.location.pathname)[0]);
  await getCards(bookId);
  let book = await fetch("/api/books/"+bookId);
  book = await book.json();
  const $author = $("#author").html();
  for(let author of book.authors){
    $("#authors").append($author.replace(/%authorId%/g, author.id).replace(/%authorName%/g, author.name));
  }
  $("#backgroundImage").attr("src", book.picture).attr("alt", book.title);
  $("#bookTitle").text(book.title);
  $("#abstract").text(book.abstract);
  $("#interview").text(book.interview);
  const token = Cookies.get("token");
  if(token){
    let cart = await fetch("/api/reservations/cart", {
      method: "get",
      headers: new Headers({
        authorization: token
      })
    });
    cart = await cart.json();
    alreadyInCart = cart.includes(bookId);
    updateBtnText();
  }

  $("#addToCartBtn").click(async function (e) {
    e.preventDefault();
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