// market.js - Мониторинг рынка с калькулятором крафта
// ==================================================

// Конфигурация
const CONFIG = {
    apiEndpoint: 'https://europe.albion-online-data.com/api/v2/stats',
    cacheTime: 120000, // 2 минуты
    defaultReturn: 36.7 // процент возврата по умолчанию
};

// Состояние приложения
let AppState = {
    currentCity: 'Fort Sterling',
    currentFilter: 'all',
    searchQuery: '',
    prices: [],
    lastUpdate: null,
    isLoading: false
};

// ID предметов для запроса
const ITEM_IDS = [
    // Руда и слитки
    'T2_ORE', 'T3_ORE', 'T4_ORE', 'T5_ORE', 'T6_ORE', 'T7_ORE', 'T8_ORE',
    'T2_METALBAR', 'T3_METALBAR', 'T4_METALBAR', 'T5_METALBAR', 'T6_METALBAR', 'T7_METALBAR', 'T8_METALBAR',
    // Древесина и доски
    'T2_WOOD', 'T3_WOOD', 'T4_WOOD', 'T5_WOOD', 'T6_WOOD', 'T7_WOOD', 'T8_WOOD',
    'T2_PLANKS', 'T3_PLANKS', 'T4_PLANKS', 'T5_PLANKS', 'T6_PLANKS', 'T7_PLANKS', 'T8_PLANKS',
    // Кожа и шкуры
    'T2_HIDE', 'T3_HIDE', 'T4_HIDE', 'T5_HIDE', 'T6_HIDE', 'T7_HIDE', 'T8_HIDE',
    'T2_LEATHER', 'T3_LEATHER', 'T4_LEATHER', 'T5_LEATHER', 'T6_LEATHER', 'T7_LEATHER', 'T8_LEATHER',
    // Ткань и волокно
    'T2_FIBER', 'T3_FIBER', 'T4_FIBER', 'T5_FIBER', 'T6_FIBER', 'T7_FIBER', 'T8_FIBER',
    'T2_CLOTH', 'T3_CLOTH', 'T4_CLOTH', 'T5_CLOTH', 'T6_CLOTH', 'T7_CLOTH', 'T8_CLOTH',
    // Камень и блоки
    'T2_ROCK', 'T3_ROCK', 'T4_ROCK', 'T5_ROCK', 'T6_ROCK', 'T7_ROCK', 'T8_ROCK',
    'T2_STONEBLOCK', 'T3_STONEBLOCK', 'T4_STONEBLOCK', 'T5_STONEBLOCK', 'T6_STONEBLOCK', 'T7_STONEBLOCK', 'T8_STONEBLOCK'
];

// Рецепты крафта для калькулятора
const CRAFT_RECIPES = {
    't3_block': {
        name: 'T3 Каменный блок',
        baseName: 'T2 Каменный блок',
        baseCount: 1,
        secondaryName: 'T3 Камень',
        secondaryCount: 2,
        display: 'T2 блок ×1 + T3 камень ×2'
    },
    't4_block': {
        name: 'T4 Каменный блок',
        baseName: 'T3 Каменный блок',
        baseCount: 1,
        secondaryName: 'T4 Камень',
        secondaryCount: 2,
        display: 'T3 блок ×1 + T4 камень ×2'
    },
    't5_block': {
        name: 'T5 Каменный блок',
        baseName: 'T4 Каменный блок',
        baseCount: 1,
        secondaryName: 'T5 Камень',
        secondaryCount: 2,
        display: 'T4 блок ×1 + T5 камень ×2'
    },
    't3_metal': {
        name: 'T3 Слиток',
        baseName: 'T2 Руда',
        baseCount: 1,
        secondaryName: 'T3 Руда',
        secondaryCount: 2,
        display: 'T2 руда ×1 + T3 руда ×2'
    },
    't4_metal': {
        name: 'T4 Слиток',
        baseName: 'T3 Слиток',
        baseCount: 1,
        secondaryName: 'T4 Руда',
        secondaryCount: 2,
        display: 'T3 слиток ×1 + T4 руда ×2'
    },
    't5_metal': {
        name: 'T5 Слиток',
        baseName: 'T4 Слиток',
        baseCount: 1,
        secondaryName: 'T5 Руда',
        secondaryCount: 2,
        display: 'T4 слиток ×1 + T5 руда ×2'
    },
    't3_plank': {
        name: 'T3 Доски',
        baseName: 'T2 Древесина',
        baseCount: 1,
        secondaryName: 'T3 Древесина',
        secondaryCount: 2,
        display: 'T2 древесина ×1 + T3 древесина ×2'
    },
    't4_plank': {
        name: 'T4 Доски',
        baseName: 'T3 Доски',
        baseCount: 1,
        secondaryName: 'T4 Древесина',
        secondaryCount: 2,
        display: 'T3 доски ×1 + T4 древесина ×2'
    },
    't5_plank': {
        name: 'T5 Доски',
        baseName: 'T4 Доски',
        baseCount: 1,
        secondaryName: 'T5 Древесина',
        secondaryCount: 2,
        display: 'T4 доски ×1 + T5 древесина ×2'
    }
};

