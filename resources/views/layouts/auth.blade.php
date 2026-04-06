@extends('layouts.guest')

@section('content')
<div class="container d-flex align-items-center justify-content-center min-vh-100 py-4">
    <div class="w-100">
        <div class="text-center mb-4">
            <a href="{{ url('/') }}" class="d-inline-flex align-items-center justify-content-center">
                <x-application-logo style="width: 48px; height: 48px;" />
            </a>
        </div>

        @yield('auth-content')
    </div>
</div>
@endsection
