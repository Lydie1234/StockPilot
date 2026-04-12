@php
    $isInventory = request()->routeIs('pages.inventory') || request()->routeIs('pages.inventory.create');
    $user = auth()->user();
    $isGerant = $user && in_array($user->role, ['gerant', 'admin']);
    $displayName = auth()->check() ? (trim($user->name ?? '') ?: 'Utilisateur') : 'Invité';
    $roleLabel = auth()->check() ? ucfirst(str_replace('_', ' ', $user->role ?? 'utilisateur')) : 'Session publique';
    $initial = strtoupper(substr($displayName, 0, 1));
@endphp

<aside id="sidebar" class="sidebar">
    <div class="logo-area">
        <a href="{{ $isGerant ? route('dashboard') : route('pages.inventory') }}" class="sidebar-brand d-inline-flex align-items-center" data-nav-label="StockPilot">
            <span class="sidebar-brand-icon" aria-hidden="true">
                <img src="{{ asset('assets/images/logo-icon.svg') }}" alt="" width="20" height="20">
            </span>
            <span class="sidebar-brand-text">StockPilot</span>
        </a>
    </div>

    <div class="sidebar-body">
        <p class="sidebar-section-label nav-text">Principal</p>

        <ul class="nav flex-column sidebar-nav">
            @if($isGerant)
            <li>
                <a class="nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}" href="{{ route('dashboard') }}" data-nav-label="Tableau de bord">
                    <i class="ti ti-home"></i><span class="nav-text">Tableau de bord</span>
                </a>
            </li>
            @endif

            <li>
                <a class="nav-link {{ $isInventory ? 'active' : '' }}" href="{{ route('pages.inventory') }}" data-nav-label="Inventaire">
                    <i class="ti ti-box-seam"></i><span class="nav-text">Inventaire</span>
                </a>
            </li>

            @if($isGerant)
            <li>
                <a class="nav-link {{ request()->routeIs('pages.inventory.create') ? 'active' : '' }}" href="{{ route('pages.inventory.create') }}" data-nav-label="Nouveau produit">
                    <i class="ti ti-plus"></i><span class="nav-text">Nouveau produit</span>
                </a>
            </li>

            <li>
                <a class="nav-link {{ request()->routeIs('pages.reports') ? 'active' : '' }}" href="{{ route('pages.reports') }}" data-nav-label="Rapports">
                    <i class="ti ti-receipt"></i><span class="nav-text">Rapports</span>
                </a>
            </li>
            @endif
        </ul>

        @if($isGerant)
        <p class="sidebar-section-label nav-text mt-4">Configuration</p>

        <ul class="nav flex-column sidebar-nav">
            <li>
                <a class="nav-link {{ request()->routeIs('pages.users') ? 'active' : '' }}" href="{{ route('pages.users') }}" data-nav-label="Utilisateurs">
                    <i class="ti ti-users"></i><span class="nav-text">Utilisateurs</span>
                </a>
            </li>
            <li>
                <a class="nav-link {{ request()->routeIs('pages.settings') ? 'active' : '' }}" href="{{ route('pages.settings') }}" data-nav-label="Paramètres">
                    <i class="ti ti-settings"></i><span class="nav-text">Paramètres</span>
                </a>
            </li>
        </ul>
        @else
        <ul class="nav flex-column sidebar-nav mt-3">
            <li>
                <a class="nav-link {{ request()->routeIs('pages.settings') ? 'active' : '' }}" href="{{ route('pages.settings') }}" data-nav-label="Mon Profil">
                    <i class="ti ti-user"></i><span class="nav-text">Mon Profil</span>
                </a>
            </li>
        </ul>
        @endif
    </div>

    <div class="sidebar-footer">
        @auth
            <div class="sidebar-user">
                <span class="sidebar-user-avatar" aria-hidden="true">{{ $initial }}</span>
                <div class="sidebar-user-meta nav-text">
                    <p class="mb-0">{{ $displayName }}</p>
                    <small>{{ $roleLabel }}</small>
                </div>
            </div>

            <form method="POST" action="{{ route('logout') }}" class="m-0">
                @csrf
                <button type="submit" class="sidebar-logout-btn nav-link w-100 text-start border-0 bg-transparent" data-nav-label="Se déconnecter">
                    <i class="ti ti-logout"></i><span class="nav-text">Se déconnecter</span>
                </button>
            </form>
        @else
            <a class="sidebar-logout-btn nav-link {{ request()->routeIs('login') ? 'active' : '' }}" href="{{ route('login') }}" data-nav-label="Se connecter">
                <i class="ti ti-login"></i><span class="nav-text">Se connecter</span>
            </a>
        @endauth
    </div>
</aside>

