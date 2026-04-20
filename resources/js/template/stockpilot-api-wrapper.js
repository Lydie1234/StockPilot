/**
 * StockPilot - Wrapper pour remplacer le mock par l'API réelle
 * Garde la même interface que le mock pour la compatibilité
 */

import StockPilotAPI from '../api/stockpilot-api.js';

const formatterCurrency = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
});

const formatterNumber = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 2,
});

const statusMeta = {
    critique: { label: 'Critique', className: 'sp-badge-critique' },
    faible: { label: 'Faible', className: 'sp-badge-faible' },
    normal: { label: 'Normal', className: 'sp-badge-normal' },
};

const formatCurrency = (value) => formatterCurrency.format(parseNumeric(value));
const formatNumber = (value) => formatterNumber.format(parseNumeric(value));

const formatDateTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '-';
    }

    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const parseNumeric = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const deepClone = (value) => JSON.parse(JSON.stringify(value));

const subscriptions = new Set();

let cachedDashboardData = null;

const subscribe = (subscriber) => {
    if (typeof subscriber !== 'function') {
        return () => {};
    }

    subscriptions.add(subscriber);
    return () => subscriptions.delete(subscriber);
};

const notify = (data) => {
    subscriptions.forEach((subscriber) => {
        try {
            subscriber(deepClone(data));
        } catch (error) {
            console.error('[StockPilot] Subscriber erreur:', error);
        }
    });

    window.dispatchEvent(
        new CustomEvent('stockpilot:state-changed', { detail: deepClone(data) }),
    );
};

const getState = async () => {
    try {
        return await StockPilotAPI.getDashboardData();
    } catch (error) {
        console.error('[StockPilot] Erreur getState:', error);
        return cachedDashboardData || {};
    }
};

const getDashboardData = async () => {
    try {
        const data = await StockPilotAPI.getDashboardData();
        cachedDashboardData = data;
        return data;
    } catch (error) {
        console.error('[StockPilot] Erreur getDashboardData:', error);
        return cachedDashboardData || {};
    }
};

const renderToast = (message, tone = 'success') => {
    const stackId = 'sp-toast-stack';
    let stack = document.getElementById(stackId);

    if (!stack) {
        stack = document.createElement('div');
        stack.id = stackId;
        stack.className = 'position-fixed top-0 end-0 p-3';
        stack.style.zIndex = '1080';
        document.body.appendChild(stack);
    }

    const toast = document.createElement('div');
    toast.className = `alert alert-${tone} shadow-sm mb-2 sp-toast`;
    toast.role = 'alert';
    toast.textContent = message;

    stack.appendChild(toast);

    window.setTimeout(() => {
        toast.remove();
    }, 3200);
};

const fillCategorySelect = async (select, selectedValue = '', includeAllOption = true) => {
    if (!select) {
        return;
    }

    try {
        const categories = await StockPilotAPI.categories.getAll();
        const previous = String(selectedValue || select.value || '');
        const options = [
            ...(includeAllOption ? ["<option value=''>Toutes les categories</option>"] : []),
            ...categories.map((category) => `<option value='${category.id}'>${category.name}</option>`),
        ];

        select.innerHTML = options.join('');

        if (previous) {
            select.value = previous;
        }
    } catch (error) {
        console.error('[StockPilot] Erreur fillCategorySelect:', error);
        renderToast('Erreur lors du chargement des catégories', 'danger');
    }
};

const renderDashboardPage = async () => {
    const root = document.querySelector("[data-sp-page='dashboard']");
    if (!root) {
        return;
    }

    try {
        const dashboard = await getDashboardData();

        const bind = (key, value) => {
            const target = root.querySelector(`[data-sp-kpi='${key}']`);
            if (target) {
                target.textContent = value;
            }
        };

        bind('alert-products', String(dashboard.alertProducts?.length || 0));
        bind('stock-value', formatCurrency(dashboard.totalStockValue || 0));
        bind('movement-today', String(dashboard.movementToday || 0));
        bind('stock-units', formatNumber(dashboard.totalStockUnits || 0));
        bind('critical-products', String(dashboard.criticalProducts?.length || 0));
        bind('low-products', String(dashboard.lowProducts?.length || 0));
        bind('total-products', String(dashboard.products?.length || 0));
        bind('category-count', String(dashboard.categories?.length || 0));

        const lowStockList = root.querySelector("[data-sp-low-stock-list]");
        if (lowStockList && dashboard.alertProducts) {
            lowStockList.innerHTML = dashboard.alertProducts.length
                ? dashboard.alertProducts
                    .slice(0, 6)
                    .map((product) => {
                        const status = statusMeta[product.status] || statusMeta.normal;
                        const category = dashboard.categories?.find((c) => c.id === product.category_id);

                        return `
                            <li class='list-group-item d-flex justify-content-between align-items-center gap-3'>
                                <div>
                                    <p class='mb-1 fw-semibold'>${product.name}</p>
                                    <small class='text-secondary'>${category?.name || '-'} - ${formatNumber(product.current_stock)} ${product.unit}</small>
                                </div>
                                <span class='badge ${status.className}'>${status.label}</span>
                            </li>
                        `;
                    })
                    .join('')
                : "<li class='list-group-item text-secondary'>Aucun produit sous le seuil.</li>";
        }

        const recentMovementsElement = root.querySelector("[data-sp-recent-movements]");
        if (recentMovementsElement && dashboard.recentMovements) {
            recentMovementsElement.innerHTML = dashboard.recentMovements
                .map(
                    (movement) => `
                <tr>
                    <td>${movement.product_name}</td>
                    <td>${movement.category_name}</td>
                    <td>${movement.type}</td>
                    <td>${formatNumber(movement.quantity)} ${movement.product?.unit || 'unité'}</td>
                    <td>${formatDateTime(movement.created_at)}</td>
                </tr>
            `,
                )
                .join('');
        }

        notify(dashboard);
    } catch (error) {
        console.error('[StockPilot] Erreur renderDashboardPage:', error);
        renderToast('Erreur lors du chargement du dashboard', 'danger');
    }
};

const renderInventoryPage = async () => {
    const root = document.querySelector("[data-sp-page='inventory']");
    if (!root) {
        return;
    }

    try {
        const dashboard = await getDashboardData();

        const bind = (key, value) => {
            const target = root.querySelector(`[data-sp-${key}]`);
            if (target) {
                target.textContent = value;
            }
        };

        bind('products-count', String(dashboard.products?.length || 0));
        bind('critical-count', String(dashboard.criticalProducts?.length || 0));
        bind('low-count', String(dashboard.lowProducts?.length || 0));
        bind('total-value', formatCurrency(dashboard.totalStockValue || 0));

        notify(dashboard);
    } catch (error) {
        console.error('[StockPilot] Erreur renderInventoryPage:', error);
        renderToast('Erreur lors du chargement de l\'inventaire', 'danger');
    }
};

// Exporter l'API pour utilisation dans les composants
window.StockPilotAPI = StockPilotAPI;
window.StockPilot = {
    subscribe,
    getState,
    getDashboardData,
    renderToast,
    fillCategorySelect,
    renderDashboardPage,
    renderInventoryPage,
    formatCurrency,
    formatNumber,
    formatDateTime,
    statusMeta,
};

// Charger les pages au démarrage
document.addEventListener('DOMContentLoaded', async () => {
    await renderDashboardPage();
    await renderInventoryPage();
});
