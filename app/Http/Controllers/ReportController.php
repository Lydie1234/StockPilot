<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function topProductsOut()
    {
        return DB::table('stock_movements')
            ->select('product_id', DB::raw('SUM(quantity) as total_out'))
            ->where('type', 'sortie')
            ->groupBy('product_id')
            ->orderByDesc('total_out')
            ->take(10)
            ->get();
    }

    public function history(Request $request)
    {
        $start = $request->input('start');
        $end = $request->input('end');
        $query = DB::table('stock_movements')
            ->whereBetween('created_at', [$start, $end]);
        return $query->get();
    }
}
