// ==========================================
// calculator.js - Полный калькулятор крафта Enforcer
// С поддержкой всех ресурсов и предметов
// ==========================================

// База данных ресурсов (из вашего файла)
const RESOURCES = {
    // Волокно (сырьё)
    "Хлопок": { tier: 2, type: "Волокно", processed: "Простая ткань" },
    "Лён": { tier: 3, type: "Волокно", processed: "Крепкая ткань" },
    "Пенька": { tier: 4, type: "Волокно", processed: "Изысканная ткань" },
    "Звездоцвет": { tier: 5, type: "Волокно", processed: "Ткань с узором" },
    "Хлопок - янтарник": { tier: 6, type: "Волокно", processed: "Дорогая ткань" },
    "Златолён": { tier: 7, type: "Волокно", processed: "Роскошная ткань" },
    "Призрачная пенька": { tier: 8, type: "Волокно", processed: "Великолепная ткань" },
    
    // Шкуры (сырьё)
    "Грубая шкура": { tier: 2, type: "Шкуры", processed: "Жёсткая кожа" },
    "Тонкая шкура": { tier: 3, type: "Шкуры", processed: "Толстая кожа" },
    "Средняя шкура": { tier: 4, type: "Шкуры", processed: "Обработанная кожа" },
    "Тяжёлая шкура": { tier: 5, type: "Шкуры", processed: "Выделанная кожа" },
    "Прочная шкура": { tier: 6, type: "Шкуры", processed: "Кожа демона" },
    "Толстая шкура": { tier: 7, type: "Шкуры", processed: "Прочная кожа" },
    "Надёжная шкура": { tier: 8, type: "Шкуры", processed: "Долговечная кожа" },
    
    // Руда (сырьё)
    "Медная руда": { tier: 2, type: "Руда", processed: "Слиток меди" },
    "Оловянная руда": { tier: 3, type: "Руда", processed: "Слиток бронзы" },
    "Железная руда": { tier: 4, type: "Руда", processed: "Слиток стали" },
    "Титановая руда": { tier: 5, type: "Руда", processed: "Слиток титановой стали" },
    "Рунитовая руда": { tier: 6, type: "Руда", processed: "Слиток рунитовой стали" },
    "Метеоридная руда": { tier: 7, type: "Руда", processed: "Слиток метеоритной стали" },
    "Адамантиевая руда": { tier: 8, type: "Руда", processed: "Слиток адамантиевой стали" },
    
    // Камень (сырьё)
    "Известняк": { tier: 2, type: "Камень", processed: "Блок известняка" },
    "Песчаник": { tier: 3, type: "Камень", processed: "Блок песчанника" },
    "Травертин": { tier: 4, type: "Камень", processed: "Блок травертина" },
    "Гранит": { tier: 5, type: "Камень", processed: "Блок гранита" },
    "Лунный камень": { tier: 6, type: "Камень", processed: "Блок лунного камня" },
    "Базальт": { tier: 7, type: "Камень", processed: "Блок базальта" },
    "Мрамор": { tier: 8, type: "Камень", processed: "Блок мрамора" },
    
    // Древесина (сырьё)
    "Брёвна берёзы": { tier: 2, type: "Древесина", processed: "Берёзовые брусья" },
    "Брёвна каштана": { tier: 3, type: "Древесина", processed: "Каштановые брусья" },
    "Брёвна сосны": { tier: 4, type: "Древесина", processed: "Сосновые брусья" },
    "Брёвна кедра": { tier: 5, type: "Древесина", processed: "Брусья из кедра" },
    "Брёвна кровавого дерева": { tier: 6, type: "Древесина", processed: "Брусья из кровавого дерева" },
    "Брёвна железного дерева": { tier: 7, type: "Древесина", processed: "Брусья из железного дерева" },
    "Брёвна белого дерева": { tier: 8, type: "Древесина", processed: "Брусья из белого дерева" }
};

