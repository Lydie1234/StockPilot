<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    @include('partials.styles')
    <title>@yield('title', 'StockPilot')</title>
    @auth
    <script>
        window.userRole = "{{ auth()->user()->role }}";
        window.userId = {{ auth()->id() }};
        window.userName = @json(auth()->user()->name);
        window.userEmail = @json(auth()->user()->email);
    </script>
    @endauth
</head>
<body>
    <div id="overlay" class="overlay"></div>

    @include('partials.header')
    @include('partials.sidebar')

    <main id="content" class="content py-10">
        @yield('content')
    </main>
    @include('partials.scripts')
</body>
</html>
