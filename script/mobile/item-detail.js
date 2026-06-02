const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
const quantityValue = document.querySelector(".detail-mobile-qty-value");
const quantityButtons = document.querySelectorAll(".detail-mobile-qty-btn");
let selectedQuantity = 1;

// Logic thêm vào giỏ hàng
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
    updateCartBadge();
    alert(`Đã thêm ${selectedQuantity} sản phẩm vào giỏ hàng.`);
}

// Cập nhật giao diện tăng/giảm số lượng
function renderSelectedQuantity() {
    if (quantityValue) {
        quantityValue.textContent = selectedQuantity;
    }
    const decreaseButton = document.querySelector('.detail-mobile-qty-btn[data-action="decrease"]');
    if (decreaseButton) {
        decreaseButton.disabled = selectedQuantity <= 1;
    }
}

function updateSelectedQuantity(delta) {
    selectedQuantity = Math.max(1, selectedQuantity + delta);
    renderSelectedQuantity();
}

quantityButtons.forEach((button) => {
    button.addEventListener("click", function () {
        const action = this.dataset.action;
        if (action === "increase") updateSelectedQuantity(1);
        if (action === "decrease") updateSelectedQuantity(-1);
    });
});

// Tải dữ liệu sản phẩm lên giao diện
function loadProductDetail() {
    if (!window.productsData) return;

    const nameEl = document.getElementById("detail-mobile-name");
    const priceEl = document.getElementById("detail-mobile-price");
    const imgEl = document.querySelector(".detail-mobile-img");

    if (productId && window.productsData[productId]) {
        const product = window.productsData[productId];
        
        if (nameEl) nameEl.textContent = product.name;
        if (priceEl) priceEl.textContent = product.price;
        
        if (imgEl) {
            // Xử lý lỗi ảnh khi chuyển file vào thư mục /mobile
            let imgPath = product.image;
            if (imgPath && imgPath.startsWith('./images/')) {
                imgPath = '../' + imgPath.substring(2);
            }
            imgEl.src = imgPath;
            imgEl.alt = product.name;
        }
        
        renderSelectedQuantity();
    } else {
        if (nameEl) nameEl.textContent = "Product not found.";
        const layout = document.querySelector(".detail-mobile-layout");
        if (layout) layout.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadProductDetail();
    updateCartBadge();
});