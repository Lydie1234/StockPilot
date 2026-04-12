@extends('layouts.app')

@section('title', 'Créer un produit - InApp Inventaire')

@section('content')
<div class="container-fluid sp-page" data-sp-page="create-product">
    <!-- Header Section -->
    <div class="row align-items-center mb-4 justify-content-center">
        <div class="col-12 col-xl-8">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                    <h1 class="fs-3 fw-bold mb-1 text-dark">Ajouter un article</h1>
                    <p class="mb-0 text-muted">Création rapide d'un produit dans votre catalogue.</p>
                </div>
                <div>
                    <a href="{{ route('pages.inventory') }}" class="btn btn-light shadow-sm d-inline-flex align-items-center gap-2 rounded-3 px-4 py-2 fw-medium text-dark transition-hover border-gray-300">
                        <i class="ti ti-arrow-left"></i> Retour inventaire
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Centered Form Card -->
    <div class="row justify-content-center">
        <div class="col-12 col-xl-8">
            <div class="card border-0 shadow-sm rounded-4 sp-form-card overflow-hidden">
                <div class="card-header bg-transparent border-bottom border-light pt-4 pb-3 px-4 px-md-5">
                    <h2 class="h5 fw-bold mb-0 text-dark">Informations du produit</h2>
                </div>
                <div class="card-body p-4 p-md-5">
                    <form data-sp-create-product-form data-inventory-url="{{ route('pages.inventory') }}">
                        <div class="row g-4">
                            <!-- Nom & SKU -->
                            <div class="col-md-6">
                                <label class="form-label fw-medium text-dark small mb-2" for="productName">Nom du produit <span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-lg shadow-none border-gray-300 text-dark" id="productName" name="product_name" placeholder="Ex: Ordinateur portable XPS" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-medium text-dark small mb-2" for="productSKU">Référence (SKU)</label>
                                <input type="text" class="form-control form-control-lg shadow-none border-gray-300 text-dark" id="productSKU" name="product_sku" placeholder="Ex: LPT-XPS-2026">
                            </div>

                            <!-- Catégorie, Unité, Seuil -->
                            <div class="col-md-4">
                                <label class="form-label fw-medium text-dark small mb-2" for="productCategory">Catégorie <span class="text-danger">*</span></label>
                                <select class="form-select form-select-lg shadow-none border-gray-300 text-dark" id="productCategory" name="product_category" data-sp-create-category required>
                                    <option value="">Choisir...</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-medium text-dark small mb-2" for="productUnit">Unité <span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-lg shadow-none border-gray-300 text-dark" id="productUnit" name="product_unit" placeholder="Ex: pièce, kg, litre" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-medium text-dark small mb-2" for="productThreshold">Seuil d'alerte <span class="text-danger">*</span></label>
                                <input type="number" class="form-control form-control-lg shadow-none border-gray-300 text-dark" id="productThreshold" name="product_threshold" placeholder="10" min="0" step="0.01" required>
                            </div>

                            <hr class="text-muted opacity-25 my-4">

                            <!-- Prix, Stock Image -->
                            <div class="col-md-4">
                                <label class="form-label fw-medium text-dark small mb-2" for="productPrice">Prix unitaire (FCFA) <span class="text-danger">*</span></label>
                                <input type="number" class="form-control form-control-lg shadow-none border-gray-300 text-dark" id="productPrice" name="product_price" placeholder="0.00" min="0" step="0.01" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-medium text-dark small mb-2" for="productStock">Quantité en stock <span class="text-danger">*</span></label>
                                <input type="number" class="form-control form-control-lg shadow-none border-gray-300 text-dark" id="productStock" name="product_stock" placeholder="0" min="0" step="0.01" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-medium text-dark small mb-2" for="productImage">Image produit</label>
                                <input type="file" class="form-control form-control-lg shadow-none border-gray-300 text-dark" id="productImage" name="product_image" accept="image/*">
                            </div>

                            <!-- Description -->
                            <div class="col-12 mt-4">
                                <label class="form-label fw-medium text-dark small mb-2" for="productDescription">Description</label>
                                <textarea class="form-control shadow-none border-gray-300 text-dark" id="productDescription" rows="4" placeholder="Description détaillée du produit..."></textarea>
                            </div>
                        </div>

                        <div class="d-flex flex-column flex-md-row justify-content-end gap-3 mt-5">
                            <button type="reset" class="btn btn-light btn-lg px-4 fw-medium text-muted transition-hover shadow-none border-gray-300 order-2 order-md-1">
                                Effacer
                            </button>
                            <button type="submit" class="btn btn-primary btn-lg px-5 fw-medium transition-hover d-flex align-items-center justify-content-center gap-2 shadow-sm order-1 order-md-2">
                                <i class="ti ti-check"></i> Ajouter au catalogue
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

