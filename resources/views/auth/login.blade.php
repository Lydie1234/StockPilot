@extends('layouts.auth')

@section('title', 'Connexion - StockPilot')

@section('auth-content')
    <div class="sp-login-page">
        <section class="sp-login-stage">
            <div class="sp-login-screen">
                    <div class="sp-login-form-col" style="--sp-login-mobile-bg: url('{{ asset('assets/images/login-stock-scene.svg') }}');">
                        <div class="sp-login-form-inner">
                            <a href="{{ url('/') }}" class="sp-login-logo d-inline-flex align-items-center text-decoration-none">
                                <x-application-logo style="width: 44px; height: 44px;" />
                                <span class="sp-login-logo-text">StockPilot</span>
                            </a>

                            <div class="sp-login-form-head">
                                <h1 class="h3 mb-2">Connexion</h1>
                                <p class="mb-0 text-secondary">Accédez à votre espace de gestion de stock.</p>
                            </div>

                            <x-auth-session-status class="alert alert-success py-2 px-3 mb-3" :status="session('status')" />

                            @if ($errors->any())
                                <div class="alert alert-danger d-flex gap-2 align-items-start py-2 px-3 mb-3" role="alert">
                                    <i class="ti ti-alert-circle fs-5 mt-0"></i>
                                    <div>
                                        <p class="mb-1 fw-semibold">Connexion impossible</p>
                                        <ul class="mb-0 ps-3 small">
                                            @foreach ($errors->all() as $error)
                                                <li>{{ $error }}</li>
                                            @endforeach
                                        </ul>
                                    </div>
                                </div>
                            @endif

                            <form class="needs-validation mt-3" novalidate method="POST" action="{{ route('login') }}" data-login-form>
                                @csrf

                                <div class="mb-3">
                                    <label for="email" class="form-label">Email</label>
                                    <div class="input-group sp-input-group sp-input-group-soft">
                                        <span class="input-group-text" aria-hidden="true"><i class="ti ti-mail"></i></span>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            class="form-control @error('email') is-invalid @enderror"
                                            placeholder="nom@entreprise.com"
                                            value="{{ old('email') }}"
                                            autocomplete="username"
                                            required
                                            autofocus
                                        >
                                    </div>
                                    @error('email')
                                        <div class="invalid-feedback d-block">{{ $message }}</div>
                                    @else
                                        <div class="invalid-feedback">Veuillez entrer une adresse e-mail valide.</div>
                                    @enderror
                                </div>

                                <div class="mb-3">
                                    <label for="password" class="form-label">Mot de passe</label>
                                    <div class="input-group sp-input-group sp-input-group-soft">
                                        <span class="input-group-text" aria-hidden="true"><i class="ti ti-lock"></i></span>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            class="form-control @error('password') is-invalid @enderror"
                                            placeholder="Entrez votre mot de passe"
                                            autocomplete="current-password"
                                            required
                                            minlength="6"
                                        >
                                    </div>
                                    @error('password')
                                        <div class="invalid-feedback d-block">{{ $message }}</div>
                                    @else
                                        <div class="invalid-feedback">Veuillez fournir un mot de passe (min 6 caractères).</div>
                                    @enderror
                                </div>

                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <div class="form-check">
                                        <input id="remember" name="remember" class="form-check-input" type="checkbox">
                                        <label class="form-check-label small" for="remember">Se souvenir de moi</label>
                                    </div>

                                    @if (Route::has('password.request'))
                                        <a href="{{ route('password.request') }}" class="small link-primary">Mot de passe oublié ?</a>
                                    @endif
                                </div>

                                <button class="btn btn-primary w-100 sp-login-cta d-inline-flex align-items-center justify-content-center gap-2" type="submit" data-login-submit>
                                    <span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true" data-login-spinner></span>
                                    <span data-login-label>Connexion</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    <div class="sp-login-visual-col" style="--sp-login-hero-image: url('{{ asset('assets/images/login-stock-scene.svg') }}');" aria-hidden="true"></div>
                </div>
        </section>
    </div>
@endsection

@push('scripts')
<script>
    (() => {
        const form = document.querySelector('[data-login-form]');
        if (!form) {
            return;
        }

        const submitButton = form.querySelector('[data-login-submit]');
        const spinner = form.querySelector('[data-login-spinner]');
        const label = form.querySelector('[data-login-label]');
        const initialLabel = label ? label.textContent : 'Se connecter';

        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
            firstInvalid.focus();
        }

        form.addEventListener('submit', (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                form.classList.add('was-validated');
                const invalidInput = form.querySelector(':invalid');
                if (invalidInput) {
                    invalidInput.focus();
                }
                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.classList.add('is-loading');
            }
            if (spinner) {
                spinner.classList.remove('d-none');
            }
            if (label) {
                label.textContent = 'Connexion en cours...';
            }
        });

        window.addEventListener('pageshow', () => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.classList.remove('is-loading');
            }
            if (spinner) {
                spinner.classList.add('d-none');
            }
            if (label) {
                label.textContent = initialLabel;
            }
        });
    })();
</script>
@endpush

