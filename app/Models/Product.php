<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Product extends Model
{
    use HasFactory;

=======
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


    // Scope for products below threshold
    public function scopeBelowThreshold(Builder $query)
=======

    //scope pour filtrer les produits en dessous du seuil d'alerte
    public function scopeBelowThreshold($query)

    {
        return $query->whereColumn('current_stock', '<=', 'alert_threshold');
    }


    // Accessor for stock status
    public function getStockStatusAttribute()
    {
        if ($this->current_stock <= 0) {
            return 'critique';
        } elseif ($this->current_stock <= $this->alert_threshold) {
            return 'faible';
        }


    //accessor pour vérifier si le stock est en dessous du seuil d'alerte
    public function getStockStatusAttribute()
    {
        if ($this->current_stock <= 0) return 'critique';
        if ($this->current_stock <= $this->alert_threshold) return 'faible';

        return 'normal';
    }
}