// Обработанные ресурсы
const PROCESSED_RESOURCES = {
    // Ткани
    "Простая ткань": { tier: 2, type: "Ткань", requires: { "Хлопок": 1 } },
    "Крепкая ткань": { tier: 3, type: "Ткань", requires: { "Лён": 2, "Простая ткань": 1 } },
    "Изысканная ткань": { tier: 4, type: "Ткань", requires: { "Пенька": 2, "Крепкая ткань": 1 } },
    "Ткань с узором": { tier: 5, type: "Ткань", requires: { "Звездоцвет": 3, "Изысканная ткань": 1 } },
    "Дорогая ткань": { tier: 6, type: "Ткань", requires: { "Хлопок - янтарник": 4, "Ткань с узором": 1 } },
    "Роскошная ткань": { tier: 7, type: "Ткань", requires: { "Златолён": 5, "Дорогая ткань": 1 } },
    "Великолепная ткань": { tier: 8, type: "Ткань", requires: { "Призрачная пенька": 5, "Роскошная ткань": 1 } },
    
    // Кожа
    "Жёсткая кожа": { tier: 2, type: "Кожа", requires: { "Грубая шкура": 1 } },
    "Толстая кожа": { tier: 3, type: "Кожа", requires: { "Тонкая шкура": 2, "Жёсткая кожа": 1 } },
    "Обработанная кожа": { tier: 4, type: "Кожа", requires: { "Средняя шкура": 2, "Толстая кожа": 1 } },
    "Выделанная кожа": { tier: 5, type: "Кожа", requires: { "Тяжёлая шкура": 3, "Обработанная кожа": 1 } },
    "Кожа демона": { tier: 6, type: "Кожа", requires: { "Прочная шкура": 4, "Выделанная кожа": 1 } },
    "Прочная кожа": { tier: 7, type: "Кожа", requires: { "Толстая шкура": 5, "Кожа демона": 1 } },
    "Долговечная кожа": { tier: 8, type: "Кожа", requires: { "Надёжная шкура": 5, "Прочная кожа": 1 } },
    
    // Слитки
    "Слиток меди": { tier: 2, type: "Слитки", requires: { "Медная руда": 1 } },
    "Слиток бронзы": { tier: 3, type: "Слитки", requires: { "Оловянная руда": 2, "Слиток меди": 1 } },
    "Слиток стали": { tier: 4, type: "Слитки", requires: { "Железная руда": 2, "Слиток бронзы": 1 } },
    "Слиток титановой стали": { tier: 5, type: "Слитки", requires: { "Титановая руда": 3, "Слиток стали": 1 } },
    "Слиток рунитовой стали": { tier: 6, type: "Слитки", requires: { "Рунитовая руда": 4, "Слиток титановой стали": 1 } },
    "Слиток метеоритной стали": { tier: 7, type: "Слитки", requires: { "Метеоридная руда": 5, "Слиток рунитовой стали": 1 } },
    "Слиток адамантиевой стали": { tier: 8, type: "Слитки", requires: { "Адамантиевая руда": 5, "Слиток метеоритной стали": 1 } },
    
    // Брусья
    "Берёзовые брусья": { tier: 2, type: "Брусья", requires: { "Брёвна берёзы": 1 } },
    "Каштановые брусья": { tier: 3, type: "Брусья", requires: { "Брёвна каштана": 2, "Берёзовые брусья": 1 } },
    "Сосновые брусья": { tier: 4, type: "Брусья", requires: { "Брёвна сосны": 2, "Каштановые брусья": 1 } },
    "Брусья из кедра": { tier: 5, type: "Брусья", requires: { "Брёвна кедра": 3, "Сосновые брусья": 1 } },
    "Брусья из кровавого дерева": { tier: 6, type: "Брусья", requires: { "Брёвна кровавого дерева": 4, "Брусья из кедра": 1 } },
    "Брусья из железного дерева": { tier: 7, type: "Брусья", requires: { "Брёвна железного дерева": 5, "Брусья из кровавого дерева": 1 } },
    "Брусья из белого дерева": { tier: 8, type: "Брусья", requires: { "Брёвна белого дерева": 5, "Брусья из железного дерева": 1 } },
    
    // Блоки
    "Блок известняка": { tier: 2, type: "Блоки", requires: { "Известняк": 1 } },
    "Блок песчанника": { tier: 3, type: "Блоки", requires: { "Песчаник": 2, "Блок известняка": 1 } },
    "Блок травертина": { tier: 4, type: "Блоки", requires: { "Травертин": 2, "Блок песчанника": 1 } },
    "Блок гранита": { tier: 5, type: "Блоки", requires: { "Гранит": 3, "Блок травертина": 1 } },
    "Блок лунного камня": { tier: 6, type: "Блоки", requires: { "Лунный камень": 4, "Блок гранита": 1 } },
    "Блок базальта": { tier: 7, type: "Блоки", requires: { "Базальт": 5, "Блок лунного камня": 1 } },
    "Блок мрамора": { tier: 8, type: "Блоки", requires: { "Мрамор": 5, "Блок базальта": 1 } }
};

