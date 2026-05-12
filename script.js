// 請務必填入你部署後的 GAS 網頁應用程式網址 (含有 /exec 的那個)
const gasUrl = "https://script.google.com/macros/s/AKfycbzoRn5kCz1DSvFKqDhCJJinZRdIKtMEw-4Ns7nHZ6f5sccKr7t-IyhAk7Erdpq3n8Rd/exec";

let contentData = {};

/**
 * 初始化：從 Google Sheets 抓取資料
 */
async function initData() {
    try {
        const response = await fetch(gasUrl);
        contentData = await response.json();
        console.log("資料同步成功:", contentData);
    } catch (e) {
        console.error("同步失敗，請確認是否已部署為「所有人」皆可存取，或是否被瀏覽器 CORS 擋住：", e);
    }
}

// 執行初始化
initData();

/**
 * 切換「目錄」按鈕的顯示與隱藏
 */
function toggleMain() {
    const abcMenu = document.getElementById('submenu-abc');
    const isVisible = abcMenu.style.display === 'block';
    
    if (isVisible) {
        hideAllMenus();
    } else {
        hideAllMenus(); // 先清除所有選單狀態，確保乾淨
        abcMenu.style.display = 'block';
        document.getElementById('menu-main').classList.add('active-item');
    }
}

/**
 * 切換 A/B/C 子選單 (修復互斥邏輯)
 * 當點擊 A 時，B 或 C 會恢復未點擊狀態
 */
function toggleSub(el, subId) {
    // 1. 隱藏所有的第三層選單 (例如 123, 456, 789 那些區塊)
    document.querySelectorAll('.third').forEach(m => m.style.display = 'none');
    
    // 2. 重點：移除 A, B, C 的高亮狀態，讓它們恢復原狀
    // 這樣點擊 A 時，原本深色的 B 就會變回淺色
    document.querySelectorAll('.submenu-abc .sub-item').forEach(item => {
        item.classList.remove('active-item');
    });
    
    // 3. 顯示目前點擊的這個子選單 (例如 sub-A)
    const targetSub = document.getElementById(subId);
    if (targetSub) {
        targetSub.style.display = 'block';
    }
    
    // 4. 將目前點擊的 A 或 B 或 C 設為高亮 (深色)
    el.classList.add('active-item');
}

/**
 * 點擊數字 (1, 2, 3...) 後更新右側內容並自動收合
 */
function changeContent(id, el) {
    // 從連動 Google Sheets 的資料中找尋對應 ID
    const data = contentData[id];
    
    if (data) {
        // 切換顯示狀態
        document.getElementById('intro-view').style.display = 'none';
        document.getElementById('detail-view').style.display = 'flex';
        
        const dynamicContent = document.getElementById('dynamic-content');
        
        // 組合路徑 (例如：目錄 / B / 1)
        const path = `目錄 / ${data.category} / ${data.title}`;
        
        // 渲染新版排版 (路徑、大標題、橫線、說明)
        dynamicContent.innerHTML = `
            <p class="path-label">路徑</p>
            <p class="path-data">${path}</p>
            <h1 class="main-title">${data.title}</h1>
            <div class="green-line"></div>
            <div class="desc-title">說明：</div>
            <div class="desc-text">${data.desc.replace(/\n/g, '<br>')}</div>
        `;
        
        // 更新圖片框文字
        document.querySelector('.image-box').innerText = data.imgSrc;
    } else {
        console.warn("找不到 ID 為 " + id + " 的資料，請檢查 Google Sheet B 欄。");
    }

    // 點完後自動收回選單
    hideAllMenus();
    
    // 讓「目錄」主按鈕保持高亮
    document.getElementById('menu-main').classList.add('active-item');
}

/**
 * 點擊「介紹」回到初始頁面
 */
function showIntro() {
    hideAllMenus();
    document.getElementById('nav-intro').classList.add('active-item');
    document.getElementById('intro-view').style.display = 'block';
    document.getElementById('detail-view').style.display = 'none';
}

/**
 * 隱藏所有選單並清除所有高亮狀態
 */
function hideAllMenus() {
    // 隱藏選單
    const submenu = document.getElementById('submenu-abc');
    if (submenu) submenu.style.display = 'none';
    
    document.querySelectorAll('.third').forEach(m => m.style.display = 'none');
    
    // 清除所有按鈕的高亮 (CSS active-item 類別)
    document.querySelectorAll('.nav-item, .sub-item').forEach(i => {
        i.classList.remove('active-item');
    });
}