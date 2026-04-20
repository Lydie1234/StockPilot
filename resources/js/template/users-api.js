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

const DEFAULT_AVATAR = '/assets/images/logo-icon.svg';
const SETTINGS_STORAGE_KEY = 'stockpilot.user-settings.v1';
const DEFAULT_PASSWORD = 'password';

const PAGE_REQUIRING_USERS_API = new Set(['users', 'settings']);

const DEFAULT_SETTINGS = {
    preferences: {
        theme: 'light',
        language: 'fr',
        notifications: {
            email: true,
            push: false,
            lowStockAlert: true,
            newOrder: true,
        },
    },
    system: {
        currency: 'XOF',
        maintenanceMode: false,
        autoLogoutTime: 120,
    },
    userProfile: {
        phone: '',
        jobTitle: '',
        bio: '',
    },
};

let cachedUsers = [];
let currentUser = null;
let localSettings = { ...DEFAULT_SETTINGS };
let currentPassword = DEFAULT_PASSWORD;

const deepClone = (value) => JSON.parse(JSON.stringify(value));

const normalizeRole = (role) => {
    const normalized = String(role || '').toLowerCase();
    return ['admin', 'gerant', 'employe'].includes(normalized) ? normalized : 'employe';
};

const getCurrentPage = () => {
    const root = document.querySelector('[data-sp-page]');
    return root?.dataset?.spPage || '';
};

const shouldInitializeUsersApi = () => PAGE_REQUIRING_USERS_API.has(getCurrentPage());

const isAuthenticatedContext = () => typeof window.userRole === 'string' && window.userRole.length > 0;

const emitStateChange = () => {
    window.dispatchEvent(new CustomEvent('stockpilot:user-state-changed', {
        detail: {
            currentUserId: currentUser?.id || null,
            usersCount: cachedUsers.length,
        },
    }));
};

const getDefaultCurrentUser = () => {
    const id = Number.parseInt(String(window.userId || ''), 10);

    return {
        id: Number.isFinite(id) && id > 0 ? id : 1,
        name: String(window.userName || 'Utilisateur'),
        email: String(window.userEmail || ''),
        role: normalizeRole(window.userRole),
        phone: '-',
        avatar: DEFAULT_AVATAR,
        status: 'active',
        lastLogin: null,
    };
};

const normalizeApiUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: normalizeRole(user.role),
    phone: user.phone || '-',
    avatar: DEFAULT_AVATAR,
    status: user.email_verified_at ? 'active' : 'inactive',
    lastLogin: user.created_at,
});

const getSafeCurrentUser = () => currentUser || getDefaultCurrentUser();

const loadSettings = () => {
    try {
        const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (!raw) {
            return deepClone(DEFAULT_SETTINGS);
        }

        const parsed = JSON.parse(raw);
        return {
            preferences: {
                ...DEFAULT_SETTINGS.preferences,
                ...(parsed.preferences || {}),
                notifications: {
                    ...DEFAULT_SETTINGS.preferences.notifications,
                    ...((parsed.preferences || {}).notifications || {}),
                },
            },
            system: {
                ...DEFAULT_SETTINGS.system,
                ...(parsed.system || {}),
            },
            userProfile: {
                ...DEFAULT_SETTINGS.userProfile,
                ...(parsed.userProfile || {}),
            },
        };
    } catch {
        return deepClone(DEFAULT_SETTINGS);
    }
};

const saveSettings = () => {
    try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(localSettings));
    } catch {
        // Ignore storage issues (private mode or quota).
    }
};

/**
 * Initialiser les données utilisateur
 */
const initializeUsers = async () => {
    currentUser = getDefaultCurrentUser();
    localSettings = loadSettings();

    if (!shouldInitializeUsersApi() || !isAuthenticatedContext()) {
        emitStateChange();
        return;
    }

    try {
        const users = await StockPilotAPI.users.getAll();
        cachedUsers = users.map(normalizeApiUser);

        const matched = cachedUsers.find((user) => (
            (currentUser.email && user.email === currentUser.email)
            || user.id === currentUser.id
        ));

        if (matched) {
            currentUser = { ...currentUser, ...matched };
        }
    } catch (error) {
        console.error('[Users API] Erreur initializeUsers:', error);
        cachedUsers = [];
    } finally {
        emitStateChange();
    }
};

const getSettings = () => {
    const user = getSafeCurrentUser();

    const settings = deepClone(localSettings);
    if (!settings.userProfile.phone && user.phone && user.phone !== '-') {
        settings.userProfile.phone = user.phone;
    }

    return settings;
};

const updateSettings = (data) => {
    const payload = data && typeof data === 'object' ? data : {};

    if (payload.preferences) {
        localSettings.preferences = {
            ...localSettings.preferences,
            ...payload.preferences,
            notifications: {
                ...localSettings.preferences.notifications,
                ...(payload.preferences.notifications || {}),
            },
        };
    }

    if (payload.system) {
        localSettings.system = {
            ...localSettings.system,
            ...payload.system,
        };
    }

    if (payload.userProfile) {
        localSettings.userProfile = {
            ...localSettings.userProfile,
            ...payload.userProfile,
        };

        if (currentUser && payload.userProfile.phone) {
            currentUser.phone = payload.userProfile.phone;
        }
    }

    saveSettings();
    emitStateChange();

    return getSettings();
};

