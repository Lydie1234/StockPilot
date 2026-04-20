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

const normalizeMovementType = (value) => {
    const normalized = String(value || '').toLowerCase();
    return normalized === 'entrée' ? 'entree' : normalized;
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

const renderReportsPage = async () => {
    const root = document.querySelector("[data-sp-page='reports']");
    if (!root) {
        return;
    }

    const refs = {
        filterPeriod: root.querySelector('[data-sp-report-period]'),
        filterType: root.querySelector('[data-sp-report-type]'),
        filterCategory: root.querySelector('[data-sp-report-category]'),
        filterStatus: root.querySelector('[data-sp-report-status]'),
        movementsBody: root.querySelector('[data-sp-report-movements]'),
        topProducts: root.querySelector('[data-sp-report-top-products]'),
    };

    const filterState = {
        period: Number(refs.filterPeriod?.value || 30),
        type: String(refs.filterType?.value || ''),
        category: String(refs.filterCategory?.value || ''),
        status: String(refs.filterStatus?.value || ''),
    };

    let allMovements = [];
    let products = [];
    let categories = [];

    const bindKpi = (name, value) => {
        const node = root.querySelector(`[data-sp-kpi='${name}']`);
        if (node) {
            node.textContent = value;
        }
    };

    const getStockStatus = (product) => {
        const stock = parseNumeric(product?.current_stock);
        const threshold = parseNumeric(product?.alert_threshold);

        if (stock <= 0) {
            return 'critique';
        }

        if (stock <= threshold) {
            return 'faible';
        }

        return 'normal';
    };

    const ensureCategoryOptions = () => {
        if (!refs.filterCategory || refs.filterCategory.dataset.loaded === '1') {
            return;
        }

        const selected = String(filterState.category || refs.filterCategory.value || '');
        refs.filterCategory.innerHTML = [
            "<option value=''>Toutes les categories</option>",
            ...categories.map((category) => (
                `<option value='${category.id}'>${category.name}</option>`
            )),
        ].join('');

        if (selected) {
            refs.filterCategory.value = selected;
        }

        refs.filterCategory.dataset.loaded = '1';
    };

    const getFilteredMovements = () => {
        const now = Date.now();
        const maxAge = Number(filterState.period || 30) * 24 * 60 * 60 * 1000;

        return [...allMovements]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .filter((movement) => {
                const movementDate = new Date(movement.created_at).getTime();
                const age = now - movementDate;
                const periodMatch = maxAge > 0 ? age <= maxAge : true;

                const movementType = normalizeMovementType(movement.type);
                const typeMatch = !filterState.type || movementType === normalizeMovementType(filterState.type);

                const product = products.find((item) => item.id === movement.product_id);
                const categoryMatch = !filterState.category || String(product?.category_id || '') === String(filterState.category);
                const statusMatch = !filterState.status || getStockStatus(product) === filterState.status;

                return periodMatch && typeMatch && categoryMatch && statusMatch;
            });
    };

    const renderMovements = (movements) => {
        if (!refs.movementsBody) {
            return;
        }

        refs.movementsBody.innerHTML = movements.length
            ? movements.slice(0, 30).map((movement) => {
                const product = products.find((item) => item.id === movement.product_id);
                const category = categories.find((item) => item.id === product?.category_id);
                const type = normalizeMovementType(movement.type);

                const badgeClass = type === 'sortie'
                    ? 'bg-danger-subtle text-danger border border-danger'
                    : type === 'entree'
                        ? 'bg-success-subtle text-success border border-success'
                        : 'bg-warning-subtle text-warning border border-warning';

                return `
                    <tr class='sp-report-row'>
                        <td class='sp-report-date'>${formatDateTime(movement.created_at)}</td>
                        <td><span class='sp-report-main'>${product?.name || 'Produit archive'}</span></td>
                        <td class='sp-report-category'>${category?.name || '-'}</td>
                        <td><span class='badge sp-report-type-badge ${badgeClass}'>${type}</span></td>
                        <td class='text-end'><span class='sp-report-number'>${formatNumber(movement.quantity)}</span></td>
                        <td class='sp-report-reason'>${movement.reason || '-'}</td>
                        <td class='text-end'><span class='sp-report-number sp-report-stock'>${formatNumber(product?.current_stock || 0)}</span></td>
                    </tr>
                `;
            }).join('')
            : "<tr><td colspan='7' class='text-center text-secondary py-4 sp-report-empty-cell'>Aucun mouvement pour ces filtres.</td></tr>";
    };

    const renderTopProducts = (movements) => {
        if (!refs.topProducts) {
            return;
        }

        const topProducts = movements
            .filter((movement) => normalizeMovementType(movement.type) === 'sortie')
            .reduce((accumulator, movement) => {
                const key = String(movement.product_id);
                accumulator[key] = (accumulator[key] || 0) + parseNumeric(movement.quantity);
                return accumulator;
            }, {});

        const list = Object.entries(topProducts)
            .map(([productId, quantity]) => {
                const product = products.find((item) => item.id === parseNumeric(productId));
                return {
                    product,
                    quantity,
                };
            })
            .filter((entry) => entry.product)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        refs.topProducts.innerHTML = list.length
            ? list.map((entry) => `
                <li class='list-group-item sp-report-top-item'>
                    <div class='min-w-0'>
                        <h6 class='mb-1 sp-report-top-title text-truncate'>${entry.product.name}</h6>
                        <small class='sp-report-top-sub'>${formatNumber(entry.quantity)} ${entry.product.unit} sortis</small>
                    </div>
                    <span class='badge sp-report-top-value'>${formatCurrency(entry.quantity * parseNumeric(entry.product.unit_price))}</span>
                </li>
            `).join('')
            : "<li class='list-group-item p-3 text-secondary'>Aucune sortie sur cette periode.</li>";
    };

    const render = () => {
        ensureCategoryOptions();

        const movements = getFilteredMovements();

        const totalStockValue = products.reduce((sum, product) => (
            sum + (parseNumeric(product.current_stock) * parseNumeric(product.unit_price))
        ), 0);
        const lowProducts = products.filter((product) => getStockStatus(product) === 'faible').length;
        const criticalProducts = products.filter((product) => getStockStatus(product) === 'critique').length;

        bindKpi('report-stock-value', formatCurrency(totalStockValue));
        bindKpi('report-movement-count', String(movements.length));
        bindKpi('report-low-stock', String(lowProducts));
        bindKpi('report-critical', String(criticalProducts));

        renderMovements(movements);
        renderTopProducts(movements);
    };

    const normalizeCollection = (payload) => {
        if (Array.isArray(payload)) {
            return payload;
        }

        if (Array.isArray(payload?.data)) {
            return payload.data;
        }

        return [];
    };

    const loadData = async () => {
        try {
            const [movementsResponse, productsResponse, categoriesResponse] = await Promise.all([
                StockPilotAPI.movements.getAll(1),
                StockPilotAPI.products.getAll(),
                StockPilotAPI.categories.getAll(),
            ]);

            allMovements = normalizeCollection(movementsResponse);
            products = normalizeCollection(productsResponse);
            categories = normalizeCollection(categoriesResponse);

            render();
        } catch (error) {
            console.error('[StockPilot] Erreur renderReportsPage:', error);

            if (refs.movementsBody) {
                refs.movementsBody.innerHTML = "<tr><td colspan='7' class='text-center text-danger py-4 sp-report-empty-cell'>Erreur de chargement des donnees.</td></tr>";
            }

            renderToast('Erreur lors du chargement des rapports', 'danger');
        }
    };

    refs.filterPeriod?.addEventListener('change', (event) => {
        filterState.period = Number(event.target.value || 30);
        render();
    });

    refs.filterType?.addEventListener('change', (event) => {
        filterState.type = String(event.target.value || '');
        render();
    });

    refs.filterCategory?.addEventListener('change', (event) => {
        filterState.category = String(event.target.value || '');
        render();
    });

    refs.filterStatus?.addEventListener('change', (event) => {
        filterState.status = String(event.target.value || '');
        render();
    });

    await loadData();
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
    renderReportsPage,
    formatCurrency,
    formatNumber,
    formatDateTime,
    statusMeta,
};

// Charger les pages au démarrage
document.addEventListener('DOMContentLoaded', async () => {
    await renderDashboardPage();
    await renderInventoryPage();
    await renderReportsPage();
});