// ==========================================
// ИНИЦИАЛИЗАЦИЯ
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    initCraftingCalculator();
    loadPrices();
    
    // Автообновление каждые 2 минуты
    setInterval(() => {
        refreshMarketData();
    }, 120000);
});

function initApp() {
    setupEventListeners();
    setupTabs();
}

// ==========================================
// НАСТРОЙКА ОБРАБОТЧИКОВ
// ==========================================
function setupEventListeners() {
    // Смена города
    const citySelect = document.getElementById('citySelect');
    if (citySelect) {
        citySelect.addEventListener('change', function(e) {
            AppState.currentCity = e.target.value;
            document.getElementById('currentCityName').textContent = e.target.value;
            loadPrices();
        });
    }

    // Фильтры ресурсов
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            AppState.currentFilter = this.dataset.filter;
            renderPrices();
        });
    });

    // Поиск с задержкой
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                AppState.searchQuery = e.target.value;
                renderPrices();
            }, 300);
        });
    }

    // Кнопка обновления
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshMarketData);
    }
    
    // Выбор ресурса для сравнения
    const compareResource = document.getElementById('compareResource');
    if (compareResource) {
        compareResource.addEventListener('change', updateComparison);
    }
}

function setupTabs() {
    document.querySelectorAll('.market-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.market-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.market-section').forEach(s => s.classList.remove('active'));
            
            this.classList.add('active');
            const sectionId = 'section' + this.dataset.tab.charAt(0).toUpperCase() + this.dataset.tab.slice(1);
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// ==========================================
// КАЛЬКУЛЯТОР КРАФТА
// ==========================================
function initCraftingCalculator() {
    // Калькулятор 1: ресурсы для производства
    const calcResourcesBtn = document.getElementById('calcResourcesBtn');
    if (calcResourcesBtn) {
        calcResourcesBtn.addEventListener('click', calculateResources);
    }
    
    const craftItem = document.getElementById('craftItem');
    if (craftItem) {
        craftItem.addEventListener('change', updateRecipeDisplay);
        craftItem.addEventListener('change', calculateResources);
    }
    
    const returnPercent = document.getElementById('returnPercent');
    if (returnPercent) {
        returnPercent.addEventListener('input', calculateResources);
    }
    
    const targetAmount = document.getElementById('targetAmount');
    if (targetAmount) {
        targetAmount.addEventListener('input', calculateResources);
    }

    // Калькулятор 2: выход из сырья
    const calcYieldBtn = document.getElementById('calcYieldBtn');
    if (calcYieldBtn) {
        calcYieldBtn.addEventListener('click', calculateYield);
    }
    
    const craftItem2 = document.getElementById('craftItem2');
    if (craftItem2) {
        craftItem2.addEventListener('change', updateRecipeDisplay2);
        craftItem2.addEventListener('change', calculateYield);
    }
    
    const returnPercent2 = document.getElementById('returnPercent2');
    if (returnPercent2) {
        returnPercent2.addEventListener('input', calculateYield);
    }
    
    const haveBase = document.getElementById('haveBase');
    if (haveBase) {
        haveBase.addEventListener('input', calculateYield);
    }
    
    const haveSecondary = document.getElementById('haveSecondary');
    if (haveSecondary) {
        haveSecondary.addEventListener('input', calculateYield);
    }

    // Первоначальное отображение
    updateRecipeDisplay();
    updateRecipeDisplay2();
    calculateResources();
    calculateYield();
}

function updateRecipeDisplay() {
    const craftItem = document.getElementById('craftItem');
    if (!craftItem) return;
    
    const recipe = CRAFT_RECIPES[craftItem.value];
    if (!recipe) return;
    
    document.getElementById('baseRecipe').textContent = recipe.display;
    document.getElementById('baseResourceName').textContent = recipe.baseName + ':';
    document.getElementById('secondaryResourceName').textContent = recipe.secondaryName + ':';
}

function updateRecipeDisplay2() {
    const craftItem2 = document.getElementById('craftItem2');
    if (!craftItem2) return;
    
    const recipe = CRAFT_RECIPES[craftItem2.value];
    if (!recipe) return;
    
    document.getElementById('baseRecipe2').textContent = recipe.display;
    document.getElementById('baseInputLabel').textContent = 'Имеем ' + recipe.baseName + ':';
    document.getElementById('secondaryInputLabel').textContent = 'Имеем ' + recipe.secondaryName + ':';
    document.getElementById('yieldFromBaseLabel').textContent = 'Из ' + recipe.baseName + ':';
    document.getElementById('yieldFromSecondaryLabel').textContent = 'Из ' + recipe.secondaryName + ':';
}

function calculateResources() {
    const craftItem = document.getElementById('craftItem');
    const returnPercent = document.getElementById('returnPercent');
    const targetAmount = document.getElementById('targetAmount');
    
    if (!craftItem || !returnPercent || !targetAmount) return;
    
    const recipe = CRAFT_RECIPES[craftItem.value];
    if (!recipe) return;
    
    const percent = parseFloat(returnPercent.value) || CONFIG.defaultReturn;
    const target = parseInt(targetAmount.value) || 0;
    
    // Коэффициент расхода = 1 - (возврат%/100)
    const coefficient = 1 - (percent / 100);
    
    const baseNeeded = Math.ceil(target * coefficient);
    const secondaryNeeded = Math.ceil(target * coefficient * recipe.secondaryCount);
    
    document.getElementById('resBase').innerHTML = baseNeeded.toLocaleString() + ' шт';
    document.getElementById('resSecondary').innerHTML = secondaryNeeded.toLocaleString() + ' шт';
    document.getElementById('coefficient').innerHTML = coefficient.toFixed(3);
}

function calculateYield() {
    const craftItem2 = document.getElementById('craftItem2');
    const returnPercent2 = document.getElementById('returnPercent2');
    const haveBase = document.getElementById('haveBase');
    const haveSecondary = document.getElementById('haveSecondary');
    
    if (!craftItem2 || !returnPercent2 || !haveBase || !haveSecondary) return;
    
    const recipe = CRAFT_RECIPES[craftItem2.value];
    if (!recipe) return;
    
    const percent = parseFloat(returnPercent2.value) || CONFIG.defaultReturn;
    const baseAmount = parseInt(haveBase.value) || 0;
    const secondaryAmount = parseInt(haveSecondary.value) || 0;
    
    // Коэффициент расхода
    const coefficient = 1 - (percent / 100);
    
    // Сколько можно сделать из каждого ресурса
    const yieldFromBase = Math.floor(baseAmount / coefficient);
    const yieldFromSecondary = Math.floor(secondaryAmount / (coefficient * recipe.secondaryCount));
    
    // Итог - ограничивающий ресурс
    const totalYield = Math.min(yieldFromBase, yieldFromSecondary);
    
    document.getElementById('yieldFromBase').innerHTML = yieldFromBase.toLocaleString() + ' шт';
    document.getElementById('yieldFromSecondary').innerHTML = yieldFromSecondary.toLocaleString() + ' шт';
    document.getElementById('totalYield').innerHTML = totalYield.toLocaleString() + ' шт';
    
    // Подсветка ограничивающего ресурса
    document.getElementById('yieldFromBase').style.color = yieldFromBase <= yieldFromSecondary ? '#ff8c00' : '#4caf50';
    document.getElementById('yieldFromSecondary').style.color = yieldFromSecondary <= yieldFromBase ? '#ff8c00' : '#4caf50';
}

// ==========================================
// ЗАГРУЗКА ЦЕН С API
// ==========================================
async function loadPrices() {
    if (AppState.isLoading) return;
    
    AppState.isLoading = true;
    showLoading();
    
    try {
        // Проверяем кэш
        const cached = checkCache();
        if (cached) {
            AppState.prices = cached.prices;
            AppState.lastUpdate = new Date(cached.timestamp);
            renderPrices();
            renderMiniCharts();
            updateFreshnessIndicator();
            updateResourceSelectors();
            AppState.isLoading = false;
            return;
        }

        // Загружаем новые данные
        const url = `${CONFIG.apiEndpoint}/prices/${ITEM_IDS.join(',')}?locations=${encodeURIComponent(AppState.currentCity)}&qualities=1`;
        const response = await fetch(url);
        const data = await response.json();
        
        AppState.prices = processPriceData(data);
        AppState.lastUpdate = new Date();
        
        // Сохраняем в кэш
        saveToCache();
        
        renderPrices();
        renderMiniCharts();
        updateFreshnessIndicator();
        updateResourceSelectors();
        
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        showError('Не удалось загрузить данные с сервера');
    } finally {
        AppState.isLoading = false;
    }
}

function processPriceData(data) {
    const processed = [];
    const uniqueItems = new Map();
    
    data.forEach(item => {
        if (!item.sell_price_min && !item.buy_price_max) return;
        
        const key = `${item.item_id}_${item.quality || 1}`;
        
        if (!uniqueItems.has(key)) {
            const resourceInfo = getResourceInfo(item.item_id);
            
            uniqueItems.set(key, {
                id: item.item_id,
                name: resourceInfo.name,
                tier: resourceInfo.tier,
                type: resourceInfo.type,
                buyPrice: item.buy_price_max || 0,
                sellPrice: item.sell_price_min || 0,
                volume: item.sell_price_min_volume || 0,
                quality: item.quality || 1,
                city: item.city
            });
        }
    });
    
    return Array.from(uniqueItems.values());
}

function getResourceInfo(itemId) {
    const tiers = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'];
    const tier = tiers.find(t => itemId.startsWith(t)) || 'T4';
    
    let type = 'other';
    let name = itemId;
    
    if (itemId.includes('ORE')) {
        type = 'ore';
        name = `${tier} Руда`;
    } else if (itemId.includes('METALBAR')) {
        type = 'ore';
        name = `${tier} Слитки`;
    } else if (itemId.includes('WOOD') && !itemId.includes('PLANKS')) {
        type = 'wood';
        name = `${tier} Древесина`;
    } else if (itemId.includes('PLANKS')) {
        type = 'wood';
        name = `${tier} Доски`;
    } else if (itemId.includes('HIDE') && !itemId.includes('LEATHER')) {
        type = 'hide';
        name = `${tier} Шкуры`;
    } else if (itemId.includes('LEATHER')) {
        type = 'hide';
        name = `${tier} Кожа`;
    } else if (itemId.includes('FIBER') && !itemId.includes('CLOTH')) {
        type = 'fiber';
        name = `${tier} Волокно`;
    } else if (itemId.includes('CLOTH')) {
        type = 'fiber';
        name = `${tier} Ткань`;
    } else if (itemId.includes('ROCK') && !itemId.includes('STONEBLOCK')) {
        type = 'stone';
        name = `${tier} Камень`;
    } else if (itemId.includes('STONEBLOCK')) {
        type = 'stone';
        name = `${tier} Каменные блоки`;
    }
    
    return { name, tier, type };
}

// ==========================================
// ОТОБРАЖЕНИЕ ЦЕН
// ==========================================
function renderPrices() {
    const tbody = document.getElementById('pricesBody');
    if (!tbody) return;
    
    const filteredPrices = filterPrices();
    
    if (filteredPrices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">Нет данных для отображения</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredPrices.map(price => `
        <tr>
            <td class="sticky-col">
                <span class="resource-tier ${price.tier.toLowerCase()}">${price.tier}</span>
                ${price.name}
            </td>
            <td>${getTypeName(price.type)}</td>
            <td class="price-cell buy">${formatPrice(price.buyPrice)}</td>
            <td class="price-cell sell">${formatPrice(price.sellPrice)}</td>
            <td>${formatVolume(price.volume)}</td>
            <td>${price.quality > 1 ? price.quality : 'Обычное'}</td>
        </tr>
    `).join('');
}

function filterPrices() {
    return AppState.prices.filter(price => {
        // Фильтр по типу
        if (AppState.currentFilter !== 'all' && price.type !== AppState.currentFilter) {
            return false;
        }
        
        // Поиск по названию
        if (AppState.searchQuery) {
            const query = AppState.searchQuery.toLowerCase();
            return price.name.toLowerCase().includes(query);
        }
        
        return true;
    }).sort((a, b) => {
        if (a.tier !== b.tier) {
            return a.tier.localeCompare(b.tier);
        }
        return a.name.localeCompare(b.name);
    });
}

function renderMiniCharts() {
    const chartsContainer = document.getElementById('miniCharts');
    if (!chartsContainer) return;
    
    const popularResources = AppState.prices
        .filter(p => p.volume > 100)
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 6);
    
    if (popularResources.length === 0) {
        chartsContainer.innerHTML = '<p style="text-align: center; color: var(--light-steel);">Нет данных о популярных ресурсах</p>';
        return;
    }
    
    chartsContainer.innerHTML = popularResources.map(resource => `
        <div class="mini-chart-card">
            <div class="chart-header">
                <span class="resource-name">${resource.name}</span>
                <span class="resource-price">${formatPrice(resource.sellPrice)}</span>
            </div>
            <div style="font-size: 0.9rem; color: var(--light-steel);">
                Объём: ${formatVolume(resource.volume)}
            </div>
            <div style="margin-top: 10px; font-size: 0.8rem;">
                🟢 ${formatPrice(resource.buyPrice)} / 🟠 ${formatPrice(resource.sellPrice)}
            </div>
        </div>
    `).join('');
}

function updateResourceSelectors() {
    const select = document.getElementById('compareResource');
    if (!select) return;
    
    const uniqueResources = [];
    const resourceMap = new Map();
    
    AppState.prices.forEach(price => {
        if (!resourceMap.has(price.id)) {
            resourceMap.set(price.id, price);
            uniqueResources.push(price);
        }
    });
    
    select.innerHTML = '<option value="">Выберите ресурс</option>' + 
        uniqueResources.sort((a, b) => a.name.localeCompare(b.name))
            .map(r => `<option value="${r.id}">${r.name}</option>`).join('');
}

// ==========================================
// СРАВНЕНИЕ ГОРОДОВ
// ==========================================
function updateComparison() {
    const resourceId = document.getElementById('compareResource').value;
    if (!resourceId) {
        document.getElementById('comparisonGrid').innerHTML = '<p style="color: var(--light-steel); text-align: center;">Выберите ресурс для сравнения</p>';
        return;
    }

    const cities = ['Fort Sterling', 'Lymhurst', 'Bridgewatch', 'Martlock', 'Thetford', 'Caerleon', 'Brecilien'];
    
    // В реальном приложении здесь должен быть запрос к API
    // Для демонстрации используем случайные данные на основе выбранного ресурса
    const prices = cities.map(city => ({
        city: city,
        buyPrice: Math.floor(Math.random() * 1000) + 500,
        sellPrice: Math.floor(Math.random() * 1200) + 600
    }));

    const bestBuy = Math.min(...prices.map(p => p.buyPrice));
    const bestSell = Math.max(...prices.map(p => p.sellPrice));

    document.getElementById('comparisonGrid').innerHTML = prices.map(p => `
        <div class="comparison-card">
            <h4>${p.city}</h4>
            <div class="comparison-row">
                <span>Покупка 🟢</span>
                <span class="comparison-price ${p.buyPrice === bestBuy ? 'best-price' : ''}">${formatPrice(p.buyPrice)}</span>
            </div>
            <div class="comparison-row">
                <span>Продажа 🟠</span>
                <span class="comparison-price ${p.sellPrice === bestSell ? 'best-price' : ''}">${formatPrice(p.sellPrice)}</span>
            </div>
            <div class="comparison-row">
                <span>Спред</span>
                <span class="${p.sellPrice - p.buyPrice > 0 ? 'profit-positive' : 'profit-negative'}">
                    ${formatPrice(p.sellPrice - p.buyPrice)}
                </span>
            </div>
        </div>
    `).join('');
}

// ==========================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================================
async function refreshMarketData() {
    const btnIcon = document.querySelector('#refreshBtn i');
    if (btnIcon) {
        btnIcon.classList.add('fa-spin');
    }
    
    localStorage.removeItem('marketCache');
    await loadPrices();
    
    setTimeout(() => {
        if (btnIcon) {
            btnIcon.classList.remove('fa-spin');
        }
    }, 500);
}

function updateFreshnessIndicator() {
    const dot = document.getElementById('freshnessDot');
    const text = document.getElementById('freshnessText');
    
    if (!AppState.lastUpdate) {
        if (dot) dot.className = 'freshness-dot dot-old';
        if (text) text.textContent = 'Нет данных';
        return;
    }
    
    const now = new Date();
    const diffMinutes = Math.floor((now - AppState.lastUpdate) / 60000);
    
    if (diffMinutes < 1) {
        if (dot) dot.className = 'freshness-dot dot-fresh';
        if (text) text.textContent = 'Только что обновлено';
    } else if (diffMinutes < 5) {
        if (dot) dot.className = 'freshness-dot dot-stale';
        if (text) text.textContent = `${diffMinutes} мин. назад`;
    } else {
        if (dot) dot.className = 'freshness-dot dot-old';
        if (text) text.textContent = `${diffMinutes} мин. назад`;
    }
    
    const lastUpdateEl = document.getElementById('lastUpdateTime');
    if (lastUpdateEl) {
        lastUpdateEl.textContent = `Последнее обновление: ${AppState.lastUpdate.toLocaleString('ru-RU')}`;
    }
}

function formatPrice(price) {
    if (!price || price === 0) return '—';
    return new Intl.NumberFormat('ru-RU').format(price) + ' <i class="fas fa-coins" style="color: #ffd700;"></i>';
}

function formatVolume(volume) {
    if (!volume) return '0';
    return new Intl.NumberFormat('ru-RU').format(volume);
}

function getTypeName(type) {
    const names = {
        ore: 'Руда/Слитки',
        wood: 'Древесина/Доски',
        hide: 'Кожа/Шкуры',
        fiber: 'Ткань/Волокно',
        stone: 'Камень/Блоки',
        other: 'Прочее'
    };
    return names[type] || type;
}

function checkCache() {
    const cached = localStorage.getItem('marketCache');
    if (!cached) return null;
    
    try {
        const data = JSON.parse(cached);
        if (new Date() - new Date(data.timestamp) < CONFIG.cacheTime) {
            return data;
        }
    } catch (e) {
        console.error('Ошибка чтения кэша:', e);
    }
    
    return null;
}

function saveToCache() {
    const cacheData = {
        prices: AppState.prices,
        timestamp: AppState.lastUpdate
    };
    localStorage.setItem('marketCache', JSON.stringify(cacheData));
}

function showLoading() {
    const tbody = document.getElementById('pricesBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--royal-blue);"></i>
                    <p style="margin-top: 15px;">Загрузка данных...</p>
                </td>
            </tr>
        `;
    }
}

function showError(message) {
    const tbody = document.getElementById('pricesBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${message}</p>
                    <button class="btn btn-outline" style="margin-top: 15px;" onclick="refreshMarketData()">
                        <i class="fas fa-sync-alt"></i> Повторить
                    </button>
                </td>
            </tr>
        `;
    }
    
    const dot = document.getElementById('freshnessDot');
    const text = document.getElementById('freshnessText');
    if (dot) dot.className = 'freshness-dot dot-old';
    if (text) text.textContent = 'Ошибка подключения';
}