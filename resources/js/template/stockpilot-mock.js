import { Modal, Tooltip } from "bootstrap";

const STORAGE_KEY = "stockpilot.mock.state.v1";

const formatterCurrency = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
});

const formatterNumber = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
});

const daysAgoIso = (days, hour = 8) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(hour, 10, 0, 0);
    return date.toISOString();
};

const defaultState = {
    categories: [
        { id: 1, name: "Antalgiques", description: "Medicaments douleur et fievre" },
        { id: 2, name: "Antibiotiques", description: "Traitements antibiotiques" },
        { id: 3, name: "Dispositifs", description: "Materiel medical et para-pharmacie" },
        { id: 4, name: "Hygiene", description: "Produits hygiene boutique" },
    ],
    products: [
        {
            id: 1,
            sku: "PHA-001",
            category_id: 1,
            name: "Paracetamol 500 mg",
            unit: "boite",
            current_stock: 4,
            alert_threshold: 12,
            unit_price: 1200,
            image: "product-1.png",
        },
        {
            id: 2,
            sku: "PHA-002",
            category_id: 2,
            name: "Amoxicilline 500 mg",
            unit: "boite",
            current_stock: 22,
            alert_threshold: 10,
            unit_price: 3500,
            image: "product-2.png",
        },
        {
            id: 3,
            sku: "PHA-003",
            category_id: 4,
            name: "Gel hydroalcoolique 500 ml",
            unit: "flacon",
            current_stock: 7,
            alert_threshold: 8,
            unit_price: 2800,
            image: "product-3.png",
        },
        {
            id: 4,
            sku: "PHA-004",
            category_id: 3,
            name: "Thermometre digital",
            unit: "piece",
            current_stock: 16,
            alert_threshold: 6,
            unit_price: 6500,
            image: "product-4.png",
        },
        {
            id: 5,
            sku: "PHA-005",
            category_id: 3,
            name: "Bandelettes glycemie",
            unit: "boite",
            current_stock: 0,
            alert_threshold: 5,
            unit_price: 9000,
            image: "product-5.png",
        },
        {
            id: 6,
            sku: "PHA-006",
            category_id: 4,
            name: "Gants nitrile (100)",
            unit: "boite",
            current_stock: 40,
            alert_threshold: 15,
            unit_price: 7200,
            image: "product-6.png",
        },
        {
            id: 7,
            sku: "PHA-007",
            category_id: 1,
            name: "Sirop toux enfant",
            unit: "flacon",
            current_stock: 3,
            alert_threshold: 6,
            unit_price: 4500,
            image: "product-7.png",
        },
        {
            id: 8,
            sku: "PHA-008",
            category_id: 1,
            name: "Vitamine C 1000 mg",
            unit: "tube",
            current_stock: 25,
            alert_threshold: 10,
            unit_price: 2200,
            image: "product-8.png",
        },
    ],
    movements: [
        {
            id: 1,
            product_id: 1,
            type: "sortie",
            quantity: 10,
            delta: -10,
            reason: "Ventes comptoir",
            new_stock: 4,
            created_at: daysAgoIso(1, 9),
        },
        {
            id: 2,
            product_id: 2,
            type: "entree",
            quantity: 15,
            delta: 15,
            reason: "Livraison fournisseur MediPlus",
            new_stock: 22,
            created_at: daysAgoIso(2, 11),
        },
        {
            id: 3,
            product_id: 5,
            type: "sortie",
            quantity: 5,
            delta: -5,
            reason: "Commande client",
            new_stock: 0,
            created_at: daysAgoIso(3, 15),
        },
        {
            id: 4,
            product_id: 3,
            type: "sortie",
            quantity: 6,
            delta: -6,
            reason: "Approvisionnement rayons",
            new_stock: 7,
            created_at: daysAgoIso(4, 13),
        },
        {
            id: 5,
            product_id: 4,
            type: "entree",
            quantity: 12,
            delta: 12,
            reason: "Reception hebdomadaire",
            new_stock: 16,
            created_at: daysAgoIso(5, 10),
        },
        {
            id: 6,
            product_id: 7,
            type: "sortie",
            quantity: 3,
            delta: -3,
            reason: "Vente ordonnance",
            new_stock: 3,
            created_at: daysAgoIso(0, 8),
        },
    ],
};

const deepClone = (value) => JSON.parse(JSON.stringify(value));

const parseNumeric = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const toIsoDate = (value) => {
    const date = value ? new Date(value) : new Date();
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

const stateValidator = (candidate) => {
    if (!candidate || typeof candidate !== "object") {
        return false;
    }

    return Array.isArray(candidate.categories)
        && Array.isArray(candidate.products)
        && Array.isArray(candidate.movements);
};

const loadState = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return deepClone(defaultState);
        }

        const parsed = JSON.parse(raw);
        return stateValidator(parsed) ? parsed : deepClone(defaultState);
    } catch (error) {
        console.warn("Impossible de charger les mocks StockPilot:", error);
        return deepClone(defaultState);
    }
};

let state = loadState();
const subscriptions = new Set();

const saveState = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const getCategoryById = (categoryId) => state.categories.find((category) => category.id === Number(categoryId));
const getProductById = (productId) => state.products.find((product) => product.id === Number(productId));

const getStockStatus = (product) => {
    const stock = parseNumeric(product.current_stock);
    const threshold = parseNumeric(product.alert_threshold);

    if (stock <= 0) {
        return "critique";
    }

    if (stock <= threshold) {
        return "faible";
    }

    return "normal";
};

const statusMeta = {
    critique: { label: "Critique", className: "sp-badge-critique" },
    faible: { label: "Faible", className: "sp-badge-faible" },
    normal: { label: "Normal", className: "sp-badge-normal" },
};

const formatCurrency = (value) => formatterCurrency.format(parseNumeric(value));
const formatNumber = (value) => formatterNumber.format(parseNumeric(value));

const formatDateTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getNextId = (items) => {
    if (!items.length) {
        return 1;
    }

    return Math.max(...items.map((item) => Number(item.id) || 0)) + 1;
};

