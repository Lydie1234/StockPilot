<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    @include('partials.styles')
    <title>@yield('title', 'StockPilot')</title>
</head>
<body>
    <div id="overlay" class="overlay"></div>

    @include('partials.header')
    @include('partials.sidebar')

    <main id="content" class="content py-10">
        @yield('content')
    </main>

    @include('partials.footer')

    @include('partials.scripts')
</body>
</html>
