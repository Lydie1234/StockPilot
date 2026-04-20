/**
 * Gestionnaire des mouvements de stock avec validation en temps réel
 * Affiche des messages d'erreur clairs lorsque le seuil minimum est dépassé
 */

import { StockPilotAPI } from '../api/stockpilot-api.js';

class StockMovementHandler {
    constructor() {
        this.form = document.querySelector('[data-sp-movement-form]');
        this.productSelect = document.querySelector('[data-sp-movement-product]');
        this.typeSelect = document.querySelector('[data-sp-movement-type]');
        this.quantityInput = document.querySelector('input[name="quantity"]');
        this.modal = document.querySelector('#spMovementModal');
        
        this.products = [];
        this.currentProduct = null;
        
        this.init();
    }

    async init() {
        if (!this.form) return;
        
        // Charger les produits
        await this.loadProducts();
        
        // Attacher les écouteurs d'événements
        this.attachEventListeners();
        
        // Initialiser les tooltips Bootstrap
        this.initTooltips();
    }

    async loadProducts() {
        try {
            this.products = await StockPilotAPI.products.getAll();
            this.populateProductSelect();
        } catch (error) {
            console.error('Erreur chargement produits:', error);
        }
    }

    populateProductSelect() {
        if (!this.productSelect) return;
        
        this.productSelect.innerHTML = '<option value="">Choisir un produit...</option>';
        
        this.products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} (Stock: ${product.current_stock} ${product.unit})`;
            option.dataset.stock = product.current_stock;
            option.dataset.threshold = product.alert_threshold;
            option.dataset.unit = product.unit;
            this.productSelect.appendChild(option);
        });
    }

    attachEventListeners() {
        // Changement de produit
        this.productSelect?.addEventListener('change', () => {
            this.updateCurrentProduct();
            this.validateQuantity();
        });

        // Changement de type de mouvement
        this.typeSelect?.addEventListener('change', () => {
            this.updateQuantityLabel();
            this.validateQuantity();
        });

        // Validation en temps réel de la quantité
        this.quantityInput?.addEventListener('input', () => {
            this.validateQuantity();
        });

        // Soumission du formulaire
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    updateCurrentProduct() {
        const selectedOption = this.productSelect?.selectedOptions[0];
        if (!selectedOption || !selectedOption.value) {
            this.currentProduct = null;
            return;
        }

        this.currentProduct = {
            id: selectedOption.value,
            name: selectedOption.textContent.split(' (')[0],
            stock: parseFloat(selectedOption.dataset.stock),
            threshold: parseFloat(selectedOption.dataset.threshold),
            unit: selectedOption.dataset.unit
        };
    }

    updateQuantityLabel() {
        const label = document.querySelector('[data-sp-movement-quantity-label]');
        const type = this.typeSelect?.value || 'sortie';
        
        if (label) {
            if (type === 'ajustement') {
                label.textContent = 'Nouveau stock';
            } else {
                label.textContent = 'Quantité';
            }
        }
    }

    validateQuantity() {
        if (!this.currentProduct || !this.quantityInput) return;
        
        const type = this.typeSelect?.value || 'sortie';
        const quantity = parseFloat(this.quantityInput.value) || 0;
        
        // Effacer les messages d'erreur précédents
        this.clearErrorMessages();
        
        if (type === 'sortie') {
            this.validateExitMovement(quantity);
        } else if (type === 'ajustement') {
            this.validateAdjustment(quantity);
        }
    }

    validateExitMovement(quantity) {
        if (quantity <= 0) return;
        
        // Vérifier si le stock est suffisant
        if (quantity > this.currentProduct.stock) {
            this.showErrorMessage(
                `Stock insuffisant. Stock disponible: ${this.currentProduct.stock} ${this.currentProduct.unit}`,
                'danger'
            );
            this.disableSubmitButton();
            return;
        }
        
        // Vérifier si le seuil minimum serait dépassé
        const remainingStock = this.currentProduct.stock - quantity;
        if (remainingStock < this.currentProduct.threshold) {
            this.showErrorMessage(
                `Cette sortie ferait descendre le stock sous le seuil minimum d'alerte.\n` +
                `Stock après sortie: ${remainingStock} ${this.currentProduct.unit}\n` +
                `Seuil minimum: ${this.currentProduct.threshold} ${this.currentProduct.unit}`,
                'warning'
            );
            this.disableSubmitButton();
            return;
        }
        
        // Si tout est valide
        this.showSuccessMessage(`Stock après sortie: ${remainingStock} ${this.currentProduct.unit}`);
        this.enableSubmitButton();
    }

    validateAdjustment(newStock) {
        if (newStock < 0) {
            this.showErrorMessage('Le nouveau stock ne peut pas être négatif.', 'danger');
            this.disableSubmitButton();
            return;
        }
        
        if (newStock < this.currentProduct.threshold) {
            this.showErrorMessage(
                `Attention: le nouveau stock (${newStock} ${this.currentProduct.unit}) est sous le seuil minimum (${this.currentProduct.threshold} ${this.currentProduct.unit}).`,
                'warning'
            );
            // Ne pas bloquer l'ajustement, juste avertir
        }
        
        this.enableSubmitButton();
    }

    showErrorMessage(message, type = 'danger') {
        this.clearErrorMessages();
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        alertDiv.innerHTML = `
            <small class="pre-wrap">${message}</small>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        this.quantityInput?.parentNode?.insertBefore(alertDiv, this.quantityInput.nextSibling);
    }

    showSuccessMessage(message) {
        this.clearErrorMessages();
        
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show mt-3';
        alertDiv.innerHTML = `
            <small>${message}</small>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        this.quantityInput?.parentNode?.insertBefore(alertDiv, this.quantityInput.nextSibling);
    }

    clearErrorMessages() {
        const alerts = this.form?.querySelectorAll('.alert');
        alerts?.forEach(alert => alert.remove());
    }

    disableSubmitButton() {
        const submitBtn = this.form?.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Non autorisé';
            submitBtn.classList.add('disabled');
        }
    }

    enableSubmitButton() {
        const submitBtn = this.form?.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Valider';
            submitBtn.classList.remove('disabled');
        }
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        
        try {
            await StockPilotAPI.movements.create({
                product_id: formData.get('product_id'),
                type: formData.get('type'),
                quantity: formData.get('quantity'),
                reason: formData.get('reason') || 'Mouvement manuel'
            });
            
            // Fermer la modal et réinitialiser
            const modalInstance = bootstrap.Modal.getInstance(this.modal);
            modalInstance?.hide();
            
            this.form.reset();
            this.clearErrorMessages();
            
            // Afficher un message de succès
            this.showToast('Mouvement de stock enregistré avec succès', 'success');
            
            // Recharger les données
            setTimeout(() => window.location.reload(), 1000);
            
        } catch (error) {
            // Afficher l'erreur du backend
            this.showErrorMessage(error.message, 'danger');
        }
    }

    showToast(message, type = 'success') {
        // Utiliser le système de toast existant
        if (window.StockPilot?.renderToast) {
            window.StockPilot.renderToast(message, type);
        }
    }

    initTooltips() {
        // Initialiser les tooltips Bootstrap si nécessaire
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Initialiser le gestionnaire quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new StockMovementHandler();
});
