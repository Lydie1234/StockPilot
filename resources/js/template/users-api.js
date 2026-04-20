/**
 * Gestion des utilisateurs avec StockPilot API
 * Remplace le mock utilisateur par l'API réelle
 */

import StockPilotAPI from '../api/stockpilot-api.js';

const ROLE_LABELS = {
    admin: 'Admin',
    gerant: 'Gerant',
    employe: 'Employe',
};

let cachedUsers = [];
let currentUser = null;

/**
 * Initialiser les données utilisateur
 */
const initializeUsers = async () => {
    try {
        cachedUsers = await StockPilotAPI.users.getAll();

        // Obtenir l'utilisateur courant depuis le DOM
        const userRole = window.userRole || 'employe';
        currentUser = {
            id: parseInt(document.head.dataset.userId || '1'),
            name: document.head.dataset.userName || 'Utilisateur',
            email: document.head.dataset.userEmail || '',
            role: userRole,
        };
    } catch (error) {
        console.error('[Users API] Erreur initializeUsers:', error);
        cachedUsers = [];
    }
};

/**
 * API utilisateurs compatible avec le script existant
 */
window.spUserMock = {
    /**
     * Vérifier si l'utilisateur peut gérer les utilisateurs
     */
    canManageUsers() {
        return currentUser && ['gerant', 'admin'].includes(currentUser.role);
    },

    /**
     * Obtenir l'utilisateur courant
     */
    getCurrentUser() {
        return currentUser || {};
    },

    /**
     * Obtenir la liste des utilisateurs
     */
    getUsers() {
        return cachedUsers.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || '-',
            avatar: `/assets/images/avatar/avatar-${(user.id % 5) + 1}.jpg`,
            status: user.email_verified_at ? 'active' : 'inactive',
            lastLogin: user.created_at,
        }));
    },

    /**
     * Obtenir les permissions de modification pour un utilisateur
     */
    getEditPermissions(userId) {
        const user = cachedUsers.find((u) => u.id === userId);
        if (!user) {
            return {
                allowed: false,
                reason: 'Utilisateur introuvable.',
            };
        }

        const isSelf = currentUser.id === userId;
        const canManage = this.canManageUsers();

        if (!canManage && !isSelf) {
            return {
                allowed: false,
                reason: 'Seuls les gérants peuvent modifier les autres utilisateurs.',
            };
        }

        if (isSelf) {
            return {
                allowed: true,
                canEditIdentity: true,
                canEditRole: false,
                mode: 'self',
                reason: 'Modification de votre profil.',
            };
        }

        return {
            allowed: true,
            canEditIdentity: true,
            canEditRole: true,
            mode: 'manage',
            reason: 'Modification utilisateur',
        };
    },

    /**
     * Ajouter un nouvel utilisateur
     */
    async addUser(payload) {
        try {
            const newUser = await StockPilotAPI.users.create({
                name: payload.name,
                email: payload.email,
                phone: payload.phone || null,
                role: payload.role,
            });

            cachedUsers.push(newUser);
            window.StockPilot.renderToast(
                `Utilisateur créé. Mot de passe par défaut: "password"`,
                'success',
            );

            return newUser;
        } catch (error) {
            throw new Error(error.message || 'Impossible de créer l\'utilisateur.');
        }
    },

    /**
     * Modifier un utilisateur
     */
    async updateUser(userId, payload) {
        try {
            const updated = await StockPilotAPI.users.update(userId, {
                name: payload.name,
                email: payload.email,
                phone: payload.phone || null,
                role: payload.role,
            });

            const index = cachedUsers.findIndex((u) => u.id === userId);
            if (index !== -1) {
                cachedUsers[index] = { ...cachedUsers[index], ...updated };
            }

            window.StockPilot.renderToast('Utilisateur mis à jour avec succès', 'success');

            return updated;
        } catch (error) {
            throw new Error(error.message || 'Impossible de modifier l\'utilisateur.');
        }
    },

    /**
     * Mettre à jour le statut d'un utilisateur
     */
    updateUserStatus(userId, status) {
        // Le statut est juste pour l'affichage
        const user = cachedUsers.find((u) => u.id === userId);
        if (user) {
            user.status = status;
        }
    },

    /**
     * Supprimer un utilisateur
     */
    async deleteUser(userId) {
        try {
            await StockPilotAPI.users.delete(userId);
            cachedUsers = cachedUsers.filter((u) => u.id !== userId);
            window.StockPilot.renderToast('Utilisateur supprimé avec succès', 'success');
        } catch (error) {
            throw new Error(error.message || 'Impossible de supprimer l\'utilisateur.');
        }
    },

    /**
     * Réinitialiser le mot de passe d'un utilisateur
     */
    async resetPassword(userId) {
        try {
            const response = await StockPilotAPI.users.resetPassword(userId);
            window.StockPilot.renderToast(response.message, 'success');
            return response;
        } catch (error) {
            throw new Error(error.message || 'Impossible de réinitialiser le mot de passe.');
        }
    },

    /**
     * Rafraîchir la liste des utilisateurs
     */
    async refreshUsers() {
        await initializeUsers();
    },
};

// Initialiser au chargement du DOM
document.addEventListener('DOMContentLoaded', async () => {
    await initializeUsers();
});

