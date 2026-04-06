@extends('layouts.app')

@section('title', 'Créer un produit - InApp Inventaire')

@section('content')
<div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div class="">
              <h1 class="fs-3 mb-1">Ajouter un article</h1>
              <p class="mb-0">Gérez vos articles d'inventaire</p>
            </div>
            <div>
              <a href="{{ route('pages.inventory') }}" class="btn btn-primary">Aller à la liste d'inventaire</a>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body p-4">
              <form id="addProductForm">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="productName" class="form-label">Nom du produit</label>
                    <input type="text" class="form-control" id="productName" placeholder="Entrez le nom du produit" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="productSKU" class="form-label">Référence (SKU)</label>
                    <input type="text" class="form-control" id="productSKU" placeholder="Entrez la référence" required>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="productPrice" class="form-label">Prix</label>
                    <input type="number" class="form-control" id="productPrice" placeholder="0.00" step="0.01" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="productStock" class="form-label">Quantité en stock</label>
                    <input type="number" class="form-control" id="productStock" placeholder="0" required>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="productCategory" class="form-label">Catégorie</label>
                  <select class="form-select" id="productCategory" required>
                    <option value="">Sélectionner la catégorie</option>
                    <option value="electronics">Électronique</option>
                    <option value="clothing">Vêtements</option>
                    <option value="food">Alimentation</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="productImage" class="form-label">Image du produit</label>
                  <input type="file" class="form-control" id="productImage" accept="image/*" required>
                </div>
                <div class="mb-3">
                  <label for="productDescription" class="form-label">Description</label>
                  <textarea class="form-control" id="productDescription" rows="4"
                    placeholder="Entrez la description du produit"></textarea>
                </div>
                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary">Ajouter un produit</button>
                  <button type="reset" class="btn btn-secondary">Effacer</button>
                </div>

              </form>
            </div>
          </div>


        </div>

      </div>
    </div>
@endsection

