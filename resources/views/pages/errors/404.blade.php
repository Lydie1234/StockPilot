@extends('layouts.auth')

@section('title', '404 Error - InApp Inventory Dashboard')

@section('auth-content')
    <div style="max-width: 500px; width: 100%; margin: 0 auto;">
        <div class="text-center">
            <h1 class="display-1 fw-bold text-primary mb-2">404</h1>
            <h2 class="card-title h4 mb-3">Page Not Found</h2>
            <p class="text-muted mb-4">Sorry, the page you're looking for doesn't exist or has been moved.</p>

            <a href="{{ route('dashboard') }}" class="btn btn-primary">Go to Dashboard</a>
        </div>
    </div>
@endsection

