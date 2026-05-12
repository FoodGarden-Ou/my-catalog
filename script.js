// 請確保這是你最新的 GAS 網址 (末尾是 /exec)
const gasUrl = "https://script.google.com/macros/s/AKfycbzoRn5kCz1DSvFKqDhCJJinZRdIKtMEw-4Ns7nHZ6f5sccKr7t-IyhAk7Erdpq3n8Rd/exec";

let contentData = {};

// 1. 初始化：抓取資料
async function initData() {
    try {
        const response = await fetch(gasUrl);
        contentData = await response.json();
        console.log("資料同步成功，共有項目：", Object.keys(contentData).length);
        renderDynamicMenus(); // 抓到資料後，立即生成選單
    } catch (e) {
        console.error("同步失敗：", e);
    }
}

// 2. 動態渲染選單 (A, B, C, D...)
function renderDynamicMenus() {
    const abcContainer = document.getElementById('submenu-abc');
    const thirdContainer = document.querySelector('.third-container');
    
    // 取得所有不重複的分類 (並排序，確保 A->B->C)
    const categories = [...new Set(Object.values(contentData).map(item => item.category))].sort();
    
    // 生成 A, B, C... 的按鈕
    let abcHtml = '<ul class="sub-list">';
    categories.forEach(cat => {
        // sub-item 點擊時會觸發 toggleSub
        abcHtml += `<li class="sub-item" onclick="toggleSub(this, 'sub-${cat}')">${cat}</li>`;
    });
    abcHtml += '</ul>';
    abcContainer.innerHTML = abcHtml;

    // 生成每個分類對應的數字面板 (1, 2, 3...)
    let thirdHtml = '';
    categories.forEach(cat => {
        thirdHtml += `<div id="sub-${cat}" class="third" style="display:none;">`;
        
        // 關鍵：過濾出「這一個分類」下面的所有 ID
        const ids = Object.keys(contentData).filter(id => contentData[id].category === cat);
        
        ids.forEach(id => {
            thirdHtml += `<span onclick="changeContent('${id}', this)">${id}</span>`;
        });
        thirdHtml += `</div>`;
    });
    thirdContainer.innerHTML = thirdHtml;
}

// 3. 切換分類 (互斥邏輯：點 A 時 B 會消失)
function toggleSub(el, subId) {
    // 隱藏所有數字區
    document.querySelectorAll('.third').forEach(m => m.style.display = 'none');
    // 取消所有 A, B, C 的高亮狀態
    document.querySelectorAll('.sub-item').forEach(i => i.classList.remove('active-item'));
    
    // 顯示點選的那個分類的數字區
    const target = document.getElementById(subId);
    if (target) {
        target.style.display = 'block';
    }
    // 高亮當前點擊的 A 或 B 或 C
    el.classList.add('active-item');
}

// 4. 點擊數字後更新右側內容 (說明與圖片)
function changeContent(id, el) {
    const data = contentData[id];
    if (data) {
        // 切換顯示模式
        document.getElementById('intro-view').style.display = 'none';
        document.getElementById('detail-view').style.display = 'block';
        
        // 更新文字區
        const dynamicContent = document.getElementById('dynamic-content');
        dynamicContent.innerHTML = `
            <p class="path-label">路徑</p>
            <p class="path-data">目錄 / ${data.category} / ${data.title}</p>
            <h1 class="main-title">${data.title}</h1>
            <div class="green-line"></div>
            <div class="desc-title">說明：</div>
            <div class="desc-text">${data.desc.replace(/\n/g, '<br>')}</div>
        `;

        // 更新圖片區
        const imageBox = document.querySelector('.image-box');
        if (data.imgUrl && data.imgUrl.trim() !== "") {
            imageBox.innerHTML = `<img src="${data.imgUrl}" alt="產品圖片">`;
        } else {
            imageBox.innerHTML = '<span>圖片 2 (暫無資料)</span>';
        }
    }
    
    // 點完數字後收起選單
    hideAllMenus();
    document.getElementById('menu-main').classList.add('active-item');
}

// 切換導覽列「目錄」按鈕
function toggleMain() {
    const abc = document.getElementById('submenu-abc');
    if (abc.style.display === 'block') {
        hideAllMenus();
    } else {
        hideAllMenus();
        abc.style.display = 'block';
        document.getElementById('menu-main').classList.add('active-item');
    }
}

// 回到「介紹」頁面
function showIntro() {
    hideAllMenus();
    document.getElementById('nav-intro').classList.add('active-item');
    document.getElementById('intro-view').style.display = 'block';
    document.getElementById('detail-view').style.display = 'none';
}

// 隱藏所有選單的工具函式
function hideAllMenus() {
    document.getElementById('submenu-abc').style.display = 'none';
    document.querySelectorAll('.third').forEach(m => m.style.display = 'none');
    document.querySelectorAll('.nav-item, .sub-item').forEach(i => i.classList.remove('active-item'));
}

// 啟動程式
initData();
