
function normalizePrice(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string") {
        const parsed = parseFloat(value.replace(/[^0-9.]/g, ""));
        return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
}

function normalizeCartItems(cartItems) {
    return cartItems.map((item) => {
        const fallbackProduct = productsData[item.id] || {};
        const quantity = Number(item.quantity);

        return {
            id: item.id,
            name: item.name || fallbackProduct.name || "Unknown product",
            price: normalizePrice(item.price ?? fallbackProduct.price),
            image: item.image || item.img || fallbackProduct.image || "",
            description: item.description || item.desc || fallbackProduct.desc || "",
            quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1
        };
    });
}

function getCartItems() {
    const storedCart = JSON.parse(localStorage.getItem("myCart")) || [];
    const normalizedCart = normalizeCartItems(storedCart);

    if (JSON.stringify(storedCart) !== JSON.stringify(normalizedCart)) {
        localStorage.setItem("myCart", JSON.stringify(normalizedCart));
    }

    return normalizedCart;
}

function saveCartItems(cartItems) {
    localStorage.setItem("myCart", JSON.stringify(normalizeCartItems(cartItems)));
}

function AddToCart(productId) {
    const product = productsData[productId];

    if (!product) {
        alert("Không tìm thấy thông tin sản phẩm.");
        return;
    }

    const cartItems = getCartItems();
    const existingItem = cartItems.find((item) => item.id == productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.desc,
            quantity: 1
        });
    }

    saveCartItems(cartItems);
    alert("Sản phẩm đã được thêm vào giỏ hàng!");
}

function toggleMenu() {
    const menu = document.getElementById("menu");
    if (!menu) {
        return;
    }

    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function setupMenuInteractions() {
    const menu = document.getElementById("menu");
    const btn = document.querySelector(".btn-menu");

    if (!menu || !btn || document.body.dataset.menuInitialized === "true") {
        return;
    }

    document.addEventListener("click", function (event) {
        if (menu.contains(event.target) || btn.contains(event.target)) {
            return;
        }

        menu.style.display = "none";
    });

    document.body.dataset.menuInitialized = "true";
}

function sort() {
    const sortSelect = document.querySelector('select[name="product-sort"]');
    if (!sortSelect) {
        return;
    }

    const sortValue = sortSelect.value;
    const items = Array.from(document.querySelectorAll(".main-item"));

    items.sort((a, b) => {
        const nameA = a.querySelector(".item-name").innerText.toUpperCase();
        const nameB = b.querySelector(".item-name").innerText.toUpperCase();
        const priceA = parseFloat(a.querySelector(".item-price").innerText.replace("$", ""));
        const priceB = parseFloat(b.querySelector(".item-price").innerText.replace("$", ""));

        if (sortValue === "az") {
            return nameA.localeCompare(nameB);
        }
        if (sortValue === "za") {
            return nameB.localeCompare(nameA);
        }
        if (sortValue === "highlow") {
            return priceB - priceA;
        }
        if (sortValue === "lowhigh") {
            return priceA - priceB;
        }

        return 0;
    });

    const container = document.querySelector(".main-product-grid");
    items.forEach((item) => container.appendChild(item));
}

function renderCart() {
    const container = document.getElementById("cart-container");
    const template = document.getElementById("cart-item-template");
    
    if (!container || !template) {
        return;
    }

    const cartItems = getCartItems();
    container.innerHTML = ""; // Clear container

    if (cartItems.length === 0) {
        container.innerHTML = '<div class="empty-cart-message">Giỏ hàng của bạn đang trống</div>';
        return;
    }

    cartItems.forEach((item, index) => {
        const totalPrice = (item.price * item.quantity).toFixed(2);
        
        // Clone template
        const clone = template.content.cloneNode(true);
        
        // Fill template data
        clone.querySelector("[data-qty]").textContent = item.quantity;
        clone.querySelector("[data-name]").textContent = item.name;
        clone.querySelector("[data-description]").textContent = item.description;
        clone.querySelector("[data-price]").textContent = `$${totalPrice}`;
        
        // Add remove button click handler
        clone.querySelector("[data-remove-btn]").addEventListener("click", () => {
            removeFromCart(index);
        });
        
        container.appendChild(clone);
    });
}

function removeFromCart(index) {
    const cartItems = getCartItems();
    cartItems.splice(index, 1);
    saveCartItems(cartItems);
    renderCart();
}

function checkout() {
    const cartItems = getCartItems();

    if (cartItems.length === 0) {
        alert("Giỏ hàng của bạn đang trống. Vui lòng mua sản phẩm trên trang chính.");
        return;
    }

    window.location.href = "./check-out.html";
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupMenuInteractions);
} else {
    setupMenuInteractions();
}