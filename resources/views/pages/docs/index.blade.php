@extends('layouts.app')

@section('title', 'Documentation - InApp Inventaire')

@section('content')
<div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div class="">
              <h1 class="fs-3 mb-1">Documentation</h1>
             <p>
          Cette documentation vous guide pour l'installation et l'utilisation du template InApp Inventory Dashboard.
        </p>
            </div>

          </div>
        </div>
      </div>

        <div class="row">
            <div class="col-12">
                <div class="">
    <div class="">



      <!-- Prérequis -->
      <div class="mb-4">
        <div class="mb-2">
        <h2 class="h5 mb-1">Prérequis</h2>
        <p>Avant de commencer, assurez-vous d'avoir installé les éléments suivants :</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item ps-0">Node.js (v14 or higher)</li>
          <li class="list-group-item ps-0">Gestionnaire de paquets npm ou yarn</li>
          <li class="list-group-item ps-0">[Tout autre outil/dépendance spécifique]</li>
        </ul>
      </div>

      <!-- Installation -->
      <div class="mb-4">
        <h2 class="h5 mb-2">Installation</h2>
        <ol class="list-group list-group-numbered list-group-flush">
          <li class="list-group-item ps-0" >Clonez le dépôt ou téléchargez le template</li>
          <li class="list-group-item ps-0">Accédez au répertoire du projet</li>
          <li class="list-group-item ps-0">
            Installez les dépendances :
            <pre class="bg-light border rounded p-3 mt-2"><code>npm install</code></pre>
          </li>
        </ol>
      </div>



      <!-- Utilisation -->
      <div class="mb-6">
        <h2 class="h5 mb-2">Lancer l'application</h2>
        <p>Pour démarrer le serveur de développement :</p>
        <pre class="bg-light border rounded p-3"><code>npm run dev</code></pre>
      </div>
    <!-- Étapes suivantes -->
      <div class="mb-4">
        <h2 class="h5 mb-2">Étapes suivantes</h2>
        <ol class="list-group list-group-numbered list-group-flush">
          <li class="list-group-item ps-0">Consultez les sources du template dans <code>resources/js/template/</code> et <code>resources/scss/template/</code></li>
          <li class="list-group-item ps-0">Personnalisez les composants selon vos besoins</li>
          <li class="list-group-item ps-0">
            Compiler pour la production :
            <pre class="bg-light border rounded p-3 mt-4"><code>npm run build</code></pre>
          </li>
        </ol>
      </div>

      <!-- Structure du projet -->
      <div class="mb-4">
        <h2 class="h5 mb-0">Structure du projet</h2>
        <pre>
     <code>
StockPilot/
├── public/
│   ├── assets/
│   │   └── images/     # Images et icônes du template
│   └── build/          # Ressources compilées générées par Vite
├── resources/
│   ├── js/template/    # Sources JS du template (Vite)
│   ├── scss/template/  # Sources SCSS du template (Vite)
│   └── views/
│   ├── layouts/        # app.blade.php et auth.blade.php
│   ├── partials/       # header, sidebar, scripts, styles, footer
│   ├── pages/          # dashboard, inventory, reports, docs
│   └── auth/           # login et register
├── routes/web.php      # Routes des pages
└── vite.config.js      # Configuration standard Laravel Vite
     </code>
     </pre>
      </div>


      <!-- Support -->
      <div class="mb-2">
        <h2 class="h5">Support</h2>
        <p>
          Pour toute question, consultez la documentation ou créez une issue dans le dépôt. Vous pouvez aussi nous contacter
          à l'adresse <a href="#!" class="text-primary">CodesCandy</a>.
        </p>
      </div>

    </div>
  </div>

            </div>
            </div>
    </div>
@endsection