const buildProductSku = (name) => {
    const normalized = (name || "PROD")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 6);

    const index = String(getNextId(state.products)).padStart(3, "0");
    return `${normalized || "PROD"}-${index}`;
};

const notify = () => {
    saveState();
    const snapshot = deepClone(state);

    subscriptions.forEach((subscriber) => {
        try {
            subscriber(snapshot);
        } catch (error) {
            console.error("Subscriber StockPilot mock en erreur:", error);
        }
    });

    window.dispatchEvent(new CustomEvent("stockpilot:state-changed", { detail: snapshot }));
};

const subscribe = (subscriber) => {
    if (typeof subscriber !== "function") {
        return () => {};
    }

    subscriptions.add(subscriber);
    return () => subscriptions.delete(subscriber);
};

const getState = () => deepClone(state);

const getDashboardData = () => {
    const products = state.products.map((product) => ({
        ...product,
        status: getStockStatus(product),
    }));

    const totalStockValue = products.reduce(
        (sum, product) => sum + parseNumeric(product.current_stock) * parseNumeric(product.unit_price),
        0,
    );

    const totalStockUnits = products.reduce((sum, product) => sum + parseNumeric(product.current_stock), 0);
    const alertProducts = products.filter((product) => product.status !== "normal");
    const criticalProducts = products.filter((product) => product.status === "critique");
    const lowProducts = products.filter((product) => product.status === "faible");

    const recentMovements = [...state.movements]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 8)
        .map((movement) => {
            const product = getProductById(movement.product_id);
            const category = product ? getCategoryById(product.category_id) : null;

            return {
                ...movement,
                product_name: product?.name || "Produit archive",
                category_name: category?.name || "-",
            };
        });

    const outgoingByProduct = state.movements
        .filter((movement) => movement.type === "sortie")
        .reduce((accumulator, movement) => {
            const key = String(movement.product_id);
            const quantity = parseNumeric(movement.quantity);
            accumulator[key] = (accumulator[key] || 0) + quantity;
            return accumulator;
        }, {});

    const topOutgoing = Object.entries(outgoingByProduct)
        .map(([productId, quantity]) => {
            const product = getProductById(productId);
            return {
                product_id: Number(productId),
                product_name: product?.name || "Produit archive",
                quantity,
                unit: product?.unit || "unite",
                revenue: quantity * parseNumeric(product?.unit_price),
            };
        })
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

    const movementToday = state.movements.filter((movement) => {
        const created = new Date(movement.created_at);
        const now = new Date();

        return created.toDateString() === now.toDateString();
    }).length;

    return {
        products,
        totalStockValue,
        totalStockUnits,
        alertProducts,
        criticalProducts,
        lowProducts,
        recentMovements,
        topOutgoing,
        movementToday,
    };
};

const getMonthlySeries = (monthCount = 12) => {
    const labels = [];
    const entries = [];
    const outputs = [];
    const keyMap = new Map();

    const now = new Date();
    for (let index = monthCount - 1; index >= 0; index -= 1) {
        const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const label = date.toLocaleDateString("fr-FR", { month: "short" });

        keyMap.set(key, labels.length);
        labels.push(label.charAt(0).toUpperCase() + label.slice(1));
        entries.push(0);
        outputs.push(0);
    }

    state.movements.forEach((movement) => {
        const movementDate = new Date(movement.created_at);
        const key = `${movementDate.getFullYear()}-${String(movementDate.getMonth() + 1).padStart(2, "0")}`;
        const targetIndex = keyMap.get(key);

        if (targetIndex === undefined) {
            return;
        }

        const product = getProductById(movement.product_id);
        const unitPrice = parseNumeric(product?.unit_price);
        const delta = parseNumeric(movement.delta, movement.type === "sortie" ? -parseNumeric(movement.quantity) : parseNumeric(movement.quantity));
        const value = Math.abs(delta) * unitPrice;

        if (delta >= 0) {
            entries[targetIndex] += value;
        } else {
            outputs[targetIndex] += value;
        }
    });

    const dashboard = getDashboardData();
    const normalCount = dashboard.products.filter((product) => product.status === "normal").length;
    const alertCount = Math.max(1, dashboard.products.length - normalCount);

    return {
        labels,
        entries,
        outputs,
        statusBreakdown: {
            normal: normalCount,
            alert: alertCount,
        },
    };
};

const addCategory = ({ name, description }) => {
    const cleanName = String(name || "").trim();
    if (!cleanName) {
        throw new Error("Le nom de categorie est obligatoire.");
    }

    const exists = state.categories.some((category) => category.name.toLowerCase() === cleanName.toLowerCase());
    if (exists) {
        throw new Error("Cette categorie existe deja.");
    }

    const category = {
        id: getNextId(state.categories),
        name: cleanName,
        description: String(description || "").trim(),
    };

    state.categories.push(category);
    notify();
    return category;
};

const deleteCategory = (categoryId) => {
    const id = Number(categoryId);
    const category = getCategoryById(id);

    if (!category) {
        throw new Error("Categorie introuvable.");
    }

    const hasProducts = state.products.some((product) => Number(product.category_id) === id);
    if (hasProducts) {
        throw new Error("Impossible de supprimer une categorie contenant des produits.");
    }

    state.categories = state.categories.filter((item) => Number(item.id) !== id);
    notify();
};

const addProduct = (payload) => {
    const name = String(payload?.name || "").trim();
    const categoryId = Number(payload?.category_id);
    const category = getCategoryById(categoryId);

    if (!name) {
        throw new Error("Le nom du produit est obligatoire.");
    }

    if (!category) {
        throw new Error("Veuillez choisir une categorie valide.");
    }

    const product = {
        id: getNextId(state.products),
        sku: String(payload?.sku || "").trim() || buildProductSku(name),
        category_id: categoryId,
        name,
        unit: String(payload?.unit || "piece").trim(),
        current_stock: parseNumeric(payload?.current_stock),
        alert_threshold: parseNumeric(payload?.alert_threshold, 5),
        unit_price: parseNumeric(payload?.unit_price),
        image: String(payload?.image || "product-9.png"),
    };

    if (product.unit_price <= 0) {
        throw new Error("Le prix unitaire doit etre superieur a 0.");
    }

    if (product.alert_threshold < 0 || product.current_stock < 0) {
        throw new Error("Le stock et le seuil ne peuvent pas etre negatifs.");
    }

    state.products.push(product);

    if (product.current_stock > 0) {
        state.movements.push({
            id: getNextId(state.movements),
            product_id: product.id,
            type: "entree",
            quantity: product.current_stock,
            delta: product.current_stock,
            reason: "Stock initial (mock)",
            new_stock: product.current_stock,
            created_at: new Date().toISOString(),
        });
    }

    notify();
    return product;
};

