const G_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzoRn5kCz1DSvFKqDhCJJinZRdIKtMEw-4Ns7nHZ6f5sccKr7t-IyhAk7Erdpq3n8Rd/exec';

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
});

function loadNavbar() {
    fetch('title.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('nav-placeholder').innerHTML = html;
            fetchData();
        });
}

function fetchData() {
    fetch(G_SHEET_URL)
        .then(res => res.json())
        .then(data => {
            renderDropdown(data);
            if (document.getElementById('product-id-list')) {
                renderProductList(data);
            }
        });
}

function renderDropdown(data) {
    const list = document.getElementById('product-category-list');
    if (!list) return;

    const categories = [...new Set(Object.values(data).map(item => item.category))];

    list.innerHTML = ''; 
    categories.forEach(cat => {
        const li = document.createElement('li');
        // 【修正點】移除多餘的 ul 標籤，並移除 "類" 字
        li.innerHTML = `<a href="product.html?type=${encodeURIComponent(cat)}">${cat}</a>`;
        list.appendChild(li);
    });
}

function renderProductList(data) {
    const listContainer = document.getElementById('product-id-list');
    const categoryHeader = document.getElementById('display-category-name');
    
    const urlParams = new URLSearchParams(window.location.search);
    const selectedType = urlParams.get('type') || 'A';

    categoryHeader.textContent = selectedType;
    document.getElementById('breadcrumb-type').textContent = selectedType;

    const products = Object.values(data);
    const filtered = products.filter(p => p.category === selectedType);

    listContainer.innerHTML = '';
    filtered.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-item';
        div.textContent = p.title; // 顯示 B 欄的 ID (1, 2, 3...)
        listContainer.appendChild(div);
    });
}
