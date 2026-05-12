/* 基本設定 */
body { font-family: "Microsoft JhengHei", sans-serif; margin: 0; padding: 0; background-color: #fff; }
.container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }

.hero-section { background: #ddd; height: 200px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px; }

/* 導覽列 */
.nav-container { display: flex; gap: 5px; margin-bottom: 20px; }
.nav-item-wrapper { flex: 1; position: relative; }
.nav-item { 
    background: #55a630; color: white; padding: 15px; 
    text-align: center; cursor: pointer; font-size: 18px; font-weight: bold; 
}
.nav-item:hover { background: #386621; }

/* 雙欄目錄樣式 */
.menu-outer-box {
    position: absolute; top: 100%; left: 0; width: 450px; 
    background: white; z-index: 1000; border: 4px solid #d9ebd3;
}
.menu-header { background: #386621; color: white; text-align: center; padding: 8px; font-size: 22px; }
.menu-flex-container { display: flex; background: #d9ebd3; padding: 10px; gap: 10px; }

.category-column, .number-column { flex: 1; display: flex; flex-direction: column; gap: 8px; }

/* 按鈕樣式 */
.category-btn, .number-btn {
    background: #55a630; color: white; padding: 12px; 
    text-align: center; cursor: pointer; font-size: 18px; transition: 0.2s;
}
.category-btn:hover, .number-btn:hover { background: #386621; }

/* 隱藏/顯示邏輯 */
.third-group { display: none; flex-direction: column; gap: 8px; }

/* 內容區佈局 */
.layout-wrapper { display: flex; gap: 30px; margin-top: 30px; border-left: 5px solid #d9ebd3; padding-left: 20px; }
.image-box { flex: 0 0 300px; height: 300px; background: #eee; display: flex; align-items: center; justify-content: center; border: 1px solid #ccc; }
.image-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
.text-wrapper { flex: 1; }
