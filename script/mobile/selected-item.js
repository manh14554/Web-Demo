function formatCurrency(value) {
    const amount = Number(value);
    return `$${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"}`;
}

function getSelectedItemTotals(cartItems) {
    const totalQuantity = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0);
    const taxAmount = subtotal * 0.1;
    const grandTotal = subtotal + taxAmount;
    
    return { totalQuantity, subtotal, taxAmount, grandTotal};
}

function resolveMobileImagePath(imagePath) {
    if (typeof imagePath !== "string" || imagePath.length === 0) {
        return "../images/balo.png";
    }

    if (imagePath.startsWith("./images/")) {
        return imagePath.replace("./images/", "../images/");
    }

    return imagePath;
}

function renderSelectedItemPage() {
    const cartItems = getCartItems();
    const selectedItem = cartItems[0];
    const totals = getSelectedItemTotals(cartItems);

    const image = document.querySelector("[data-selected-image]");
    const name = document.querySelector("[data-selected-name]");
    const price = document.querySelector("[data-selected-price]");
    const totalItems = document.querySelector("[data-selected-total-items]");
    const grandTotal = document.querySelector("[data-selected-grand-total]");
    const badge = document.getElementById("selected-item-nav-badge");

    if (image) {
        image.src = resolveMobileImagePath(selectedItem.image);
        image.alt = selectedItem.name || "Selected product";
    }

    if (name) {
        name.textContent = selectedItem.name || "Swag Labs Backpack";
    }

    if (price) {
        price.textContent = formatCurrency(selectedItem.price || 0);
    }

    if (totalItems) {
        totalItems.textContent = `${totals.totalQuantity} items`;
    }

    if (grandTotal) {
        grandTotal.textContent = formatCurrency(totals.grandTotal);
    }

    if (badge) {
        badge.textContent = totals.totalQuantity;
        badge.style.display = totals.totalQuantity > 0 ? "flex" : "none";
    }
}

function handlePlaceOrderMobile() {
    const cartItems = getCartItems();

    if (cartItems.length === 0) {
        alert("Giỏ hàng của bạn đang trống. Vui lòng quay lại trang chính.");
        return;
    }

    window.location.href = "./checkout-order-address.html";
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderSelectedItemPage);
} else {
    renderSelectedItemPage();
}
