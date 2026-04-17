@extends('layouts.app')

@section('title', 'Tableau de bord - InApp Inventaire')

@section('content')
<div class="container-fluid sp-page" data-sp-page="dashboard">
    <!-- Header Section -->
    <div class="row align-items-center mb-4">
        <div class="col-12 col-md-8">
            <h1 class="fs-3 fw-bold mb-1 text-dark">Tableau de bord</h1>
            <p class="mb-0 text-muted">Aperçu de votre activité et état global des stocks.</p>
        </div>
        <div class="col-12 col-md-4 text-md-end mt-3 mt-md-0">
            <a href="{{ route('pages.inventory') }}" class="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm rounded-3 px-4 py-2 fw-medium transition-hover">
                <i class="ti ti-box"></i>
                Voir l'inventaire
            </a>
        </div>
    </div>

    <!-- Main KPI Cards -->
    <div class="row g-4 mb-4">
        <!-- Alerte -->
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="card border-0 shadow-sm rounded-4 sp-kpi-card sp-kpi-danger h-100 transition-hover">
                <div class="card-body p-4 d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="icon-shape bg-danger bg-opacity-10 text-danger rounded-circle p-3 d-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
                            <i class="ti ti-alert-triangle fs-3"></i>
                        </div>
                        <span class="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-3 py-2 fw-medium">Urgent</span>
                    </div>
                    <div>
                        <h2 class="text-muted fs-6 mb-1 fw-medium tracking-wide text-uppercase" style="letter-spacing: 0.5px;">Produits en alerte</h2>
                        <h3 class="fw-bold mb-0 text-dark fs-2" data-sp-kpi="alert-products">--</h3>
                    </div>
                </div>
            </div>
        </div>

        <!-- Valeur du Stock -->
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="card border-0 shadow-sm rounded-4 sp-kpi-card sp-kpi-success h-100 transition-hover">
                <div class="card-body p-4 d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="icon-shape bg-success bg-opacity-10 text-success rounded-circle p-3 d-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
                            <i class="ti ti-cash fs-3"></i>
                        </div>
                    </div>
                    <div>
                        <h2 class="text-muted fs-6 mb-1 fw-medium tracking-wide text-uppercase" style="letter-spacing: 0.5px;">Valeur totale</h2>
                        <h3 class="fw-bold mb-0 text-dark fs-3 text-truncate" data-sp-kpi="stock-value" title="Valeur du stock">--</h3>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mouvements du jour -->
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="card border-0 shadow-sm rounded-4 sp-kpi-card sp-kpi-info h-100 transition-hover">
                <div class="card-body p-4 d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="icon-shape bg-info bg-opacity-10 text-info rounded-circle p-3 d-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
                            <i class="ti ti-arrows-transfer-up fs-3"></i>
                        </div>
                    </div>
                    <div>
                        <h2 class="text-muted fs-6 mb-1 fw-medium tracking-wide text-uppercase" style="letter-spacing: 0.5px;">Mouvements du jour</h2>
                        <h3 class="fw-bold mb-0 text-dark fs-2" data-sp-kpi="movement-today">--</h3>
                    </div>
                </div>
            </div>
        </div>

        <!-- Unités en stock -->
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="card border-0 shadow-sm rounded-4 sp-kpi-card sp-kpi-warning h-100 transition-hover">
                <div class="card-body p-4 d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="icon-shape bg-warning bg-opacity-10 text-warning rounded-circle p-3 d-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
                            <i class="ti ti-packages fs-3"></i>
                        </div>
                    </div>
                    <div>
                        <h2 class="text-muted fs-6 mb-1 fw-medium tracking-wide text-uppercase" style="letter-spacing: 0.5px;">Unités en stock</h2>
                        <h3 class="fw-bold mb-0 text-dark fs-2" data-sp-kpi="stock-units">--</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Secondary KPIs (Stats) -->
    <div class="row g-4 mb-4">
        <!-- Produits Actifs -->
        <div class="col-12 col-md-4">
            <div class="card border-0 shadow-sm rounded-4 h-100 sp-stat-card transition-hover">
                <div class="card-body p-4 d-flex align-items-center">
                    <div class="flex-grow-1">
                        <h3 class="fw-bold fs-2 mb-1 text-dark" data-sp-kpi="total-products">--</h3>
                        <p class="text-muted mb-0 fw-medium">Produits actifs dans la base</p>
                    </div>
                    <div class="ms-3 text-primary opacity-50 p-3 bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                        <i class="ti ti-box-seam fs-2"></i>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Catégories -->
        <div class="col-12 col-md-4">
            <div class="card border-0 shadow-sm rounded-4 h-100 sp-stat-card transition-hover">
                <div class="card-body p-4 d-flex align-items-center">
                    <div class="flex-grow-1">
                        <h3 class="fw-bold fs-2 mb-1 text-dark" data-sp-kpi="category-count">--</h3>
                        <p class="text-muted mb-0 fw-medium">Catégories actives</p>
                    </div>
                    <div class="ms-3 text-success opacity-50 p-3 bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                        <i class="ti ti-category fs-2"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Répartition Alerte -->
        <div class="col-12 col-md-4">
            <div class="card border-0 shadow-sm rounded-4 h-100 sp-stat-card transition-hover">
                <div class="card-body p-4 d-flex align-items-center">
                    <div class="flex-grow-1">
                        <h3 class="fw-bold fs-2 mb-1 text-dark">
                            <span class="text-danger" data-sp-kpi="critical-products">--</span> / 
                            <span class="text-warning" data-sp-kpi="low-products">--</span>
                        </h3>
                        <p class="text-muted mb-0 fw-medium">Critique / Faible (Réappro.)</p>
                    </div>
                    <div class="ms-3 text-danger opacity-50 p-3 bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                        <i class="ti ti-activity-heartbeat fs-2"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Charts -->
    <div class="row g-4 mb-4">
        <!-- Sales vs Purchase -->
        <div class="col-12 col-xl-8">
            <div class="card border-0 shadow-sm rounded-4 h-100">
                <div class="card-header bg-transparent border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h3 class="h5 fw-bold mb-1 text-dark">Flux d'inventaire</h3>
                        <p class="text-muted small mb-0 fw-medium">Entrées vs Sorties sur 12 mois</p>
                    </div>
                </div>
                <div class="card-body p-4 pt-2">
                    <div id="salesPurchaseChart" class="sp-chart-container w-100 h-100"></div>
                </div>
            </div>
        </div>

        <!-- Stock Distribution -->
        <div class="col-12 col-xl-4">
            <div class="card border-0 shadow-sm rounded-4 h-100">
                <div class="card-header bg-transparent border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h3 class="h5 fw-bold mb-1 text-dark">Santé du stock</h3>
                        <p class="text-muted small mb-0 fw-medium">Répartition par statut</p>
                    </div>
                </div>
                <!-- Need relative container to let ApexCharts center perfectly -->
                <div class="card-body p-4 d-flex align-items-center justify-content-center position-relative">
                    <div id="customerChart" class="sp-chart-container w-100"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Lists -->
    <div class="row g-4">
        <!-- Top Products -->
        <div class="col-12 col-lg-4">
            <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden d-flex flex-column">
                <div class="card-header bg-transparent border-bottom border-light pt-4 pb-3 px-4">
                    <h4 class="mb-0 h6 fw-bold text-dark">Top Sorties</h4>
                </div>
                <ul class="list-group list-group-flush flex-grow-1 sp-dashboard-list" data-sp-top-products-list>
                    <li class="list-group-item text-muted p-4 text-center border-0">Chargement...</li>
                </ul>
            </div>
        </div>

        <!-- Low Stock -->
        <div class="col-12 col-lg-4">
            <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden d-flex flex-column">
                <div class="card-header bg-transparent border-bottom border-light pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
                    <h4 class="mb-0 h6 fw-bold text-dark">Sous seuil</h4>
                    <a href="{{ route('pages.inventory') }}" class="btn btn-sm btn-light text-primary rounded-pill px-3 fw-medium">Voir tout</a>
                </div>
                <ul class="list-group list-group-flush flex-grow-1 sp-dashboard-list" data-sp-low-stock-list>
                    <li class="list-group-item text-muted p-4 text-center border-0">Chargement...</li>
                </ul>
            </div>
        </div>

        <!-- Recent Movements -->
        <div class="col-12 col-lg-4">
            <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden d-flex flex-column">
                <div class="card-header bg-transparent border-bottom border-light pt-4 pb-3 px-4">
                    <h4 class="mb-0 h6 fw-bold text-dark">Mouvements Récents</h4>
                </div>
                <ul class="list-group list-group-flush flex-grow-1 sp-dashboard-list" data-sp-recent-movements-list>
                    <li class="list-group-item text-muted p-4 text-center border-0">Chargement...</li>
                </ul>
            </div>
        </div>
    </div>
</div>
@endsection



