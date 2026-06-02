function renderOverview() {
    const cartItems = getCartItems();
    const container = document.getElementById("site-main-overview-item");
    const template = document.getElementById("overview-item-template");

    if (!container || !template) {
        return;
    }

    if (cartItems.length === 0) {
        container.innerHTML = "<p>Giỏ hàng trống</p>";
        return;
    }

    container.innerHTML = ""; // Clear container
    let itemTotal = 0;

    cartItems.forEach((item) => {
        itemTotal += item.price * item.quantity;
        const clone = template.content.cloneNode(true);
        clone.querySelector("[data-qty]").textContent = item.quantity;
        clone.querySelector("[data-name]").textContent = item.name;
        clone.querySelector("[data-description]").textContent = item.description || "Product description";
        clone.querySelector("[data-price]").textContent = "$" + item.price.toFixed(2);

        container.appendChild(clone);
    });

    const taxAmount = itemTotal * 0.1;
    const grandTotal = itemTotal + taxAmount;

    document.getElementById("item-total").innerText = "$" + itemTotal.toFixed(2);
    document.getElementById("tax-total").innerText = "$" + taxAmount.toFixed(2);
    document.getElementById("grand-total").innerText = "$" + grandTotal.toFixed(2);
}

function handleFinish() {
    localStorage.removeItem("myCart");
    localStorage.removeItem("checkoutInfo");
    window.location.href = "./check-out-complete.html";
}

function handleCancel() {
    window.location.href = "./cart.html";
}
renderOverview();