const updateProduct = (productId, payload) => {
    const product = getProductById(productId);

    if (!product) {
        throw new Error("Produit introuvable.");
    }

    const previousStock = parseNumeric(product.current_stock);

    const nextCategory = getCategoryById(payload?.category_id);
    if (!nextCategory) {
        throw new Error("Categorie introuvable.");
    }

    product.name = String(payload?.name || product.name).trim();
    product.category_id = Number(payload?.category_id);
    product.unit = String(payload?.unit || product.unit).trim();
    product.alert_threshold = parseNumeric(payload?.alert_threshold, product.alert_threshold);
    product.unit_price = parseNumeric(payload?.unit_price, product.unit_price);
    product.current_stock = parseNumeric(payload?.current_stock, product.current_stock);

    if (!product.name || product.unit_price <= 0) {
        throw new Error("Les informations du produit sont invalides.");
    }

    const delta = product.current_stock - previousStock;
    if (delta !== 0) {
        state.movements.push({
            id: getNextId(state.movements),
            product_id: product.id,
            type: "ajustement",
            quantity: Math.abs(delta),
            delta,
            reason: "Mise a jour fiche produit",
            new_stock: product.current_stock,
            created_at: new Date().toISOString(),
        });
    }

    notify();
    return product;
};

const deleteProduct = (productId) => {
    const id = Number(productId);
    const exists = getProductById(id);

    if (!exists) {
        throw new Error("Produit introuvable.");
    }

    state.products = state.products.filter((product) => Number(product.id) !== id);
    notify();
};

const addMovement = (payload) => {
    const product = getProductById(payload?.product_id);
    if (!product) {
        throw new Error("Produit introuvable pour ce mouvement.");
    }

    const movementType = String(payload?.type || "").trim();
    const reason = String(payload?.reason || "").trim();
    const quantity = parseNumeric(payload?.quantity);

    if (!reason) {
        throw new Error("Le motif du mouvement est obligatoire.");
    }

    if (!["entree", "sortie", "ajustement"].includes(movementType)) {
        throw new Error("Type de mouvement invalide.");
    }

    if (quantity <= 0 && movementType !== "ajustement") {
        throw new Error("La quantite doit etre superieure a 0.");
    }

    let delta = 0;
    const current = parseNumeric(product.current_stock);

    if (movementType === "entree") {
        delta = quantity;
        product.current_stock = current + quantity;
    }

    if (movementType === "sortie") {
        if (quantity > current) {
            throw new Error("Stock insuffisant pour effectuer cette sortie.");
        }

        delta = -quantity;
        product.current_stock = current - quantity;
    }

    if (movementType === "ajustement") {
        if (quantity < 0) {
            throw new Error("Le nouveau stock ne peut pas etre negatif.");
        }

        delta = quantity - current;
        if (delta === 0) {
            throw new Error("Aucun changement detecte sur le stock.");
        }

        product.current_stock = quantity;
    }

    const movement = {
        id: getNextId(state.movements),
        product_id: product.id,
        type: movementType,
        quantity: movementType === "ajustement" ? Math.abs(delta) : quantity,
        delta,
        reason,
        new_stock: product.current_stock,
        created_at: toIsoDate(payload?.created_at),
    };

    state.movements.push(movement);
    notify();
    return movement;
};

const resetMockState = () => {
    state = deepClone(defaultState);
    notify();
};

const renderToast = (message, tone = "success") => {
    const stackId = "sp-toast-stack";
    let stack = document.getElementById(stackId);

    if (!stack) {
        stack = document.createElement("div");
        stack.id = stackId;
        stack.className = "position-fixed top-0 end-0 p-3";
        stack.style.zIndex = "1080";
        document.body.appendChild(stack);
    }

    const toast = document.createElement("div");
    toast.className = `alert alert-${tone} shadow-sm mb-2 sp-toast`;
    toast.role = "alert";
    toast.textContent = message;

    stack.appendChild(toast);

    window.setTimeout(() => {
        toast.remove();
    }, 3200);
};

const fillCategorySelect = (select, selectedValue = "", includeAllOption = true, categoriesList = null) => {
    if (!select) {
        return;
    }

    const cats = categoriesList || state.categories;
    const previous = String(selectedValue || select.value || "");
    const options = [
        ...(includeAllOption ? ["<option value=''>Toutes les categories</option>"] : []),
        ...cats.map((category) => `<option value='${category.id}'>${category.name}</option>`),
    ];

    select.innerHTML = options.join("");

    if (previous) {
        select.value = previous;
    }
};

