/* --- script.js --- */
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
            
            // 精確控制：只有「產品」標籤不跳轉
            const links = document.querySelectorAll('.nav-links a');
            links.forEach(link => {
                if (link.classList.contains('dropbtn')) {
                    link.onclick = (e) => e.preventDefault();
                }
            });

            fetchData(); // 導覽列就緒後才抓資料
        });
}

// 2. 抓取資料庫
function fetchData() {
    fetch(G_SHEET_URL)
        .then(res => res.json())
        .then(data => {
            renderDropdown(data); // 覆蓋導覽列的 Loading...
            
            // 只有在產品頁面才執行清單渲染
            if (document.getElementById('product-id-list')) {
                renderProductList(data);
            }
        })
        .catch(err => {
            console.error("資料載入錯誤:", err);
            const list = document.getElementById('product-category-list');
            if (list) list.innerHTML = '<li><a href="#">載入失敗</a></li>';
        });
}

// 3. 渲染下拉選單
function renderDropdown(data) {
    const list = document.getElementById('product-category-list');
    if (!list) return;

    // 取得唯一類別清單
    const categories = [...new Set(Object.values(data).map(item => item.category))];
    
    list.innerHTML = ''; // 清除 Loading...
    
    categories.forEach(cat => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="product.html?type=${encodeURIComponent(cat)}">${cat}</a>`;
        list.appendChild(li);
    });
}

// 4. 渲染產品頁內容 (1, 2, 3...)
function renderProductList(data) {
    const listContainer = document.getElementById('product-id-list');
    const categoryHeader = document.getElementById('display-category-name');
    const breadcrumbType = document.getElementById('breadcrumb-type');

    const urlParams = new URLSearchParams(window.location.search);
    const selectedType = urlParams.get('type') || 'A';

    // 覆蓋頁面上的 Loading...
    if (categoryHeader) categoryHeader.textContent = selectedType;
    if (breadcrumbType) breadcrumbType.textContent = selectedType;

    const products = Object.values(data);
    const filtered = products.filter(p => p.category === selectedType);

    listContainer.innerHTML = ''; // 清除資料載入中...
    
    if (filtered.length === 0) {
        listContainer.innerHTML = '<div>無對應產品資料</div>';
        return;
    }

    filtered.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-item';
        div.textContent = p.title; // 顯示 B 欄編號
        listContainer.appendChild(div);
    });
}
