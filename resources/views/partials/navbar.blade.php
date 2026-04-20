<nav id="topbar" class="navbar bg-white border-bottom fixed-top topbar px-3">
    <button id="toggleBtn" class="d-none d-lg-inline-flex btn btn-light btn-icon btn-sm ">
        <i class="ti ti-layout-sidebar-left-expand"></i>
    </button>

    <button id="mobileBtn" class="btn btn-light btn-icon btn-sm d-lg-none me-2">
        <i class="ti ti-layout-sidebar-left-expand"></i>
    </button>

    <div>
        <ul class="list-unstyled d-flex align-items-center mb-0 gap-1">
            <li>
                <a class="position-relative btn-icon btn-sm btn-light btn rounded-circle" data-bs-toggle="dropdown"
                    aria-expanded="false" href="#" role="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-bell">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                        <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                    </svg>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-2 ms-n2">
                        2
                        <span class="visually-hidden">messages non lus</span>
                    </span>
                </a>
                <div class="dropdown-menu dropdown-menu-end dropdown-menu-md p-0">
                    <ul class="list-unstyled p-0 m-0">
                        <li class="p-3 border-bottom ">
                            <div class="d-flex gap-3">
                                <img src="{{ asset('assets/images/logo-icon.svg') }}" alt="" class="avatar avatar-sm rounded-circle" />
                                <div class="flex-grow-1 small">
                                    <p class="mb-0">Nouvelle commande reçue</p>
                                    <p class="mb-1">Commande n°12345 passée</p>
                                    <div class="text-secondary">il y a 5 minutes</div>
                                </div>
                            </div>
                        </li>
                        <li class="p-3 border-bottom ">
                            <div class="d-flex gap-3">
                                <img src="{{ asset('assets/images/logo-icon.svg') }}" alt="" class="avatar avatar-sm rounded-circle" />
                                <div class="flex-grow-1 small">
                                    <p class="mb-0">Nouvel utilisateur inscrit</p>
                                    <p class="mb-1">L'utilisateur @john_doe s'est inscrit</p>
                                    <div class="text-secondary">il y a 30 minutes</div>
                                </div>
                            </div>
                        </li>

                        <li class="p-3 border-bottom">
                            <div class="d-flex gap-3">
                                <img src="{{ asset('assets/images/logo-icon.svg') }}" alt="" class="avatar avatar-sm rounded-circle" />
                                <div class="flex-grow-1 small">
                                    <p class="mb-0">Paiement confirmé</p>
                                    <p class="mb-1">Paiement de 299 $ reçu</p>
                                    <div class="text-secondary">il y a 1 heure</div>
                                </div>
                            </div>
                        </li>
                        <li class="px-4 py-3 text-center">
                            <a href="#" class="text-primary ">Voir toutes les notifications</a>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
</nav>


