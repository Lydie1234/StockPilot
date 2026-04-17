// resources/js/template/user-mock.js
const USER_STORAGE_KEY = "stockpilot.mock.user.v1";
const DEFAULT_PASSWORD = "password";
const MANAGER_ROLES = new Set(["admin", "gerant"]);
const EDITABLE_ROLES = new Set(["gerant", "employe"]);

const ROLE_LABELS = {
    admin: "Admin",
    gerant: "Gerant",
    employe: "Employe",
};

const AVATAR_POOL = [
    "/assets/images/avatar/avatar-1.jpg",
    "/assets/images/avatar/avatar-2.jpg",
    "/assets/images/avatar/avatar-3.jpg",
    "/assets/images/avatar/avatar-4.jpg",
    "/assets/images/avatar/avatar-5.jpg",
];

const defaultUserData = {
    currentUserId: 1,
    usersList: [
        {
            id: 1,
            name: "Aissatou Ndiaye",
            role: "admin",
            email: "admin@stockpilot.test",
            phone: "+221 77 100 11 22",
            avatar: "/assets/images/avatar/avatar-1.jpg",
            status: "active",
            lastLogin: "2026-04-12T09:10:00",
        },
        {
            id: 2,
            name: "Amadou Diallo",
            role: "gerant",
            email: "gerant@stockpilot.test",
            phone: "+221 77 200 22 33",
            avatar: "/assets/images/avatar/avatar-2.jpg",
            status: "active",
            lastLogin: "2026-04-11T16:30:00",
        },
        {
            id: 3,
            name: "Fatou Kane",
            role: "employe",
            email: "employe@stockpilot.test",
            phone: "+221 77 300 33 44",
            avatar: "/assets/images/avatar/avatar-4.jpg",
            status: "active",
            lastLogin: "2026-04-10T11:45:00",
        },
        {
            id: 4,
            name: "Aliou Cisse",
            role: "employe",
            email: "aliou.c@stockpilot.test",
            phone: "+221 77 400 44 55",
            avatar: "/assets/images/avatar/avatar-5.jpg",
            status: "inactive",
            lastLogin: "2026-03-25T08:12:00",
        },
    ],
    credentials: {
        1: DEFAULT_PASSWORD,
        2: DEFAULT_PASSWORD,
        3: DEFAULT_PASSWORD,
        4: DEFAULT_PASSWORD,
    },
    settings: {
        userProfiles: {
            1: {
                phone: "+221 77 100 11 22",
                jobTitle: "Administratrice plateforme",
                bio: "Pilotage global des operations et des droits utilisateurs.",
            },
            2: {
                phone: "+221 77 200 22 33",
                jobTitle: "Gerant magasin",
                bio: "Supervision des stocks et des mouvements quotidiens.",
            },
            3: {
                phone: "+221 77 300 33 44",
                jobTitle: "Employe comptoir",
                bio: "Traitement des ventes et mises a jour de stock.",
            },
            4: {
                phone: "+221 77 400 44 55",
                jobTitle: "Employe reserve",
                bio: "Reception fournisseur et controle des articles.",
            },
        },
        preferences: {
            theme: "light",
            notifications: {
                email: true,
                push: false,
                lowStockAlert: true,
                newOrder: true,
            },
            language: "fr",
            timezone: "Africa/Dakar",
        },
        system: {
            currency: "XOF",
            maintenanceMode: false,
            autoLogoutTime: 120,
        },
    },
};

const deepClone = (value) => JSON.parse(JSON.stringify(value));
const sanitizeString = (value) => String(value || "").trim();

