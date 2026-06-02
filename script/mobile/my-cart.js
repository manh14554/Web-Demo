const TAX_PERCENT = 0.1;

let cachedItems = [];

function sanitizeItem(item) {
    return {
        ...item,
        price: parseFloat(item.price) || 0,
        quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
        image: typeof item.image === "string" ? item.image : ""
    };
}

function loadItems() {
    cachedItems = (getCartItems() || []).map(sanitizeItem);
    return cachedItems;
}

function saveItems(items) {
    cachedItems = items;
    saveCartItems(items);
}

function itemLabel(count) {
    return `${count} ${count === 1 ? "item" : "items"}`;
}

function calcTotals(items) {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * TAX_PERCENT;
    const grandTotal = subtotal + tax;
    return { totalQuantity, subtotal, tax, grandTotal };
}

function updateSummary(items) {
    const { totalQuantity, grandTotal } = calcTotals(items);

    const badge = document.getElementById("cart-nav-badge");
    if (badge) {
        badge.textContent = totalQuantity;
        badge.style.display = totalQuantity > 0 ? "flex" : "none";
    }

    const totalItemsEl = document.getElementById("mobile-total-items");
    const totalPriceEl = document.getElementById("mobile-total-price");
    if (totalItemsEl) totalItemsEl.textContent = itemLabel(totalQuantity);
    if (totalPriceEl) totalPriceEl.textContent = `$${grandTotal.toFixed(2)}`;
}

function reindexCards() {
    document.querySelectorAll("#mobile-cart-list .cart-mobile-card").forEach((card, i) => {
        card.dataset.index = i;
    });
}

function updateCardQty(domCard, domQty, domPrice, domDecreaseBtn, newQty, item) {
    domQty.textContent = newQty;
    // Giá từng sản phẩm hiển thị chưa bao gồm thuế; thuế chỉ tính ở tổng cuối
    domPrice.textContent = `$${(item.price * newQty).toFixed(2)}`;

    // Fix #3: disable nút decrease khi quantity = 1 để tránh UX confusing
    domDecreaseBtn.disabled = newQty <= 1;
    domDecreaseBtn.setAttribute("aria-disabled", newQty <= 1 ? "true" : "false");
}

function debounce(fn, delay = 150) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

function renderMobileCart() {
    const items = loadItems();
    const emptyView = document.querySelector(".cart-mobile-empty");
    const filledView = document.querySelector(".cart-mobile-filled");
    const list = document.getElementById("mobile-cart-list");
    const template = document.getElementById("cart-mobile-card-template");

    if (!emptyView || !filledView || !list || !template) return;

    list.innerHTML = "";

    if (items.length === 0) {
        emptyView.style.display = "flex";
        filledView.style.display = "none";
        updateSummary(items);
        return;
    }

    emptyView.style.display = "none";
    filledView.style.display = "flex";

    items.forEach((item, index) => {
        const fragment = template.content.cloneNode(true);
        const cardEl = fragment.querySelector(".cart-mobile-card");
        const image = fragment.querySelector("[data-image]");
        const name = fragment.querySelector("[data-name]");
        const qty = fragment.querySelector("[data-qty]");
        const price = fragment.querySelector("[data-price]");
        const decreaseBtn = fragment.querySelector('[data-action="decrease"]');

        cardEl.dataset.index = index;
        if (image) {
            if (item.image) {
                let imgPath = item.image;
                if (imgPath.startsWith('./images/')) {
                    imgPath = '../' + imgPath.substring(2);
                }
                image.src = imgPath;
                image.alt = item.name || "Product image";
                image.onerror = () => {
                    image.style.display = "none"; 
                };
            } else {
                image.style.display = "none";
            }
        }

        if (name) name.textContent = item.name || "Unknown product";
        if (qty) qty.textContent = item.quantity;
        if (price) price.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

        if (decreaseBtn) {
            decreaseBtn.disabled = item.quantity <= 1;
            decreaseBtn.setAttribute("aria-disabled", item.quantity <= 1 ? "true" : "false");
        }

        list.appendChild(fragment);

        const domCard = list.lastElementChild;
        const domQty = domCard.querySelector("[data-qty]");
        const domPrice = domCard.querySelector("[data-price]");
        const domDecreaseBtn = domCard.querySelector('[data-action="decrease"]');
        const domIncreaseBtn = domCard.querySelector('[data-action="increase"]');
        const domRemoveBtn = domCard.querySelector('[data-action="remove"]');

        domDecreaseBtn.addEventListener("click", debounce(() => {
            if (!domCard.isConnected) return;

            const currentIndex = parseInt(domCard.dataset.index, 10);
            const current = cachedItems[currentIndex];
            if (!current) return;

            current.quantity = Math.max(1, current.quantity - 1);
            saveItems([...cachedItems]);

            updateCardQty(domCard, domQty, domPrice, domDecreaseBtn, current.quantity, current);
            updateSummary(cachedItems);
        }));

        domIncreaseBtn.addEventListener("click", debounce(() => {
            if (!domCard.isConnected) return;

            const currentIndex = parseInt(domCard.dataset.index, 10);
            const current = cachedItems[currentIndex];
            if (!current) return;

            current.quantity += 1;
            saveItems([...cachedItems]);

            updateCardQty(domCard, domQty, domPrice, domDecreaseBtn, current.quantity, current);
            updateSummary(cachedItems);
        }));

        domRemoveBtn.addEventListener("click", () => {
            if (!domCard.isConnected) return;

            const currentIndex = parseInt(domCard.dataset.index, 10);
            cachedItems.splice(currentIndex, 1);
            saveItems([...cachedItems]);

            domCard.remove();
            reindexCards();

            if (cachedItems.length === 0) {
                if (emptyView) emptyView.style.display = "flex";
                if (filledView) filledView.style.display = "none";
            }

            updateSummary(cachedItems);
        });
    });

    updateSummary(items);
}

document.addEventListener("DOMContentLoaded", () => {
    renderMobileCart();
});