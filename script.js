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
            
            // --- 精確修正：只讓「產品」按鈕不跳轉 ---
            const allLinks = document.querySelectorAll('.nav-links a');
            allLinks.forEach(link => {
                // 只有帶有 dropbtn 類別的（即產品按鈕）才執行 e.preventDefault()
                if (link.classList.contains('dropbtn')) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                    });
                }
            });

            fetchData(); // 載入完導覽列後抓取資料
        })
        .catch(err => console.error('導覽列載入失敗:', err));
}

// 2. 抓取資料並判斷頁面任務
function fetchData() {
    fetch(G_SHEET_URL)
        .then(res => res.json())
        .then(data => {
            renderDropdown(data); // 渲染導覽列下拉選單
            
            // 判斷是否在產品頁面 (檢查是否有 product-id-list 容器)
            if (document.getElementById('product-id-list')) {
                renderProductList(data);
            }
        });
}

// 3. 渲染下拉選單 (不帶「類」字，間距由 CSS 控制)
function renderDropdown(data) {
    const list = document.getElementById('product-category-list');
    if (!list) return;

    const categories = [...new Set(Object.values(data).map(item => item.category))];
    list.innerHTML = ''; 
    categories.forEach(cat => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="product.html?type=${encodeURIComponent(cat)}">${cat}</a>`;
        list.appendChild(li);
    });
}

// 4. 產品頁內容渲染
function renderProductList(data) {
    const listContainer = document.getElementById('product-id-list');
    const categoryHeader = document.getElementById('display-category-name');
    const breadcrumbType = document.getElementById('breadcrumb-type');

    const urlParams = new URLSearchParams(window.location.search);
    const selectedType = urlParams.get('type') || 'A';

    categoryHeader.textContent = selectedType;
    breadcrumbType.textContent = selectedType;

    const products = Object.values(data);
    const filtered = products.filter(p => p.category === selectedType);

    listContainer.innerHTML = '';
    filtered.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-item';
        div.textContent = p.title; // 顯示 ID (如 1, 2, 11)
        listContainer.appendChild(div);
    });
}