const toSafeId = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const normalizeRole = (value) => {
    const role = sanitizeString(value).toLowerCase();
    if (role === "admin" || role === "gerant" || role === "employe") {
        return role;
    }

    return "employe";
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isValidPhone = (value) => /^[+\d][\d\s().-]{7,}$/.test(value);

const normalizeUser = (rawUser, fallbackId) => {
    const id = toSafeId(rawUser?.id) || fallbackId;
    const role = normalizeRole(rawUser?.role);

    return {
        id,
        name: sanitizeString(rawUser?.name) || `Utilisateur ${id}`,
        role,
        email: sanitizeString(rawUser?.email).toLowerCase() || `user${id}@stockpilot.test`,
        phone: sanitizeString(rawUser?.phone) || "+221 70 000 00 00",
        avatar: sanitizeString(rawUser?.avatar) || AVATAR_POOL[(id - 1) % AVATAR_POOL.length],
        status: sanitizeString(rawUser?.status).toLowerCase() === "inactive" ? "inactive" : "active",
        lastLogin: rawUser?.lastLogin || null,
    };
};

const normalizeState = (candidate) => {
    const fallback = deepClone(defaultUserData);

    if (!candidate || typeof candidate !== "object") {
        return fallback;
    }

    const sourceUsers = Array.isArray(candidate.usersList) && candidate.usersList.length
        ? candidate.usersList
        : fallback.usersList;

    const normalizedUsers = [];
    const usedIds = new Set();

    sourceUsers.forEach((user, index) => {
        const normalized = normalizeUser(user, index + 1);
        let nextId = normalized.id;

        while (usedIds.has(nextId)) {
            nextId += 1;
        }

        normalized.id = nextId;
        usedIds.add(nextId);
        normalizedUsers.push(normalized);
    });

    if (candidate.currentUser && typeof candidate.currentUser === "object") {
        const legacyCurrentUser = normalizeUser(candidate.currentUser, normalizedUsers.length + 1);
        const existingUser = normalizedUsers.find(
            (user) => user.id === legacyCurrentUser.id || user.email === legacyCurrentUser.email,
        );

        if (existingUser) {
            Object.assign(existingUser, legacyCurrentUser);
        } else {
            normalizedUsers.unshift(legacyCurrentUser);
        }
    }

    let currentUserId = toSafeId(candidate.currentUserId) || toSafeId(candidate.currentUser?.id);
    if (!currentUserId || !normalizedUsers.some((user) => user.id === currentUserId)) {
        currentUserId = normalizedUsers[0]?.id || fallback.currentUserId;
    }

    const credentials = typeof candidate.credentials === "object" && candidate.credentials
        ? { ...candidate.credentials }
        : {};

    normalizedUsers.forEach((user) => {
        if (!sanitizeString(credentials[user.id])) {
            credentials[user.id] = DEFAULT_PASSWORD;
        }
    });

    const sourceSettings = candidate.settings && typeof candidate.settings === "object"
        ? candidate.settings
        : {};

    const settings = {
        preferences: {
            ...fallback.settings.preferences,
            ...(sourceSettings.preferences || {}),
            notifications: {
                ...fallback.settings.preferences.notifications,
                ...((sourceSettings.preferences || {}).notifications || {}),
            },
        },
        system: {
            ...fallback.settings.system,
            ...(sourceSettings.system || {}),
        },
        userProfiles: {
            ...fallback.settings.userProfiles,
            ...(sourceSettings.userProfiles || {}),
        },
    };

    if (sourceSettings.userProfile && typeof sourceSettings.userProfile === "object") {
        settings.userProfiles[currentUserId] = {
            ...(settings.userProfiles[currentUserId] || {}),
            ...sourceSettings.userProfile,
        };
    }

    normalizedUsers.forEach((user) => {
        const profile = settings.userProfiles[user.id] || {};
        settings.userProfiles[user.id] = {
            phone: sanitizeString(profile.phone) || user.phone,
            jobTitle: sanitizeString(profile.jobTitle),
            bio: sanitizeString(profile.bio),
        };
    });

    return {
        currentUserId,
        usersList: normalizedUsers,
        credentials,
        settings,
    };
};

const safeParseStorage = () => {
    try {
        const raw = localStorage.getItem(USER_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
};

let userState = normalizeState(safeParseStorage());

const syncCurrentUserWithBackendRole = () => {
    const backendRoleRaw = typeof window !== "undefined" ? window.userRole : null;
    if (!backendRoleRaw) {
        return;
    }

    const backendRole = normalizeRole(backendRoleRaw);
    const matchedUser = userState.usersList.find((user) => user.role === backendRole);
    if (!matchedUser) {
        return;
    }

    userState.currentUserId = matchedUser.id;
};

syncCurrentUserWithBackendRole();

const getUserByIdInternal = (userId) => {
    const id = toSafeId(userId);
    return userState.usersList.find((user) => user.id === id) || null;
};

const getCurrentUserInternal = () => {
    let currentUser = getUserByIdInternal(userState.currentUserId);
    if (!currentUser) {
        currentUser = userState.usersList[0] || null;
        userState.currentUserId = currentUser?.id || defaultUserData.currentUserId;
    }

    return currentUser;
};

const getNextUserId = () => {
    if (!userState.usersList.length) {
        return 1;
    }

    return Math.max(...userState.usersList.map((user) => user.id)) + 1;
};

const ensureProfile = (userId) => {
    if (!userState.settings.userProfiles[userId]) {
        userState.settings.userProfiles[userId] = {
            phone: "",
            jobTitle: "",
            bio: "",
        };
    }

    return userState.settings.userProfiles[userId];
};

const emitStateChange = () => {
    window.dispatchEvent(new CustomEvent("stockpilot:user-state-changed", {
        detail: {
            currentUserId: userState.currentUserId,
            usersCount: userState.usersList.length,
        },
    }));
};

const persistState = () => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userState));
    emitStateChange();
};

