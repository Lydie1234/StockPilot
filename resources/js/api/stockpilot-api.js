/**
 * StockPilot API - Couche d'accès aux données backend
 * Communique avec les contrôleurs Laravel pour les données réelles
 */

const API_BASE_URL = '/';
const API_ENDPOINTS = {
    categories: 'api/categories',
    products: 'api/products',
    movements: 'api/stock-movements',
    users: 'api/users',
    belowThreshold: 'api/products-below-threshold',
};

/**
 * Effectue une requête HTTP avec gestion d'erreur
 */
async function request(method, url, data = null) {
    try {
        const config = {
            method,
            url: API_BASE_URL + url,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        };

        if (data) {
            config.data = data;
        }

        const response = await window.axios(config);
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            const authMessage = 'Session expirée ou non authentifiée. Veuillez vous reconnecter.';
            console.error(`[API] ${method} ${url}:`, authMessage);
            throw new Error(authMessage);
        }

        const message = error.response?.data?.error || error.message || 'Erreur serveur';
        console.error(`[API] ${method} ${url}:`, message);
        throw new Error(message);
    }
}

/**
 * API pour les catégories
 */
const categoriesAPI = {
    async getAll() {
        return request('GET', API_ENDPOINTS.categories);
    },

    async create(data) {
        return request('POST', API_ENDPOINTS.categories, data);
    },

    async update(id, data) {
        return request('PATCH', `${API_ENDPOINTS.categories}/${id}`, data);
    },

    async delete(id) {
        return request('DELETE', `${API_ENDPOINTS.categories}/${id}`);
    },
};

/**
 * API pour les produits
 */
const productsAPI = {
    async getAll() {
        return request('GET', API_ENDPOINTS.products);
    },

    async create(data) {
        return request('POST', API_ENDPOINTS.products, data);
    },

    async update(id, data) {
        return request('PATCH', `${API_ENDPOINTS.products}/${id}`, data);
    },

    async delete(id) {
        return request('DELETE', `${API_ENDPOINTS.products}/${id}`);
    },

    async getBelowThreshold() {
        return request('GET', API_ENDPOINTS.belowThreshold);
    },
};

/**
 * API pour les mouvements de stock
 */
const movementsAPI = {
    async getAll(page = 1) {
        return request('GET', `${API_ENDPOINTS.movements}?page=${page}`);
    },

    async create(data) {
        return request('POST', API_ENDPOINTS.movements, data);
    },

    async get(id) {
        return request('GET', `${API_ENDPOINTS.movements}/${id}`);
    },
};

/**
 * API pour les utilisateurs
 */
const usersAPI = {
    async getAll() {
        return request('GET', API_ENDPOINTS.users);
    },

    async create(data) {
        return request('POST', API_ENDPOINTS.users, data);
    },

    async get(id) {
        return request('GET', `${API_ENDPOINTS.users}/${id}`);
    },

    async update(id, data) {
        return request('PATCH', `${API_ENDPOINTS.users}/${id}`, data);
    },

    async delete(id) {
        return request('DELETE', `${API_ENDPOINTS.users}/${id}`);
    },

    async resetPassword(id) {
        return request('POST', `${API_ENDPOINTS.users}/${id}/reset-password`);
    },
};

/**
 * API unifiée StockPilot
 */
export const StockPilotAPI = {
    categories: categoriesAPI,
    products: productsAPI,
    movements: movementsAPI,
    users: usersAPI,

    async getDashboardData() {
        try {
            const [products, movements, categories] = await Promise.all([
                this.products.getAll(),
                this.movements.getAll(),
                this.categories.getAll(),
            ]);

            // Ajouter le statut de stock à chaque produit
            const productsWithStatus = products.map((product) => ({
                ...product,
                status: this._getStockStatus(product),
            }));

            // Calculer les statistiques
            const totalStockValue = productsWithStatus.reduce(
                (sum, p) => sum + parseFloat(p.current_stock) * parseFloat(p.unit_price),
                0,
            );

            const totalStockUnits = productsWithStatus.reduce(
                (sum, p) => sum + parseInt(p.current_stock),
                0,
            );

            const alertProducts = productsWithStatus.filter((p) => p.status !== 'normal');
            const criticalProducts = productsWithStatus.filter((p) => p.status === 'critique');
            const lowProducts = productsWithStatus.filter((p) => p.status === 'faible');

            // Mouvements récents avec infos produit et catégorie
            const recentMovements = movements.data
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 8)
                .map((movement) => {
                    const product = productsWithStatus.find((p) => p.id === movement.product_id);
                    const category = categories.find((c) => c.id === product?.category_id);

                    return {
                        ...movement,
                        product_name: product?.name || 'Produit archivé',
                        category_name: category?.name || '-',
                    };
                });

            // Top produits vendus
            const outgoingByProduct = movements.data
                .filter((m) => m.type === 'sortie')
                .reduce((acc, m) => {
                    const key = String(m.product_id);
                    acc[key] = (acc[key] || 0) + parseInt(m.quantity);
                    return acc;
                }, {});

            const topOutgoing = Object.entries(outgoingByProduct)
                .map(([productId, quantity]) => {
                    const product = productsWithStatus.find((p) => p.id === parseInt(productId));
                    return {
                        product_id: parseInt(productId),
                        product_name: product?.name || 'Produit archivé',
                        quantity,
                        unit: product?.unit || 'unité',
                        revenue: quantity * parseFloat(product?.unit_price),
                    };
                })
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 5);

            // Mouvements du jour
            const today = new Date().toDateString();
            const movementToday = (movements.data || []).filter((m) => {
                return new Date(m.created_at).toDateString() === today;
            }).length;

            return {
                products: productsWithStatus,
                totalStockValue,
                totalStockUnits,
                alertProducts,
                criticalProducts,
                lowProducts,
                recentMovements,
                topOutgoing,
                movementToday,
                categories,
            };
        } catch (error) {
            console.error('[StockPilotAPI] Erreur getDashboardData:', error);
            throw error;
        }
    },

    _getStockStatus(product) {
        const stock = parseInt(product.current_stock);
        const threshold = parseInt(product.alert_threshold);

        if (stock <= 0) {
            return 'critique';
        } else if (stock <= threshold) {
            return 'faible';
        }

        return 'normal';
    },
};

export default StockPilotAPI;
