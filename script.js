// 設定你的 GAS 網址
const G_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzoRn5kCz1DSvFKqDhCJJinZRdIKtMEw-4Ns7nHZ6f5sccKr7t-IyhAk7Erdpq3n8Rd/exec';

/**
 * 頁面初始化
 */
document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
});

/**
 * 1. 載入導覽列並處理後續邏輯
 */
function loadNavbar() {
    fetch('title.html')
        .then(response => {
            if (!response.ok) throw new Error('找不到 title.html');
            return response.text();
        })
        .then(html => {
            const navPlaceholder = document.getElementById('nav-placeholder');
            if (navPlaceholder) {
                navPlaceholder.innerHTML = html;
                // 導覽列載入後，開始抓取 Google Sheet 資料來填充選單
                initDataLogic();
            }
        })
        .catch(err => console.error('載入導覽列失敗:', err));
}

/**
 * 2. 資料核心邏輯：區分「導覽列選單」與「產品頁內容」
 */
function initDataLogic() {
    fetch(G_SHEET_URL)
        .then(res => res.json())
        .then(data => {
            // A. 處理導覽列的產品下拉選單 (Unique Categories)
            renderDropdown(data);

            // B. 如果當前在產品頁面，則渲染產品清單
            if (window.location.pathname.includes('product.html')) {
                renderProductPage(data);
            }
        })
        .catch(err => console.error('抓取資料失敗:', err));
}

/**
 * 3. 渲染導覽列下拉選單 (自動去重)
 */
function renderDropdown(data) {
    const listContainer = document.getElementById('product-category-list');
    if (!listContainer) return;

    // 從物件中提取所有 category 並去重
    const allCategories = Object.values(data).map(item => item.category);
    const uniqueCategories = [...new Set(allCategories)];

    listContainer.innerHTML = ''; // 清空載入中字樣
    
    uniqueCategories.forEach(cat => {
        if (cat) {
            const li = document.createElement('li');
            // 點擊後會帶參數跳轉，例如 product.html?type=A
            li.innerHTML = `<a href="product.html?type=${encodeURIComponent(cat)}">${cat} 類</a>`;
            listContainer.appendChild(li);
        }
    });
}

/**
 * 4. 產品頁內容渲染 (根據網址參數篩選)
 */
function renderProductPage(data) {
    const productGrid = document.getElementById('product-grid'); // 假設產品頁有個容器叫 product-grid
    if (!productGrid) return;

    // 取得網址參數 ?type=xxx
    const urlParams = new URLSearchParams(window.location.search);
    const selectedType = urlParams.get('type');

    productGrid.innerHTML = ''; // 清空

    // 轉換資料物件為陣列並篩選
    const products = Object.values(data);
    const filteredProducts = selectedType 
        ? products.filter(p => p.category === selectedType)
        : products; // 若沒選參數，顯示全部

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p>目前沒有此類別的產品。</p>';
        return;
    }

    // 生成產品卡片 HTML
    filteredProducts.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.imgUrl || 'https://via.placeholder.com/150'}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
        `;
        productGrid.appendChild(card);
    });
}