const renderDashboardPage = () => {
    const root = document.querySelector("[data-sp-page='dashboard']");
    if (!root) {
        return;
    }

    const render = () => {
        const dashboard = getDashboardData();

        const bind = (key, value) => {
            const target = root.querySelector(`[data-sp-kpi='${key}']`);
            if (target) {
                target.textContent = value;
            }
        };

        bind("alert-products", String(dashboard.alertProducts.length));
        bind("stock-value", formatCurrency(dashboard.totalStockValue));
        bind("movement-today", String(dashboard.movementToday));
        bind("stock-units", formatNumber(dashboard.totalStockUnits));
        bind("critical-products", String(dashboard.criticalProducts.length));
        bind("low-products", String(dashboard.lowProducts.length));
        bind("total-products", String(dashboard.products.length));
        bind("category-count", String(state.categories.length));

        const lowStockList = root.querySelector("[data-sp-low-stock-list]");
        if (lowStockList) {
            lowStockList.innerHTML = dashboard.alertProducts.length
                ? dashboard.alertProducts
                    .slice(0, 6)
                    .map((product) => {
                        const status = statusMeta[product.status];
                        const category = getCategoryById(product.category_id);

                        return `
                            <li class='list-group-item d-flex justify-content-between align-items-center gap-3'>
                                <div>
                                    <p class='mb-1 fw-semibold'>${product.name}</p>
                                    <small class='text-secondary'>${category?.name || "-"} - ${formatNumber(product.current_stock)} ${product.unit}</small>
                                </div>
                                <span class='badge ${status.className}'>${status.label}</span>
                            </li>
                        `;
                    })
                    .join("")
                : "<li class='list-group-item text-secondary'>Aucun produit sous le seuil.</li>";
        }

        const topProductsList = root.querySelector("[data-sp-top-products-list]");
        if (topProductsList) {
            topProductsList.innerHTML = dashboard.topOutgoing.length
                ? dashboard.topOutgoing
                    .map((item) => `
                        <li class='list-group-item d-flex justify-content-between align-items-center'>
                            <div>
                                <p class='mb-1 fw-semibold'>${item.product_name}</p>
                                <small class='text-secondary'>${formatNumber(item.quantity)} ${item.unit} sortis</small>
                            </div>
                            <span class='badge bg-primary-subtle text-primary border border-primary'>${formatCurrency(item.revenue)}</span>
                        </li>
                    `)
                    .join("")
                : "<li class='list-group-item text-secondary'>Aucun mouvement sortant sur la periode.</li>";
        }

        const movementList = root.querySelector("[data-sp-recent-movements-list]");
        if (movementList) {
            movementList.innerHTML = dashboard.recentMovements.length
                ? dashboard.recentMovements
                    .map((movement) => {
                        const badge = movement.type === "sortie"
                            ? "bg-danger-subtle text-danger border border-danger"
                            : movement.type === "entree"
                                ? "bg-success-subtle text-success border border-success"
                                : "bg-warning-subtle text-warning border border-warning";

                        return `
                            <li class='list-group-item d-flex justify-content-between align-items-start gap-3'>
                                <div>
                                    <p class='mb-1 fw-semibold'>${movement.product_name}</p>
                                    <small class='text-secondary d-block'>${movement.reason}</small>
                                    <small class='text-secondary'>${formatDateTime(movement.created_at)}</small>
                                </div>
                                <span class='badge ${badge}'>${movement.type} ${formatNumber(movement.quantity)}</span>
                            </li>
                        `;
                    })
                    .join("")
                : "<li class='list-group-item text-secondary'>Aucun mouvement recent.</li>";
        }
    };

    render(state);
    subscribe(render);
};

