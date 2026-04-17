@extends('layouts.app')

@section('title', 'Parametres - StockPilot')

@section('content')
<div class="container-fluid sp-page" data-sp-page="settings">
    <div class="row align-items-center justify-content-between mb-4">
        <div class="col-12 col-md-8">
            <h1 class="fs-3 fw-bold mb-1 text-dark">Parametres du compte</h1>
            <p class="mb-0 text-muted">Gerez vos informations personnelles, votre mot de passe et les preferences de votre interface.</p>
        </div>
    </div>

    <div class="row g-4">
        <div class="col-12 col-xl-3">
            <div class="card border-0 shadow-sm rounded-4 sticky-xl-top" style="top: 80px;">
                <div class="card-body p-3">
                    <ul class="nav nav-pills flex-column sp-settings-nav gap-1" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link w-100 text-start active d-flex align-items-center gap-2 rounded-3 text-dark fw-medium" data-bs-toggle="pill" data-bs-target="#profile" type="button" role="tab">
                                <i class="ti ti-user-circle fs-5 text-muted"></i> Profil public
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link w-100 text-start d-flex align-items-center gap-2 rounded-3 text-dark fw-medium" data-bs-toggle="pill" data-bs-target="#security" type="button" role="tab">
                                <i class="ti ti-shield-lock fs-5 text-muted"></i> Securite & Mot de passe
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link w-100 text-start d-flex align-items-center gap-2 rounded-3 text-dark fw-medium" data-bs-toggle="pill" data-bs-target="#preferences" type="button" role="tab">
                                <i class="ti ti-adjustments fs-5 text-muted"></i> Preferences
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="col-12 col-xl-9">
            <div class="tab-content">
                <div class="tab-pane fade show active" id="profile" role="tabpanel">
                    <div class="card border-0 shadow-sm rounded-4 mb-4">
                        <form id="mock-profile-form" novalidate>
                            <div class="card-header bg-transparent border-bottom border-light pt-4 pb-3 px-4">
                                <h2 class="h5 fw-bold mb-0 text-dark">Informations personnelles</h2>
                            </div>
                            <div class="card-body p-4 p-md-5">
                                <div class="alert d-none mb-4 rounded-3" data-profile-feedback role="alert"></div>

                                <div class="d-flex align-items-center gap-4 mb-5 pb-4 border-bottom border-light">
                                    <div class="position-relative">
                                        <img src="" alt="Avatar" data-sp-user="avatar" class="rounded-circle object-fit-cover shadow-sm border border-2 border-white" width="96" height="96">
                                        <button type="button" class="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0 shadow-sm p-2 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; margin-bottom: -5px; margin-right: -5px;">
                                            <i class="ti ti-camera"></i>
                                        </button>
                                    </div>
                                    <div>
                                        <h3 class="h5 fw-bold mb-1" data-sp-user="name">Chargement...</h3>
                                        <p class="text-muted small mb-3 mb-md-0" data-sp-user="role">Chargement...</p>
                                        <button type="button" class="btn btn-outline-secondary btn-sm bg-white rounded-3 fw-medium">Changer d'avatar</button>
                                    </div>
                                </div>

                                <div class="row g-4">
                                    <div class="col-md-6">
                                        <label class="form-label fw-medium text-muted small mb-2">Nom complet</label>
                                        <input type="text" name="name" class="form-control form-control-lg border-gray-300 shadow-none text-dark" required>
                                        <div class="invalid-feedback" data-profile-error-for="name"></div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-medium text-muted small mb-2">Adresse Email</label>
                                        <input type="email" name="email" class="form-control form-control-lg border-gray-300 shadow-none text-dark" required>
                                        <div class="invalid-feedback" data-profile-error-for="email"></div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-medium text-muted small mb-2">Titre du poste (optionnel)</label>
                                        <input type="text" id="setting-jobTitle" class="form-control form-control-lg border-gray-300 shadow-none text-dark" autocomplete="off">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-medium text-muted small mb-2">Numero de telephone</label>
                                        <input type="text" id="setting-phone" name="phone" class="form-control form-control-lg border-gray-300 shadow-none text-dark" required>
                                        <div class="invalid-feedback" data-profile-error-for="phone"></div>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label fw-medium text-muted small mb-2">Biographie courte</label>
                                        <textarea id="setting-bio" class="form-control border-gray-300 shadow-none text-dark" rows="3"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer bg-light border-top-0 p-4 text-end rounded-bottom-4">
                                <button type="submit" class="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm rounded-3 px-4 py-2 fw-medium transition-hover">
                                    <i class="ti ti-device-floppy"></i>
                                    Sauvegarder le profil
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="tab-pane fade" id="security" role="tabpanel">
                    <div class="card border-0 shadow-sm rounded-4 mb-4">
                        <form id="mock-password-form" novalidate>
                            <div class="card-header bg-transparent border-bottom border-light pt-4 pb-3 px-4">
                                <h2 class="h5 fw-bold mb-0 text-dark">Modifier le mot de passe</h2>
                            </div>
                            <div class="card-body p-4 p-md-5">
                                <div class="alert d-none mb-4 rounded-3" data-password-feedback role="alert"></div>

                                <div class="row g-4">
                                    <div class="col-12">
                                        <label class="form-label fw-medium text-muted small mb-2">Ancien mot de passe</label>
                                        <input type="password" name="old_password" class="form-control form-control-lg border-gray-300 shadow-none text-dark" autocomplete="current-password" required>
                                        <div class="invalid-feedback" data-password-error-for="old_password"></div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-medium text-muted small mb-2">Nouveau mot de passe</label>
                                        <input type="password" name="new_password" class="form-control form-control-lg border-gray-300 shadow-none text-dark" autocomplete="new-password" required>
                                        <div class="form-text small mt-2"><i class="ti ti-info-circle"></i> Minimum 8 caracteres.</div>
                                        <div class="invalid-feedback" data-password-error-for="new_password"></div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-medium text-muted small mb-2">Confirmation du nouveau mot de passe</label>
                                        <input type="password" name="new_password_confirmation" class="form-control form-control-lg border-gray-300 shadow-none text-dark" autocomplete="new-password" required>
                                        <div class="invalid-feedback" data-password-error-for="new_password_confirmation"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer bg-light border-top-0 p-4 text-end rounded-bottom-4">
                                <button type="submit" class="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm rounded-3 px-4 py-2 fw-medium transition-hover">
                                    <i class="ti ti-lock"></i>
                                    Mettre a jour
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="tab-pane fade" id="preferences" role="tabpanel">
                    <div class="card border-0 shadow-sm rounded-4 mb-4">
                        <div class="card-header bg-transparent border-bottom border-light pt-4 pb-3 px-4">
                            <h2 class="h5 fw-bold mb-0 text-dark">Preferences de l'application</h2>
                        </div>
                        <div class="card-body p-4 p-md-5">
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <div class="card bg-light border-0 rounded-4 p-4 h-100">
                                        <h4 class="h6 fw-bold mb-3">Notifications email</h4>
                                        <div class="form-check form-switch mb-3">
                                            <input class="form-check-input" type="checkbox" id="notif-stock" checked>
                                            <label class="form-check-label text-dark" for="notif-stock">Alertes de stock bas</label>
                                        </div>
                                        <div class="form-check form-switch mb-3">
                                            <input class="form-check-input" type="checkbox" id="notif-orders" checked>
                                            <label class="form-check-label text-dark" for="notif-orders">Nouvelles commandes</label>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="notif-login">
                                            <label class="form-check-label text-dark" for="notif-login">Connexions suspectes</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card bg-light border-0 rounded-4 p-4 h-100">
                                        <h4 class="h6 fw-bold mb-3">Affichage</h4>
                                        <div class="mb-3">
                                            <label class="form-label fw-medium text-muted small mb-2">Theme par defaut</label>
                                            <select class="form-select border-gray-300 shadow-none">
                                                <option value="light">Clair</option>
                                                <option value="dark">Sombre (Bientot)</option>
                                                <option value="auto">Systeme</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="form-label fw-medium text-muted small mb-2">Langue principale</label>
                                            <select class="form-select border-gray-300 shadow-none">
                                                <option value="fr" selected>Francais</option>
                                                <option value="en">English</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', () => {
    const userApi = window.spUserMock;
    if (!userApi) {
        return;
    }

    const refs = {
        profileForm: document.getElementById('mock-profile-form'),
        profileFeedback: document.querySelector('[data-profile-feedback]'),
        passwordForm: document.getElementById('mock-password-form'),
        passwordFeedback: document.querySelector('[data-password-feedback]'),
        profileName: document.querySelector('[data-sp-user="name"]'),
        profileRole: document.querySelector('[data-sp-user="role"]'),
        profileAvatar: document.querySelector('[data-sp-user="avatar"]'),
        profileNameInput: document.querySelector('#mock-profile-form [name="name"]'),
        profileEmailInput: document.querySelector('#mock-profile-form [name="email"]'),
        profilePhoneInput: document.getElementById('setting-phone'),
        profileJobInput: document.getElementById('setting-jobTitle'),
        profileBioInput: document.getElementById('setting-bio'),
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+\d][\d\s().-]{7,}$/;

    const clearErrors = (form, selector) => {
        form.querySelectorAll('.is-invalid').forEach((field) => field.classList.remove('is-invalid'));
        form.querySelectorAll(selector).forEach((node) => {
            node.textContent = '';
        });
    };

    const setError = (form, fieldName, message, selectorPrefix) => {
        const field = form.querySelector(`[name="${fieldName}"]`) || document.getElementById(fieldName);
        const node = form.querySelector(`[${selectorPrefix}="${fieldName}"]`);

        if (field) {
            field.classList.add('is-invalid');
        }
        if (node) {
            node.textContent = message;
        }
    };

    const setFeedback = (node, message, tone = 'success') => {
        if (!node) {
            return;
        }

        if (!message) {
            node.className = 'alert d-none mb-4 rounded-3';
            node.textContent = '';
            return;
        }

        const toneClass = tone === 'danger' ? 'alert-danger' : 'alert-success';
        node.className = `alert ${toneClass} mb-4 rounded-3`;
        node.textContent = message;
    };

    const loadProfile = () => {
        const currentUser = userApi.getCurrentUser();
        const settings = userApi.getSettings();

        refs.profileName.textContent = currentUser.name;
        refs.profileRole.textContent = userApi.getRoleLabel(currentUser.role);
        refs.profileAvatar.src = currentUser.avatar;

        refs.profileNameInput.value = currentUser.name;
        refs.profileEmailInput.value = currentUser.email;
        refs.profilePhoneInput.value = currentUser.phone || settings.userProfile.phone || '';
        refs.profileJobInput.value = settings.userProfile.jobTitle || '';
        refs.profileBioInput.value = settings.userProfile.bio || '';
    };

    refs.profileForm?.addEventListener('submit', (event) => {
        event.preventDefault();

        clearErrors(refs.profileForm, '[data-profile-error-for]');
        setFeedback(refs.profileFeedback, '');

        const payload = {
            name: String(refs.profileNameInput.value || '').trim(),
            email: String(refs.profileEmailInput.value || '').trim().toLowerCase(),
            phone: String(refs.profilePhoneInput.value || '').trim(),
        };

        const profileSettings = {
            jobTitle: String(refs.profileJobInput.value || '').trim(),
            bio: String(refs.profileBioInput.value || '').trim(),
            phone: payload.phone,
        };

        let valid = true;

        if (payload.name.length < 2) {
            setError(refs.profileForm, 'name', 'Le nom doit contenir au moins 2 caracteres.', 'data-profile-error-for');
            valid = false;
        }

        if (!emailRegex.test(payload.email)) {
            setError(refs.profileForm, 'email', 'Veuillez saisir un email valide.', 'data-profile-error-for');
            valid = false;
        }

        if (!phoneRegex.test(payload.phone)) {
            setError(refs.profileForm, 'phone', 'Veuillez saisir un numero de telephone valide.', 'data-profile-error-for');
            valid = false;
        }

        if (!valid) {
            return;
        }

        try {
            userApi.updateCurrentUser(payload);
            userApi.updateSettings({ userProfile: profileSettings });
            setFeedback(refs.profileFeedback, 'Profil mis a jour avec succes.', 'success');
            loadProfile();
        } catch (error) {
            setFeedback(refs.profileFeedback, error.message || 'Impossible de mettre a jour le profil.', 'danger');
        }
    });

    refs.passwordForm?.addEventListener('submit', (event) => {
        event.preventDefault();

        clearErrors(refs.passwordForm, '[data-password-error-for]');
        setFeedback(refs.passwordFeedback, '');

        const oldPassword = String(refs.passwordForm.elements.old_password.value || '').trim();
        const newPassword = String(refs.passwordForm.elements.new_password.value || '').trim();
        const confirmPassword = String(refs.passwordForm.elements.new_password_confirmation.value || '').trim();

        let valid = true;

        if (!oldPassword) {
            setError(refs.passwordForm, 'old_password', 'L\'ancien mot de passe est obligatoire.', 'data-password-error-for');
            valid = false;
        }

        if (newPassword.length < 8) {
            setError(refs.passwordForm, 'new_password', 'Le nouveau mot de passe doit contenir au moins 8 caracteres.', 'data-password-error-for');
            valid = false;
        }

        if (confirmPassword !== newPassword) {
            setError(refs.passwordForm, 'new_password_confirmation', 'La confirmation ne correspond pas.', 'data-password-error-for');
            valid = false;
        }

        if (!valid) {
            return;
        }

        try {
            userApi.changePassword({
                oldPassword,
                newPassword,
                confirmPassword,
            });
            refs.passwordForm.reset();
            setFeedback(refs.passwordFeedback, 'Mot de passe mis a jour avec succes.', 'success');
        } catch (error) {
            setFeedback(refs.passwordFeedback, error.message || 'Mise a jour impossible.', 'danger');
        }
    });

    window.addEventListener('stockpilot:user-state-changed', () => {
        loadProfile();
    });

    loadProfile();
});
</script>
@endpush

@push('styles')
<style>
.sp-settings-nav .nav-link {
    color: #4b5563;
    padding: 0.75rem 1rem;
    transition: all 0.2s ease;
}

.sp-settings-nav .nav-link:hover {
    background-color: #f3f4f6;
    color: #111827;
}

.sp-settings-nav .nav-link.active {
    background-color: rgba(var(--bs-primary-rgb), 0.1);
    color: var(--bs-primary);
    font-weight: 600 !important;
}

.sp-settings-nav .nav-link.active i {
    color: var(--bs-primary) !important;
}
</style>
@endpush
