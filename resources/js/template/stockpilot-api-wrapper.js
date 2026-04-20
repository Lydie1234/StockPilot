/**
 * StockPilot - Wrapper pour remplacer le mock par l'API reelle
 * Garde la meme interface que le mock pour la compatibilite
 */

import StockPilotAPI from '../api/stockpilot-api.js';
import { Modal, Tooltip } from 'bootstrap';

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

const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const normalizeMovementType = (value) => {
    const normalized = String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    return normalized === 'entree' ? 'entree' : normalized;
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
        renderToast('Erreur lors du chargement des categories', 'danger');
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

        const topProductsList = root.querySelector("[data-sp-top-products-list]");
        const topOutgoing = Array.isArray(dashboard.topOutgoing) ? dashboard.topOutgoing : [];
        if (topProductsList) {
            topProductsList.innerHTML = topOutgoing.length
                ? topOutgoing
                    .map((item) => `
                        <li class='list-group-item d-flex justify-content-between align-items-center'>
                            <div>
                                <p class='mb-1 fw-semibold'>${escapeHtml(item.product_name)}</p>
                                <small class='text-secondary'>${formatNumber(item.quantity)} ${escapeHtml(item.unit || 'unite')} sortis</small>
                            </div>
                            <span class='badge bg-primary-subtle text-primary border border-primary'>${formatCurrency(item.revenue)}</span>
                        </li>
                    `)
                    .join('')
                : "<li class='list-group-item text-secondary'>Aucun mouvement sortant sur la periode.</li>";
        }

        const movementList = root.querySelector("[data-sp-recent-movements-list]");
        const recentMovements = Array.isArray(dashboard.recentMovements) ? dashboard.recentMovements : [];
        if (movementList) {
            movementList.innerHTML = recentMovements.length
                ? recentMovements
                    .map((movement) => {
                        const movementType = normalizeMovementType(movement.type);
                        const badgeClass = movementType === 'sortie'
                            ? 'bg-danger-subtle text-danger border border-danger'
                            : movementType === 'entree'
                                ? 'bg-success-subtle text-success border border-success'
                                : 'bg-warning-subtle text-warning border border-warning';

                        return `
                            <li class='list-group-item d-flex justify-content-between align-items-start gap-3'>
                                <div>
                                    <p class='mb-1 fw-semibold'>${escapeHtml(movement.product_name)}</p>
                                    <small class='text-secondary d-block'>${escapeHtml(movement.reason || '-')}</small>
                                    <small class='text-secondary'>${formatDateTime(movement.created_at)}</small>
                                </div>
                                <span class='badge ${badgeClass}'>${escapeHtml(movementType)} ${formatNumber(movement.quantity)}</span>
                            </li>
                        `;
                    })
                    .join('')
                : "<li class='list-group-item text-secondary'>Aucun mouvement recent.</li>";
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

    const refs = {
        productsCount: root.querySelector('[data-sp-products-count]'),
        criticalCount: root.querySelector('[data-sp-critical-count]'),
        lowCount: root.querySelector('[data-sp-low-count]'),
        totalValue: root.querySelector('[data-sp-total-value]'),
        searchInput: root.querySelector('[data-sp-search]'),
        statusFilter: root.querySelector('[data-sp-status-filter]'),
        categoryFilter: root.querySelector('[data-sp-category-filter]'),
        resetFilters: root.querySelector('[data-sp-reset-filters]'),
        body: root.querySelector('[data-sp-products-body]'),
        productsCards: root.querySelector('[data-sp-products-cards]'),
        emptyState: root.querySelector('[data-sp-empty-state]'),
        movementModal: root.querySelector('#spMovementModal'),
        movementForm: root.querySelector('[data-sp-movement-form]'),
        movementProduct: root.querySelector('[data-sp-movement-product]'),
        movementType: root.querySelector('[data-sp-movement-type]'),
        movementQuantityLabel: root.querySelector('[data-sp-movement-quantity-label]'),
        categoryModal: root.querySelector('#spCategoryModal'),
        categoryForm: root.querySelector('[data-sp-category-form]'),
        categoryList: root.querySelector('[data-sp-category-list]'),
        editCard: root.querySelector('[data-sp-edit-card]'),
        editForm: root.querySelector('[data-sp-edit-form]'),
        editCategory: root.querySelector('[data-sp-edit-category]'),
        productModal: root.querySelector('[data-sp-product-modal]'),
        modalTitle: root.querySelector('[data-sp-modal-title]'),
        modalSku: root.querySelector('[data-sp-modal-sku]'),
        modalStatus: root.querySelector('[data-sp-modal-status]'),
        modalCategory: root.querySelector('[data-sp-modal-category]'),
        modalStock: root.querySelector('[data-sp-modal-stock]'),
        modalThreshold: root.querySelector('[data-sp-modal-threshold]'),
        modalPrice: root.querySelector('[data-sp-modal-price]'),
        modalPrefill: root.querySelector('[data-sp-modal-prefill]'),
    };

    const filters = {
        search: String(refs.searchInput?.value || '').trim().toLowerCase(),
        status: String(refs.statusFilter?.value || ''),
        category: String(refs.categoryFilter?.value || ''),
    };

    const canManageProducts = ['gerant', 'admin'].includes(String(window.userRole || '').toLowerCase());
    const movementModal = refs.movementModal ? Modal.getOrCreateInstance(refs.movementModal) : null;
    const categoryModal = refs.categoryModal ? Modal.getOrCreateInstance(refs.categoryModal) : null;
    const editModal = refs.editCard ? Modal.getOrCreateInstance(refs.editCard) : null;
    const productModal = refs.productModal ? Modal.getOrCreateInstance(refs.productModal) : null;
    let activeProductId = null;

    let products = [];
    let categories = [];

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

    const getCategoryById = (id) => {
        return categories.find((category) => Number(category.id) === Number(id)) || null;
    };

    const getProductById = (id) => {
        return products.find((product) => Number(product.id) === Number(id)) || null;
    };

    const productSku = (product) => {
        const fallback = `PROD-${String(product?.id || '').padStart(4, '0')}`;
        return String(product?.sku || fallback);
    };

    const productImage = (product) => {
        return String(product?.image || 'logo-icon.svg');
    };

    const createStatusBadge = (status) => {
        const statusInfo = statusMeta[status] || statusMeta.normal;
        return `<span class='badge ${statusInfo.className}'><span class='sp-status-dot'></span>${statusInfo.label}</span>`;
    };

    const refreshTooltips = () => {
        root.querySelectorAll("[data-bs-toggle='tooltip']").forEach((node) => {
            const existingTooltip = Tooltip.getInstance(node);
            if (existingTooltip) {
                existingTooltip.dispose();
            }

            new Tooltip(node, {
                trigger: 'hover focus',
                boundary: 'window',
            });
        });
    };

    const applyMovementHint = () => {
        const type = refs.movementType?.value || 'sortie';

        if (!refs.movementQuantityLabel) {
            return;
        }

        refs.movementQuantityLabel.textContent = type === 'ajustement' ? 'Nouveau stock' : 'Quantité';
    };

    const focusMovementForm = (productId) => {
        if (refs.movementProduct) {
            refs.movementProduct.value = String(productId);
        }

        if (movementModal && refs.movementModal) {
            refs.movementModal.addEventListener('shown.bs.modal', () => {
                refs.movementType?.focus();
            }, { once: true });
            movementModal.show();
            return;
        }

        refs.movementForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        refs.movementType?.focus();
    };

    const openEditProduct = (productId) => {
        const product = getProductById(productId);
        if (!product || !refs.editForm || !canManageProducts) {
            return;
        }

        refs.editForm.querySelector("[name='product_id']").value = String(product.id);
        refs.editForm.querySelector("[name='name']").value = product.name || '';
        refs.editForm.querySelector("[name='unit']").value = product.unit || '';
        refs.editForm.querySelector("[name='current_stock']").value = String(product.current_stock ?? '');
        refs.editForm.querySelector("[name='alert_threshold']").value = String(product.alert_threshold ?? '');
        refs.editForm.querySelector("[name='unit_price']").value = String(product.unit_price ?? '');

        if (refs.editCategory) {
            const selected = String(product.category_id || '');
            refs.editCategory.innerHTML = categories
                .map((category) => `<option value='${category.id}'>${escapeHtml(category.name)}</option>`)
                .join('');
            refs.editCategory.value = selected;
        }

        if (editModal && refs.editCard) {
            refs.editCard.addEventListener('shown.bs.modal', () => {
                refs.editForm?.querySelector("[name='name']")?.focus();
            }, { once: true });
            editModal.show();
            return;
        }

        refs.editCard?.classList.remove('d-none');
    };

    const renderProductDetailsModal = (productId) => {
        const product = getProductById(productId);
        if (!product) {
            return;
        }

        const category = getCategoryById(product.category_id);
        const stockStatus = getStockStatus(product);

        activeProductId = product.id;

        if (refs.modalTitle) {
            refs.modalTitle.textContent = product.name || 'Produit';
        }

        if (refs.modalSku) {
            refs.modalSku.textContent = `${productSku(product)}${canManageProducts ? ` - ${formatCurrency(product.unit_price)} / ${product.unit}` : ''}`;
        }

        if (refs.modalStatus) {
            refs.modalStatus.innerHTML = createStatusBadge(stockStatus);
        }

        if (refs.modalCategory) {
            refs.modalCategory.textContent = category?.name || '-';
        }

        if (refs.modalStock) {
            refs.modalStock.textContent = `${formatNumber(product.current_stock)} ${product.unit || ''}`.trim();
        }

        if (refs.modalThreshold) {
            refs.modalThreshold.textContent = `${formatNumber(product.alert_threshold)} ${product.unit || ''}`.trim();
        }

        if (refs.modalPrice) {
            refs.modalPrice.textContent = formatCurrency(product.unit_price || 0);
        }

        productModal?.show();
    };

    const getFilteredProducts = () => {
        return products
            .map((product) => ({
                ...product,
                status: getStockStatus(product),
            }))
            .filter((product) => {
                const categoryName = getCategoryById(product.category_id)?.name || '';
                const searchable = `${product.name || ''} ${productSku(product)} ${categoryName}`.toLowerCase();
                const searchMatch = !filters.search || searchable.includes(filters.search);
                const statusMatch = !filters.status || product.status === filters.status;
                const categoryMatch = !filters.category || String(product.category_id) === String(filters.category);

                return searchMatch && statusMatch && categoryMatch;
            })
            .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    };

    const fillCategoryFilter = () => {
        if (!refs.categoryFilter) {
            return;
        }

        const selected = String(filters.category || refs.categoryFilter.value || '');
        refs.categoryFilter.innerHTML = [
            "<option value=''>Toutes</option>",
            ...categories.map((category) => `<option value='${category.id}'>${escapeHtml(category.name)}</option>`),
        ].join('');

        if (selected) {
            refs.categoryFilter.value = selected;
        }
    };

    const fillMovementProducts = () => {
        if (!refs.movementProduct) {
            return;
        }

        const selected = refs.movementProduct.value;
        refs.movementProduct.innerHTML = [
            "<option value=''>Choisir un produit...</option>",
            ...products.map((product) => (
                `<option value='${product.id}'>${escapeHtml(product.name)} (${formatNumber(product.current_stock)} ${escapeHtml(product.unit || '')})</option>`
            )),
        ].join('');

        refs.movementProduct.value = selected || '';
    };

    const renderCategoryList = () => {
        if (!refs.categoryList) {
            return;
        }

        refs.categoryList.innerHTML = categories
            .map((category) => {
                const count = products.filter((product) => Number(product.category_id) === Number(category.id)).length;
                const canDelete = count === 0;

                return `
                    <li class='list-group-item d-flex justify-content-between align-items-center'>
                        <div>
                            <div class='fw-semibold'>${escapeHtml(category.name)}</div>
                            <small class='text-secondary'>${count} produit(s)</small>
                        </div>
                        <button type='button' class='btn btn-sm btn-outline-danger' data-sp-action='delete-category' data-category-id='${category.id}' ${canDelete ? '' : 'disabled'}>
                            <i class='ti ti-trash'></i>
                        </button>
                    </li>
                `;
            })
            .join('');
    };

    const renderMetrics = () => {
        const criticalProducts = products.filter((product) => getStockStatus(product) === 'critique').length;
        const lowProducts = products.filter((product) => getStockStatus(product) === 'faible').length;
        const totalValue = products.reduce((sum, product) => (
            sum + (parseNumeric(product.current_stock) * parseNumeric(product.unit_price))
        ), 0);

        if (refs.productsCount) {
            refs.productsCount.textContent = String(products.length);
        }

        if (refs.criticalCount) {
            refs.criticalCount.textContent = String(criticalProducts);
        }

        if (refs.lowCount) {
            refs.lowCount.textContent = String(lowProducts);
        }

        if (refs.totalValue) {
            refs.totalValue.textContent = formatCurrency(totalValue);
        }
    };

    const renderProducts = () => {
        const filteredProducts = getFilteredProducts();

        if (refs.body) {
            refs.body.innerHTML = filteredProducts.length
                ? filteredProducts
                    .map((product) => {
                        const categoryName = getCategoryById(product.category_id)?.name || '-';
                        const statusBadge = createStatusBadge(product.status);

                        return `
                            <tr class='sp-inventory-row'>
                                <td>
                                    <div class='d-flex align-items-center gap-3'>
                                        <img src='/assets/images/${escapeHtml(productImage(product))}' alt='${escapeHtml(product.name)}' class='avatar avatar-md rounded-3'>
                                        <div>
                                            <div class='fw-semibold'>${escapeHtml(product.name)}</div>
                                            <small class='text-secondary d-block'>${escapeHtml(productSku(product))}</small>
                                            ${canManageProducts ? `<small class='text-secondary'>${formatCurrency(product.unit_price)} / ${escapeHtml(product.unit || '')}</small>` : ''}
                                        </div>
                                    </div>
                                </td>
                                <td><span class='sp-inventory-category'>${escapeHtml(categoryName)}</span></td>
                                <td>
                                    <div class='sp-inventory-stock'>
                                        <strong>${formatNumber(product.current_stock)}</strong>
                                        <small>${escapeHtml(product.unit || '')}</small>
                                    </div>
                                </td>
                                <td>${formatNumber(product.alert_threshold)} ${escapeHtml(product.unit || '')}</td>
                                <td>${statusBadge}</td>
                                <td>
                                    <div class='d-flex gap-1 sp-inventory-actions'>
                                        <button type='button' class='btn btn-sm btn-light sp-action-btn' data-sp-action='view-product' data-product-id='${product.id}' data-bs-toggle='tooltip' data-bs-title='Voir'>
                                            <i class='ti ti-eye'></i><span class='visually-hidden'>Voir</span>
                                        </button>
                                        ${canManageProducts ? `
                                        <button type='button' class='btn btn-sm btn-outline-primary sp-action-btn' data-sp-action='edit-product' data-product-id='${product.id}' data-bs-toggle='tooltip' data-bs-title='Modifier'>
                                            <i class='ti ti-edit'></i><span class='visually-hidden'>Modifier</span>
                                        </button>
                                        ` : ''}
                                        <button type='button' class='btn btn-sm btn-outline-success sp-action-btn' data-sp-action='prefill-movement' data-product-id='${product.id}' data-bs-toggle='tooltip' data-bs-title='Ajouter un mouvement'>
                                            <i class='ti ti-transfer-in'></i><span class='visually-hidden'>Ajouter un mouvement</span>
                                        </button>
                                        ${canManageProducts ? `
                                        <button type='button' class='btn btn-sm btn-outline-danger sp-action-btn' data-sp-action='delete-product' data-product-id='${product.id}' data-bs-toggle='tooltip' data-bs-title='Supprimer'>
                                            <i class='ti ti-trash'></i><span class='visually-hidden'>Supprimer</span>
                                        </button>
                                        ` : ''}
                                    </div>
                                </td>
                            </tr>
                        `;
                    })
                    .join('')
                : "<tr><td colspan='6' class='text-center text-secondary py-4'>Aucun produit ne correspond aux filtres.</td></tr>";
        }

        if (refs.productsCards) {
            refs.productsCards.innerHTML = filteredProducts.length
                ? filteredProducts
                    .map((product) => {
                        const categoryName = getCategoryById(product.category_id)?.name || '-';
                        const statusBadge = createStatusBadge(product.status);

                        return `
                            <article class='card border-0 shadow-sm sp-inventory-mobile-card'>
                                <div class='card-body p-3'>
                                    <div class='d-flex justify-content-between align-items-start gap-2 mb-2'>
                                        <div>
                                            <p class='mb-1 fw-semibold'>${escapeHtml(product.name)}</p>
                                            <small class='text-secondary d-block'>${escapeHtml(productSku(product))}</small>
                                            <small class='text-secondary'>${escapeHtml(categoryName)}</small>
                                        </div>
                                        ${statusBadge}
                                    </div>
                                    <div class='sp-inventory-mobile-meta'>
                                        <p class='mb-0'><span>Stock</span><strong>${formatNumber(product.current_stock)} ${escapeHtml(product.unit || '')}</strong></p>
                                        <p class='mb-0'><span>Seuil</span><strong>${formatNumber(product.alert_threshold)} ${escapeHtml(product.unit || '')}</strong></p>
                                        ${canManageProducts ? `<p class='mb-0'><span>Prix</span><strong>${formatCurrency(product.unit_price)}</strong></p>` : ''}
                                    </div>
                                    <div class='d-flex gap-2 mt-3'>
                                        <button type='button' class='btn btn-sm btn-light flex-fill' data-sp-action='view-product' data-product-id='${product.id}'>
                                            <i class='ti ti-eye me-1'></i> Voir
                                        </button>
                                        ${canManageProducts ? `
                                        <button type='button' class='btn btn-sm btn-outline-primary flex-fill' data-sp-action='edit-product' data-product-id='${product.id}'>
                                            <i class='ti ti-edit me-1'></i> Modifier
                                        </button>
                                        ` : ''}
                                        <button type='button' class='btn btn-sm btn-outline-success flex-fill' data-sp-action='prefill-movement' data-product-id='${product.id}'>
                                            <i class='ti ti-transfer-in me-1'></i> Mouvement
                                        </button>
                                    </div>
                                </div>
                            </article>
                        `;
                    })
                    .join('')
                : "<div class='card border-0 shadow-sm'><div class='card-body p-3 text-secondary'>Aucun produit correspondant.</div></div>";
        }

        if (refs.emptyState) {
            refs.emptyState.classList.toggle('d-none', filteredProducts.length > 0);
        }

        fillMovementProducts();
        refreshTooltips();
    };

    const render = () => {
        fillCategoryFilter();
        renderCategoryList();
        renderMetrics();
        renderProducts();
    };

    const loadData = async () => {
        const dashboard = await getDashboardData();

        products = Array.isArray(dashboard.products) ? dashboard.products : [];
        categories = Array.isArray(dashboard.categories) ? dashboard.categories : [];

        render();
        notify(dashboard);
    };

    const handleProductAction = async (action, productId) => {
        if (!action || !Number.isFinite(productId)) {
            return;
        }

        if (action === 'view-product') {
            renderProductDetailsModal(productId);
            return;
        }

        if (action === 'prefill-movement') {
            focusMovementForm(productId);
            return;
        }

        if (action === 'edit-product') {
            openEditProduct(productId);
            return;
        }

        if (action === 'delete-product') {
            const product = getProductById(productId);
            if (!product) {
                return;
            }

            const confirmed = window.confirm(`Supprimer ${product.name} ?`);
            if (!confirmed) {
                return;
            }

            try {
                await StockPilotAPI.products.delete(productId);
                renderToast('Produit supprimé.', 'success');
                await loadData();
            } catch (error) {
                renderToast(error.message || 'Suppression impossible', 'danger');
            }
        }
    };

    refs.searchInput?.addEventListener('input', (event) => {
        filters.search = String(event.target.value || '').trim().toLowerCase();
        renderProducts();
    });

    refs.categoryFilter?.addEventListener('change', (event) => {
        filters.category = String(event.target.value || '');
        renderProducts();
    });

    refs.statusFilter?.addEventListener('change', (event) => {
        filters.status = String(event.target.value || '');
        renderProducts();
    });

    refs.resetFilters?.addEventListener('click', () => {
        filters.search = '';
        filters.category = '';
        filters.status = '';

        if (refs.searchInput) {
            refs.searchInput.value = '';
        }
        if (refs.categoryFilter) {
            refs.categoryFilter.value = '';
        }
        if (refs.statusFilter) {
            refs.statusFilter.value = '';
        }

        renderProducts();
    });

    refs.movementType?.addEventListener('change', applyMovementHint);
    applyMovementHint();

    const onProductActionClick = (event) => {
        const button = event.target.closest('[data-sp-action]');
        if (!button) {
            return;
        }

        const action = button.dataset.spAction;
        const productId = Number(button.dataset.productId);
        handleProductAction(action, productId);
    };

    refs.body?.addEventListener('click', onProductActionClick);
    refs.productsCards?.addEventListener('click', onProductActionClick);

    refs.categoryList?.addEventListener('click', async (event) => {
        const button = event.target.closest("[data-sp-action='delete-category']");
        if (!button) {
            return;
        }

        const categoryId = Number(button.dataset.categoryId);
        const usedByProducts = products.some((product) => Number(product.category_id) === categoryId);

        if (usedByProducts) {
            renderToast('Impossible de supprimer une catégorie utilisée.', 'danger');
            return;
        }

        try {
            await StockPilotAPI.categories.delete(categoryId);
            renderToast('Catégorie supprimée.', 'success');
            await loadData();
        } catch (error) {
            renderToast(error.message || 'Suppression impossible', 'danger');
        }
    });

    refs.movementForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        try {
            await StockPilotAPI.movements.create({
                product_id: formData.get('product_id'),
                type: formData.get('type'),
                quantity: formData.get('quantity'),
                reason: formData.get('reason'),
            });

            event.currentTarget.reset();
            applyMovementHint();
            movementModal?.hide();
            renderToast('Mouvement enregistré avec succès.', 'success');
            await loadData();
        } catch (error) {
            renderToast(error.message || 'Enregistrement du mouvement impossible', 'danger');
        }
    });

    refs.categoryForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        try {
            await StockPilotAPI.categories.create({
                name: formData.get('category_name'),
                description: formData.get('category_description'),
            });

            event.currentTarget.reset();
            categoryModal?.hide();
            renderToast('Catégorie ajoutée.', 'success');
            await loadData();
        } catch (error) {
            renderToast(error.message || 'Ajout de catégorie impossible', 'danger');
        }
    });

    refs.editForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        try {
            await StockPilotAPI.products.update(formData.get('product_id'), {
                name: formData.get('name'),
                category_id: formData.get('category_id'),
                unit: formData.get('unit'),
                current_stock: formData.get('current_stock'),
                alert_threshold: formData.get('alert_threshold'),
                unit_price: formData.get('unit_price'),
            });

            editModal?.hide();
            renderToast('Produit mis à jour.', 'success');
            await loadData();
        } catch (error) {
            renderToast(error.message || 'Mise à jour impossible', 'danger');
        }
    });

    root.querySelectorAll('[data-sp-edit-cancel]').forEach((button) => {
        button.addEventListener('click', () => {
            if (editModal) {
                editModal.hide();
            } else {
                refs.editCard?.classList.add('d-none');
            }
        });
    });

    refs.modalPrefill?.addEventListener('click', () => {
        if (!activeProductId) {
            return;
        }

        const selectedProductId = activeProductId;
        if (refs.productModal && productModal) {
            refs.productModal.addEventListener('hidden.bs.modal', () => {
                focusMovementForm(selectedProductId);
            }, { once: true });
            productModal.hide();
            return;
        }

        focusMovementForm(selectedProductId);
    });

    refs.productModal?.addEventListener('hidden.bs.modal', () => {
        activeProductId = null;
    });

    try {
        await loadData();
    } catch (error) {
        console.error('[StockPilot] Erreur renderInventoryPage:', error);
        renderToast('Erreur lors du chargement de l\'inventaire', 'danger');

        if (refs.body) {
            refs.body.innerHTML = "<tr><td colspan='6' class='text-center text-danger py-4'>Erreur lors du chargement des produits.</td></tr>";
        }

        if (refs.productsCards) {
            refs.productsCards.innerHTML = "<div class='card border-0 shadow-sm'><div class='card-body p-3 text-danger'>Erreur lors du chargement des produits.</div></div>";
        }
    }
};
const renderCreateProductPage = async () => {
    const root = document.querySelector("[data-sp-page='create-product']");
    if (!root) {
        return;
    }

    const form = root.querySelector('[data-sp-create-product-form]');
    const categorySelect = root.querySelector('[data-sp-create-category]');
    const inventoryUrl = form?.dataset.inventoryUrl;

    const normalizeCollection = (payload) => {
        if (Array.isArray(payload)) {
            return payload;
        }

        if (Array.isArray(payload?.data)) {
            return payload.data;
        }

        return [];
    };

    const loadCategories = async () => {
        if (!categorySelect) {
            return;
        }

        try {
            const categoriesResponse = await StockPilotAPI.categories.getAll();
            const categories = normalizeCollection(categoriesResponse);
            const selected = String(categorySelect.value || '');

            categorySelect.innerHTML = [
                "<option value=''>Selectionner la categorie</option>",
                ...categories.map((category) => `<option value='${category.id}'>${category.name}</option>`),
            ].join('');

            if (selected) {
                categorySelect.value = selected;
            }
        } catch (error) {
            console.error('[StockPilot] Erreur chargement categories create-product:', error);
            renderToast('Erreur lors du chargement des categories', 'danger');
        }
    };

    form?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector("button[type='submit']");
        const previousLabel = submitButton?.innerHTML;
        const formData = new FormData(form);

        const payload = {
            category_id: formData.get('product_category'),
            name: String(formData.get('product_name') || '').trim(),
            unit: String(formData.get('product_unit') || '').trim(),
            current_stock: formData.get('product_stock'),
            alert_threshold: formData.get('product_threshold'),
            unit_price: formData.get('product_price'),
        };

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = "<i class='ti ti-loader-2'></i> Enregistrement...";
            }

            await StockPilotAPI.products.create(payload);

            renderToast('Produit ajoute avec succes.', 'success');
            form.reset();
            await loadCategories();

            if (inventoryUrl) {
                window.setTimeout(() => {
                    window.location.assign(inventoryUrl);
                }, 400);
            }
        } catch (error) {
            console.error('[StockPilot] Erreur create-product:', error);
            renderToast(error.message || 'Erreur lors de la creation du produit', 'danger');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = previousLabel || 'Ajouter au catalogue';
            }
        }
    });

    await loadCategories();
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
    renderCreateProductPage,
    renderReportsPage,
    formatCurrency,
    formatNumber,
    formatDateTime,
    statusMeta,
};

// Charger les pages au demarrage
document.addEventListener('DOMContentLoaded', async () => {
    await renderDashboardPage();
    await renderInventoryPage();
    await renderCreateProductPage();
    await renderReportsPage();
});