const renderInventoryPage = () => {
    const root = document.querySelector("[data-sp-page='inventory']");
    if (!root) {
        return;
    }

    const refs = {
        searchInput: root.querySelector("[data-sp-search]"),
        categoryFilter: root.querySelector("[data-sp-category-filter]"),
        statusFilter: root.querySelector("[data-sp-status-filter]"),
        resetFilters: root.querySelector("[data-sp-reset-filters]"),
        body: root.querySelector("[data-sp-products-body]"),
        productsCards: root.querySelector("[data-sp-products-cards]"),
        productsCount: root.querySelector("[data-sp-products-count]"),
        productsVisibleCount: root.querySelector("[data-sp-products-visible-count]"),
        criticalCount: root.querySelector("[data-sp-critical-count]"),
        lowCount: root.querySelector("[data-sp-low-count]"),
        totalValue: root.querySelector("[data-sp-total-value]"),
        movementModal: root.querySelector("#spMovementModal"),
        movementForm: root.querySelector("[data-sp-movement-form]"),
        movementProduct: root.querySelector("[data-sp-movement-product]"),
        movementType: root.querySelector("[data-sp-movement-type]"),
        movementQuantityLabel: root.querySelector("[data-sp-movement-quantity-label]"),
        movementHint: root.querySelector("[data-sp-movement-hint]"),
        categoryModal: root.querySelector("#spCategoryModal"),
        categoryForm: root.querySelector("[data-sp-category-form]"),
        categoryList: root.querySelector("[data-sp-category-list]"),
        editCard: root.querySelector("[data-sp-edit-card]"),
        editForm: root.querySelector("[data-sp-edit-form]"),
        editCategory: root.querySelector("[data-sp-edit-category]"),
        emptyState: root.querySelector("[data-sp-empty-state]"),
        productModal: root.querySelector("[data-sp-product-modal]"),
        modalTitle: root.querySelector("[data-sp-modal-title]"),
        modalSku: root.querySelector("[data-sp-modal-sku]"),
        modalStatus: root.querySelector("[data-sp-modal-status]"),
        modalCategory: root.querySelector("[data-sp-modal-category]"),
        modalStock: root.querySelector("[data-sp-modal-stock]"),
        modalThreshold: root.querySelector("[data-sp-modal-threshold]"),
        modalPrice: root.querySelector("[data-sp-modal-price]"),
        modalPrefill: root.querySelector("[data-sp-modal-prefill]"),
    };

    const filters = {
        search: "",
        category: "",
        status: "",
    };

    const movementModal = refs.movementModal ? Modal.getOrCreateInstance(refs.movementModal) : null;
    const categoryModal = refs.categoryModal ? Modal.getOrCreateInstance(refs.categoryModal) : null;
    const editModal = refs.editCard ? Modal.getOrCreateInstance(refs.editCard) : null;
    const productModal = refs.productModal ? Modal.getOrCreateInstance(refs.productModal) : null;
    let activeProductId = null;

    const applyMovementHint = () => {
        const type = refs.movementType?.value || "sortie";

        if (type === "ajustement") {
            if (refs.movementQuantityLabel) {
                refs.movementQuantityLabel.textContent = "Nouveau stock";
            }
            if (refs.movementHint) {
                refs.movementHint.textContent = "L'ajustement definit directement la nouvelle quantite en stock.";
            }
            return;
        }

        if (refs.movementQuantityLabel) {
            refs.movementQuantityLabel.textContent = "Quantite";
        }
        if (refs.movementHint) {
            refs.movementHint.textContent = "Utilisez entree pour augmenter, sortie pour diminuer le stock.";
        }
    };

    const refreshTooltips = () => {
        root.querySelectorAll("[data-bs-toggle='tooltip']").forEach((node) => {
            const existingTooltip = Tooltip.getInstance(node);
            if (existingTooltip) {
                existingTooltip.dispose();
            }

            new Tooltip(node, {
                trigger: "hover focus",
                boundary: "window",
            });
        });
    };

    const createStatusBadge = (status) => {
        const statusData = statusMeta[status] || statusMeta.normal;
        return `<span class='badge ${statusData.className}'><span class='sp-status-dot'></span>${statusData.label}</span>`;
    };

    const focusMovementForm = (productId) => {
        if (refs.movementProduct) {
            refs.movementProduct.value = String(productId);
        }

        if (movementModal && refs.movementModal) {
            refs.movementModal.addEventListener("shown.bs.modal", () => {
                refs.movementType?.focus();
            }, { once: true });
            movementModal.show();
            return;
        }

        refs.movementForm?.scrollIntoView({ behavior: "smooth", block: "center" });
        refs.movementType?.focus();
    };

    const openEditProduct = (productId) => {
        const product = getProductById(productId);
        if (!product || !refs.editCard || !refs.editForm) {
            return;
        }

        // Set the form values
        refs.editForm.querySelector("[name='product_id']").value = String(product.id);
        refs.editForm.querySelector("[name='name']").value = product.name;
        refs.editForm.querySelector("[name='category_id']").value = String(product.category_id);
        refs.editForm.querySelector("[name='unit']").value = product.unit;
        refs.editForm.querySelector("[name='current_stock']").value = String(product.current_stock);
        refs.editForm.querySelector("[name='alert_threshold']").value = String(product.alert_threshold);
        refs.editForm.querySelector("[name='unit_price']").value = String(product.unit_price);

        if (editModal && refs.editCard) {
            refs.editCard.addEventListener("shown.bs.modal", () => {
                refs.editForm?.querySelector("[name='name']")?.focus();
            }, { once: true });
            editModal.show();
            return;
        }

        refs.editCard.classList.remove("d-none");
        refs.editCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
            refs.modalTitle.textContent = product.name;
        }
        if (refs.modalSku) {
            refs.modalSku.textContent = `${product.sku}${window?.userRole === 'gerant' || window?.userRole === 'admin' ? ` - ${formatCurrency(product.unit_price)} / ${product.unit}` : ''}`;
        }
        if (refs.modalStatus) {
            refs.modalStatus.innerHTML = createStatusBadge(stockStatus);
        }
        if (refs.modalCategory) {
            refs.modalCategory.textContent = category?.name || "-";
        }
        if (refs.modalStock) {
            refs.modalStock.textContent = `${formatNumber(product.current_stock)} ${product.unit}`;
        }
        if (refs.modalThreshold) {
            refs.modalThreshold.textContent = `${formatNumber(product.alert_threshold)} ${product.unit}`;
        }
        if (refs.modalPrice) {
            refs.modalPrice.textContent = formatCurrency(product.unit_price);
        }

        productModal?.show();
    };

    const handleProductAction = (action, productId) => {
        if (!action || !Number.isFinite(productId)) {
            return;
        }

        if (action === "view-product") {
            renderProductDetailsModal(productId);
            return;
        }

        if (action === "prefill-movement") {
            focusMovementForm(productId);
            return;
        }

        if (action === "edit-product") {
            openEditProduct(productId);
            return;
        }

        if (action === "delete-product") {
            const product = getProductById(productId);
            if (!product) {
                return;
            }

            const confirmed = window.confirm(`Supprimer ${product.name} ?`);
            if (!confirmed) {
                return;
            }

            try {
                deleteProduct(productId);
                renderToast("Produit supprime du stock mock.", "success");
            } catch (error) {
                renderToast(error.message, "danger");
            }
        }
    };

    const getFilteredProducts = () => {
        return state.products
            .map((product) => ({
                ...product,
                status: getStockStatus(product),
            }))
            .filter((product) => {
                const category = getCategoryById(product.category_id);
                const searchable = `${product.name} ${product.sku} ${category?.name || ""}`.toLowerCase();
                const searchMatches = !filters.search || searchable.includes(filters.search);
                const categoryMatches = !filters.category || String(product.category_id) === String(filters.category);
                const statusMatches = !filters.status || product.status === filters.status;

                return searchMatches && categoryMatches && statusMatches;
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    };

    const renderProducts = () => {
        const dashboard = getDashboardData();
        const products = getFilteredProducts();

        if (refs.productsCount) {
            refs.productsCount.textContent = String(dashboard.products.length);
        }
        if (refs.productsVisibleCount) {
            refs.productsVisibleCount.textContent = String(products.length);
        }
        if (refs.criticalCount) {
            refs.criticalCount.textContent = String(dashboard.criticalProducts.length);
        }
        if (refs.lowCount) {
            refs.lowCount.textContent = String(dashboard.lowProducts.length);
        }
        if (refs.totalValue) {
            refs.totalValue.textContent = formatCurrency(dashboard.totalStockValue);
        }

        if (refs.body) {
            refs.body.innerHTML = products.length
                ? products
                    .map((product) => {
                        const category = getCategoryById(product.category_id);
                        const statusBadge = createStatusBadge(product.status);

                        return `
                            <tr class='sp-inventory-row'>
                                <td>
                                    <div class='d-flex align-items-center gap-3'>
                                        <img src='/assets/images/${product.image || "product-9.png"}' alt='${product.name}' class='avatar avatar-md rounded-3'>
                                        <div>
                                            <div class='fw-semibold'>${product.name}</div>
                                            <small class='text-secondary d-block'>${product.sku}</small>
                                            ${window?.userRole === 'gerant' || window?.userRole === 'admin' ? `<small class='text-secondary'>${formatCurrency(product.unit_price)} / ${product.unit}</small>` : ''}
                                        </div>
                                    </div>
                                </td>
                                <td><span class='sp-inventory-category'>${category?.name || "-"}</span></td>
                                <td>
                                    <div class='sp-inventory-stock'>
                                        <strong>${formatNumber(product.current_stock)}</strong>
                                        <small>${product.unit}</small>
                                    </div>
                                </td>
                                <td>${formatNumber(product.alert_threshold)} ${product.unit}</td>
                                <td>${statusBadge}</td>
                                <td>
                                    <div class='d-flex gap-1 sp-inventory-actions'>
                                        <button type='button' class='btn btn-sm btn-light sp-action-btn' data-sp-action='view-product' data-product-id='${product.id}' data-bs-toggle='tooltip' data-bs-title='Voir'>
                                            <i class='ti ti-eye'></i><span class='visually-hidden'>Voir</span>
                                        </button>
                                        ${window?.userRole === 'gerant' || window?.userRole === 'admin' ? `
                                        <button type='button' class='btn btn-sm btn-outline-primary sp-action-btn' data-sp-action='edit-product' data-product-id='${product.id}' data-bs-toggle='tooltip' data-bs-title='Modifier'>
                                            <i class='ti ti-edit'></i><span class='visually-hidden'>Modifier</span>
                                        </button>
                                        ` : ''}
                                        <button type='button' class='btn btn-sm btn-outline-success sp-action-btn' data-sp-action='prefill-movement' data-product-id='${product.id}' data-bs-toggle='tooltip' data-bs-title='Ajouter un mouvement'>
                                            <i class='ti ti-transfer-in'></i><span class='visually-hidden'>Ajouter un mouvement</span>
                                        </button>
                                        ${window?.userRole === 'gerant' || window?.userRole === 'admin' ? `
                                        <button type='button' class='btn btn-sm btn-outline-danger sp-action-btn' data-sp-action='delete-product' data-product-id='${product.id}' data-bs-toggle='tooltip' data-bs-title='Supprimer'>
                                            <i class='ti ti-trash'></i><span class='visually-hidden'>Supprimer</span>
                                        </button>
                                        ` : ''}
                                    </div>
                                </td>
                            </tr>
                        `;
                    })
                    .join("")
                : "<tr><td colspan='6' class='text-center text-secondary py-4'>Aucun produit ne correspond aux filtres.</td></tr>";
        }

        if (refs.productsCards) {
            refs.productsCards.innerHTML = products.length
                ? products
                    .map((product) => {
                        const category = getCategoryById(product.category_id);
                        const statusBadge = createStatusBadge(product.status);

                        return `
                            <article class='card border-0 shadow-sm sp-inventory-mobile-card'>
                                <div class='card-body p-3'>
                                    <div class='d-flex justify-content-between align-items-start gap-2 mb-2'>
                                        <div>
                                            <p class='mb-1 fw-semibold'>${product.name}</p>
                                            <small class='text-secondary d-block'>${product.sku}</small>
                                            <small class='text-secondary'>${category?.name || "-"}</small>
                                        </div>
                                        ${statusBadge}
                                    </div>
                                    <div class='sp-inventory-mobile-meta'>
                                        <p class='mb-0'><span>Stock</span><strong>${formatNumber(product.current_stock)} ${product.unit}</strong></p>
                                        <p class='mb-0'><span>Seuil</span><strong>${formatNumber(product.alert_threshold)} ${product.unit}</strong></p>
                                        ${window?.userRole === 'gerant' || window?.userRole === 'admin' ? `<p class='mb-0'><span>Prix</span><strong>${formatCurrency(product.unit_price)}</strong></p>` : ''}
                                    </div>
                                    <div class='d-flex gap-2 mt-3'>
                                        <button type='button' class='btn btn-sm btn-light flex-fill' data-sp-action='view-product' data-product-id='${product.id}'>
                                            <i class='ti ti-eye me-1'></i> Voir
                                        </button>
                                        ${window?.userRole === 'gerant' || window?.userRole === 'admin' ? `
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
                    .join("")
                : "<div class='card border-0 shadow-sm'><div class='card-body p-3 text-secondary'>Aucun produit correspondant.</div></div>";
        }

        if (refs.emptyState) {
            refs.emptyState.classList.toggle("d-none", products.length > 0);
        }

        if (refs.movementProduct) {
            const selected = refs.movementProduct.value;
            refs.movementProduct.innerHTML = [
                "<option value=''>Choisir un produit</option>",
                ...state.products.map((product) => `<option value='${product.id}'>${product.name} (${formatNumber(product.current_stock)} ${product.unit})</option>`),
            ].join("");

            refs.movementProduct.value = selected || "";
        }

        refreshTooltips();
    };

    const renderCategories = () => {
        fillCategorySelect(refs.categoryFilter, filters.category, true);

        if (refs.editCategory) {
            const selected = refs.editCategory.value;
            fillCategorySelect(refs.editCategory, selected, false);
        }

        if (refs.categoryList) {
            refs.categoryList.innerHTML = state.categories
                .map((category) => {
                    const count = state.products.filter((product) => Number(product.category_id) === Number(category.id)).length;
                    const canDelete = count === 0;

                    return `
                        <li class='list-group-item d-flex justify-content-between align-items-center'>
                            <div>
                                <div class='fw-semibold'>${category.name}</div>
                                <small class='text-secondary'>${count} produit(s)</small>
                            </div>
                            <button type='button' class='btn btn-sm btn-outline-danger' data-sp-action='delete-category' data-category-id='${category.id}' ${canDelete ? "" : "disabled"}>
                                <i class='ti ti-trash'></i>
                            </button>
                        </li>
                    `;
                })
                .join("");
        }
    };

    const render = () => {
        renderCategories();
        renderProducts();
    };

    refs.searchInput?.addEventListener("input", (event) => {
        filters.search = event.target.value.trim().toLowerCase();
        renderProducts();
    });

    refs.categoryFilter?.addEventListener("change", (event) => {
        filters.category = event.target.value;
        renderProducts();
    });

    refs.statusFilter?.addEventListener("change", (event) => {
        filters.status = event.target.value;
        renderProducts();
    });

    refs.resetFilters?.addEventListener("click", () => {
        filters.search = "";
        filters.category = "";
        filters.status = "";

        if (refs.searchInput) {
            refs.searchInput.value = "";
        }
        if (refs.categoryFilter) {
            refs.categoryFilter.value = "";
        }
        if (refs.statusFilter) {
            refs.statusFilter.value = "";
        }

        renderProducts();
    });

    refs.movementType?.addEventListener("change", applyMovementHint);
    applyMovementHint();

    const onProductActionClick = (event) => {
        const button = event.target.closest("[data-sp-action]");
        if (!button) {
            return;
        }

        const action = button.dataset.spAction;
        const productId = Number(button.dataset.productId);
        handleProductAction(action, productId);
    };

    refs.body?.addEventListener("click", onProductActionClick);
    refs.productsCards?.addEventListener("click", onProductActionClick);

    refs.categoryList?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-sp-action='delete-category']");
        if (!button) {
            return;
        }

        try {
            deleteCategory(button.dataset.categoryId);
            renderToast("Categorie supprimee.", "success");
        } catch (error) {
            renderToast(error.message, "danger");
        }
    });

    refs.movementForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        try {
            addMovement({
                product_id: formData.get("product_id"),
                type: formData.get("type"),
                quantity: formData.get("quantity"),
                reason: formData.get("reason"),
            });

            event.currentTarget.reset();
            applyMovementHint();
            renderToast("Mouvement enregistré avec succès.", "success");
            movementModal?.hide();
        } catch (error) {
            renderToast(error.message, "danger");
        }
    });

    refs.categoryForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        try {
            addCategory({
                name: formData.get("category_name"),
                description: formData.get("category_description"),
            });
            event.currentTarget.reset();
            renderToast("Categorie ajoutee.", "success");
            categoryModal?.hide();
        } catch (error) {
            renderToast(error.message, "danger");
        }
    });

    refs.editForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
            updateProduct(formData.get("product_id"), {
                name: formData.get("name"),
                category_id: formData.get("category_id"),
                unit: formData.get("unit"),
                current_stock: formData.get("current_stock"),
                alert_threshold: formData.get("alert_threshold"),
                unit_price: formData.get("unit_price"),
            });
            renderToast("Produit mis a jour.", "success");
            editModal?.hide();
        } catch (error) {
            renderToast(error.message, "danger");
        }
    });

    root.querySelectorAll("[data-sp-edit-cancel]").forEach((button) => {
        button.addEventListener("click", () => {
            if (editModal) {
                editModal.hide();
            } else {
                refs.editCard?.classList.add("d-none");
            }
        });
    });

    refs.modalPrefill?.addEventListener("click", () => {
        if (!activeProductId) {
            return;
        }

        const selectedProductId = activeProductId;
        if (refs.productModal && productModal) {
            refs.productModal.addEventListener("hidden.bs.modal", () => {
                focusMovementForm(selectedProductId);
            }, { once: true });
            productModal.hide();
            return;
        }

        focusMovementForm(selectedProductId);
    });

    refs.productModal?.addEventListener("hidden.bs.modal", () => {
        activeProductId = null;
    });

    render();
    subscribe(render);
};