// Рецепты предметов (оружие, броня и т.д.)
const ITEM_RECIPES = {
    // Арбалеты
    "Арбалет (Странник)": { tier: 3, category: "arbalet", resources: { "Каштановые брусья": 20, "Слиток бронзы": 12 } },
    "Арбалет (Знаток)": { tier: 4, category: "arbalet", resources: { "Сосновые брусья": 20, "Слиток стали": 12 } },
    "Арбалет (Эксперт)": { tier: 5, category: "arbalet", resources: { "Брусья из кедра": 20, "Слиток титановой стали": 12 } },
    "Арбалет (Мастер)": { tier: 6, category: "arbalet", resources: { "Брусья из кровавого дерева": 20, "Слиток рунитовой стали": 12 } },
    "Арбалет (Магистр)": { tier: 7, category: "arbalet", resources: { "Брусья из железного дерева": 20, "Слиток метеоритной стали": 12 } },
    "Арбалет (Старейшина)": { tier: 8, category: "arbalet", resources: { "Брусья из белого дерева": 20, "Слиток адамантиевой стали": 12 } },
    
    "Тяжёлый арбалет (Знаток)": { tier: 4, category: "arbalet", resources: { "Сосновые брусья": 20, "Слиток стали": 12 } },
    "Тяжёлый арбалет (Эксперт)": { tier: 5, category: "arbalet", resources: { "Брусья из кедра": 20, "Слиток титановой стали": 12 } },
    "Тяжёлый арбалет (Мастер)": { tier: 6, category: "arbalet", resources: { "Брусья из кровавого дерева": 20, "Слиток рунитовой стали": 12 } },
    "Тяжёлый арбалет (Магистр)": { tier: 7, category: "arbalet", resources: { "Брусья из железного дерева": 20, "Слиток метеоритной стали": 12 } },
    "Тяжёлый арбалет (Старейшина)": { tier: 8, category: "arbalet", resources: { "Брусья из белого дерева": 20, "Слиток адамантиевой стали": 12 } },
    
    "Лёгкий арбалет (Знаток)": { tier: 4, category: "arbalet", resources: { "Сосновые брусья": 16, "Слиток стали": 8 } },
    "Лёгкий арбалет (Эксперт)": { tier: 5, category: "arbalet", resources: { "Брусья из кедра": 16, "Слиток титановой стали": 8 } },
    "Лёгкий арбалет (Мастер)": { tier: 6, category: "arbalet", resources: { "Брусья из кровавого дерева": 16, "Слиток рунитовой стали": 8 } },
    "Лёгкий арбалет (Магистр)": { tier: 7, category: "arbalet", resources: { "Брусья из железного дерева": 16, "Слиток метеоритной стали": 8 } },
    "Лёгкий арбалет (Старейшина)": { tier: 8, category: "arbalet", resources: { "Брусья из белого дерева": 16, "Слиток адамантиевой стали": 8 } },
    
    // Топоры
    "Боевой топор (Странник)": { tier: 3, category: "axe", resources: { "Каштановые брусья": 8, "Слиток бронзы": 16 } },
    "Боевой топор (Знаток)": { tier: 4, category: "axe", resources: { "Сосновые брусья": 8, "Слиток стали": 16 } },
    "Боевой топор (Эксперт)": { tier: 5, category: "axe", resources: { "Брусья из кедра": 8, "Слиток титановой стали": 16 } },
    "Боевой топор (Мастер)": { tier: 6, category: "axe", resources: { "Брусья из кровавого дерева": 8, "Слиток рунитовой стали": 16 } },
    "Боевой топор (Магистр)": { tier: 7, category: "axe", resources: { "Брусья из железного дерева": 8, "Слиток метеоритной стали": 16 } },
    "Боевой топор (Старейшина)": { tier: 8, category: "axe", resources: { "Брусья из белого дерева": 8, "Слиток адамантиевой стали": 16 } },
    
    "Большой топор (Знаток)": { tier: 4, category: "axe", resources: { "Сосновые брусья": 12, "Слиток стали": 20 } },
    "Большой топор (Эксперт)": { tier: 5, category: "axe", resources: { "Брусья из кедра": 12, "Слиток титановой стали": 20 } },
    "Большой топор (Мастер)": { tier: 6, category: "axe", resources: { "Брусья из кровавого дерева": 12, "Слиток рунитовой стали": 20 } },
    "Большой топор (Магистр)": { tier: 7, category: "axe", resources: { "Брусья из железного дерева": 12, "Слиток метеоритной стали": 20 } },
    "Большой топор (Старейшина)": { tier: 8, category: "axe", resources: { "Брусья из белого дерева": 12, "Слиток адамантиевой стали": 20 } },
    
    "Алебарда (Знаток)": { tier: 4, category: "axe", resources: { "Сосновые брусья": 20, "Слиток стали": 12 } },
    "Алебарда (Эксперт)": { tier: 5, category: "axe", resources: { "Брусья из кедра": 20, "Слиток титановой стали": 12 } },
    "Алебарда (Мастер)": { tier: 6, category: "axe", resources: { "Брусья из кровавого дерева": 20, "Слиток рунитовой стали": 12 } },
    "Алебарда (Магистр)": { tier: 7, category: "axe", resources: { "Брусья из железного дерева": 20, "Слиток метеоритной стали": 12 } },
    "Алебарда (Старейшина)": { tier: 8, category: "axe", resources: { "Брусья из белого дерева": 20, "Слиток адамантиевой стали": 12 } },
    
    // Молоты
    "Молот (Странник)": { tier: 3, category: "hammer", resources: { "Слиток бронзы": 24 } },
    "Молот (Знаток)": { tier: 4, category: "hammer", resources: { "Слиток стали": 24 } },
    "Молот (Эксперт)": { tier: 5, category: "hammer", resources: { "Слиток титановой стали": 24 } },
    "Молот (Мастер)": { tier: 6, category: "hammer", resources: { "Слиток рунитовой стали": 24 } },
    "Молот (Магистр)": { tier: 7, category: "hammer", resources: { "Слиток метеоритной стали": 24 } },
    "Молот (Старейшина)": { tier: 8, category: "hammer", resources: { "Слиток адамантиевой стали": 24 } },
    
    "Большой молот (Знаток)": { tier: 4, category: "hammer", resources: { "Слиток стали": 20, "Изысканная ткань": 12 } },
    "Большой молот (Эксперт)": { tier: 5, category: "hammer", resources: { "Слиток титановой стали": 20, "Ткань с узором": 12 } },
    "Большой молот (Мастер)": { tier: 6, category: "hammer", resources: { "Слиток рунитовой стали": 20, "Дорогая ткань": 12 } },
    "Большой молот (Магистр)": { tier: 7, category: "hammer", resources: { "Слиток метеоритной стали": 20, "Роскошная ткань": 12 } },
    "Большой молот (Старейшина)": { tier: 8, category: "hammer", resources: { "Слиток адамантиевой стали": 20, "Великолепная ткань": 12 } },
    
    // Мечи
    "Палаш (Новичок)": { tier: 2, category: "sword", resources: { "Слиток меди": 16, "Жёсткая кожа": 8 } },
    "Палаш (Странник)": { tier: 3, category: "sword", resources: { "Слиток бронзы": 16, "Толстая кожа": 8 } },
    "Палаш (Знаток)": { tier: 4, category: "sword", resources: { "Слиток стали": 16, "Обработанная кожа": 8 } },
    "Палаш (Эксперт)": { tier: 5, category: "sword", resources: { "Слиток титановой стали": 16, "Выделанная кожа": 8 } },
    "Палаш (Мастер)": { tier: 6, category: "sword", resources: { "Слиток рунитовой стали": 16, "Кожа демона": 8 } },
    "Палаш (Магистр)": { tier: 7, category: "sword", resources: { "Слиток метеоритной стали": 16, "Прочная кожа": 8 } },
    "Палаш (Старейшина)": { tier: 8, category: "sword", resources: { "Слиток адамантиевой стали": 16, "Долговечная кожа": 8 } },
    
    "Клеймор (Знаток)": { tier: 4, category: "sword", resources: { "Слиток стали": 20, "Обработанная кожа": 12 } },
    "Клеймор (Эксперт)": { tier: 5, category: "sword", resources: { "Слиток титановой стали": 20, "Выделанная кожа": 12 } },
    "Клеймор (Мастер)": { tier: 6, category: "sword", resources: { "Слиток рунитовой стали": 20, "Кожа демона": 12 } },
    "Клеймор (Магистр)": { tier: 7, category: "sword", resources: { "Слиток метеоритной стали": 20, "Прочная кожа": 12 } },
    "Клеймор (Старейшина)": { tier: 8, category: "sword", resources: { "Слиток адамантиевой стали": 20, "Долговечная кожа": 12 } },
    
    "Парные мечи (Знаток)": { tier: 4, category: "sword", resources: { "Слиток стали": 20, "Обработанная кожа": 12 } },
    "Парные мечи (Эксперт)": { tier: 5, category: "sword", resources: { "Слиток титановой стали": 20, "Выделанная кожа": 12 } },
    "Парные мечи (Мастер)": { tier: 6, category: "sword", resources: { "Слиток рунитовой стали": 20, "Кожа демона": 12 } },
    "Парные мечи (Магистр)": { tier: 7, category: "sword", resources: { "Слиток метеоритной стали": 20, "Прочная кожа": 12 } },
    "Парные мечи (Старейшина)": { tier: 8, category: "sword", resources: { "Слиток адамантиевой стали": 20, "Долговечная кожа": 12 } }
};

