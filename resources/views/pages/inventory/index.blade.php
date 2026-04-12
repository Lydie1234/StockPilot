@extends('layouts.app')

@section('title', 'Inventaire - InApp Inventaire')

@php
    $isGerant = auth()->check() && in_array(auth()->user()->role, ['gerant', 'admin']);
@endphp

@section('content')
<div class="container-fluid sp-page" data-sp-page="inventory">
    <!-- Header Section -->
    <div class="row align-items-center mb-4">
        <div class="col-12 col-md-5 mb-3 mb-md-0">
            <h1 class="fs-3 fw-bold mb-1 text-dark">Inventaire</h1>
            <p class="mb-0 text-muted">Aperçu global, filtrage ciblé et gestion de vos produits.</p>
        </div>
        <div class="col-12 col-md-7 d-flex flex-wrap justify-content-md-end gap-2 mt-3 mt-md-0">
            <button type="button" class="btn border-0 shadow-sm rounded-3 px-3 py-2 fw-medium transition-hover d-inline-flex align-items-center gap-2" style="background-color: #e0f2fe; color: #0284c7;" data-bs-toggle="modal" data-bs-target="#spMovementModal">
                <i class="ti ti-transfer-in fs-5"></i> Opérer un mouvement
            </button>
            @if($isGerant)
            <button type="button" class="btn btn-light bg-white border border-gray-200 shadow-sm rounded-3 px-3 py-2 fw-medium transition-hover text-dark d-inline-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#spCategoryModal">
                <i class="ti ti-tags text-muted fs-5"></i> Nouvelle catégorie
            </button>
            <a href="{{ route('pages.inventory.create') }}" class="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm rounded-3 px-3 py-2 fw-medium transition-hover">
                <i class="ti ti-plus fs-5"></i> Produit
            </a>
            @endif
        </div>
    </div>

    <!-- Main KPI Cards -->
    <div class="row g-4 mb-4">
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="card border-0 shadow-sm rounded-4 sp-kpi-card sp-kpi-info h-100 transition-hover">
                <div class="card-body p-4 d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="icon-shape bg-info bg-opacity-10 text-info rounded-circle p-3 d-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
                            <i class="ti ti-box fs-3"></i>
                        </div>
                    </div>
                    <div>
                        <h2 class="text-muted fs-6 mb-1 fw-medium tracking-wide text-uppercase" style="letter-spacing: 0.5px;">Total produits</h2>
                        <h3 class="fw-bold mb-0 text-dark fs-2" data-sp-products-count>--</h3>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 col-sm-6 col-xl-3">
            <div class="card border-0 shadow-sm rounded-4 sp-kpi-card sp-kpi-danger h-100 transition-hover">
                <div class="card-body p-4 d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="icon-shape bg-danger bg-opacity-10 text-danger rounded-circle p-3 d-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
                            <i class="ti ti-alert-triangle fs-3"></i>
                        </div>
                        <span class="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-3 py-2 fw-medium">Rupture</span>
                    </div>
                    <div>
                        <h2 class="text-muted fs-6 mb-1 fw-medium tracking-wide text-uppercase" style="letter-spacing: 0.5px;">En rupture</h2>
                        <h3 class="fw-bold mb-0 text-dark fs-2" data-sp-critical-count>--</h3>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 col-sm-6 col-xl-3">
            <div class="card border-0 shadow-sm rounded-4 sp-kpi-card sp-kpi-warning h-100 transition-hover">
                <div class="card-body p-4 d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="icon-shape bg-warning bg-opacity-10 text-warning rounded-circle p-3 d-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
                            <i class="ti ti-alert-circle fs-3"></i>
                        </div>
                        <span class="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-3 py-2 fw-medium">Sous seuil</span>
                    </div>
                    <div>
                        <h2 class="text-muted fs-6 mb-1 fw-medium tracking-wide text-uppercase" style="letter-spacing: 0.5px;">Stocks faibles</h2>
                        <h3 class="fw-bold mb-0 text-dark fs-2" data-sp-low-count>--</h3>
                    </div>
                </div>
            </div>
        </div>

        @if($isGerant)
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="card border-0 shadow-sm rounded-4 sp-kpi-card sp-kpi-success h-100 transition-hover">
                <div class="card-body p-4 d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="icon-shape bg-success bg-opacity-10 text-success rounded-circle p-3 d-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
                            <i class="ti ti-cash fs-3"></i>
                        </div>
                    </div>
                    <div>
                        <h2 class="text-muted fs-6 mb-1 fw-medium tracking-wide text-uppercase" style="letter-spacing: 0.5px;">Valeur globale</h2>
                        <h3 class="fw-bold mb-0 text-dark fs-3 text-truncate" data-sp-total-value title="Valeur du stock">--</h3>
                    </div>
                </div>
            </div>
        </div>
        @endif
    </div>

    <!-- Filters & Table -->
    <div class="row g-4 sp-inventory-grid">
        <div class="col-12">
            <!-- Filter Toolbar -->
            <div class="card border-0 shadow-sm rounded-4 mb-4 sp-inventory-toolbar-card">
                <div class="card-body p-4">
                    <div class="row g-3 align-items-end">
                        <div class="col-12 col-lg-5">
                            <label class="form-label fw-medium text-muted small mb-2">Rechercher</label>
                            <div class="input-group input-group-lg sp-input-group-soft shadow-none">
                                <span class="input-group-text border-end-0 bg-transparent text-muted"><i class="ti ti-search px-1"></i></span>
                                <input type="text" class="form-control border-start-0 ps-0" placeholder="Nom du produit ou SKU..." data-sp-search>
                            </div>
                        </div>
                        <div class="col-6 col-lg-3">
                            <label class="form-label fw-medium text-muted small mb-2">Statut</label>
                            <select class="form-select form-select-lg shadow-none border-gray-300 text-dark" data-sp-status-filter>
                                <option value="">Tous les statuts</option>
                                <option value="critique">Critique</option>
                                <option value="faible">Faible</option>
                                <option value="normal">Normal</option>
                            </select>
                        </div>
                        <div class="col-6 col-lg-3">
                            <label class="form-label fw-medium text-muted small mb-2">Catégorie</label>
                            <select class="form-select form-select-lg shadow-none border-gray-300 text-dark" data-sp-category-filter>
                                <option value="">Toutes</option>
                            </select>
                        </div>
                        <div class="col-12 col-lg-1 d-flex flex-column justify-content-end">
                            <button class="btn btn-light btn-lg w-100 d-flex align-items-center justify-content-center text-muted transition-hover shadow-none" type="button" data-sp-reset-filters title="Réinitialiser les filtres">
                                <i class="ti ti-refresh"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Table Wrapper -->
            <div class="card border-0 shadow-sm rounded-4 sp-inventory-table-card overflow-hidden d-none d-lg-block">
                <div class="table-responsive">
                    <table class="table table-hover align-middle sp-inventory-table mb-0">
                        <thead class="bg-light">
                            <tr>
                                <th class="text-uppercase fw-semibold text-muted small py-3 ps-4 border-0 tracking-wide">Nom produit</th>
                                <th class="text-uppercase fw-semibold text-muted small py-3 border-0 tracking-wide">Catégorie</th>
                                <th class="text-uppercase fw-semibold text-muted small py-3 border-0 tracking-wide">En stock</th>
                                <th class="text-uppercase fw-semibold text-muted small py-3 border-0 tracking-wide">Seuil</th>
                                <th class="text-uppercase fw-semibold text-muted small py-3 border-0 tracking-wide">Statut</th>
                                <th class="text-uppercase fw-semibold text-muted small py-3 pe-4 border-0 text-end tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody data-sp-products-body class="border-top-0">
                            <tr>
                                <td colspan="6" class="text-center py-5 text-muted fw-medium">
                                    <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                                    Chargement des produits...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Mobile View -->
            <div class="d-lg-none" data-sp-products-cards>
                <div class="card border-0 shadow-sm rounded-4 mb-3">
                    <div class="card-body p-4 text-center text-muted fw-medium py-5">
                        <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                        Chargement des produits...
                    </div>
                </div>
            </div>

            <!-- Empty state -->
            <div class="card border-0 shadow-sm rounded-4 mt-3 d-none sp-inventory-empty bg-light" data-sp-empty-state>
                <div class="card-body text-center p-5">
                    <div class="icon-shape bg-white text-muted rounded-circle p-4 mb-3 mx-auto d-inline-flex shadow-sm" style="width: 72px; height: 72px;">
                        <i class="ti ti-search fs-2"></i>
                    </div>
                    <h3 class="h5 fw-bold text-dark">Aucun produit trouvé</h3>
                    <p class="text-muted mb-0">Essayez de modifier vos filtres ou d'ajouter un nouveau produit.</p>
                </div>
            </div>
        </div>
    </div>


    <div class="d-none">
        <ul class="list-group" data-sp-category-list>
            <li></li>
        </ul>
    </div>

    <!-- Modales -->
    <div class="modal fade" id="spMovementModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4 sp-modern-modal">
                <div class="modal-header border-bottom-0 pb-0 pt-4 px-4">
                    <h5 class="modal-title fw-bold text-dark fs-4">Mouvement de stock</h5>
                    <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Cancel"></button>
                </div>
                <div class="modal-body p-4 pt-3">
                    <form data-sp-movement-form>
                        <div class="mb-4">
                            <label class="form-label fw-medium text-dark small mb-2">Sélectionnez le produit</label>
                            <select class="form-select form-select-lg border-gray-200 shadow-none text-dark bg-light" name="product_id" data-sp-movement-product required>
                                <option value="">Choisir un produit...</option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-medium text-dark small mb-2">Type d'opération</label>
                            <select class="form-select form-select-lg border-gray-200 shadow-none text-dark bg-light" name="type" data-sp-movement-type required>
                                <option value="sortie">Sortie de stock (Vente)</option>
                                <option value="entree">Entrée en stock (Réappro)</option>
                                <option value="ajustement">Ajustement (Inventaire)</option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-medium text-dark small mb-2" data-sp-movement-quantity-label>Quantité</label>
                            <input type="number" name="quantity" class="form-control form-control-lg border-gray-200 shadow-none text-dark bg-light" min="0" step="0.01" placeholder="Ex: 10" required>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-medium text-dark small mb-2">Motif détaillé (Optionnel)</label>
                            <textarea name="reason" class="form-control border-gray-200 shadow-none text-dark bg-light" rows="2" placeholder="Ex: Vente au comptoir, Casse..."></textarea>
                        </div>

                        <div class="d-flex gap-2 pt-2 mt-2">
                            <button type="button" class="btn btn-light btn-lg flex-fill fw-medium transition-hover shadow-none border-0" data-bs-dismiss="modal">Annuler</button>
                            <button class="btn btn-primary btn-lg flex-fill fw-medium transition-hover border-0 shadow-sm" type="submit">
                                Valider
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    @if($isGerant)
    <div class="modal fade" id="spCategoryModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4 sp-modern-modal">
                <div class="modal-header border-bottom-0 pb-0 pt-4 px-4">
                    <h5 class="modal-title fw-bold text-dark fs-4">Nouvelle catégorie</h5>
                    <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Cancel"></button>
                </div>
                <div class="modal-body p-4 pt-3">
                    <form data-sp-category-form>
                        <div class="mb-4">
                            <label class="form-label fw-medium text-dark small mb-2">Nom de la catégorie</label>
                            <input type="text" class="form-control form-control-lg border-gray-200 shadow-none text-dark bg-light" name="category_name" placeholder="Ex: Électronique" required autocomplete="off">
                        </div>
                        <div class="mb-4">
                            <label class="form-label fw-medium text-dark small mb-2">Description (optionnel)</label>
                            <textarea class="form-control border-gray-200 shadow-none text-dark bg-light" name="category_description" rows="3" placeholder="Brève description..."></textarea>
                        </div>

                        <div class="d-flex gap-2 pt-2 mt-2">
                            <button type="button" class="btn btn-light btn-lg flex-fill fw-medium transition-hover shadow-none border-0" data-bs-dismiss="modal">Annuler</button>
                            <button class="btn btn-primary btn-lg flex-fill fw-medium transition-hover border-0 shadow-sm" type="submit">
                                Valider
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    @endif


    @if($isGerant)
    <div class="modal fade" id="spEditProductModal" tabindex="-1" aria-hidden="true" data-sp-edit-card>
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content border-0 shadow-lg rounded-4 sp-modern-modal">
                <div class="modal-header border-bottom-0 pb-0 pt-4 px-4">
                    <h5 class="modal-title fw-bold text-dark fs-4">Modifier produit</h5>
                    <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" data-sp-edit-cancel aria-label="Cancel"></button>
                </div>
                <div class="modal-body p-4 pt-3">
                    <form data-sp-edit-form>
                        <input type="hidden" name="product_id">
                        <div class="row g-4 mb-4">
                            <div class="col-md-6">
                                <label class="form-label fw-medium text-dark small mb-2">Nom</label>
                                <input class="form-control form-control-lg border-gray-200 shadow-none text-dark bg-light" name="name" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-medium text-dark small mb-2">Catégorie</label>
                                <select class="form-select form-select-lg border-gray-200 shadow-none text-dark bg-light" name="category_id" data-sp-edit-category required></select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-medium text-dark small mb-2">Unité</label>
                                <input class="form-control form-control-lg border-gray-200 shadow-none text-dark bg-light" name="unit" required placeholder="Ex: pcs, kg...">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-medium text-dark small mb-2">Stock actuel</label>
                                <input type="number" step="0.01" min="0" class="form-control form-control-lg border-gray-200 shadow-none text-dark bg-light" name="current_stock" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-medium text-dark small mb-2">Seuil d'alerte</label>
                                <input type="number" step="0.01" min="0" class="form-control form-control-lg border-gray-200 shadow-none text-dark bg-light" name="alert_threshold" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-medium text-dark small mb-2">Prix unitaire</label>
                                <input type="number" step="0.01" min="0" class="form-control form-control-lg border-gray-200 shadow-none text-dark bg-light" name="unit_price" required>
                            </div>
                        </div>

                        <div class="d-flex gap-2 pt-2 mt-2">
                            <button type="button" class="btn btn-light btn-lg flex-fill fw-medium transition-hover shadow-none border-0" data-bs-dismiss="modal" data-sp-edit-cancel>Annuler</button>
                            <button class="btn btn-primary btn-lg flex-fill fw-medium transition-hover border-0 shadow-sm" type="submit">
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    @endif

    <div class="modal fade" id="spProductDetailsModal" tabindex="-1" aria-hidden="true" data-sp-product-modal>
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header border-0 pb-0">
                    <div>
                        <h2 class="h5 mb-1" data-sp-modal-title>Produit</h2>
                        <p class="small text-secondary mb-0" data-sp-modal-sku>SKU</p>
                    </div>
                    <button type="button" class="btn btn-sm btn-light" data-bs-dismiss="modal" aria-label="Fermer">
                        <i class="ti ti-x"></i>
                    </button>
                </div>
                <div class="modal-body pt-3">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <p class="small text-uppercase text-secondary fw-semibold mb-0">Statut</p>
                        <span data-sp-modal-status></span>
                    </div>

                    <div class="sp-inventory-modal-grid">
                        <div>
                            <p class="small text-secondary mb-1">Categorie</p>
                            <p class="mb-0 fw-semibold" data-sp-modal-category>-</p>
                        </div>
                        <div>
                            <p class="small text-secondary mb-1">Stock actuel</p>
                            <p class="mb-0 fw-semibold" data-sp-modal-stock>-</p>
                        </div>
                        <div>
                            <p class="small text-secondary mb-1">Seuil</p>
                            <p class="mb-0 fw-semibold" data-sp-modal-threshold>-</p>
                        </div>
                        @if($isGerant)
                        <div>
                            <p class="small text-secondary mb-1">Prix unitaire</p>
                            <p class="mb-0 fw-semibold" data-sp-modal-price>-</p>
                        </div>
                        @endif
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-outline-primary" data-sp-modal-prefill>
                        <i class="ti ti-transfer-in me-1"></i> Ajouter un mouvement
                    </button>
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Fermer</button>
                </div>
            </div>
        </div>
    </div>