const renderCreateProductPage = () => {
    const root = document.querySelector("[data-sp-page='create-product']");
    if (!root) {
        return;
    }

    const form = root.querySelector("[data-sp-create-product-form]");
    const categorySelect = root.querySelector("[data-sp-create-category]");
    const inventoryUrl = form?.dataset.inventoryUrl;

    const renderCategories = () => {
        if (!categorySelect) {
            return;
        }

        const selected = categorySelect.value;
        categorySelect.innerHTML = [
            "<option value=''>Selectionner la categorie</option>",
            ...state.categories.map((category) => `<option value='${category.id}'>${category.name}</option>`),
        ].join("");
        categorySelect.value = selected || "";
    };

    form?.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const imageName = "product-9.png";

        try {
            addProduct({
                name: formData.get("product_name"),
                sku: formData.get("product_sku"),
                unit_price: formData.get("product_price"),
                current_stock: formData.get("product_stock"),
                alert_threshold: formData.get("product_threshold"),
                unit: formData.get("product_unit"),
                category_id: formData.get("product_category"),
                image: imageName,
            });

            renderToast("Produit ajoute au stock mock.", "success");
            event.currentTarget.reset();
            renderCategories();

            if (inventoryUrl) {
                window.setTimeout(() => {
                    window.location.assign(inventoryUrl);
                }, 450);
            }
        } catch (error) {
            renderToast(error.message, "danger");
        }
    });

    renderCategories();
    subscribe(renderCategories);
};

