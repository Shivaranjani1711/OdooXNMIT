// Edit Profile
function editProfile() {
  let newName = prompt("Enter new name:");
  let newEmail = prompt("Enter new email:");
  let newPhone = prompt("Enter new phone:");

  if (newName) document.getElementById("userName").innerText = newName;
  if (newEmail) document.getElementById("userEmail").innerText = newEmail;
  if (newPhone) document.getElementById("userPhone").innerText = newPhone;
}

// Navigation functions
// Function to navigate to another page
function goToPage(pageName) {
  window.location.href = pageName; // redirect to the page
}

function showListings() {
  alert("Here will be all your posted ads (My Listings).");
}

function showPurchases() {
  alert("Here will be all items you purchased.");
}

function showWishlist() {
  alert("Here will be your saved ads.");
}

function showChats() {
  alert("Here will be your chats with buyers/sellers.");
}
function goToCart() {
  window.location.href = 'cart.html';
}
const form = document.getElementById('productForm');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Get form values
  const name = form.querySelector('input[placeholder="Enter product title"]').value;
  const price = parseInt(form.querySelector('input[placeholder="Enter price"]').value);
  const img = document.getElementById('previewImage').src;

  // Save to cart in localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push({ name, price, img, quantity: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));

  alert('Product added to cart!');
  window.location.href = 'listings.html'; // back to listings page
});


