@extends('layouts.app')

@section('title', 'Gestion des Utilisateurs - StockPilot')

@section('content')
<div class="container-fluid sp-page sp-users-page" data-sp-page="users">
    <div class="row align-items-center justify-content-between mb-4">
        <div class="col-12 col-md-8">
            <h1 class="fs-3 fw-bold mb-1 text-dark">Utilisateurs et permissions</h1>
            <p class="mb-0 text-muted">Ajoutez des employes, mettez a jour les roles et appliquez les permissions selon le profil actif.</p>
        </div>
        <div class="col-12 col-md-4 text-md-end mt-3 mt-md-0">
            <button type="button" class="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm rounded-3 px-4 py-2 fw-medium transition-hover" data-users-open-create data-bs-toggle="modal" data-bs-target="#spUserModal">
                <i class="ti ti-user-plus"></i>
                Ajouter un employe
            </button>
        </div>
    </div>

    <div class="alert d-none mb-3 rounded-3" data-users-feedback role="alert"></div>
    <div class="alert alert-info border border-info-subtle rounded-3 d-none mb-4" data-users-permission-banner role="alert"></div>

    <div class="row">
        <div class="col-12">
            <div class="card border-0 shadow-sm rounded-4 sp-inventory-table-card overflow-hidden">
                <div class="card-header bg-transparent border-bottom border-light pt-4 pb-3 px-4 d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
                    <div>
                        <h3 class="h5 fw-bold mb-1 text-dark">Membres de l'equipe</h3>
                        <p class="mb-0 text-muted small" data-users-current-meta>Chargement du profil actif...</p>
                    </div>
                    <div class="input-icon" style="width: min(100%, 300px);">
                        <span class="input-icon-addon">
                            <i class="ti ti-search text-muted"></i>
                        </span>
                        <input type="text" class="form-control form-control-sm border-gray-300 rounded-pill shadow-none" data-users-search placeholder="Rechercher nom, email, role, telephone...">
                    </div>
                </div>

                <div class="table-responsive mb-0 p-0">
                    <table class="table table-hover align-middle mb-0 sp-inventory-table sp-users-table">
                        <thead class="bg-light">
                            <tr>
                                <th class="text-uppercase fw-semibold text-muted small py-3 ps-4 border-0 tracking-wide text-start">Nom</th>
                                <th class="text-uppercase fw-semibold text-muted small py-3 border-0 tracking-wide text-start">Role</th>
                                <th class="text-uppercase fw-semibold text-muted small py-3 border-0 tracking-wide text-start">Email</th>
                                <th class="text-uppercase fw-semibold text-muted small py-3 border-0 tracking-wide text-start">Telephone</th>
                                <th class="text-uppercase fw-semibold text-muted small py-3 border-0 tracking-wide text-start">Statut</th>
                                <th class="text-uppercase fw-semibold text-muted small py-3 pe-4 border-0 tracking-wide text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="mock-users-tbody" class="border-top-0">
                            <tr>
                                <td colspan="6" class="text-center py-5 text-muted fw-medium border-0">
                                    <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                                    Chargement des utilisateurs...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="card-footer bg-white border-top border-light p-3 d-flex align-items-center justify-content-between rounded-bottom-4">
                    <span class="text-muted small fw-medium" id="mock-users-count">Chargement...</span>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="spUserModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4 sp-users-modal">
                <div class="modal-header border-bottom-0 pb-0 pt-4 px-4">
                    <h5 class="modal-title fw-bold text-dark fs-4" data-user-modal-title>Ajouter un employe</h5>
                    <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Fermer"></button>
                </div>
                <div class="modal-body p-4 pt-3">
                    <div class="alert d-none mb-3 rounded-3" data-user-modal-feedback role="alert"></div>

                    <form id="sp-user-form" novalidate>
                        <input type="hidden" name="user_id">

                        <div class="mb-3">
                            <label class="form-label fw-medium text-dark small mb-2">Nom complet</label>
                            <input type="text" class="form-control form-control-lg border-gray-200 shadow-none text-dark bg-light" name="name" autocomplete="off">
                            <div class="invalid-feedback" data-error-for="name"></div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-medium text-dark small mb-2">Role</label>
                            <select class="form-select form-select-lg border-gray-200 shadow-none text-dark bg-light" name="role">
                                <option value="">Choisir un role...</option>
                                <option value="gerant">Gerant</option>
                                <option value="employe">Employe</option>
                            </select>
                            <div class="invalid-feedback" data-error-for="role"></div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-medium text-dark small mb-2">Email</label>
                            <input type="email" class="form-control form-control-lg border-gray-200 shadow-none text-dark bg-light" name="email" autocomplete="off">
                            <div class="invalid-feedback" data-error-for="email"></div>
                        </div>

                        <div class="mb-2">
                            <label class="form-label fw-medium text-dark small mb-2">Telephone</label>
                            <input type="text" class="form-control form-control-lg border-gray-200 shadow-none text-dark bg-light" name="phone" autocomplete="off">
                            <div class="invalid-feedback" data-error-for="phone"></div>
                        </div>

                        <p class="small text-muted mt-3 mb-0" data-user-modal-permission-hint></p>

                        <div class="d-flex gap-2 pt-2 mt-3">
                            <button type="button" class="btn btn-light btn-lg flex-fill fw-medium transition-hover shadow-none border-0" data-users-modal-close data-bs-dismiss="modal">Annuler</button>
                            <button type="submit" class="btn btn-primary btn-lg flex-fill fw-medium transition-hover border-0 shadow-sm" data-users-submit-btn>
                                Ajouter
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('styles')
<style>
.sp-users-page .btn-primary {
    background-color: #f97316;
    border-color: #f97316;
}

