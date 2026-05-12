const gasUrl = "https://script.google.com/macros/s/AKfycbzoRn5kCz1DSvFKqDhCJJinZRdIKtMEw-4Ns7nHZ6f5sccKr7t-IyhAk7Erdpq3n8Rd/exec";
let contentData = {};

// 初始化
async function initData() {
    console.log("開始同步雲端資料...");
    try {
        // 加入快取消除機制，確保每次都抓最新
        const response = await fetch(`${gasUrl}?t=${new Date().getTime()}`);
        contentData = await response.json();
        
        if (contentData.error) {
            alert("試算表讀取錯誤：" + contentData.error);
            return;
        }

        console.log("同步成功，繪製選單中...");
        renderDynamicMenus();
        
        // 資料載入完成後，可以給個小提示或改變狀態
        document.getElementById('menu-main').innerText = "目錄 (已更新)";
    } catch (e) {
        console.error("無法連線至 Google Sheet：", e);
        alert("網路連線異常，請重新整理網頁");
    }
}

// 動態生成選單 (A, B, C, D...)
function renderDynamicMenus() {
    const abcContainer = document.getElementById('submenu-abc');
    const thirdContainer = document.querySelector('.third-container');
    
    // 取得所有分類並排序
    const categories = [...new Set(Object.values(contentData).map(item => item.category))].sort();
    
    // 生成 A, B, C...
    let abcHtml = '<ul class="sub-list">';
    categories.forEach(cat => {
        abcHtml += `<li class="sub-item" onclick="toggleSub(this, 'sub-${cat}')">${cat}</li>`;
    });
    abcHtml += '</ul>';
    abcContainer.innerHTML = abcHtml;

    // 生成 1, 2, 3...
    let thirdHtml = '';
    categories.forEach(cat => {
        thirdHtml += `<div id="sub-${cat}" class="third" style="display:none;">`;
        const ids = Object.keys(contentData).filter(id => contentData[id].category === cat);
        ids.forEach(id => {
            thirdHtml += `<span onclick="changeContent('${id}', this)">${id}</span>`;
        });
        thirdHtml += `</div>`;
    });
    thirdContainer.innerHTML = thirdHtml;
}

// 點擊數字後的跳轉與內容更新
function changeContent(id, el) {
    const data = contentData[id];
    
    // 預防機制：如果資料還沒載入就點擊
    if (!data) {
        console.log("資料載入中，請稍候...");
        return;
    }

    // 強制顯示詳細頁面
    document.getElementById('intro-view').style.display = 'none';
    document.getElementById('detail-view').style.display = 'block';
    
    // 更新路徑與文字
    document.getElementById('dynamic-content').innerHTML = `
        <p class="path-label">路徑</p>
        <p class="path-data">目錄 / ${data.category} / ${data.title}</p>
        <h1 class="main-title">${data.title}</h1>
        <div class="green-line"></div>
        <div class="desc-title">說明：</div>
        <div class="desc-text">${data.desc.replace(/\n/g, '<br>')}</div>
    `;

    // 更新圖片
    const imageBox = document.querySelector('.image-box');
    if (data.imgUrl && data.imgUrl.trim() !== "") {
        imageBox.innerHTML = `<img src="${data.imgUrl}" alt="產品圖片">`;
    } else {
        imageBox.innerHTML = '<span>圖片 2 (暫無資料)</span>';
    }
    
    hideAllMenus();
    document.getElementById('menu-main').classList.add('active-item');
    
    // 點擊後自動滾動到上方，確保使用者看到內容
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleSub(el, subId) {
    document.querySelectorAll('.third').forEach(m => m.style.display = 'none');
    document.querySelectorAll('.sub-item').forEach(i => i.classList.remove('active-item'));
    const target = document.getElementById(subId);
    if (target) target.style.display = 'block';
    el.classList.add('active-item');
}

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

function showIntro() {
    hideAllMenus();
    document.getElementById('nav-intro').classList.add('active-item');
    document.getElementById('intro-view').style.display = 'block';
    document.getElementById('detail-view').style.display = 'none';
}

function hideAllMenus() {
    const abc = document.getElementById('submenu-abc');
    if (abc) abc.style.display = 'none';
    document.querySelectorAll('.third').forEach(m => m.style.display = 'none');
    document.querySelectorAll('.nav-item, .sub-item').forEach(i => i.classList.remove('active-item'));
}

// 立即執行
initData();
