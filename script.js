// 1. 這裡填入你的 GAS 網址
const gasUrl = "https://script.google.com/macros/s/AKfycbzoRn5kCz1DSvFKqDhCJJinZRdIKtMEw-4Ns7nHZ6f5sccKr7t-IyhAk7Erdpq3n8Rd/exec";

// 2. 這裡初始化為空物件
let contentData = {};

async function initData() {
    console.log("正在抓取雲端資料...");
    try {
        // 使用時間戳記防止瀏覽器快取舊資料
        const response = await fetch(`${gasUrl}?t=${new Date().getTime()}`);
        contentData = await response.json();
        console.log("資料抓取成功:", contentData);
        renderDynamicMenus();
    } catch (e) { 
        console.error("資料加載失敗，請檢查 GAS 部署是否為『所有人』", e); 
    }
}

function renderDynamicMenus() {
    const categoryList = document.getElementById('category-list');
    const thirdContainer = document.getElementById('third-container');
    
    // 確保容器存在
    if (!categoryList || !thirdContainer) return;

    const categories = [...new Set(Object.values(contentData).map(item => item.category))].sort();
    
    // 生成 A, B, C 大方塊
    let catHtml = '';
    categories.forEach(cat => {
        catHtml += `<div class="category-btn" onclick="toggleSub(this, 'sub-${cat}')">${cat}</div>`;
    });
    categoryList.innerHTML = catHtml;

    // 生成 1, 2, 3 按鈕組
    let thirdHtml = '';
    categories.forEach(cat => {
        thirdHtml += `<div id="sub-${cat}" class="third-group" style="display:none;">`;
        const ids = Object.keys(contentData).filter(id => contentData[id].category === cat);
        ids.forEach(id => {
            thirdHtml += `<div class="number-btn" onclick="changeContent('${id}')">${id}</div>`;
        });
        thirdHtml += `</div>`;
    });
    thirdContainer.innerHTML = thirdHtml;
}

function toggleMain() {
    const abc = document.getElementById('submenu-abc');
    if (!abc) return;
    abc.style.display = (abc.style.display === 'none' || abc.style.display === '') ? 'block' : 'none';
}

function toggleSub(el, subId) {
    // 隱藏所有數字組
    document.querySelectorAll('.third-group').forEach(g => g.style.display = 'none');
    // 顯示選中的那一組
    const target = document.getElementById(subId);
    if (target) {
        target.style.display = 'flex';
    }
}

function changeContent(id) {
    const data = contentData[id];
    if (!data) return;

    // 切換視圖
    document.getElementById('intro-view').style.display = 'none';
    document.getElementById('detail-view').style.display = 'block';
    
    // 更新文字內容
    document.getElementById('dynamic-content').innerHTML = `
        <p style="color: #666;">目錄 / ${data.category} / ${data.title}</p>
        <h1 style="font-size: 32px; margin: 10px 0;">${data.title}</h1>
        <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;">
        <p><strong>說明：</strong></p>
        <p style="line-height: 1.6;">${data.desc.replace(/\n/g, '<br>')}</p>
    `;

    // 更新圖片
    const imageBox = document.querySelector('.image-box');
    if (imageBox) {
        imageBox.innerHTML = data.imgUrl ? `<img src="${data.imgUrl}" style="max-width:100%; max-height:100%; object-fit:contain;">` : '暫無圖片';
    }

    // 點完數字後自動收起選單
    const abc = document.getElementById('submenu-abc');
    if (abc) abc.style.display = 'none';
    document.querySelectorAll('.third-group').forEach(g => g.style.display = 'none');
    
    // 畫面捲動到頂端
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showIntro() {
    document.getElementById('intro-view').style.display = 'block';
    document.getElementById('detail-view').style.display = 'none';
    const abc = document.getElementById('submenu-abc');
    if (abc) abc.style.display = 'none';
}

// 執行初始化
initData();
