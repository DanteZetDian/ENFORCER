// ==========================================
// ranks.js - Табель о рангах Enforcer
// Динамическое отображение иерархии
// ==========================================

const RANKS_DATA = {
    military: {
        title: "ВОЕННАЯ ВЕТВЬ",
        icon: "⚔️",
        description: "Война — наше ремесло, победа — единственный приемлемый исход!",
        ranks: [
            { number: 1, name: "Неофит", desc: "Новобранцы, проходящие испытательный срок" },
            { number: 2, name: "Боец Стальных Легионов", desc: "Рядовой состав, основа армии" },
            { number: 3, name: "Ветеран Крепостных Войн", desc: "Закалённые в боях бойцы" },
            { number: 4, name: "Сержант-Паладин", desc: "Командир звена, отвечает за 5-10 бойцов" },
            { number: 5, name: "Лейтенант Инквизиции", desc: "Элитный офицер, проводящий чистки" },
            { number: 6, name: "Капитан Терминатор", desc: "Командующий крупными операциями" },
            { number: 7, name: "Командор Ордена", desc: "Правая рука Генерала" },
            { number: 8, name: "Генерал-Гектарх", desc: "Высший чин военной ветви" }
        ]
    },
    craft: {
        title: "РЕМЕСЛЕННАЯ ВЕТВЬ",
        icon: "🔨",
        description: "Как техножрецы, мы куём мощь Fort Sterling!",
        ranks: [
            { number: 1, name: "Сервитор", desc: "Подмастерье, выполняет базовые задачи" },
            { number: 2, name: "Мастер-Артизан", desc: "Самостоятельный крафтер" },
            { number: 3, name: "Архимагос", desc: "Управляет гильдейскими мастерскими" },
            { number: 4, name: "Фабрикатор-Генерал", desc: "Верховный кузнец гильдии" }
        ]
    },
    gather: {
        title: "ДОБЫВАЮЩАЯ ВЕТВЬ",
        icon: "⛏️",
        description: "Мы добываем ресурсы, как крестоносцы добывали святые реликвии!",
        specializations: [
            { name: "Горняк-Сталварк", desc: "Добытчик руды", icon: "fa-hammer" },
            { name: "Лесоруб-Сильванит", desc: "Заготовщик дерева", icon: "fa-tree" },
            { name: "Свежеватель-Эксфолиант", desc: "Охотник за шкурами", icon: "fa-paw" },
            { name: "Хлопкороб-Тектонид", desc: "Собиратель льна", icon: "fa-leaf" },
            { name: "Каменщик-Петробарон", desc: "Добытчик камня", icon: "fa-mountain" }
        ],
        ranks: [
            { number: 1, name: "Простолюдин", desc: "Низший ранг, начало пути" },
            { number: 2, name: "Фригольд-Добытчик", desc: "Специалист с гильдейским разрешением" },
            { number: 3, name: "Барон-Промышленник", desc: "Организует добычу" },
            { number: 4, name: "Магнат-Экзарх", desc: "Контролирует ресурсы всей гильдии" }
        ]
    },
    honor: {
        title: "ОСОБЫЕ ЗВАНИЯ",
        icon: "⚜️",
        description: "За выдающиеся заслуги перед Орденом",
        ranks: [
            { name: "Рекрутер-Миссионер", desc: "Вербует новых членов", icon: "fa-bullhorn" },
            { name: "Казначей-Прокуратор", desc: "Управляет гильдейской казной", icon: "fa-coins" },
            { name: "Хроникер-Лексиканиум", desc: "Летописец гильдии", icon: "fa-scroll" }
        ]
    }
};

// Загрузка рангов при открытии страницы
document.addEventListener('DOMContentLoaded', function() {
    loadRanks();
});

function loadRanks() {
    const container = document.getElementById('ranksContainer');
    if (!container) return;
    
    let html = '';
    
    // Военная ветвь
    html += `
        <div class="branch-section">
            <div class="branch-header military">
                <div class="branch-icon">${RANKS_DATA.military.icon}</div>
                <div class="branch-title">
                    <h2>${RANKS_DATA.military.title}</h2>
                    <p>${RANKS_DATA.military.description}</p>
                </div>
            </div>
            <div class="ranks-grid">
    `;
    
    RANKS_DATA.military.ranks.forEach(rank => {
        html += `
            <div class="rank-card military">
                <span class="rank-number">${rank.number}</span>
                <div class="rank-name">${rank.name}</div>
                <div class="rank-desc">${rank.desc}</div>
            </div>
        `;
    });
    
    html += `</div></div>`;
    
    // Ремесленная ветвь
    html += `
        <div class="branch-section">
            <div class="branch-header craft">
                <div class="branch-icon">${RANKS_DATA.craft.icon}</div>
                <div class="branch-title">
                    <h2>${RANKS_DATA.craft.title}</h2>
                    <p>${RANKS_DATA.craft.description}</p>
                </div>
            </div>
            <div class="ranks-grid">
    `;
    
    RANKS_DATA.craft.ranks.forEach(rank => {
        html += `
            <div class="rank-card craft">
                <span class="rank-number">${rank.number}</span>
                <div class="rank-name">${rank.name}</div>
                <div class="rank-desc">${rank.desc}</div>
            </div>
        `;
    });
    
    html += `</div></div>`;
    
    // Добывающая ветвь
    html += `
        <div class="branch-section">
            <div class="branch-header gather">
                <div class="branch-icon">${RANKS_DATA.gather.icon}</div>
                <div class="branch-title">
                    <h2>${RANKS_DATA.gather.title}</h2>
                    <p>${RANKS_DATA.gather.description}</p>
                </div>
            </div>
            
            <div class="specializations">
                <h3 style="color: var(--royal-blue); margin-bottom: 15px;">⚒️ СПЕЦИАЛИЗАЦИИ</h3>
                <div class="spec-grid">
    `;
    
    RANKS_DATA.gather.specializations.forEach(spec => {
        html += `
            <div class="spec-item">
                <i class="fas ${spec.icon}"></i>
                <h4>${spec.name}</h4>
                <p>${spec.desc}</p>
            </div>
        `;
    });
    
    html += `</div></div><div class="ranks-grid">`;
    
    RANKS_DATA.gather.ranks.forEach(rank => {
        html += `
            <div class="rank-card gather">
                <span class="rank-number">${rank.number}</span>
                <div class="rank-name">${rank.name}</div>
                <div class="rank-desc">${rank.desc}</div>
            </div>
        `;
    });
    
    html += `</div></div>`;
    
    // Особые звания
    html += `
        <div class="branch-section" style="border-color: var(--gold);">
            <div class="branch-header">
                <div class="branch-icon" style="border-color: var(--gold);">${RANKS_DATA.honor.icon}</div>
                <div class="branch-title">
                    <h2>${RANKS_DATA.honor.title}</h2>
                    <p>${RANKS_DATA.honor.description}</p>
                </div>
            </div>
            <div class="honor-ranks">
    `;
    
    RANKS_DATA.honor.ranks.forEach(honor => {
        html += `
            <div class="honor-card">
                <i class="fas ${honor.icon}"></i>
                <h3>${honor.name}</h3>
                <p>${honor.desc}</p>
            </div>
        `;
    });
    
    html += `</div></div>`;
    
    container.innerHTML = html;
}