const updateCurrentUser = (payload) => {
    const user = getSafeCurrentUser();

    currentUser = {
        ...user,
        name: payload?.name ?? user.name,
        email: payload?.email ?? user.email,
        phone: payload?.phone ?? user.phone,
    };

    const index = cachedUsers.findIndex((entry) => entry.id === user.id);
    if (index !== -1) {
        cachedUsers[index] = { ...cachedUsers[index], ...currentUser };
    }

    updateSettings({
        userProfile: {
            phone: currentUser.phone,
        },
    });

    StockPilotAPI.users
        .update(user.id, {
            name: currentUser.name,
            email: currentUser.email,
            phone: currentUser.phone === '-' ? null : currentUser.phone,
        })
        .then((updated) => {
            const normalized = normalizeApiUser(updated);
            currentUser = { ...currentUser, ...normalized };

            const apiIndex = cachedUsers.findIndex((entry) => entry.id === normalized.id);
            if (apiIndex !== -1) {
                cachedUsers[apiIndex] = normalized;
            }

            emitStateChange();
        })
        .catch((error) => {
            console.error('[Users API] Erreur updateCurrentUser:', error);
        });

    emitStateChange();
    return deepClone(currentUser);
};

const changePassword = (payload) => {
    const oldPassword = String(payload?.oldPassword || payload?.old_password || '').trim();
    const newPassword = String(payload?.newPassword || payload?.new_password || '').trim();
    const confirmPassword = String(payload?.confirmPassword || payload?.new_password_confirmation || '').trim();

    if (!oldPassword || !newPassword || !confirmPassword) {
        throw new Error('Tous les champs mot de passe sont obligatoires.');
    }

    if (oldPassword !== currentPassword) {
        throw new Error('Ancien mot de passe incorrect.');
    }

    if (newPassword.length < 8) {
        throw new Error('Le nouveau mot de passe doit contenir au moins 8 caracteres.');
    }

    if (newPassword !== confirmPassword) {
        throw new Error('La confirmation du mot de passe ne correspond pas.');
    }

    if (newPassword === oldPassword) {
        throw new Error('Le nouveau mot de passe doit etre different de l\'ancien.');
    }

    currentPassword = newPassword;
    return true;
};

/**
 * API utilisateurs compatible avec le script existant
 */
window.spUserMock = {
    getRoleLabel(role) {
        return ROLE_LABELS[normalizeRole(role)] || ROLE_LABELS.employe;
    },

    /**
     * Vérifier si l'utilisateur peut gérer les utilisateurs
     */
    canManageUsers() {
        return ['gerant', 'admin'].includes(getSafeCurrentUser().role);
    },

    /**
     * Obtenir l'utilisateur courant
     */
    getCurrentUser() {
        return deepClone(getSafeCurrentUser());
    },

    /**
     * Obtenir la liste des utilisateurs
     */
    getUsers() {
        return deepClone(cachedUsers);
    },

    /**
     * Obtenir les permissions de modification pour un utilisateur
     */
    getEditPermissions(userId) {
        const targetId = Number(userId);
        const user = cachedUsers.find((u) => u.id === targetId);
        if (!user) {
            return {
                allowed: false,
                reason: 'Utilisateur introuvable.',
            };
        }

        const isSelf = getSafeCurrentUser().id === targetId;
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
            const newUser = normalizeApiUser(await StockPilotAPI.users.create({
                name: payload.name,
                email: payload.email,
                phone: payload.phone || null,
                role: payload.role,
            }));

            cachedUsers.push(newUser);
            window.StockPilot?.renderToast?.(
                `Utilisateur créé. Mot de passe par défaut: "password"`,
                'success',
            );

            emitStateChange();

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
            const updated = normalizeApiUser(await StockPilotAPI.users.update(userId, {
                name: payload.name,
                email: payload.email,
                phone: payload.phone || null,
                role: payload.role,
                password: payload.password,
            }));

            const index = cachedUsers.findIndex((u) => u.id === userId);
            if (index !== -1) {
                cachedUsers[index] = { ...cachedUsers[index], ...updated };
            }

            if (currentUser && currentUser.id === userId) {
                currentUser = { ...currentUser, ...updated };
            }

            window.StockPilot?.renderToast?.('Utilisateur mis à jour avec succès', 'success');
            emitStateChange();

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
            emitStateChange();
        }
    },

    /**
     * Supprimer un utilisateur
     */
    async deleteUser(userId) {
        try {
            await StockPilotAPI.users.delete(userId);
            cachedUsers = cachedUsers.filter((u) => u.id !== userId);
            window.StockPilot?.renderToast?.('Utilisateur supprimé avec succès', 'success');
            emitStateChange();
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
            window.StockPilot?.renderToast?.(response.message, 'success');
            return response;
        } catch (error) {
            throw new Error(error.message || 'Impossible de réinitialiser le mot de passe.');
        }
    },

    updateCurrentUser,

    getSettings,

    updateSettings,

    changePassword,

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