// Состояние калькулятора
let CalculatorState = {
    selectedItem: "Палаш (Новичок)",
    currentCategory: "all",
    quantity: 1,
    currentResult: null
};

// Получение тира ресурса
function getResourceTier(resource) {
    if (PROCESSED_RESOURCES[resource]) return PROCESSED_RESOURCES[resource].tier;
    if (RESOURCES[resource]) return RESOURCES[resource].tier;
    return 0;
}

// Получение формулы крафта
function getCraftingFormula(resource) {
    const recipe = PROCESSED_RESOURCES[resource];
    if (!recipe) return null;
    
    const parts = [];
    for (const [res, count] of Object.entries(recipe.requires)) {
        parts.push(`${count}× ${res}`);
    }
    return parts.join(' + ');
}

// Разложение ресурса до сырья
function decomposeResource(resource, amount, depth = 0) {
    if (depth > 10) return {};
    
    const result = {};
    
    if (PROCESSED_RESOURCES[resource]) {
        const recipe = PROCESSED_RESOURCES[resource];
        for (const [res, count] of Object.entries(recipe.requires)) {
            const subAmount = amount * count;
            
            if (PROCESSED_RESOURCES[res]) {
                const subResult = decomposeResource(res, subAmount, depth + 1);
                for (const [r, a] of Object.entries(subResult)) {
                    result[r] = (result[r] || 0) + a;
                }
            } else {
                result[res] = (result[res] || 0) + subAmount;
            }
        }
    } else {
        result[resource] = (result[resource] || 0) + amount;
    }
    
    return result;
}

