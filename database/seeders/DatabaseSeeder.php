<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer les utilisateurs de test
        User::query()->updateOrCreate(
            ['email' => 'gerant@stockpilot.test'],
            [
                'name' => 'Gerant Demo',
                'password' => Hash::make('password'),
                'role' => 'gerant',
                'email_verified_at' => now(),
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'employe@stockpilot.test'],
            [
                'name' => 'Employe Demo',
                'password' => Hash::make('password'),
                'role' => 'employe',
                'email_verified_at' => now(),
            ]
        );

        $this->call([
            UserSeeder::class,
        ]);

        // Créer les catégories de test
        $categories = [
            ['name' => 'Antalgiques', 'description' => 'Medicaments douleur et fievre'],
            ['name' => 'Antibiotiques', 'description' => 'Traitements antibiotiques'],
            ['name' => 'Dispositifs', 'description' => 'Materiel medical et para-pharmacie'],
            ['name' => 'Hygiene', 'description' => 'Produits hygiene boutique'],
        ];

        $createdCategories = [];
        foreach ($categories as $cat) {
            $createdCategories[] = Category::updateOrCreate(
                ['name' => $cat['name']],
                ['description' => $cat['description']]
            );
        }

        // Créer les produits de test
        $products = [
            ['category' => 'Antalgiques', 'name' => 'Paracetamol 500 mg', 'unit' => 'boite', 'stock' => 4, 'threshold' => 12, 'price' => 1200],
            ['category' => 'Antibiotiques', 'name' => 'Amoxicilline 500 mg', 'unit' => 'boite', 'stock' => 22, 'threshold' => 10, 'price' => 3500],
            ['category' => 'Hygiene', 'name' => 'Gel hydroalcoolique 500 ml', 'unit' => 'flacon', 'stock' => 7, 'threshold' => 8, 'price' => 2800],
            ['category' => 'Dispositifs', 'name' => 'Thermometre digital', 'unit' => 'piece', 'stock' => 16, 'threshold' => 6, 'price' => 6500],
            ['category' => 'Dispositifs', 'name' => 'Bandelettes glycemie', 'unit' => 'boite', 'stock' => 0, 'threshold' => 5, 'price' => 9000],
            ['category' => 'Hygiene', 'name' => 'Gants nitrile (100)', 'unit' => 'boite', 'stock' => 40, 'threshold' => 15, 'price' => 7200],
            ['category' => 'Antalgiques', 'name' => 'Sirop toux enfant', 'unit' => 'flacon', 'stock' => 3, 'threshold' => 6, 'price' => 4500],
            ['category' => 'Antalgiques', 'name' => 'Vitamine C 1000 mg', 'unit' => 'tube', 'stock' => 25, 'threshold' => 10, 'price' => 2200],
        ];

        $gerant = User::where('email', 'gerant@stockpilot.test')->first();

        foreach ($products as $prod) {
            $category = Category::where('name', $prod['category'])->first();
            if (!$category) continue;

            $product = Product::updateOrCreate(
                ['name' => $prod['name']],
                [
                    'category_id' => $category->id,
                    'unit' => $prod['unit'],
                    'current_stock' => $prod['stock'],
                    'alert_threshold' => $prod['threshold'],
                    'unit_price' => $prod['price'],
                ]
            );

            // Créer le mouvement initial (stock)
            StockMovement::firstOrCreate(
                ['product_id' => $product->id, 'type' => 'entree', 'reason' => 'Stock initial'],
                [
                    'user_id' => $gerant->id,
                    'quantity' => $prod['stock'],
                    'type' => 'entree',
                    'reason' => 'Stock initial',
                ]
            );
        }
    }
}

