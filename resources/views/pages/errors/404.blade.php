@extends('layouts.auth')

@section('title', 'Erreur 404 - InApp Inventaire')

@section('auth-content')
    <div style="max-width: 500px; width: 100%; margin: 0 auto;">
        <div class="text-center">
            <h1 class="display-1 fw-bold text-primary mb-2">404</h1>
            <h2 class="card-title h4 mb-3">Page non trouvée</h2>
            <p class="text-muted mb-4">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>

            <a href="{{ route('dashboard') }}" class="btn btn-primary">Aller au tableau de bord</a>
        </div>
    </div>
@endsection

