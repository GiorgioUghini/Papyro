$(document).ready(async function () {
  $("#emptyCart").hide();
  const token = Cookies.get("token");
  if(!token) window.location.href = "/signin";
  let cart = await fetch("/api/reservations/cart", {
    method: "get",
    headers: new Headers({
      authorization: "Bearer " + token
    })
  });
  handleError(cart);
  cart = await cart.json();
  if(!cart.length) showEmptyCart();
  const cartTable = $("#cartTable");
  const cartRow = $("#cartRow").html();
  for (let bookId of cart){
    let book = await fetch("/api/books/"+bookId);
    book = await book.json();
    const newRow = cartRow
      .replace("%title%", book.title)
      .replace(/%bookId%/g, book.id);
    cartTable.append(newRow);
  }

  $(".removeButton").click(async function () {
    const bookId = $(this).data("book-id");
    const result = await fetch("/api/reservations/removeFromCart", {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json",
        authorization: "Bearer " + token
      }),
      body: JSON.stringify({
        bookId
      })
    });
    if(result.ok){
      $(`.cartRow[data-book-id="${bookId}"]`).remove();
      if($(".removeButton").length === 1) showEmptyCart();
    }
  });

  $("#reserveButton").click(async function () {
    const result = await fetch("/api/reservations/confirmReservation", {
      method: "post",
      headers: new Headers({
        authorization: "Bearer " + token
      })
    });
    if(result.ok){
      showEmptyCart();
      $("#emptyCart").text("Reservation Successful!");
    }
  })
});

function showEmptyCart(){
  $("#cartTable").empty();
  $("#reserveButton").remove();
  $("#emptyCart").show();
}