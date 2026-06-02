function renderCheckoutPaymentMethodPage() {
    const cartItems = getCartItems();
    const totalQuantity = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const badge = document.getElementById("checkout-payment-method-nav-badge");

    if (badge) {
        badge.textContent = totalQuantity;
        badge.style.display = totalQuantity > 0 ? "flex" : "none";
    }

    const savedCheckout = JSON.parse(localStorage.getItem("checkoutInfo") || "null");
    const savedShippingName = savedCheckout?.fullName || "Rebecca Winter";
    const savedPayment = savedCheckout?.paymentMethod || {};

    const cardName = document.getElementById("cardName");
    const cardNumber = document.getElementById("cardNumber");
    const expirationDate = document.getElementById("expirationDate");
    const securityCode = document.getElementById("securityCode");
    const billingSameAsShipping = document.getElementById("billingSameAsShipping");
    const buyButton = document.getElementById("checkout-payment-method-buy");

    if (cardName) cardName.value = savedPayment.cardName || savedShippingName;
    if (cardNumber) cardNumber.value = savedPayment.cardNumber || cardNumber.value;
    if (expirationDate) expirationDate.value = savedPayment.expirationDate || expirationDate.value;
    if (securityCode) securityCode.value = savedPayment.securityCode || securityCode.value;
    if (billingSameAsShipping) billingSameAsShipping.checked = savedPayment.billingSameAsShipping !== false;

    if (buyButton) {
        buyButton.addEventListener("click", handleCheckoutPaymentMethodBuy);
    }
}

function handleCheckoutPaymentMethodBuy() {
    const cartItems = getCartItems();
    if (cartItems.length === 0) {
        alert("Your cart is empty. Please go back to the cart.");
        return;
    }

    const cardName = document.getElementById("cardName").value.trim();
    const cardNumber = document.getElementById("cardNumber").value.trim();
    const expirationDate = document.getElementById("expirationDate").value.trim();
    const securityCode = document.getElementById("securityCode").value.trim();

    if (!cardName || !cardNumber || !expirationDate || !securityCode) {
        alert("Please fill in the required payment fields.");
        return;
    }

    localStorage.removeItem("checkoutOrderAddress");
    localStorage.removeItem("checkoutInfo");
    localStorage.removeItem("myCart");

    window.location.href = "./checkout-complete.html";
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderCheckoutPaymentMethodPage);
} else {
    renderCheckoutPaymentMethodPage();
}
