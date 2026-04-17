@extends('layouts.guest')

@section('content')
@php
    $isLoginPage = request()->routeIs('login');
@endphp

@if($isLoginPage)
    <div class="sp-auth-layout sp-auth-layout-login position-relative">
        <div class="sp-auth-bg" aria-hidden="true"></div>
        <div class="sp-auth-wrap-login position-relative">
            @yield('auth-content')
        </div>
    </div>
@else
    <div class="container d-flex align-items-center justify-content-center min-vh-100 py-4 py-md-5 sp-auth-layout position-relative">
        <div class="sp-auth-bg" aria-hidden="true"></div>
        <div class="w-100 sp-auth-wrap position-relative">
            <div class="text-center mb-4">
                <a href="{{ url('/') }}" class="d-inline-flex align-items-center justify-content-center">
                    <x-application-logo style="width: 48px; height: 48px;" />
                </a>
            </div>

            @yield('auth-content')
        </div>
    </div>
@endif
@endsection
