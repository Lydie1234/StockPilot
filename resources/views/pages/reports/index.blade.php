@extends('layouts.app')

@section('title', 'Rapports - InApp Inventaire')

@section('content')
<div class="container-fluid sp-page" data-sp-page="reports">
    <!-- Header Section -->
    <div class="row align-items-center justify-content-between mb-4">
        <div class="col-12 col-md-8">
            <h1 class="fs-3 fw-bold mb-1 text-dark">Rapports &amp; Statistiques</h1>
            <p class="mb-0 text-muted">Historique des mouvements, tendances et insights clés.</p>
        </div>
        <div class="col-12 col-md-4 text-md-end mt-3 mt-md-0">
            <button class="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm rounded-3 px-4 py-2 fw-medium transition-hover" onclick="window.print()">
                <i class="ti ti-printer"></i>
                Exporter le rapport
            </button>
        </div>
    </div>

    <!-- Filter Card -->
    <div class="card border-0 shadow-sm rounded-4 mb-4">
        <div class="card-body p-4">
            <div class="row g-3">
                <div class="col-md-3">
                    <label class="form-label fw-medium text-muted small mb-2">Période d'analyse</label>
                    <select class="form-select form-select-lg shadow-none border-gray-300 text-dark" data-sp-report-period>
                        <option value="7">7 derniers jours</option>
                        <option value="30" selected>30 derniers jours</option>
                        <option value="90">3 derniers mois</option>
                        <option value="365">12 derniers mois</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-medium text-muted small mb-2">Type d'opération</label>
                    <select class="form-select form-select-lg shadow-none border-gray-300 text-dark" data-sp-report-type>
                        <option value="">Tous les types</option>
                        <option value="entree">Entrée (Réappro)</option>
                        <option value="sortie">Sortie (Vente)</option>
                        <option value="ajustement">Ajustement</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-medium text-muted small mb-2">Catégorie</label>
                    <select class="form-select form-select-lg shadow-none border-gray-300 text-dark" data-sp-report-category>
                        <option value="">Toutes les catégories</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-medium text-muted small mb-2">Santé du stock</label>
                    <select class="form-select form-select-lg shadow-none border-gray-300 text-dark" data-sp-report-status>
                        <option value="">Tous les statuts</option>
                        <option value="critique">Critique (Rupture)</option>
                        <option value="faible">Faible (Sous seuil)</option>
                        <option value="normal">Stock Normal</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <!-- Main KPI Cards -->
    <div class="row g-4 mb-4">
        <!-- Valeur du stock -->
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
                        <h3 class="fw-bold mb-0 text-dark fs-3 text-truncate" data-sp-kpi="report-stock-value">--</h3>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mouvements filtres -->
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="card border-0 shadow-sm rounded-4 sp-kpi-card sp-kpi-info h-100 transition-hover">
                <div class="card-body p-4 d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="icon-shape bg-info bg-opacity-10 text-info rounded-circle p-3 d-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
                            <i class="ti ti-arrows-transfer-up fs-3"></i>
                        </div>
                    </div>
                    <div>
                        <h2 class="text-muted fs-6 mb-1 fw-medium tracking-wide text-uppercase" style="letter-spacing: 0.5px;">Opérations listées</h2>
                        <h3 class="fw-bold mb-0 text-dark fs-2" data-sp-kpi="report-movement-count">--</h3>
                    </div>
                </div>
            </div>
        </div>

        <!-- Produits faibles -->
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
                        <h2 class="text-muted fs-6 mb-1 fw-medium tracking-wide text-uppercase" style="letter-spacing: 0.5px;">Alerte Stock bas</h2>
                        <h3 class="fw-bold mb-0 text-dark fs-2" data-sp-kpi="report-low-stock">--</h3>
                    </div>
                </div>
            </div>
        </div>

        <!-- Produits critiques -->
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
                        <h2 class="text-muted fs-6 mb-1 fw-medium tracking-wide text-uppercase" style="letter-spacing: 0.5px;">Stock épuisé</h2>
                        <h3 class="fw-bold mb-0 text-dark fs-2" data-sp-kpi="report-critical">--</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Report Chart -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card border-0 shadow-sm rounded-4">
                <div class="card-header bg-transparent border-bottom border-light pt-4 pb-0 px-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                    <div>
                        <h3 class="h5 fw-bold mb-1 text-dark">Tendance des mouvements</h3>
                        <p class="text-muted small mb-0 fw-medium">Évolution temporelle selon les montants valorisés en FCFA</p>
                    </div>
                    <div class="controls d-flex flex-wrap gap-2">
                        <button id="btn-update" class="btn btn-outline-primary btn-sm rounded-pill px-3 fw-medium d-flex align-items-center gap-2">
                            <i class="ti ti-filter"></i> Entrées seules
                        </button>
                        <button id="btn-random" class="btn btn-light btn-sm rounded-pill px-3 fw-medium text-dark d-flex align-items-center gap-2 transition-hover border-gray-300">
                            <i class="ti ti-refresh"></i> Recharger
                        </button>
                    </div>
                </div>
                <div class="card-body p-4 pt-3">
                    <div id="salesChart" class="sp-chart-container w-100"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="row g-4 mb-4">
        <!-- Top outputs list -->
        <div class="col-12 col-xl-4">
            <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden d-flex flex-column sp-report-bottom-card">
                <div class="card-header bg-transparent border-bottom border-light pt-4 pb-3 px-4">
                    <h3 class="h5 fw-bold mb-0 text-dark">Top Sorties (Période)</h3>
                </div>
                <ul class="list-group list-group-flush flex-grow-1 sp-dashboard-list sp-report-top-list" data-sp-report-top-products>
                    <li class="list-group-item text-muted p-4 text-center border-0">
                        <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div> Chargement...
                    </li>
                </ul>
            </div>
        </div>

        <!-- History Table -->
        <div class="col-12 col-xl-8">
            <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden d-flex flex-column sp-inventory-table-card sp-report-bottom-card sp-report-history-card">
                <div class="card-header bg-transparent border-bottom border-light pt-4 pb-3 px-4">
                    <h3 class="h5 fw-bold mb-0 text-dark">Historique détaillé</h3>
                </div>
                <div class="table-responsive flex-grow-1 sp-report-history-wrap">
                    <table class="table table-hover align-middle sp-inventory-table sp-report-history-table mb-0">
                        <colgroup>
                            <col style="width: 14%;">
                            <col style="width: 20%;">
                            <col style="width: 14%;">
                            <col style="width: 12%;">
                            <col style="width: 10%;">
                            <col style="width: 20%;">
                            <col style="width: 10%;">
                        </colgroup>
                        <thead>
                            <tr>
                                <th class="text-uppercase fw-semibold text-muted small py-3 ps-4 border-0 tracking-wide text-start">Date</th>
                                <th class="text-uppercase fw-semibold text-muted small py-3 border-0 tracking-wide text-start">Produit</th>
                                <th class="text-uppercase fw-semibold text-muted small py-3 border-0 tracking-wide text-start">Catégorie</th>
                                <th class="text-uppercase fw-semibold text-muted small py-3 border-0 tracking-wide text-start">Type</th>
                                <th class="text-uppercase fw-semibold text-muted small py-3 border-0 tracking-wide text-end">Quantité</th>
                                <th class="text-uppercase fw-semibold text-muted small py-3 border-0 tracking-wide text-start">Motif</th>
                                <th class="text-uppercase fw-semibold text-muted small py-3 pe-4 border-0 tracking-wide text-end">Stock après</th>
                            </tr>
                        </thead>
                        <tbody data-sp-report-movements class="border-top-0">
                            <tr>
                                <td colspan="7" class="text-center py-5 text-muted fw-medium border-0 sp-report-empty-cell">
                                    <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                                    Chargement de l'historique...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('styles')
