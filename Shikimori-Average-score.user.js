// ==UserScript==
// @name         Shikimori Средний балл оценок
// @namespace    https://shiki.one/Reverend
// @version      1.0
// @description  Добавляет средний балл к распределению оценок на страницах Shikimori
// @author       Reverend
// @match        *://shiki.one/*
// @match        *://shikimori.org/*
// @match        *://shikimori.one/*
// @match        *://shiki.one/*
// @downloadURL  https://github.com/Reverend322/Shikimori-Average-score/raw/main/Shikimori-Average-score.user.js
// @updateURL    https://github.com/Reverend322/Shikimori-Average-score/raw/main/Shikimori-Average-score.user.js
// @license      MIT
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function calculateAverage(barElement) {
        try {
            const rawData = barElement.dataset.stats;
            if (!rawData) return null;

            const stats = JSON.parse(rawData.replace(/&quot;/g, '"'));

            let totalSum = 0;
            let totalCount = 0;

            stats.forEach(item => {
                const rating = parseInt(item.name);
                const count = item.value;
                totalSum += rating * count;
                totalCount += count;
            });

            if (totalCount === 0) return null;
            return (totalSum / totalCount).toFixed(2);
        } catch (e) {
            console.error('Ошибка расчета:', e);
            return null;
        }
    }

    function addAverageToPage() {
        const scoreCharts = document.querySelectorAll('.scores.block .bar[data-stats]');

        scoreCharts.forEach(chart => {
            const parentBlock = chart.closest('.scores.block');
            if (parentBlock.querySelector('.average-added')) return;

            const average = calculateAverage(chart);
            if (average === null) return;

            const titleElement = parentBlock.querySelector('.subheadline.m5');
            if (!titleElement) return;

            // Создаем элемент для среднего балла
            const averageSpan = document.createElement('span');
            averageSpan.className = 'average-added';
            averageSpan.textContent = ` (Ср. ${average})`;
            averageSpan.style.marginLeft = '8px';

            // Наследуем только цвет и семейство шрифта у заголовка
            averageSpan.style.color = 'inherit';  // Наследует цвет родителя
            averageSpan.style.fontFamily = 'inherit';  // Наследует шрифт родителя

            titleElement.appendChild(averageSpan);
        });
    }

    // Запускаем при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addAverageToPage);
    } else {
        addAverageToPage();
    }

    // Отслеживаем изменения на странице (если контент загружается динамически)
    const observer = new MutationObserver(function() {
        setTimeout(addAverageToPage, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
