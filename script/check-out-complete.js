function renderCheckOutCompletePage() {
    const cartItems = getCartItems();
    const totalQuantity = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const badge = document.getElementById("check-out-complete-nav-badge");

    if (badge) {
        badge.textContent = totalQuantity;
        badge.style.display = totalQuantity > 0 ? "flex" : "none";
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderCheckOutCompletePage);
} else {
    renderCheckOutCompletePage();
}
