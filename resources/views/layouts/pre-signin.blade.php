<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta Information -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Flatfile | CSV Importer (In Browser). Automatic column matching.</title>
    <meta name="description" content="The missing CSV importer for web apps. 30 minute setup. Validate, repair, and transform data w/machine learning.">

    <!-- Fonts -->
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:300,400,600' rel='stylesheet' type='text/css'>
    <link href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css' rel='stylesheet' type='text/css'>

    <!-- CSS -->
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <link href="{{ mix('css/pre-signin.css') }}" rel="stylesheet">

    <!-- Scripts -->
    @yield('scripts', '')

    <!-- Global Spark Object -->
    <script>
    window.Spark = <?php echo json_encode(array_merge(
        Spark::scriptVariables(), []
    )); ?>;
    </script>
    @include('components.scripts.google-analytics')
    @include('components.scripts.full-story')
</head>
<body class="@yield('page-class')">

  <nav>
  <div class="container">
    <a href="/" class="logo-container">
      <svg width="30" height="31" viewBox="0 0 30 31" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>flatfile_logo</title>
        <g id="Canvas" transform="translate(-963 485)">
          <g id="flatfile_logo">
            <use xlink:href="#path0_fill" transform="translate(963 -485)" fill="#3F9DF7"/>
          </g>
        </g>
        <defs>
          <path id="path0_fill" fill-rule="evenodd" d="M 0 7.06662L 14.9736 0L 30 7.09064L 30 7.10843L 14.9736 14.1994L 0 7.13248L 0 7.06662ZM 5.39825 7.0997L 14.9736 11.6185L 24.5506 7.0997L 14.9739 2.5806L 5.39825 7.0997ZM 0 21.4474L 0 24.022L 14.9736 31L 30 23.9983L 30 21.4236L 14.9736 28.4091L 0 21.4474ZM 0 15.6793L 0 13.1047L 14.9736 20.0658L 30 13.0806L 30 15.6556L 14.9736 22.6563L 0 15.6793Z"/>
        </defs>
      </svg>
      <span>Flatfile</span>
    </a>
  </div>
</nav>
<div id="spark-app" v-cloak>


<!-- Main Content -->

@yield('content')


</div>


<script src="{{ mix('js/app.js') }}"></script>

@include('components.scripts.intercom')
@yield('footer-scripts', '')
</body>
</html>
