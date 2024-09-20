<!DOCTYPE html>
<html lang="{{ locale }}">
<head>
  <!-- Google Tag Manager -->
  <script>(function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({
        'gtm.start':
          new Date().getTime(), event: 'gtm.js'
      });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src =
        'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-K5TKPRN8');</script>
  <!-- End Google Tag Manager -->

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <meta name="google-site-verification" content="tU74Gqe6W30B1vFAC_O8B3NLuGMsLYV4CA8cqt_hbes"/>
  {% if seo.description != '' %}
    <meta name="description" content="{{ seo.description }}">
    <meta property="og:description" content="{{ seo.description }}"/>
  {% else %}
    <meta property="og:description" content="{{ seo.title }}"/>
  {% endif %}
  {% if seo.keywords != '' %}
    <meta name="keywords" content="{{ seo.keywords }}">{% endif %}
  <meta property="og:title" content="{{ seo.title }}"/>
  {% if article.preview %}
    <meta property="og:image" content="{{ article.preview }}"/>
  {% endif %}

  <link rel="icon" href="{{ 'favicon.ico' | asset_path }}">

  <title>{{ seo.title }}</title>

  {{ wm3 }}
  {% assign version = "1.0" %}

  <link rel="alternate" type="application/rss+xml" href="/{{ locale }}/a.rss" title="RSS Feed">

  <!--- Bootstrap---->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

  <!--- Swiper--->
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
  />

  <!--- Google fonts--->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet">

  <!-- Google icons -->
  <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>

  <!-- Styles -->
  <link href="{{ 'print.css' | template_path }}?{{ version }}" rel="stylesheet">
  <link href="{{ 'form_anmalan_ny.css' | template_path }}?{{ version }}" rel="stylesheet">
  <link href="{{ 'application.css' | template_path }}?{{ version }}" rel="stylesheet">

</head>
<body class="{% if admin %}admin{% endif %} {{ cart.number }}">
{% assign page_path = request.path %}

<!-- Google Tag Manager (noscript) -->
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K5TKPRN8"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
<!-- End Google Tag Manager (noscript) -->

<body>
<header class="padding-y-sm padding-y-lg-base bg-transparent">
  <div class="container">
    <div class="row">
      {% include 'desktop_nav' %}
    </div>
  </div>
  {% include 'mobile_nav' %}

</header>
<main>
