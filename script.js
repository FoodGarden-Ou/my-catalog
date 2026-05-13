const G_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzoRn5kCz1DSvFKqDhCJJinZRdIKtMEw-4Ns7nHZ6f5sccKr7t-IyhAk7Erdpq3n8Rd/exec';

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
});

// 1. 載入導覽列組件
function loadNavbar() {
    fetch('title.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('nav-placeholder').innerHTML = html;
            // 載入完導覽列，才開始抓取 Google Sheet 資料
            fetchData();
        });
}

// 2. 抓取資料
function fetchData() {
    fetch(G_SHEET_URL)
        .then(res => res.json())
        .then(data => {
            renderDropdown(data);
            // 如果在產品頁面，執行產品渲染
            if (document.getElementById('product-grid')) {
                renderProducts(data);
            }
        });
}

// 3. 渲染下拉選單 (不含「類」字)
function renderDropdown(data) {
    const list = document.getElementById('product-category-list');
    if (!list) return;

    // 取得唯一類別清單
    const categories = [...new Set(Object.values(data).map(item => item.category))];

    list.innerHTML = ''; 
    categories.forEach(cat => {
        const li = document.createElement('li');
        // A、B、C 類點擊後跳轉到產品頁，並篩選類別
        li.innerHTML = `<a href="product.html?type=${encodeURIComponent(cat)}">${cat}</a>`;
        list.appendChild(li);
    });
}

// 4. 產品頁渲染邏輯
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