.sp-users-page .btn-primary:hover,
.sp-users-page .btn-primary:focus {
    background-color: #ea580c;
    border-color: #ea580c;
}

.sp-users-page .btn-outline-primary {
    color: #f97316;
    border-color: #f97316;
}

.sp-users-page .btn-outline-primary:hover {
    color: #fff;
    background-color: #f97316;
    border-color: #f97316;
}

.sp-users-page .sp-users-table tbody td {
    padding-top: 0.9rem;
    padding-bottom: 0.9rem;
}

.sp-users-page .sp-users-table tbody tr:nth-child(odd) td {
    background: #fcfcfd;
}

.sp-users-page .sp-users-table tbody tr:hover td {
    background: #fff7ed;
}

.sp-users-modal {
    border-radius: 1rem !important;
    box-shadow: 0 18px 36px rgba(15, 23, 42, 0.16) !important;
}

.sp-users-modal .form-control:disabled,
.sp-users-modal .form-select:disabled {
    background-color: #f8fafc !important;
    color: #64748b;
    opacity: 1;
}
</style>
@endpush

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', () => {
    const userApi = window.spUserMock;
    if (!userApi) {
        return;
    }

    const refs = {
        feedback: document.querySelector('[data-users-feedback]'),
        permissionBanner: document.querySelector('[data-users-permission-banner]'),
        currentMeta: document.querySelector('[data-users-current-meta]'),
        search: document.querySelector('[data-users-search]'),
        openCreate: document.querySelector('[data-users-open-create]'),
        tbody: document.getElementById('mock-users-tbody'),
        count: document.getElementById('mock-users-count'),
        modal: document.getElementById('spUserModal'),
        modalTitle: document.querySelector('[data-user-modal-title]'),
        modalFeedback: document.querySelector('[data-user-modal-feedback]'),
        modalHint: document.querySelector('[data-user-modal-permission-hint]'),
        modalClose: document.querySelector('[data-users-modal-close]'),
        submitBtn: document.querySelector('[data-users-submit-btn]'),
        form: document.getElementById('sp-user-form'),
    };

    const state = {
        query: '',
        mode: 'create',
        editingUserId: null,
    };

    const roleLabels = {
        admin: 'Admin',
        gerant: 'Gerant',
        employe: 'Employe',
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+\d][\d\s().-]{7,}$/;

    const escapeHtml = (value) => String(value || '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

    const normalize = (value) => String(value || '').trim();

    const setFeedback = (node, message, tone = 'success') => {
        if (!node) {
            return;
        }

        if (!message) {
            node.className = 'alert d-none mb-3 rounded-3';
            node.textContent = '';
            return;
        }

        const toneClass = tone === 'danger' ? 'alert-danger' : tone === 'info' ? 'alert-info' : 'alert-success';
        node.className = `alert ${toneClass} mb-3 rounded-3`;
        node.textContent = message;
    };

    const clearFieldErrors = () => {
        refs.form.querySelectorAll('.is-invalid').forEach((field) => field.classList.remove('is-invalid'));
        refs.form.querySelectorAll('[data-error-for]').forEach((node) => {
            node.textContent = '';
        });
    };

    const setFieldError = (fieldName, message) => {
        const field = refs.form.elements[fieldName];
        const node = refs.form.querySelector(`[data-error-for="${fieldName}"]`);
        if (field) {
            field.classList.add('is-invalid');
        }
        if (node) {
            node.textContent = message;
        }
    };

    const closeModal = () => {
        refs.modalClose?.click();
    };

    const getPayload = () => ({
        name: normalize(refs.form.elements.name.value),
        role: normalize(refs.form.elements.role.value).toLowerCase(),
        email: normalize(refs.form.elements.email.value).toLowerCase(),
        phone: normalize(refs.form.elements.phone.value),
    });

    const validatePayload = (payload, permissions, mode) => {
        clearFieldErrors();
        setFeedback(refs.modalFeedback, '');

        if (!permissions.allowed) {
            setFeedback(refs.modalFeedback, permissions.reason || 'Action non autorisee.', 'danger');
            return false;
        }

        let isValid = true;

        if (mode === 'create' || permissions.canEditIdentity) {
            if (payload.name.length < 2) {
                setFieldError('name', 'Le nom complet doit contenir au moins 2 caracteres.');
                isValid = false;
            }
            if (!emailRegex.test(payload.email)) {
                setFieldError('email', 'Veuillez saisir un email valide.');
                isValid = false;
            }
            // Le téléphone est optionnel - valider seulement s'il est rempli
            if (payload.phone && !phoneRegex.test(payload.phone)) {
                setFieldError('phone', 'Veuillez saisir un numero de telephone valide.');
                isValid = false;
            }
        }

        if (mode === 'create' || permissions.canEditRole) {
            if (!['gerant', 'employe'].includes(payload.role)) {
                setFieldError('role', 'Le role doit etre Gerant ou Employe.');
                isValid = false;
            }
        }

        return isValid;
    };

    const formatDate = (isoString) => {
        if (!isoString) {
            return 'Jamais connecte';
        }

        const date = new Date(isoString);
        if (Number.isNaN(date.getTime())) {
            return 'Date invalide';
        }

        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const applyPermissionsToForm = (permissions) => {
        const identityLocked = !permissions.canEditIdentity && state.mode === 'edit';
        const roleLocked = !permissions.canEditRole && state.mode === 'edit';

        refs.form.elements.name.disabled = identityLocked;
        refs.form.elements.email.disabled = identityLocked;
        refs.form.elements.phone.disabled = identityLocked;
        refs.form.elements.role.disabled = roleLocked;

        refs.submitBtn.disabled = !permissions.allowed;

        if (state.mode === 'create') {
            refs.modalHint.textContent = 'Creation d\'un employe: tous les champs sont requis.';
            return;
        }

        if (permissions.mode === 'manager-role-only') {
            refs.modalHint.textContent = 'Mode Admin: seul le role est modifiable pour ce compte.';
            return;
        }

        if (permissions.mode === 'self') {
            refs.modalHint.textContent = 'Vous modifiez votre profil: role verrouille.';
            return;
        }

        refs.modalHint.textContent = permissions.reason || 'Vous ne disposez pas des permissions necessaires.';
    };

    const openCreateModal = () => {
        state.mode = 'create';
        state.editingUserId = null;

        refs.form.reset();
        refs.form.elements.user_id.value = '';
        refs.modalTitle.textContent = 'Ajouter un employe';
        refs.submitBtn.textContent = 'Ajouter';

        clearFieldErrors();
        setFeedback(refs.modalFeedback, '');

        applyPermissionsToForm({
            allowed: userApi.canManageUsers(),
            canEditIdentity: true,
            canEditRole: true,
            mode: 'create',
            reason: userApi.canManageUsers() ? '' : 'Seuls les comptes admin peuvent ajouter des employes.',
        });

        if (!userApi.canManageUsers()) {
            setFeedback(refs.modalFeedback, 'Permission refusee: seuls les admins peuvent ajouter des employes.', 'danger');
        }
    };

    const openEditModal = (userId) => {
        const users = userApi.getUsers();
        const user = users.find((item) => Number(item.id) === Number(userId));
        if (!user) {
            setFeedback(refs.feedback, 'Utilisateur introuvable.', 'danger');
            return;
        }

        state.mode = 'edit';
        state.editingUserId = user.id;

        refs.form.elements.user_id.value = String(user.id);
        refs.form.elements.name.value = user.name || '';
        refs.form.elements.role.value = user.role || '';
        refs.form.elements.email.value = user.email || '';
        refs.form.elements.phone.value = user.phone || '';

        refs.modalTitle.textContent = 'Modifier utilisateur';
        refs.submitBtn.textContent = 'Enregistrer';

        clearFieldErrors();
        setFeedback(refs.modalFeedback, '');

        const permissions = userApi.getEditPermissions(user.id);
        applyPermissionsToForm(permissions);

        if (!permissions.allowed) {
            setFeedback(refs.modalFeedback, permissions.reason || 'Action non autorisee.', 'danger');
        }
    };

    const renderPermissionBanner = () => {
        const canManage = userApi.canManageUsers();

        if (canManage) {
            refs.permissionBanner.classList.remove('d-none');
            refs.permissionBanner.textContent = 'Mode Admin actif: vous pouvez ajouter des employes et modifier les roles. Pour les autres comptes, nom/email/telephone restent verrouilles.';
            return;
        }

        refs.permissionBanner.classList.remove('d-none');
        refs.permissionBanner.textContent = 'Mode Employe actif: vous pouvez uniquement modifier votre propre profil. Les autres actions sont verrouillees.';
    };

    const updateCurrentMeta = () => {
        const current = userApi.getCurrentUser();
        const roleLabel = roleLabels[current.role] || current.role;
        refs.currentMeta.textContent = `Compte actif: ${current.name} (${roleLabel})`;

        refs.openCreate.disabled = !userApi.canManageUsers();
        refs.openCreate.title = userApi.canManageUsers()
            ? 'Ajouter un nouvel employe'
            : 'Action reservee a un admin';
    };

    const renderUsers = () => {
        const current = userApi.getCurrentUser();
        const canManage = userApi.canManageUsers();
        const query = state.query.toLowerCase();

        const users = userApi.getUsers().filter((user) => {
            if (!query) {
                return true;
            }

            const searchable = `${user.name} ${user.role} ${user.email} ${user.phone}`.toLowerCase();
            return searchable.includes(query);
        });

        refs.count.textContent = `Affichage de ${users.length} utilisateur(s)`;

        if (!users.length) {
            refs.tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-5 text-muted fw-medium border-0">Aucun utilisateur ne correspond a votre recherche.</td>
                </tr>
            `;
            return;
        }

        refs.tbody.innerHTML = users.map((user) => {
            const isActive = user.status === 'active';
            const isSelf = current.id === user.id;
            const permissions = userApi.getEditPermissions(user.id);
            const roleBadgeClass = user.role === 'admin'
                ? 'bg-danger-subtle text-danger border-danger-subtle'
                : user.role === 'gerant'
                    ? 'bg-primary-subtle text-primary border-primary-subtle'
                    : 'bg-warning-subtle text-warning border-warning-subtle';

            return `
                <tr>
                    <td class="ps-4">
                        <div class="d-flex align-items-center gap-3">
                            <img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.name)}" class="avatar avatar-md rounded-circle object-fit-cover">
                            <div>
                                <p class="mb-0 fw-semibold text-dark">${escapeHtml(user.name)} ${isSelf ? "<span class='text-muted small'>(Vous)</span>" : ''}</p>
                                <small class="text-secondary">Derniere connexion: ${escapeHtml(formatDate(user.lastLogin))}</small>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="badge ${roleBadgeClass} border rounded-pill px-3 py-1 fw-medium text-uppercase" style="font-size: 0.72rem;">${escapeHtml(roleLabels[user.role] || user.role)}</span>
                    </td>
                    <td><span class="text-dark">${escapeHtml(user.email)}</span></td>
                    <td><span class="text-dark">${escapeHtml(user.phone || '-')}</span></td>
                    <td>
                        ${canManage ? `
                            <div class="form-check form-switch m-0" title="${isActive ? 'Desactiver' : 'Activer'}">
                                <input class="form-check-input user-status-toggle shadow-none" type="checkbox" data-user-id="${user.id}" ${isActive ? 'checked' : ''} ${isSelf ? 'disabled' : ''}>
                                <label class="form-check-label small ms-2">${isActive ? 'Actif' : 'Inactif'}</label>
                            </div>
                        ` : `
                            <span class="badge ${isActive ? 'bg-success-subtle text-success border-success-subtle' : 'bg-secondary-subtle text-secondary border-secondary-subtle'} border rounded-pill px-3 py-2 fw-medium">
                                ${isActive ? 'Actif' : 'Inactif'}
                            </span>
                        `}
                    </td>
                    <td class="pe-4 text-end">
                        <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3 d-inline-flex align-items-center gap-1" data-users-action="edit" data-user-id="${user.id}" data-bs-toggle="modal" data-bs-target="#spUserModal" ${permissions.allowed ? '' : 'disabled'}>
                            <i class="ti ti-edit"></i>
                            Modifier
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    };

    refs.search.addEventListener('input', (event) => {
        state.query = normalize(event.target.value);
        renderUsers();
    });

    refs.openCreate.addEventListener('click', () => {
        openCreateModal();
    });

    refs.tbody.addEventListener('click', (event) => {
        const button = event.target.closest('[data-users-action="edit"]');
        if (!button) {
            return;
        }

        openEditModal(Number(button.dataset.userId));
    });

    refs.tbody.addEventListener('change', (event) => {
        const target = event.target;
        if (!target.classList.contains('user-status-toggle')) {
            return;
        }

        const userId = Number(target.dataset.userId);
        const nextStatus = target.checked ? 'active' : 'inactive';

        try {
            userApi.updateUserStatus(userId, nextStatus);
            setFeedback(refs.feedback, 'Statut utilisateur mis a jour.', 'success');
            renderUsers();
        } catch (error) {
            setFeedback(refs.feedback, error.message || 'Impossible de modifier le statut.', 'danger');
            renderUsers();
        }
    });

    refs.form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const payload = getPayload();

        if (state.mode === 'create') {
            const permissions = {
                allowed: userApi.canManageUsers(),
                canEditIdentity: true,
                canEditRole: true,
                mode: 'create',
                reason: 'Seuls les admins peuvent ajouter des employes.',
            };

            if (!validatePayload(payload, permissions, 'create')) {
                return;
            }

            try {
                await userApi.addUser(payload);
                setFeedback(refs.feedback, 'Employe ajoute avec succes.', 'success');
                closeModal();
                renderUsers();
            } catch (error) {
                setFeedback(refs.modalFeedback, error.message || 'Ajout impossible.', 'danger');
            }

            return;
        }

        const permissions = userApi.getEditPermissions(state.editingUserId);
        if (!validatePayload(payload, permissions, 'edit')) {
            return;
        }

        try {
            await userApi.updateUser(state.editingUserId, payload);
            setFeedback(refs.feedback, 'Utilisateur mis a jour avec succes.', 'success');
            closeModal();
            renderUsers();
            updateCurrentMeta();
        } catch (error) {
            setFeedback(refs.modalFeedback, error.message || 'Modification impossible.', 'danger');
        }
    });

    window.addEventListener('stockpilot:user-state-changed', () => {
        updateCurrentMeta();
        renderPermissionBanner();
        renderUsers();
    });

    updateCurrentMeta();
    renderPermissionBanner();
    openCreateModal();
    renderUsers();
});
</script>
@endpush
