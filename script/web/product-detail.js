const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
let selectedQuantity = 1;

function addToCartFromDetail() {
    if (!productId || !window.productsData || !window.productsData[productId]) {
        return;
    }

    const product = window.productsData[productId];
    const cartItems = getCartItems();
    const existingItem = cartItems.find((item) => item.id == productId);

    if (existingItem) {
        existingItem.quantity += selectedQuantity;
    } else {
        cartItems.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.desc,
            quantity: selectedQuantity
        });
    }

    saveCartItems(cartItems);
    alert(`Đã thêm ${selectedQuantity} sản phẩm vào giỏ hàng.`);
}

function loadProductDetail() {
    if (!window.productsData) {
        console.error("Products data not loaded");
        return;
    }

    const setTextIfExists = (selector, value) => {
        const el = document.querySelector(selector);
        if (el) {
            el.textContent = value;
        }
    };

    const setImages = (src) => {
        document.querySelectorAll(".detail-img").forEach((img) => {
            img.src = src.startsWith("../") ? src : "../" + src;
        });
    };

    if (productId && window.productsData[productId]) {
        const product = window.productsData[productId];
        setTextIfExists("#detail-name", product.name);
        setTextIfExists("#detail-desc", product.desc);
        setTextIfExists("#detail-price", product.price);
        setImages(product.image);
    } else {
        setTextIfExists("#detail-name", "Product not found.");
        setTextIfExists("#detail-desc", "Please return to the catalog and choose another product.");

        const desktopPrice = document.getElementById("detail-price");
        const desktopImg = document.querySelector(".detail-img");
        const desktopBtn = document.querySelector(".detail-add-btn");

        if (desktopPrice) desktopPrice.style.display = "none";
        if (desktopImg) desktopImg.style.display = "none";
        if (desktopBtn) desktopBtn.style.display = "none";
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadProductDetail);
} else {
    loadProductDetail();
}