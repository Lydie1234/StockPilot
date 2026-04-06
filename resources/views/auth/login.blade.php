@extends('layouts.auth')

@section('title', 'Signin - InApp Inventory Dashboard')

@section('auth-content')
    <div class="card mx-auto" style="max-width:420px; width:100%;">
        <div class="card-body p-5">
            <div class="text-center mb-3">
                <h1 class="card-title mb-5 h5">Sign in to your account</h1>
            </div>

            <form class="needs-validation mt-3" novalidate method="POST" action="{{ route('login') }}">
                @csrf

                <div class="mb-3">
                    <label for="email" class="form-label">Email address</label>
                    <input id="email" name="email" type="email" class="form-control @error('email') is-invalid @enderror"
                        placeholder="name@example.com" value="{{ old('email') }}" required autofocus>
                    @error('email')
                        <div class="invalid-feedback d-block">{{ $message }}</div>
                    @else
                        <div class="invalid-feedback">Please enter a valid email.</div>
                    @enderror
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label d-flex justify-content-between">
                        <span>Password</span>
                        @if (Route::has('password.request'))
                            <a href="{{ route('password.request') }}" class="small link-primary">Forgot Password?</a>
                        @endif
                    </label>
                    <input id="password" name="password" type="password" class="form-control @error('password') is-invalid @enderror"
                        placeholder="Password" required minlength="6">
                    @error('password')
                        <div class="invalid-feedback d-block">{{ $message }}</div>
                    @else
                        <div class="invalid-feedback">Please provide a password (min 6 characters).</div>
                    @enderror
                </div>

                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="form-check">
                        <input id="remember" name="remember" class="form-check-input" type="checkbox">
                        <label class="form-check-label small" for="remember">Remember me</label>
                    </div>
                </div>

                <button class="btn btn-primary w-100" type="submit">Sign in</button>
            </form>
        </div>
    </div>
@endsection

