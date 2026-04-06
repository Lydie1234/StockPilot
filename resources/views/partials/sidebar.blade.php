@php
    $isInventory = request()->routeIs('pages.inventory') || request()->routeIs('pages.inventory.create');
@endphp

<aside id="sidebar" class="sidebar">
    <div class="logo-area">
        <a href="{{ route('dashboard') }}" class="d-inline-flex">
            <img src="{{ asset('assets/images/logo-icon.svg') }}" alt="" width="24">
            <span class="logo-text ms-2"><img src="{{ asset('assets/images/logo.svg') }}" alt=""></span>
        </a>
    </div>

    <ul class="nav flex-column">
        <li class="px-4 py-2"><small class="nav-text">Principal</small></li>

        <li>
            <a class="nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}" href="{{ route('dashboard') }}">
                <i class="ti ti-home"></i><span class="nav-text">Tableau de bord</span>
            </a>
        </li>

        <li>
            <a class="nav-link {{ $isInventory ? 'active' : '' }}" href="{{ route('pages.inventory') }}">
                <i class="ti ti-box-seam"></i><span class="nav-text">Inventaire</span>
            </a>
        </li>

        <li>
            <a class="nav-link {{ request()->routeIs('pages.inventory.create') ? 'active' : '' }}" href="{{ route('pages.inventory.create') }}">
                <i class="ti ti-plus"></i><span class="nav-text">Ajouter un produit</span>
            </a>
        </li>

        <li>
            <a class="nav-link {{ request()->routeIs('pages.reports') ? 'active' : '' }}" href="{{ route('pages.reports') }}">
                <i class="ti ti-receipt"></i><span class="nav-text">Rapports</span>
            </a>
        </li>

        <li>
            <a class="nav-link {{ request()->routeIs('pages.error404') ? 'active' : '' }}" href="{{ route('pages.error404') }}">
                <i class="ti ti-alert-circle"></i><span class="nav-text">Erreur 404</span>
            </a>
        </li>

        <li>
            <a class="nav-link {{ request()->routeIs('pages.docs') ? 'active' : '' }}" href="{{ route('pages.docs') }}">
                <i class="ti ti-file-text"></i><span class="nav-text">Documentation</span>
            </a>
        </li>

        <li class="px-4 pt-4 pb-2"><small class="nav-text">Compte</small></li>

        <li>
            <a class="nav-link {{ request()->routeIs('login') ? 'active' : '' }}" href="{{ route('login') }}">
                <i class="ti ti-logout"></i><span class="nav-text">Se connecter</span>
            </a>
        </li>

        <!-- Registration link removed: registration disabled -->
    </ul>
</aside>