</div>

@push('styles')
<style>
/* Modern Modal SaaS UI */
.sp-modern-modal {
    border-radius: 1.25rem !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
    transform: scale(0.95);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
}

.modal.show .sp-modern-modal {
    transform: scale(1);
}

.modal-backdrop {
    background-color: rgba(15, 23, 42, 0.6) !important;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}
.modal-backdrop.show {
    opacity: 1 !important;
}

.sp-modern-modal .form-control,
.sp-modern-modal .form-select {
    border-radius: 0.75rem;
    padding: 0.8rem 1rem;
}

.sp-modern-modal .form-control:focus,
.sp-modern-modal .form-select:focus {
    border-color: #f97316;
    box-shadow: 0 0 0 0.25rem rgba(249, 115, 22, 0.15);
}

.sp-modern-modal .btn {
    border-radius: 0.75rem;
    padding: 0.8rem 1.5rem;
    transition: all 0.2s ease;
}

.sp-modern-modal .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.sp-modern-modal .btn-close {
    background-color: #f1f5f9;
    opacity: 0.7;
    border-radius: 50%;
    margin-top: auto;
    margin-bottom: auto;
    transition: transform 0.2s ease, opacity 0.2s ease;
}
.sp-modern-modal .btn-close:hover {
    opacity: 1;
    transform: rotate(90deg);
}

