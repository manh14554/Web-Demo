function goToDetail(id) {
    window.location.href = `./item-detail.html?id=${id}`;
}

// Logic sắp xếp
function sortProduct() {
    const select = document.querySelector('select[name="product-sort"]');
    if (!select) return;

    const val = select.value;
    const container = document.getElementById('catalog-main');
    const cards = Array.from(document.querySelectorAll('.main-item'));

    cards.sort((a, b) => {
        const nameA = a.querySelector('.item-name').innerText.toUpperCase();
        const nameB = b.querySelector('.item-name').innerText.toUpperCase();
        const priceA = parseFloat(a.querySelector('.item-price').innerText.replace('$', ''));
        const priceB = parseFloat(b.querySelector('.item-price').innerText.replace('$', ''));

        if (val === 'az') return nameA.localeCompare(nameB);
        if (val === 'za') return nameB.localeCompare(nameA);
        if (val === 'highlow') return priceB - priceA;
        if (val === 'lowhigh') return priceA - priceB;
        return 0;
    });

    cards.forEach(card => container.appendChild(card));
}