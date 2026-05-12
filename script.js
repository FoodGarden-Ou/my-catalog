// 請確保這是你最新的 GAS 網址
const gasUrl = "https://script.google.com/macros/s/AKfycbzoRn5kCz1DSvFKqDhCJJinZRdIKtMEw-4Ns7nHZ6f5sccKr7t-IyhAk7Erdpq3n8Rd/exec";
let contentData = {};

// 初始化
async function initData() {
    try {
        const response = await fetch(`${gasUrl}?t=${new Date().getTime()}`);
        contentData = await response.json();
        renderDynamicMenus();
    } catch (e) {
        console.error("資料加載失敗", e);
    }
}

// 繪製選單
function renderDynamicMenus() {
    const categoryList = document.getElementById('category-list');
    const thirdContainer = document.getElementById('third-container');
    if (!categoryList || !thirdContainer) return;

    // 取得分類 (A, B, C)
    const categories = [...new Set(Object.values(contentData).map(item => item.category))].sort();
    
    // 生成左側按鈕
    categoryList.innerHTML = categories.map(cat => 
        `<div class="category-btn" onclick="toggleSub(this, 'sub-${cat}')">${cat}</div>`
    ).join('');

    // 生成右側數字組 (預設隱藏)
    let thirdHtml = '';
    categories.forEach(cat => {
        thirdHtml += `<div id="sub-${cat}" class="third-group">`;
        const ids = Object.keys(contentData).filter(id => contentData[id].category === cat);
        ids.forEach(id => {
            thirdHtml += `<div class="number-btn" onclick="changeContent('${id}')">${id}</div>`;
        });
        thirdHtml += `</div>`;
    });
    thirdContainer.innerHTML = thirdHtml;
}

// 點擊 A, B, C 切換右側顯示
function toggleSub(el, subId) {
    // 隱藏所有數字組
    document.querySelectorAll('.third-group').forEach(g => g.style.display = 'none');
    // 顯示對應的數字組
    const target = document.getElementById(subId);
    if (target) target.style.display = 'flex';

    // 改變按鈕高亮
    document.querySelectorAll('.category-btn').forEach(btn => btn.style.background = '#55a630');
    el.style.background = '#386621';
}

// 點擊數字 (1, 2, 3) 更新內容
function changeContent(id) {
    const data = contentData[id];
    if (!data) return;

    document.getElementById('intro-view').style.display = 'none';
    document.getElementById('detail-view').style.display = 'block';
    
    document.getElementById('dynamic-content').innerHTML = `
        <p style="color: #888;">路徑：目錄 / ${data.category} / ${data.title}</p>
        <h1 style="margin: 10px 0;">${data.title}</h1>
        <div style="width: 100%; height: 2px; background: #aacc00; margin-bottom: 20px;"></div>
        <p><strong>說明：</strong></p>
        <p style="line-height: 1.6;">${data.desc.replace(/\n/g, '<br>')}</p>
    `;

    const imageBox = document.querySelector('.image-box');
    imageBox.innerHTML = data.imgUrl ? `<img src="${data.imgUrl}">` : '暫無圖片';

    // 關閉選單
    document.getElementById('submenu-abc').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMain() {
    const menu = document.getElementById('submenu-abc');
    menu.style.display = (menu.style.display === 'none') ? 'block' : 'none';
}

function showIntro() {
    document.getElementById('intro-view').style.display = 'block';
    document.getElementById('detail-view').style.display = 'none';
    document.getElementById('submenu-abc').style.display = 'none';
}

initData();
