document.querySelectorAll(".btn-add-to-cart").forEach(btn => {
    btn.addEventListener("click", function(e) {
        e.stopPropagation();
        const card = this.closest(".main-item");
        const id = card.dataset.id;
        addToCart(id);
    });
});

document.querySelectorAll(".btn-remove-inventory").forEach(btn => {
    btn.addEventListener("click", function(e) {
        e.stopPropagation();

        const card = this.closest(".main-item");
        const id = card.dataset.id;
        removeCart(id);
    });
});
function removeCart(id){
    const item = document.querySelector(`[data-id="${id}"]`);
        if(item){
            item.remove();
        }
    }

function goToProductDetail(id){
    window.location.href = `product-detail.html?id=${id}`;
}

function sortProduct() {
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