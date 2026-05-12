const gasUrl = "你的GAS網址"; // 請確認換成最新的 /exec 網址
let contentData = {};

async function initData() {
    try {
        const response = await fetch(`${gasUrl}?t=${new Date().getTime()}`);
        contentData = await response.json();
        renderDynamicMenus();
    } catch (e) { console.error("資料加載失敗", e); }
}

function renderDynamicMenus() {
    const categoryList = document.getElementById('category-list');
    const thirdContainer = document.getElementById('third-container');
    
    const categories = [...new Set(Object.values(contentData).map(item => item.category))].sort();
    
    // 生成 A, B, C 方塊
    let catHtml = '';
    categories.forEach(cat => {
        catHtml += `<div class="category-btn" onclick="toggleSub(this, 'sub-${cat}')">${cat}</div>`;
    });
    categoryList.innerHTML = catHtml;

    // 生成 1, 2, 3 按鈕
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

function toggleMain() {
    const abc = document.getElementById('submenu-abc');
    abc.style.display = (abc.style.display === 'none') ? 'block' : 'none';
}

function toggleSub(el, subId) {
    // 隱藏所有數字組
    document.querySelectorAll('.third-group').forEach(g => g.style.display = 'none');
    // 顯示選中的那組
    const target = document.getElementById(subId);
    if (target) target.style.display = 'flex';
}

function changeContent(id) {
    const data = contentData[id];
    if (!data) return;

    document.getElementById('intro-view').style.display = 'none';
    document.getElementById('detail-view').style.display = 'block';
    
    document.getElementById('dynamic-content').innerHTML = `
        <p>目錄 / ${data.category} / ${data.title}</p>
        <h1>${data.title}</h1>
        <hr>
        <p><strong>說明：</strong></p>
        <p>${data.desc.replace(/\n/g, '<br>')}</p>
    `;

    const imageBox = document.querySelector('.image-box');
    imageBox.innerHTML = data.imgUrl ? `<img src="${data.imgUrl}">` : '暫無圖片';

    // 點完數字後隱藏選單
    document.getElementById('submenu-abc').style.display = 'none';
    document.querySelectorAll('.third-group').forEach(g => g.style.display = 'none');
}

function showIntro() {
    document.getElementById('intro-view').style.display = 'block';
    document.getElementById('detail-view').style.display = 'none';
}

initData();