const renderReportsPage = () => {
    const root = document.querySelector("[data-sp-page='reports']");
    if (!root) {
        return;
    }

    const refs = {
        filterPeriod: root.querySelector("[data-sp-report-period]"),
        filterType: root.querySelector("[data-sp-report-type]"),
        filterCategory: root.querySelector("[data-sp-report-category]"),
        filterStatus: root.querySelector("[data-sp-report-status]"),
        movementsBody: root.querySelector("[data-sp-report-movements]"),
        topProducts: root.querySelector("[data-sp-report-top-products]"),
    };

    const filterState = {
        period: 30,
        type: "",
        category: "",
        status: "",
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

    const getFilteredMovements = () => {
        const now = Date.now();
        const maxAge = Number(filterState.period) * 24 * 60 * 60 * 1000;

        return [...allMovements]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .filter((movement) => {
                const age = now - new Date(movement.created_at).getTime();
                const periodMatch = maxAge > 0 ? age <= maxAge : true;
                const typeMatch = !filterState.type || movement.type === filterState.type;
                
                // Vérifier la catégorie via le produit
                const product = products.find(p => p.id === movement.product_id);
                const categoryMatch = !filterState.category || (product && String(product.category_id) === String(filterState.category));
                
                // Vérifier le statut du stock
                let statusMatch = true;
                if (filterState.status && product) {
                    const status = product.current_stock <= 0 ? 'critique' : product.current_stock <= product.alert_threshold ? 'faible' : 'normal';
                    statusMatch = status === filterState.status;
                }

                return periodMatch && typeMatch && categoryMatch && statusMatch;
            });
    };

    const render = () => {
        fillCategorySelect(refs.filterCategory, filterState.category, true, categories);

        const movements = getFilteredMovements();
        
        // Calculer les KPIs
        const totalStockValue = products.reduce((sum, p) => sum + (p.current_stock * p.unit_price), 0);
        const lowProducts = products.filter(p => p.current_stock > 0 && p.current_stock <= p.alert_threshold).length;
        const criticalProducts = products.filter(p => p.current_stock <= 0).length;

        bindKpi("report-stock-value", formatCurrency(totalStockValue));
        bindKpi("report-movement-count", String(movements.length));
        bindKpi("report-low-stock", String(lowProducts));
        bindKpi("report-critical", String(criticalProducts));

        if (refs.movementsBody) {
            refs.movementsBody.innerHTML = movements.length
                ? movements
                    .slice(0, 20)
                    .map((movement) => {
                        const product = products.find(p => p.id === movement.product_id);
                        const category = categories.find(c => c.id === product?.category_id);
                        const badge = movement.type === "sortie"
                            ? "bg-danger-subtle text-danger border border-danger"
                            : movement.type === "entree"
                                ? "bg-success-subtle text-success border border-success"
                                : "bg-warning-subtle text-warning border border-warning";

                        // Calculer le stock après le mouvement (approximatif)
                        const newStock = product?.current_stock || 0;

                        return `
                            <tr class='sp-report-row'>
                                <td class='sp-report-date'>${formatDateTime(movement.created_at)}</td>
                                <td><span class='sp-report-main'>${product?.name || "Produit archive"}</span></td>
                                <td class='sp-report-category'>${category?.name || "-"}</td>
                                <td><span class='badge sp-report-type-badge ${badge}'>${movement.type}</span></td>
                                <td class='text-end'><span class='sp-report-number'>${formatNumber(movement.quantity)}</span></td>
                                <td class='sp-report-reason'>${movement.reason || "-"}</td>
                                <td class='text-end'><span class='sp-report-number sp-report-stock'>${formatNumber(newStock)}</span></td>
                            </tr>
                        `;
                    })
                    .join("")
                : "<tr><td colspan='7' class='text-center text-secondary py-4 sp-report-empty-cell'>Aucun mouvement pour ces filtres.</td></tr>";
        }

        if (refs.topProducts) {
            const topProducts = movements
                .filter((movement) => movement.type === "sortie")
                .reduce((accumulator, movement) => {
                    const key = String(movement.product_id);
                    accumulator[key] = (accumulator[key] || 0) + parseNumeric(movement.quantity);
                    return accumulator;
                }, {});

            const list = Object.entries(topProducts)
                .map(([productId, quantity]) => {
                    const product = products.find(p => p.id === parseInt(productId));
                    return {
                        product,
                        quantity,
                    };
                })
                .filter((entry) => entry.product)
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 5);

            refs.topProducts.innerHTML = list.length
                ? list
                    .map((entry) => `
                        <li class='list-group-item sp-report-top-item'>
                            <div class='min-w-0'>
                                <h6 class='mb-1 sp-report-top-title text-truncate'>${entry.product.name}</h6>
                                <small class='sp-report-top-sub'>${formatNumber(entry.quantity)} ${entry.product.unit} sortis</small>
                            </div>
                            <span class='badge sp-report-top-value'>${formatCurrency(entry.quantity * parseNumeric(entry.product.unit_price))}</span>
                        </li>
                    `)
                    .join("")
                : "<li class='list-group-item p-3 text-secondary'>Aucune sortie sur cette periode.</li>";
        }
    };

    const loadData = async () => {
        try {
            // Charger les mouvements depuis l'API
            const movementsResponse = await window.axios.get('/api/stock-movements?page=1');
            allMovements = movementsResponse.data.data ? movementsResponse.data.data : movementsResponse.data;
            
            // Charger les produits et catégories depuis l'API
            const [productsData, categoriesData] = await Promise.all([
                window.axios.get('/api/products'),
                window.axios.get('/api/categories')
            ]);
            
            products = productsData.data.data ? productsData.data.data : productsData.data;
            categories = categoriesData.data.data ? categoriesData.data.data : categoriesData.data;
            
            render();
        } catch (error) {
            console.error('[Reports] Erreur chargement données:', error);
            refs.movementsBody.innerHTML = "<tr><td colspan='8' class='text-center text-danger py-4'>Erreur chargement données API</td></tr>";
        }
    };

    refs.filterPeriod?.addEventListener("change", (event) => {
        filterState.period = Number(event.target.value || 30);
        render();
    });

    refs.filterType?.addEventListener("change", (event) => {
        filterState.type = event.target.value;
        render();
    });

    refs.filterCategory?.addEventListener("change", (event) => {
        filterState.category = event.target.value;
        render();
    });

    refs.filterStatus?.addEventListener("change", (event) => {
        filterState.status = event.target.value;
        render();
    });

    loadData();
};

const stockPilotMockApi = {
    enabled: true,
    getState,
    subscribe,
    getDashboardData,
    getMonthlySeries,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    addMovement,
    resetMockState,
    formatCurrency,
    formatNumber,
};

window.StockPilotMock = stockPilotMockApi;

const currentPage = document.querySelector("[data-sp-page]")?.dataset.spPage;

if (currentPage === "dashboard") {
    renderDashboardPage();
}

if (currentPage === "inventory") {
    renderInventoryPage();
}

if (currentPage === "create-product") {
    renderCreateProductPage();
}

if (currentPage === "reports") {
    renderReportsPage();
}

window.addEventListener("stockpilot:mock-reset", () => {
    resetMockState();
    renderToast("Donnees mock reinitialisees.", "success");
});
