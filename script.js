const G_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzoRn5kCz1DSvFKqDhCJJinZRdIKtMEw-4Ns7nHZ6f5sccKr7t-IyhAk7Erdpq3n8Rd/exec';

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
});

function loadNavbar() {
    fetch('title.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('nav-placeholder').innerHTML = html;
            
            // 處理產品按鈕不跳轉
            const dropBtn = document.querySelector('.dropbtn');
            if (dropBtn) {
                dropBtn.onclick = (e) => e.preventDefault();
            }

            fetchData(); // 載入導覽列後才抓資料
        });
}

function fetchData() {
    fetch(G_SHEET_URL)
        .then(res => res.json())
        .then(data => {
            renderDropdown(data); // 渲染導覽列下拉選單
            
            // 如果在 product.html，執行產品清單渲染
            if (document.getElementById('product-id-list')) {
                renderProductList(data);
            }
        });
}

function renderDropdown(data) {
    const list = document.getElementById('product-category-list');
    if (!list) return;
    
    // 取得唯一類型
    const categories = [...new Set(Object.values(data).map(item => item.category))];
    list.innerHTML = ''; 
    categories.forEach(cat => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="product.html?type=${encodeURIComponent(cat)}">${cat}</a>`;
        list.appendChild(li);
    });
}

function renderProductList(data) {
    const listContainer = document.getElementById('product-id-list');
    const categoryTitle = document.getElementById('display-category-name');
    const breadcrumbType = document.getElementById('breadcrumb-type');

    // 取得網址參數 ?type=A
    const urlParams = new URLSearchParams(window.location.search);
    const selectedType = urlParams.get('type') || 'A'; // 預設顯示 A

    // 更新標題與麵包屑
    categoryTitle.textContent = selectedType;
    breadcrumbType.textContent = selectedType;

    // 將資料物件轉換為陣列並篩選符合類型的產品
    const products = Object.values(data);
    const filteredProducts = products.filter(p => p.category === selectedType);

    // 渲染清單 (1, 2, 3...)
    listContainer.innerHTML = '';
    filteredProducts.forEach(p => {
        const item = document.createElement('div');
        item.className = 'product-item';
        item.textContent = p.title; // 這裡 p.title 就是你 GAS 裡的 id (B欄)
        listContainer.appendChild(item);
    });
}
