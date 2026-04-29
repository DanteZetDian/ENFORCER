// ==========================================
// mobile.js - Универсальная мобильная оптимизация
// Адаптация интерфейса под мобильные устройства
// ==========================================

(function() {
    'use strict';

    const CONFIG = {
        breakpoints: {
            mobile: 768,
            tablet: 1024
        },
        touchThreshold: 50,
        debounceDelay: 150
    };

    let State = {
        isMobile: window.innerWidth <= CONFIG.breakpoints.mobile,
        isTablet: window.innerWidth <= CONFIG.breakpoints.tablet,
        menuOpen: false,
        touchStartX: 0,
        scrollPosition: 0
    };

    const Utils = {
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        isTouchDevice() {
            return ('ontouchstart' in window) || 
                   (navigator.maxTouchPoints > 0) || 
                   (navigator.msMaxTouchPoints > 0);
        },

        lockScroll() {
            State.scrollPosition = window.pageYOffset;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${State.scrollPosition}px`;
            document.body.style.width = '100%';
        },

        unlockScroll() {
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('position');
            document.body.style.removeProperty('top');
            document.body.style.removeProperty('width');
            window.scrollTo(0, State.scrollPosition);
        }
    };

    // Оптимизация таблиц для мобильных
    const TableOptimizer = {
        init() {
            if (State.isMobile) {
                document.querySelectorAll('.prices-table, .roster-table, .matrix-wrapper').forEach(table => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'table-scroll-wrapper';
                    wrapper.style.cssText = `
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                        margin: 15px 0;
                        border-radius: 10px;
                    `;
                    table.parentNode.insertBefore(wrapper, table);
                    wrapper.appendChild(table);
                });
            }
        }
    };

    // Адаптация сеток
    const GridOptimizer = {
        init() {
            if (State.isMobile) {
                document.querySelectorAll('.items-grid').forEach(grid => {
                    grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                });
                document.querySelectorAll('.history-grid').forEach(grid => {
                    grid.style.gridTemplateColumns = '1fr';
                });
            }
        }
    };

    const MobileOptimizer = {
        updateState() {
            State.isMobile = window.innerWidth <= CONFIG.breakpoints.mobile;
            State.isTablet = window.innerWidth <= CONFIG.breakpoints.tablet;
        },

        applyAll() {
            TableOptimizer.init();
            GridOptimizer.init();
            
            document.body.classList.toggle('mobile-device', State.isMobile);
            document.body.classList.toggle('tablet-device', State.isTablet);
        },

        init() {
            this.updateState();
            this.applyAll();

            window.addEventListener('resize', Utils.debounce(() => {
                this.updateState();
                this.applyAll();
            }, CONFIG.debounceDelay));

            console.log('✅ Mobile optimizer initialized', 
                State.isMobile ? '📱 Mobile mode' : 
                State.isTablet ? '📟 Tablet mode' : 
                '💻 Desktop mode');
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => MobileOptimizer.init());
    } else {
        MobileOptimizer.init();
    }

})();