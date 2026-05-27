function normalizePrice(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string") {
        const parsed = parseFloat(
            value.replace(/[^0-9.]/g, "")
        );

        return Number.isFinite(parsed)
            ? parsed
            : 0;
    }

    return 0;
}

function normalizeQuantity(value) {
    const quantity = Number(value);

    return Number.isFinite(quantity) &&
        quantity > 0
        ? quantity
        : 1;
}

function normalizeCartItems(cartItems = []) {
    if (!Array.isArray(cartItems)) {
        return [];
    }

    return cartItems.map((item) => {
        const fallbackProduct =
            productsData?.[item.id] || {};

        return {
            id: item.id,

            name:
                item.name ||
                fallbackProduct.name ||
                "Unknown product",

            price: normalizePrice(
                item.price ??
                    fallbackProduct.price
            ),

            image:
                item.image ||
                item.img ||
                fallbackProduct.image ||
                "",

            description:
                item.description ||
                item.desc ||
                fallbackProduct.desc ||
                "",

            quantity: normalizeQuantity(
                item.quantity
            )
        };
    });
}

function getCartItems() {
    let storedCart = [];

    try {
        storedCart =
            JSON.parse(
                localStorage.getItem("myCart")
            ) || [];
    } catch {
        storedCart = [];
    }

    const normalizedCart =
        normalizeCartItems(storedCart);

    if (
        JSON.stringify(storedCart) !==
        JSON.stringify(normalizedCart)
    ) {
        localStorage.setItem(
            "myCart",
            JSON.stringify(normalizedCart)
        );
    }

    return normalizedCart;
}

function saveCartItems(cartItems) {
    const normalizedCart =
        normalizeCartItems(cartItems);

    localStorage.setItem(
        "myCart",
        JSON.stringify(normalizedCart)
    );
}

function addToCart(productId) {
    const product =
        productsData?.[productId];

    if (!product) {
        alert(
            "Không tìm thấy thông tin sản phẩm."
        );

        return;
    }

    const cartItems = getCartItems();

    const existingItem = cartItems.find(
        (item) => item.id === productId
    );

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

    alert(
        "Sản phẩm đã được thêm vào giỏ hàng!"
    );
}

function removeFromCart(productId) {
    const cartItems = getCartItems();

    const updatedCart = cartItems.filter(
        (item) => item.id !== productId
    );

    saveCartItems(updatedCart);

    renderCart();
}

function increaseQuantity(productId) {
    const cartItems = getCartItems();

    const targetItem = cartItems.find(
        (item) => item.id === productId
    );

    if (!targetItem) {
        return;
    }

    targetItem.quantity += 1;

    saveCartItems(cartItems);

    renderCart();
}

