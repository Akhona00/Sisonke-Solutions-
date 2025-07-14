
const stripe = Stripe("pk_test_qblFNYngBkEdjEZ16jxxoWSM"); 
const elements = stripe.elements();
const cardElement = elements.create("card");
const API_BASE_URL = "http://localhost:5000";

let cart = {};

// Toggle mobile navigation
function toggleNav() {
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.toggle("active");
}
//add color to cart
function toggleCart() {
  const cartMenu = document.getElementById("cart-menu");
  cartMenu.classList.toggle("active");
}

// Add item to cart
function addToCart(name, price) {
  if (cart[name]) {
    cart[name].quantity++;
  } else {
    cart[name] = { price, quantity: 1 };
  }
  updateCartDisplay();
}

// Remove item from cart
function removeFromCart(name) {
  delete cart[name];
  updateCartDisplay();
}

// Update cart UI
function updateCartDisplay() {
  const cartContent = document.getElementById("cart-content");
  const cartTotal = document.getElementById("cart-total");
  const totalSpan = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkout-btn");

  cartContent.innerHTML = "";
  const items = Object.entries(cart);

  if (items.length === 0) {
    cartContent.innerHTML = "<div class='cart-empty'>Your cart is empty</div>";
    cartTotal.style.display = "none";
    checkoutBtn.disabled = true;
    return;
  }

  let total = 0;
  let html = "<ul>";
  items.forEach(([name, { price, quantity }]) => {
    total += price * quantity;
    html += `
      <li>
        ${name} - R${price} x ${quantity}
        <button onclick="removeFromCart('${name}')">Remove</button>
      </li>
    `;
  });
  html += "</ul>";

  cartContent.innerHTML = html;
  totalSpan.textContent = total.toFixed(2);
  cartTotal.style.display = "block";
  checkoutBtn.disabled = false;
}

// Show error message
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    background: #f8d7da;
    color: #721c24;
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
    border: 1px solid #f5c6cb;
  `;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 5000);
}

// Show success message
function showSuccessMessage(message) {
  const successDiv = document.getElementById("success-message");
  successDiv.textContent = message;
  successDiv.style.display = "block";
  setTimeout(() => {
    successDiv.style.display = "none";
  }, 5000);
}

// Clear form and cart
function clearCart() {
  cart = {};
  updateCartDisplay();
  document.getElementById("checkout-form").reset();
}

// Handle checkout
async function handleCheckout(event) {
  event.preventDefault();

  if (Object.keys(cart).length === 0) {
    showError("Your cart is empty.");
    return;
  }

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const collectDate = document.getElementById("Date").value.trim();

  const cartItems = Object.entries(cart).map(([name, { price, quantity }]) => ({
    name,
    price,
    quantity,
  }));

  try {
    // Create payment intent
    const res = await fetch(`${API_BASE_URL}/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        email,
        phone,
        collectDate,
        cartItems,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    const { clientSecret } = data;

    // Confirm payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: fullName,
          email,
        },
      },
    });

    if (result.error) throw new Error(result.error.message);

    // Mark payment as completed
    await fetch(`${API_BASE_URL}/update-payment-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentIntentId: result.paymentIntent.id,
        status: "completed",
      }),
    });

    showSuccessMessage("Payment successful! Thank you.");
    clearCart();
  } catch (err) {
    console.error(err);
    showError(err.message || "Payment failed. Please try again.");
  }
}

// Form validation
function validateForm() {
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const collectDate = document.getElementById("Date").value.trim();
  const hasItems = Object.keys(cart).length > 0;
  const checkoutBtn = document.getElementById("checkout-btn");

  checkoutBtn.disabled = !(
    fullName &&
    email &&
    phone &&
    collectDate &&
    hasItems
  );
}

// Setup
document.addEventListener("DOMContentLoaded", () => {
  cardElement.mount("#card-element");

  cardElement.on("change", ({ error }) => {
    document.getElementById("card-errors").textContent = error
      ? error.message
      : "";
  });

  updateCartDisplay();
  validateForm();

  document
    .getElementById("checkout-form")
    .addEventListener("submit", handleCheckout);

  ["fullName", "email", "phone", "Date"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", validateForm);
  });

  // Test backend
  fetch(`${API_BASE_URL}/health`)
    .then((res) => res.json())
    .then((data) => console.log("API OK:", data))
    .catch((err) => {
      console.error("API Error:", err);
      showError("Backend not responding.");
    });
});
