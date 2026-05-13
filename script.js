const G_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzoRn5kCz1DSvFKqDhCJJinZRdIKtMEw-4Ns7nHZ6f5sccKr7t-IyhAk7Erdpq3n8Rd/exec';

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
});

// 1. 載入導覽列
function loadNavbar() {
    fetch('title.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('nav-placeholder').innerHTML = html;
            // 載入完導覽列，才去抓資料
            fetchData();
        });
}

// 2. 抓取資料並分發任務
function fetchData() {
    fetch(G_SHEET_URL)
        .then(res => res.json())
        .then(data => {
            renderDropdown(data); // 渲染導覽列
            if (document.getElementById('product-grid')) {
                renderProducts(data); // 渲染產品頁
            }
        });
}

// 3. 處理下拉選單 (Unique 類別)
function renderDropdown(data) {
    const list = document.getElementById('product-category-list');
    if (!list) return;

    // 取得所有 category 並去重
    const categories = [...new Set(Object.values(data).map(item => item.category))];

    list.innerHTML = ''; 
    categories.forEach(cat => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="product.html?type=${encodeURIComponent(cat)}">${cat} 類</a>`;
        list.appendChild(li);
    });
}

// 4. 產品頁渲染與篩選
function renderProducts(data) {
    const grid = document.getElementById('product-grid');
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');

    const products = Object.values(data);
    const filtered = type ? products.filter(p => p.category === type) : products;

    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.imgUrl || 'https://via.placeholder.com/150'}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
        </div>
    `).join('');
}