// Загрузка предметов в сетку
function loadItems(category = "all") {
    const grid = document.getElementById('itemsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    let items = Object.entries(ITEM_RECIPES);
    if (category !== "all") {
        items = items.filter(([_, data]) => data.category === category);
    }
    
    items.sort((a, b) => a[1].tier - b[1].tier);
    
    items.forEach(([name, data]) => {
        const card = document.createElement('div');
        card.className = `item-card ${CalculatorState.selectedItem === name ? 'selected' : ''}`;
        card.dataset.item = name;
        card.innerHTML = `
            <div class="item-tier">T${data.tier}</div>
            <div class="item-name">${name}</div>
        `;
        card.addEventListener('click', () => {
            document.querySelectorAll('.item-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            CalculatorState.selectedItem = name;
        });
        grid.appendChild(card);
    });
}

// Расчёт ресурсов
function calculate() {
    if (!CalculatorState.selectedItem || !ITEM_RECIPES[CalculatorState.selectedItem]) return null;
    
    const recipe = ITEM_RECIPES[CalculatorState.selectedItem];
    const quantity = CalculatorState.quantity;
    
    const processed = {};
    for (const [res, amount] of Object.entries(recipe.resources)) {
        processed[res] = amount * quantity;
    }
    
    return { item: CalculatorState.selectedItem, quantity, processed };
}

// Построение матрицы
function buildMatrix(result) {
    if (!result) return;
    
    const container = document.getElementById('matrixContainer');
    const { processed } = result;
    
    // Собираем все ресурсы
    const allResources = {};
    const resourceSet = new Set();
    
    for (const [res, amount] of Object.entries(processed)) {
        allResources[res] = (allResources[res] || 0) + amount;
        resourceSet.add(res);
    }
    
    for (const [res, amount] of Object.entries(processed)) {
        const decomp = decomposeResource(res, amount);
        for (const [r, a] of Object.entries(decomp)) {
            allResources[r] = (allResources[r] || 0) + a;
            resourceSet.add(r);
        }
    }
    
    // Группируем по типам
    const groups = {};
    for (const res of resourceSet) {
        let type = "Другое";
        if (PROCESSED_RESOURCES[res]) type = PROCESSED_RESOURCES[res].type;
        else if (RESOURCES[res]) type = RESOURCES[res].type;
        
        if (!groups[type]) groups[type] = [];
        groups[type].push(res);
    }
    
    for (const type in groups) {
        groups[type].sort((a, b) => getResourceTier(a) - getResourceTier(b));
    }
    
    // Строим HTML
    let html = `
        <div class="matrix-header">
            <div class="tier-header t2">T2</div>
            <div class="tier-header t3">T3</div>
            <div class="tier-header t4">T4</div>
            <div class="tier-header t5">T5</div>
            <div class="tier-header t6">T6</div>
            <div class="tier-header t7">T7</div>
            <div class="tier-header t8">T8</div>
        </div>
    `;
    
    for (const [type, resources] of Object.entries(groups)) {
        html += `
            <div class="matrix-row" style="margin-top: 15px;">
                <div class="row-label"><i class="fas fa-layer-group"></i> ${type}</div>
            </div>
        `;
        
        for (const res of resources) {
            const tier = getResourceTier(res);
            const amount = allResources[res] || 0;
            const formula = getCraftingFormula(res);
            const isProcessed = processed[res] !== undefined;
            
            html += `<div class="matrix-row">`;
            html += `<div class="row-label"><i class="fas fa-cube"></i> ${res}</div>`;
            
            for (let t = 2; t <= 8; t++) {
                if (t === tier) {
                    html += `
                        <div class="matrix-cell has-resource t${t}">
                            <div class="amount" style="${isProcessed ? 'font-weight: 800; color: var(--gold);' : ''}">
                                ${isProcessed ? '🔨 ' : ''}${amount.toFixed(2)}
                            </div>
                            ${formula ? `<div class="formula">${formula}</div>` : ''}
                        </div>
                    `;
                } else {
                    html += `<div class="matrix-cell t${t}">—</div>`;
                }
            }
            
            html += `</div>`;
        }
    }
    
    container.innerHTML = html;
    
    // Обновляем итоги
    const totalStats = document.getElementById('totalStats');
    const totalProcessed = Object.values(processed).reduce((a, b) => a + b, 0);
    const totalRaw = Object.values(allResources).reduce((a, b) => a + b, 0);
    
    totalStats.innerHTML = `
        <div class="total-stat">
            <span class="total-label">🔨 Готовых ресурсов</span>
            <span class="total-value" style="color: var(--gold);">${totalProcessed.toFixed(2)}</span>
        </div>
        <div class="total-stat">
            <span class="total-label">⛏️ Всего сырья</span>
            <span class="total-value">${totalRaw.toFixed(2)}</span>
        </div>
    `;
}

// Сохранение в историю
function saveToHistory() {
    if (!CalculatorState.currentResult) {
        alert('Сначала выполните расчёт');
        return;
    }
    
    const history = JSON.parse(localStorage.getItem('craftHistory') || '[]');
    
    const entry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        item: CalculatorState.currentResult.item,
        quantity: CalculatorState.currentResult.quantity,
        total: Object.values(CalculatorState.currentResult.processed).reduce((a, b) => a + b, 0)
    };
    
    history.unshift(entry);
    if (history.length > 30) history.pop();
    
    localStorage.setItem('craftHistory', JSON.stringify(history));
    loadHistory();
}

// Загрузка истории
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('craftHistory') || '[]');
    const grid = document.getElementById('historyGrid');
    
    if (!grid) return;
    
    if (history.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 20px;">История пуста</div>';
        return;
    }
    
    grid.innerHTML = '';
    
    history.forEach(entry => {
        const date = new Date(entry.timestamp);
        const timeStr = date.toLocaleString('ru-RU', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
        });
        
        const card = document.createElement('div');
        card.className = 'history-card';
        card.innerHTML = `
            <div class="history-card-header">
                <span class="history-card-name">${entry.item}</span>
                <span class="history-card-delete" data-id="${entry.id}"><i class="fas fa-times"></i></span>
            </div>
            <div class="history-card-details">
                <span>${entry.quantity} шт</span>
                <span>${entry.total.toFixed(2)} ресурсов</span>
            </div>
            <div class="history-card-time">${timeStr}</div>
        `;
        
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.history-card-delete')) {
                document.getElementById('quantityInput').value = entry.quantity;
                CalculatorState.selectedItem = entry.item;
                CalculatorState.quantity = entry.quantity;
                loadItems(CalculatorState.currentCategory);
                
                const result = calculate();
                if (result) {
                    CalculatorState.currentResult = result;
                    buildMatrix(result);
                }
            }
        });
        
        grid.appendChild(card);
    });
    
    document.querySelectorAll('.history-card-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const history = JSON.parse(localStorage.getItem('craftHistory') || '[]');
            const filtered = history.filter(h => h.id !== id);
            localStorage.setItem('craftHistory', JSON.stringify(filtered));
            loadHistory();
        });
    });
}