const findDuplicateEmail = (email, excludedUserId = null) => {
    const normalizedEmail = sanitizeString(email).toLowerCase();
    return userState.usersList.find((user) => {
        if (excludedUserId && user.id === Number(excludedUserId)) {
            return false;
        }

        return user.email.toLowerCase() === normalizedEmail;
    });
};

export const UserService = {
    getCurrentUser() {
        return deepClone(getCurrentUserInternal());
    },

    getUsers() {
        return deepClone(userState.usersList);
    },

    getRoleLabel(role) {
        return ROLE_LABELS[normalizeRole(role)] || ROLE_LABELS.employe;
    },

    isManagerRole(role) {
        return MANAGER_ROLES.has(normalizeRole(role));
    },

    canManageUsers() {
        const currentUser = getCurrentUserInternal();
        return this.isManagerRole(currentUser?.role);
    },

    getEditPermissions(targetUserId) {
        const targetUser = getUserByIdInternal(targetUserId);
        if (!targetUser) {
            return {
                allowed: false,
                canEditIdentity: false,
                canEditRole: false,
                mode: "forbidden",
                reason: "Utilisateur introuvable.",
            };
        }

        const currentUser = getCurrentUserInternal();
        const isSelf = currentUser?.id === targetUser.id;

        if (isSelf) {
            return {
                allowed: true,
                canEditIdentity: true,
                canEditRole: false,
                mode: "self",
                reason: "Vous pouvez modifier vos informations personnelles uniquement.",
            };
        }

        if (this.isManagerRole(currentUser?.role)) {
            return {
                allowed: true,
                canEditIdentity: false,
                canEditRole: true,
                mode: "manager-role-only",
                reason: "En tant qu'admin, vous pouvez modifier uniquement le role.",
            };
        }

        return {
            allowed: false,
            canEditIdentity: false,
            canEditRole: false,
            mode: "forbidden",
            reason: "Vous ne pouvez modifier que votre propre profil.",
        };
    },

    updateUserStatus(userId, status) {
        if (!this.canManageUsers()) {
            throw new Error("Permission refusee: seuls les admins peuvent modifier le statut.");
        }

        const targetUser = getUserByIdInternal(userId);
        if (!targetUser) {
            throw new Error("Utilisateur introuvable.");
        }

        targetUser.status = sanitizeString(status).toLowerCase() === "inactive" ? "inactive" : "active";
        persistState();
        return deepClone(targetUser);
    },

    addUser(payload) {
        if (!this.canManageUsers()) {
            throw new Error("Permission refusee: vous ne pouvez pas ajouter d'utilisateur.");
        }

        const name = sanitizeString(payload?.name);
        const email = sanitizeString(payload?.email).toLowerCase();
        const phone = sanitizeString(payload?.phone);
        const role = normalizeRole(payload?.role);

        if (!name) {
            throw new Error("Le nom complet est obligatoire.");
        }
        if (!isValidEmail(email)) {
            throw new Error("Adresse email invalide.");
        }
        if (!isValidPhone(phone)) {
            throw new Error("Numero de telephone invalide.");
        }
        if (!EDITABLE_ROLES.has(role)) {
            throw new Error("Role invalide. Choisissez gerant ou employe.");
        }
        if (findDuplicateEmail(email)) {
            throw new Error("Cet email existe deja.");
        }

        const id = getNextUserId();
        const user = {
            id,
            name,
            email,
            phone,
            role,
            avatar: AVATAR_POOL[(id - 1) % AVATAR_POOL.length],
            status: "active",
            lastLogin: null,
        };

        userState.usersList.push(user);
        userState.credentials[id] = DEFAULT_PASSWORD;
        userState.settings.userProfiles[id] = {
            phone,
            jobTitle: role === "gerant" ? "Gerant" : "Employe",
            bio: "",
        };

        persistState();
        return deepClone(user);
    },

    updateUser(userId, payload) {
        const targetUser = getUserByIdInternal(userId);
        if (!targetUser) {
            throw new Error("Utilisateur introuvable.");
        }

        const permissions = this.getEditPermissions(userId);
        if (!permissions.allowed) {
            throw new Error(permissions.reason || "Modification non autorisee.");
        }

        if (permissions.canEditIdentity) {
            const name = sanitizeString(payload?.name || targetUser.name);
            const email = sanitizeString(payload?.email || targetUser.email).toLowerCase();
            const phone = sanitizeString(payload?.phone || targetUser.phone);

            if (!name) {
                throw new Error("Le nom complet est obligatoire.");
            }
            if (!isValidEmail(email)) {
                throw new Error("Adresse email invalide.");
            }
            if (!isValidPhone(phone)) {
                throw new Error("Numero de telephone invalide.");
            }
            if (findDuplicateEmail(email, targetUser.id)) {
                throw new Error("Cet email est deja utilise par un autre compte.");
            }

            targetUser.name = name;
            targetUser.email = email;
            targetUser.phone = phone;

            const profile = ensureProfile(targetUser.id);
            profile.phone = phone;
        }

        if (permissions.canEditRole) {
            const role = normalizeRole(payload?.role || targetUser.role);
            if (!EDITABLE_ROLES.has(role)) {
                throw new Error("Role invalide. Choisissez gerant ou employe.");
            }

            targetUser.role = role;
        }

        persistState();
        return deepClone(targetUser);
    },

    updateCurrentUser(payload) {
        const currentUser = getCurrentUserInternal();
        return this.updateUser(currentUser.id, payload);
    },

    getSettings() {
        const currentUser = getCurrentUserInternal();
        const profile = ensureProfile(currentUser.id);

        return deepClone({
            preferences: userState.settings.preferences,
            system: userState.settings.system,
            userProfile: profile,
        });
    },

    updateSettings(data) {
        const payload = data && typeof data === "object" ? data : {};
        const currentUser = getCurrentUserInternal();

        if (payload.preferences) {
            userState.settings.preferences = {
                ...userState.settings.preferences,
                ...payload.preferences,
                notifications: {
                    ...userState.settings.preferences.notifications,
                    ...(payload.preferences.notifications || {}),
                },
            };
        }

        if (payload.system) {
            userState.settings.system = {
                ...userState.settings.system,
                ...payload.system,
            };
        }

        if (payload.userProfile) {
            const profile = ensureProfile(currentUser.id);
            Object.assign(profile, payload.userProfile);

            if (sanitizeString(payload.userProfile.phone)) {
                currentUser.phone = sanitizeString(payload.userProfile.phone);
            }
        }

        persistState();
        return this.getSettings();
    },

    changePassword(payload) {
        const oldPassword = sanitizeString(payload?.oldPassword || payload?.old_password);
        const newPassword = sanitizeString(payload?.newPassword || payload?.new_password);
        const confirmPassword = sanitizeString(payload?.confirmPassword || payload?.new_password_confirmation);

        if (!oldPassword || !newPassword || !confirmPassword) {
            throw new Error("Tous les champs mot de passe sont obligatoires.");
        }

        const currentUser = getCurrentUserInternal();
        const currentPassword = sanitizeString(userState.credentials[currentUser.id] || DEFAULT_PASSWORD);

        if (oldPassword !== currentPassword) {
            throw new Error("Ancien mot de passe incorrect.");
        }

        if (newPassword.length < 8) {
            throw new Error("Le nouveau mot de passe doit contenir au moins 8 caracteres.");
        }

        if (newPassword !== confirmPassword) {
            throw new Error("La confirmation du mot de passe ne correspond pas.");
        }

        if (newPassword === oldPassword) {
            throw new Error("Le nouveau mot de passe doit etre different de l'ancien.");
        }

        userState.credentials[currentUser.id] = newPassword;
        persistState();
        return true;
    },

    resetMocks() {
        userState = deepClone(defaultUserData);
        persistState();
    },

    save() {
        persistState();
    },
};

window.spUserMock = UserService;

window.addEventListener("storage", (event) => {
    if (event.key !== USER_STORAGE_KEY) {
        return;
    }

    userState = normalizeState(safeParseStorage());
    emitStateChange();
});
