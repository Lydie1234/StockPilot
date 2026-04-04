<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'unit',
        'current_stock',
        'alert_threshold',
        'unit_price',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }


    //scope pour filtrer les produits en dessous du seuil d'alerte
    public function scopeBelowThreshold($query)
    {
        return $query->whereColumn('current_stock', '<=', 'alert_threshold');
    }


    //accessor pour vérifier si le stock est en dessous du seuil d'alerte
    public function getStockStatusAttribute()
    {
        if ($this->current_stock <= 0) return 'critique';
        if ($this->current_stock <= $this->alert_threshold) return 'faible';
        return 'normal';
    }
}