<style>
.sp-report-bottom-card {
    border: 1px solid rgba(226, 232, 240, 0.85);
}

.sp-report-bottom-card .card-header {
    background: linear-gradient(180deg, rgba(248, 250, 252, 0.82), rgba(248, 250, 252, 0.58));
}

.sp-report-top-list .list-group-item {
    border-bottom: 1px solid #eef2f7;
    padding: 1rem 1rem 1rem 1.125rem;
    transition: background-color 0.2s ease, transform 0.2s ease;
}

.sp-report-top-list .list-group-item:hover {
    background-color: #fff7ed;
}

.sp-report-history-wrap {
    overflow-x: auto;
}

.sp-report-history-table {
    min-width: 920px;
    border-collapse: separate;
    border-spacing: 0;
}

.sp-report-history-table thead th {
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0 !important;
    font-weight: 600;
    font-size: 0.75rem;
    line-height: 1.2;
}

.sp-report-history-table tbody td {
    padding-top: 0.95rem;
    padding-bottom: 0.95rem;
    padding-left: 0.9rem;
    padding-right: 0.9rem;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
    transition: background-color 0.18s ease;
    font-size: 0.9rem;
}

.sp-report-history-table tbody tr:nth-child(odd) td {
    background-color: #fcfcfd;
}

.sp-report-history-table tbody tr:hover td {
    background-color: #fff7ed;
}

.sp-report-history-table .sp-report-row td:first-child,
.sp-report-history-table th:first-child {
    padding-left: 1.25rem;
}

.sp-report-history-table .sp-report-row td:last-child,
.sp-report-history-table th:last-child {
    padding-right: 1.25rem;
}

.sp-report-main {
    font-weight: 600;
    color: #111827;
}

.sp-report-number {
    font-weight: 700;
    font-size: 0.95rem;
    color: #0f172a;
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum" 1;
}

.sp-report-stock {
    color: var(--sp-orange, #f97316);
}

.sp-report-date,
.sp-report-category,
.sp-report-reason {
    color: #475569;
}

.sp-report-reason {
    white-space: normal;
    min-width: 180px;
}

.sp-report-type-badge {
    font-weight: 600;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.sp-report-empty-cell {
    min-height: 128px;
}

.sp-report-top-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.85rem;
}

.sp-report-top-title {
    font-weight: 600;
    color: #0f172a;
}

.sp-report-top-sub {
    color: #64748b;
    font-size: 0.8rem;
}

.sp-report-top-value {
    background-color: rgba(249, 115, 22, 0.12);
    color: var(--sp-orange, #f97316);
    border: 1px solid rgba(249, 115, 22, 0.26);
    font-weight: 700;
    font-size: 0.76rem;
    padding: 0.35rem 0.7rem;
    border-radius: 999px;
    font-variant-numeric: tabular-nums;
}

@media (max-width: 1199.98px) {
    .sp-report-history-table {
        min-width: 980px;
    }
}

@media (max-width: 767.98px) {
    .sp-report-top-list .list-group-item {
        padding: 0.9rem 0.9rem 0.9rem 1rem;
    }

    .sp-report-history-table tbody td {
        font-size: 0.88rem;
    }
}
</style>
@endpush