function decreaseQuantity(productId) {
    const cartItems = getCartItems();

    const targetItem = cartItems.find(
        (item) => item.id === productId
    );

    if (!targetItem) {
        return;
    }

    targetItem.quantity -= 1;

    if (targetItem.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCartItems(cartItems);

    renderCart();
}

function clearCart() {
    localStorage.removeItem("myCart");

    renderCart();
}

function getCartTotal() {
    const cartItems = getCartItems();

    return cartItems.reduce(
        (total, item) =>
            total +
            item.price * item.quantity,
        0
    );
}

function updateCartSummary() {
    const totalElement =
        document.querySelector(
            "[data-cart-total]"
        );

    const quantityElement =
        document.querySelector(
            "[data-cart-quantity]"
        );

    const cartItems = getCartItems();

    const totalQuantity =
        cartItems.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    const totalPrice = getCartTotal();

    if (totalElement) {
        totalElement.textContent = `$${totalPrice.toFixed(
            2
        )}`;
    }

    if (quantityElement) {
        quantityElement.textContent =
            totalQuantity;
    }
}

function renderCart() {
    const container =
        document.getElementById(
            "cart-container"
        );

    const template =
        document.getElementById(
            "cart-item-template"
        );

    if (!container || !template) {
        return;
    }

    const cartItems = getCartItems();

    container.innerHTML = "";

    if (cartItems.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-message">
                Giỏ hàng của bạn đang trống
            </div>
        `;

        updateCartSummary();

        return;
    }

    cartItems.forEach((item) => {
        const clone =
            template.content.cloneNode(true);

        const totalPrice = (
            item.price * item.quantity
        ).toFixed(2);

        const qtyElement =
            clone.querySelector("[data-qty]");

        const nameElement =
            clone.querySelector("[data-name]");

        const descElement =
            clone.querySelector(
                "[data-description]"
            );

        const priceElement =
            clone.querySelector(
                "[data-price]"
            );

        const removeButton =
            clone.querySelector(
                "[data-remove-btn]"
            );

        const increaseButton =
            clone.querySelector(
                "[data-increase-btn]"
            );

        const decreaseButton =
            clone.querySelector(
                "[data-decrease-btn]"
            );

        if (qtyElement) {
            qtyElement.textContent =
                item.quantity;
        }

        if (nameElement) {
            nameElement.textContent =
                item.name;
        }

        if (descElement) {
            descElement.textContent =
                item.description;
        }

        if (priceElement) {
            priceElement.textContent = `$${totalPrice}`;
        }

        if (removeButton) {
            removeButton.addEventListener(
                "click",
                () => {
                    removeFromCart(item.id);
                }
            );
        }

        if (increaseButton) {
            increaseButton.addEventListener(
                "click",
                () => {
                    increaseQuantity(
                        item.id
                    );
                }
            );
        }

        if (decreaseButton) {
            decreaseButton.addEventListener(
                "click",
                () => {
                    decreaseQuantity(
                        item.id
                    );
                }
            );
        }

        container.appendChild(clone);
    });

    updateCartSummary();
}

function toggleMenu() {
    const menu =
        document.getElementById("menu");

    if (!menu) {
        return;
    }

    menu.classList.toggle("active");
}

function setupMenuInteractions() {
    const menu =
        document.getElementById("menu");

    const button =
        document.querySelector(
            ".btn-menu"
        );

    if (
        !menu ||
        !button ||
        document.body.dataset
            .menuInitialized === "true"
    ) {
        return;
    }

    document.addEventListener(
        "click",
        (event) => {
            const clickedInsideMenu =
                menu.contains(
                    event.target
                );

            const clickedButton =
                button.contains(
                    event.target
                );

            if (
                clickedInsideMenu ||
                clickedButton
            ) {
                return;
            }

            menu.classList.remove(
                "active"
            );
        }
    );

    document.body.dataset.menuInitialized =
        "true";
}

function sortProducts() {
    const sortSelect =
        document.querySelector(
            'select[name="product-sort"]'
        );

    const container =
        document.querySelector(
            ".main-product-grid"
        );

    if (!sortSelect || !container) {
        return;
    }

    const sortValue = sortSelect.value;

    const items = Array.from(
        container.querySelectorAll(
            ".main-item"
        )
    );

    items.sort((a, b) => {
        const nameA =
            a
                .querySelector(
                    ".item-name"
                )
                ?.innerText.toUpperCase() ||
            "";

        const nameB =
            b
                .querySelector(
                    ".item-name"
                )
                ?.innerText.toUpperCase() ||
            "";

        const priceA = normalizePrice(
            a.querySelector(
                ".item-price"
            )?.innerText
        );

        const priceB = normalizePrice(
            b.querySelector(
                ".item-price"
            )?.innerText
        );

        switch (sortValue) {
            case "az":
                return nameA.localeCompare(
                    nameB
                );

            case "za":
                return nameB.localeCompare(
                    nameA
                );

            case "highlow":
                return priceB - priceA;

            case "lowhigh":
                return priceA - priceB;

            default:
                return 0;
        }
    });

    items.forEach((item) => {
        container.appendChild(item);
    });
}

function checkout() {
    const cartItems = getCartItems();

    if (cartItems.length === 0) {
        alert(
            "Giỏ hàng của bạn đang trống. Vui lòng mua sản phẩm trên trang chính."
        );

        return;
    }

    window.location.href =
        "./check-out.html";
}

function checkoutMobileSelectedItem() {
    const cartItems = getCartItems();

    if (cartItems.length === 0) {
        alert(
            "Giỏ hàng của bạn đang trống. Vui lòng mua sản phẩm trên trang chính."
        );

        return;
    }

    window.location.href =
        "./mobile/selected-item.html";
}

function initializeCartPage() {
    renderCart();

    updateCartSummary();

    setupMenuInteractions();
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeCartPage
    );
} else {
    initializeCartPage();
}