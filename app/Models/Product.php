<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'unit',
        'current_stock',
        'alert_threshold',
        'unit_price',
    ];

    protected $appends = ['stock_status'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function scopeBelowThreshold(Builder $query)
    {
        return $query->whereColumn('current_stock', '<=', 'alert_threshold');
    }

    public function getStockStatusAttribute()
    {
        if ($this->current_stock <= 0) {
            return 'critique';
        } elseif ($this->current_stock <= $this->alert_threshold) {
            return 'faible';
        }

        return 'normal';
    }
}
