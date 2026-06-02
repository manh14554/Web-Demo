function renderCheckoutOrderAddressPage() {
    const cartItems = getCartItems();
    const totalQuantity = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const badge = document.getElementById("checkout-order-address-nav-badge");

    if (badge) {
        badge.textContent = totalQuantity;
        badge.style.display = totalQuantity > 0 ? "flex" : "none";
    }

    const savedInfo = JSON.parse(localStorage.getItem("checkoutOrderAddress") || localStorage.getItem("checkoutInfo") || "null");
    if (!savedInfo) {
        return;
    }

    const fullName = document.getElementById("fullName");
    const addressLine1 = document.getElementById("addressLine1");
    const addressLine2 = document.getElementById("addressLine2");
    const city = document.getElementById("city");
    const stateRegion = document.getElementById("stateRegion");
    const zipCode = document.getElementById("zipCode");
    const country = document.getElementById("country");

    if (fullName) fullName.value = savedInfo.fullName || fullName.value;
    if (addressLine1) addressLine1.value = savedInfo.addressLine1 || addressLine1.value;
    if (addressLine2) addressLine2.value = savedInfo.addressLine2 || addressLine2.value;
    if (city) city.value = savedInfo.city || city.value;
    if (stateRegion) stateRegion.value = savedInfo.stateRegion || stateRegion.value;
    if (zipCode) zipCode.value = savedInfo.zipCode || zipCode.value;
    if (country) country.value = savedInfo.country || country.value;
}

function handleCheckoutOrderAddressNext() {
    const cartItems = getCartItems();
    if (cartItems.length === 0) {
        alert("Your cart is empty. Please go back to the cart.");
        return;
    }

    const fullName = document.getElementById("fullName").value.trim();
    const addressLine1 = document.getElementById("addressLine1").value.trim();
    const addressLine2 = document.getElementById("addressLine2").value.trim();
    const city = document.getElementById("city").value.trim();
    const stateRegion = document.getElementById("stateRegion").value.trim();
    const zipCode = document.getElementById("zipCode").value.trim();
    const country = document.getElementById("country").value.trim();

    if (!fullName || !addressLine1 || !city || !zipCode || !country) {
        alert("Please fill in the required shipping address fields.");
        return;
    }

    const payload = {
        fullName,
        addressLine1,
        addressLine2,
        city,
        stateRegion,
        zipCode,
        country
    };

    localStorage.setItem("checkoutOrderAddress", JSON.stringify(payload));
    localStorage.setItem("checkoutInfo", JSON.stringify(payload));

    window.location.href = "../mobile/checkout-payment-method.html";
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderCheckoutOrderAddressPage);
} else {
    renderCheckoutOrderAddressPage();
}