// Очистка истории
function clearHistory() {
    if (confirm('Очистить всю историю?')) {
        localStorage.removeItem('craftHistory');
        loadHistory();
    }
}

// Экспорт функций
window.CalculatorFunctions = {
    adjustQuantity: (delta) => {
        const input = document.getElementById('quantityInput');
        let val = parseInt(input.value) || 1;
        val = Math.max(1, val + delta);
        input.value = val;
        CalculatorState.quantity = val;
    },
    calculateAndDisplay: () => {
        const result = calculate();
        if (result) {
            CalculatorState.currentResult = result;
            buildMatrix(result);
        }
    },
    saveToHistory,
    clearHistory
};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Категории
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            CalculatorState.currentCategory = this.dataset.category;
            loadItems(CalculatorState.currentCategory);
        });
    });
    
    // Переключение вкладок
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabName = this.dataset.tab;
            document.getElementById('weapons-content').style.display = tabName === 'weapons' ? 'block' : 'none';
            document.getElementById('armor-content').style.display = tabName === 'armor' ? 'block' : 'none';
            document.getElementById('consumables-content').style.display = tabName === 'consumables' ? 'block' : 'none';
        });
    });
    
    // Количество
    document.getElementById('quantityInput').addEventListener('input', function(e) {
        CalculatorState.quantity = parseInt(e.target.value) || 1;
    });
    
    // Кнопка расчёта
    document.getElementById('calculateBtn').addEventListener('click', CalculatorFunctions.calculateAndDisplay);
    
    // Загрузка
    loadItems("all");
    loadHistory();
    
    // Первый расчёт
    setTimeout(() => {
        const result = calculate();
        if (result) {
            CalculatorState.currentResult = result;
            buildMatrix(result);
        }
    }, 100);
});