/* Micro-interaction on trigger buttons */
.transition-hover {
    transition: all 0.2s ease;
}
.transition-hover:hover {
    transform: translateY(-2px);
}

/* -------------------------------------
   COLOR CORRECTIONS (ORANGE DOMINANT)
---------------------------------------- */
:root {
    --sp-orange: #f97316; /* Orange principal */
    --sp-orange-hover: #ea580c; 
    --sp-orange-light: #fff7ed;
    --sp-orange-border: #fed7aa;
}

.btn-primary, .sp-btn-orange {
    background-color: var(--sp-orange) !important;
    border-color: var(--sp-orange) !important;
    color: #fff !important;
}
.btn-primary:hover, .sp-btn-orange:hover {
    background-color: var(--sp-orange-hover) !important;
    border-color: var(--sp-orange-hover) !important;
}
.btn-outline-primary {
    color: var(--sp-orange) !important;
    border-color: var(--sp-orange) !important;
}
.btn-outline-primary:hover {
    background-color: var(--sp-orange) !important;
    color: #fff !important;
}
.text-primary {
    color: var(--sp-orange) !important;
}
.bg-primary {
    background-color: var(--sp-orange) !important;
}

/* Table Badge Status Formatting */
.sp-badge-critique {
    background-color: #fef2f2 !important;
    color: #ef4444 !important;
    border: 1px solid #fee2e2 !important;
    padding: 0.35em 0.75em !important;
    border-radius: 50rem !important;
    font-weight: 600 !important;
    font-size: 0.85em;
    display: inline-flex;
    align-items: center;
}
.sp-badge-faible {
    background-color: var(--sp-orange-light) !important;
    color: var(--sp-orange) !important;
    border: 1px solid var(--sp-orange-border) !important;
    padding: 0.35em 0.75em !important;
    border-radius: 50rem !important;
    font-weight: 600 !important;
    font-size: 0.85em;
    display: inline-flex;
    align-items: center;
}
.sp-badge-normal {
    background-color: #f0fdf4 !important;
    color: #22c55e !important;
    border: 1px solid #dcfce7 !important;
    padding: 0.35em 0.75em !important;
    border-radius: 50rem !important;
    font-weight: 600 !important;
    font-size: 0.85em;
    display: inline-flex;
    align-items: center;
}

.sp-status-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 6px;
}
.sp-badge-critique .sp-status-dot { background-color: #ef4444; }
.sp-badge-faible .sp-status-dot { background-color: var(--sp-orange); }
.sp-badge-normal .sp-status-dot { background-color: #22c55e; }

/* Table Readability */
.sp-inventory-table {
    border-collapse: separate;
    border-spacing: 0;
}
.sp-inventory-table thead th {
    background-color: #f8fafc;
    border-bottom: 2px solid #e2e8f0 !important;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
}
.sp-inventory-table tbody tr {
    transition: background-color 0.15s ease;
}
.sp-inventory-table tbody tr:nth-of-type(odd) {
    background-color: #fcfcfd;
}
.sp-inventory-table tbody tr:hover {
    background-color: #f1f5f9 !important;
}
.sp-inventory-table td {
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f1f5f9;
}
.sp-inventory-table tbody tr:last-child td {
    border-bottom: none;
}
</style>
@endpush

@endsection



