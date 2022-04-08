<!DOCTYPE html>
<html>
<head>
  <title>Flatfile | CSV Importer (In Browser). Automatic column matching.</title>
  <link rel="stylesheet" type="text/css" href="{{mix('css/new-retail.css')}}">
  <meta name="description" content="The missing CSV importer for web apps. 30 minute setup. Validate, repair, and transform data w/machine learning.">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="icon" href="/favicon.ico?v=2" />
  <link rel="stylesheet"
    href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-dark.min.css">
  <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
  <script src="https://use.typekit.net/jtt7rba.js"></script>
  <script>try{Typekit.load({ async: true });}catch(e){}</script>

  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-107630400-1', 'auto');
    ga('send', 'pageview');
  </script>
  <script>
    window['_fs_debug'] = false;
    window['_fs_host'] = 'fullstory.com';
    window['_fs_org'] = '7N9B5';
    window['_fs_namespace'] = 'FS';
    (function(m,n,e,t,l,o,g,y){
        if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
        g=m[e]=function(a,b){g.q?g.q.push([a,b]):g._api(a,b);};g.q=[];
        o=n.createElement(t);o.async=1;o.src='https://'+_fs_host+'/s/fs.js';
        y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
        g.identify=function(i,v){g(l,{uid:i});if(v)g(l,v)};g.setUserVars=function(v){g(l,v)};
        y="rec";g.shutdown=function(i,v){g(y,!1)};g.restart=function(i,v){g(y,!0)};
        g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
        g.clearUserCookie=function(){};
    })(window,document,window['_fs_namespace'],'script','user');
    </script>
</head>
<body>
  <nav>
    <div class="container">
      <div class="logo-container">
        <svg width="30" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 30 31">
          <use fill="#3F9DF7" xlink:href="#path0_fill"/>
          <defs>
            <path id="path0_fill" fill-rule="evenodd" d="M0 7l15-7 15 7v.1l-15 7.1-15-7V7zm5.4.1l9.6 4.5 9.6-4.5L15 2.6 5.4 7zM0 21.4V24l15 7 15-7v-2.6l-15 7-15-7zm0-5.7V13l15 7 15-7v2.6l-15 7-15-7z"/>
          </defs>
        </svg>
        <span>Flatfile</span>
      </div>
      <ul class="display-desktop">
        <li><a href="https://developers.flatfile.io" target="_blank" title="Flatfile Documentation For CSV Importing">Documentation
          </a>
        </li>
        @if(Auth::check())
        <li><a href="/home" title="Flatfile Dashboard To Manage CSV">Dashboard
          </a>
        </li>
        @else
        <li><a href="/login" title="Login To Flatfile">Login</a>
        </li>
        @endif
        <li><a href="/register" class="btn btn-outline" title="Register For Flatfile">Signup</a></li>
      </ul>
      <div class="svg-container display-mobile">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 61" version="1.1" xml:space="preserve" style="" x="0px" y="0px" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.41421"><rect x="0" y="0" width="64" height="64" style="" fill="#3f9df7"/><path fill="#fff" d="M46.127,21.505c0.112,0.015 0.141,0.015 0.251,0.043c0.288,0.075 0.551,0.237 0.748,0.461c0.112,0.128 0.203,0.274 0.266,0.432c0.063,0.157 0.099,0.326 0.107,0.495c0.023,0.561 -0.278,1.1 -0.767,1.374c-0.149,0.082 -0.311,0.14 -0.478,0.168c-0.112,0.02 -0.141,0.017 -0.254,0.022l-28,0c-0.113,-0.005 -0.142,-0.002 -0.253,-0.022c-0.294,-0.05 -0.57,-0.189 -0.785,-0.395c-0.123,-0.118 -0.225,-0.256 -0.301,-0.408c-0.077,-0.151 -0.127,-0.316 -0.149,-0.484c-0.06,-0.468 0.11,-0.948 0.45,-1.274c0.092,-0.088 0.195,-0.164 0.306,-0.227c0.149,-0.082 0.311,-0.14 0.479,-0.168c0.111,-0.02 0.14,-0.017 0.253,-0.022l28,0c0.042,0.002 0.085,0.004 0.127,0.005Z" style="" fill-rule="nonzero"/><path fill="#fff" d="M46.127,30.505c0.112,0.015 0.141,0.015 0.251,0.043c0.288,0.075 0.551,0.237 0.748,0.461c0.112,0.128 0.203,0.274 0.266,0.432c0.209,0.52 0.104,1.129 -0.266,1.55c-0.112,0.128 -0.246,0.236 -0.394,0.319c-0.149,0.082 -0.311,0.14 -0.478,0.168c-0.112,0.02 -0.141,0.017 -0.254,0.022l-28,0c-0.113,-0.005 -0.142,-0.002 -0.253,-0.022c-0.168,-0.028 -0.33,-0.086 -0.479,-0.168c-0.411,-0.231 -0.696,-0.652 -0.756,-1.119c-0.016,-0.127 -0.016,-0.255 0,-0.382c0.022,-0.168 0.072,-0.333 0.149,-0.484c0.076,-0.152 0.178,-0.29 0.301,-0.408c0.215,-0.206 0.491,-0.345 0.785,-0.395c0.111,-0.02 0.14,-0.017 0.253,-0.022l28,0c0.042,0.002 0.085,0.004 0.127,0.005Z" style="" fill-rule="nonzero"/><path fill="#fff" d="M46.127,39.505c0.112,0.015 0.141,0.015 0.251,0.043c0.288,0.075 0.551,0.237 0.748,0.461c0.37,0.421 0.475,1.03 0.266,1.55c-0.063,0.158 -0.154,0.304 -0.266,0.432c-0.112,0.128 -0.246,0.236 -0.394,0.319c-0.149,0.082 -0.311,0.14 -0.478,0.168c-0.112,0.02 -0.141,0.017 -0.254,0.022l-28,0c-0.113,-0.005 -0.142,-0.002 -0.253,-0.022c-0.294,-0.05 -0.57,-0.189 -0.785,-0.395c-0.092,-0.088 -0.172,-0.188 -0.239,-0.297c-0.248,-0.401 -0.291,-0.908 -0.115,-1.345c0.064,-0.158 0.154,-0.304 0.266,-0.432c0.112,-0.128 0.246,-0.236 0.394,-0.319c0.149,-0.082 0.311,-0.14 0.479,-0.168c0.111,-0.02 0.14,-0.017 0.253,-0.022l28,0c0.042,0.002 0.085,0.004 0.127,0.005Z" style="" fill-rule="nonzero"/></svg>
      </div>
    </div>
  </nav>
  <ul class="mobile hide">

  <span id="navClose"> Close <svg width="32px" height="32px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style=>
      <g id="Hilary-Final" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="Home-Menu" transform="translate(-1098.000000, -23.000000)" fill="#fff">
      <g id="Group-10" transform="translate(1029.000000, 23.000000)">
      <g id="Group-8" transform="translate(68.000000, 0.000000)">
      <g id="Exit" transform="translate(0.000000, -1.000000)">
      <rect id="Rectangle-3" transform="translate(16.556349, 16.556349) rotate(-135.000000) translate(-16.556349, -16.556349) " x="-2.94365081" y="14.0563492" width="39" height="5"></rect>
      <rect id="Rectangle-3-Copy-2" transform="translate(16.500000, 16.500000) rotate(-45.000000) translate(-16.500000, -16.500000) " x="-3" y="14" width="39" height="5"></rect>
      </g>
      </g>
      </g>
      </g>
      </g>
      </svg>
    </span>
    <li><a href="https://developers.flatfile.io" target="_blank" title="Flatfile Documentation For CSV Importing">Documentation
        <svg viewBox="0 0 9 9" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
          <desc>Created with Sketch.</desc>
          <defs></defs>
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Desktop-HD" transform="translate(-1077.000000, -426.000000)" fill-rule="nonzero" fill="#fff">
              <path d="M1077.16619,430.923172 L1080.84706,434.808578 C1081.05366,435.015853 1081.49678,435.087201 1081.73841,434.857738 C1081.98006,434.628276 1081.97855,434.192826 1081.73534,433.96504 L1079.0386,431.114906 L1085.38427,431.114906 C1085.72307,431.114906 1085.99775,430.840209 1085.99775,430.501403 C1085.99775,430.162577 1085.72307,429.887923 1085.38427,429.887923 L1079.0386,429.887923 L1081.73534,427.037789 C1081.97857,426.810003 1081.99466,426.358133 1081.73841,426.145091 C1081.50163,425.948204 1081.06198,425.939595 1080.84706,426.194251 L1077.16619,430.079634 C1077.00977,430.236502 1076.88769,430.649252 1077.16619,430.923172 Z" id="next_white_icon-copy" transform="translate(1081.498875, 430.500000) rotate(-180.000000) translate(-1081.498875, -430.500000) "></path>
            </g>
          </g>
        </svg>
      </a></li>
    @if(Auth::check())
    <li><a href="/home" title="Flatfile Dashboard To Manage CSV">Dashboard
          <svg  viewBox="0 0 9 9" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
            <desc>Created with Sketch.</desc>
            <defs></defs>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Desktop-HD" transform="translate(-1077.000000, -426.000000)" fill-rule="nonzero" fill="#fff">
                <path d="M1077.16619,430.923172 L1080.84706,434.808578 C1081.05366,435.015853 1081.49678,435.087201 1081.73841,434.857738 C1081.98006,434.628276 1081.97855,434.192826 1081.73534,433.96504 L1079.0386,431.114906 L1085.38427,431.114906 C1085.72307,431.114906 1085.99775,430.840209 1085.99775,430.501403 C1085.99775,430.162577 1085.72307,429.887923 1085.38427,429.887923 L1079.0386,429.887923 L1081.73534,427.037789 C1081.97857,426.810003 1081.99466,426.358133 1081.73841,426.145091 C1081.50163,425.948204 1081.06198,425.939595 1080.84706,426.194251 L1077.16619,430.079634 C1077.00977,430.236502 1076.88769,430.649252 1077.16619,430.923172 Z" id="next_white_icon-copy" transform="translate(1081.498875, 430.500000) rotate(-180.000000) translate(-1081.498875, -430.500000) "></path>
              </g>
            </g>
          </svg>
        </a></li>
    @else
    <li><a href="/login" title="Login To Flatfile">Login
          <svg viewBox="0 0 9 9" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
            <desc>Created with Sketch.</desc>
            <defs></defs>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Desktop-HD" transform="translate(-1077.000000, -426.000000)" fill-rule="nonzero" fill="#fff">
                <path d="M1077.16619,430.923172 L1080.84706,434.808578 C1081.05366,435.015853 1081.49678,435.087201 1081.73841,434.857738 C1081.98006,434.628276 1081.97855,434.192826 1081.73534,433.96504 L1079.0386,431.114906 L1085.38427,431.114906 C1085.72307,431.114906 1085.99775,430.840209 1085.99775,430.501403 C1085.99775,430.162577 1085.72307,429.887923 1085.38427,429.887923 L1079.0386,429.887923 L1081.73534,427.037789 C1081.97857,426.810003 1081.99466,426.358133 1081.73841,426.145091 C1081.50163,425.948204 1081.06198,425.939595 1080.84706,426.194251 L1077.16619,430.079634 C1077.00977,430.236502 1076.88769,430.649252 1077.16619,430.923172 Z" id="next_white_icon-copy" transform="translate(1081.498875, 430.500000) rotate(-180.000000) translate(-1081.498875, -430.500000) "></path>
              </g>
            </g>
          </svg>
        </a></li>
    @endif
    <li><a href="/register" class="btn btn-outline" title="Register For Flatfile Today!">Join Today!</a></li>
  </ul>
  </div>
  <header>
    <div class="container">
      <div class="header-content">
        <h1>The missing CSV importer for web apps</h1>
        <h2 class="subhead">Giving your customers a good data import experience shouldn't require months of engineering and design work. Be off to the races with just a few lines of code.</h2>
        <div class="btn-row">
          <a href="/register" class="btn btn-white" title="Register For Flatfile!">Get your license key</a>
          <a href="/demo" class="btn btn-clear" title="Tryout Flatfile Demo" target="_blank">Try Demo!</a>
        </div>
        <div class="video-link">
          <a href="javascript:"  title="CSV Importing With Flatfile">
            <img src="img/play_btn.png">
            View Flatfile In Action!
          </a>
        </div>
      </div>
    </div>
  </header>
  <div class="header-image-container">
    <img src="img/column_match.png" alt="Flatfile CSV Importing">
  </div>

  <section>
    <div class="container">
      <div class="built-container align-center">
        <svg width="46px" height="46px" viewBox="0 0 46 46" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Desktop-HD" transform="translate(-439.000000, -513.000000)" fill-rule="nonzero" fill="#3FDDD9">
              <g id="built_icon" transform="translate(439.000000, 513.000000)">
                <path d="M43.7,0 L2.3,0 C1.03031958,0.00138591226 0.00138591227,1.03031958 0,2.3 L0,43.7 C0.00138591227,44.9696804 1.03031958,45.9986141 2.3,46 L43.7,46 C44.9696804,45.9986141 45.9986141,44.9696804 46,43.7 L46,2.3 C45.9986141,1.03031958 44.9696804,0.00138591226 43.7,0 Z M44.4666667,43.7 C44.4661176,44.1231906 44.1231906,44.4661176 43.7,44.4666667 L2.3,44.4666667 C1.87680934,44.4661176 1.53388241,44.1231906 1.53333333,43.7 L1.53333333,2.3 C1.53388241,1.87680934 1.87680934,1.53388241 2.3,1.53333333 L43.7,1.53333333 C44.1231906,1.53388241 44.4661176,1.87680934 44.4666667,2.3 L44.4666667,43.7 Z" id="Shape"></path>
                <path d="M42.1666667,3.06666667 L3.83333333,3.06666667 C3.40991503,3.06666667 3.06666667,3.40991503 3.06666667,3.83333333 L3.06666667,42.1666667 C3.06666667,42.5900849 3.40991503,42.9333333 3.83333333,42.9333333 L42.1666667,42.9333333 C42.5900849,42.9333333 42.9333333,42.5900849 42.9333333,42.1666667 L42.9333333,3.83333333 C42.9333333,3.40991503 42.5900849,3.06666667 42.1666667,3.06666667 Z M41.4,4.6 L41.4,24.5333333 L32.2,24.5333333 L32.2,20.7 C32.2,20.2765817 31.8567516,19.9333333 31.4333333,19.9333333 L18.4,19.9333333 L18.4,16.1 C18.4,15.6765817 18.0567516,15.3333333 17.6333333,15.3333333 L13.8,15.3333333 L13.8,11.5 C13.8,11.0765817 13.4567516,10.7333333 13.0333333,10.7333333 L9.2,10.7333333 L9.2,6.9 C9.2,6.47658169 8.8567516,6.13333333 8.43333333,6.13333333 L4.6,6.13333333 L4.6,4.6 L41.4,4.6 Z M4.6,35.2666667 L7.66666667,35.2666667 L7.66666667,38.3333333 L4.6,38.3333333 L4.6,35.2666667 Z M4.6,30.6666667 L12.2666667,30.6666667 L12.2666667,33.7333333 L4.6,33.7333333 L4.6,30.6666667 Z M4.6,26.0666667 L7.66666667,26.0666667 L7.66666667,29.1333333 L4.6,29.1333333 L4.6,26.0666667 Z M4.6,21.4666667 L12.2666667,21.4666667 L12.2666667,24.5333333 L4.6,24.5333333 L4.6,21.4666667 Z M4.6,16.8666667 L7.66666667,16.8666667 L7.66666667,19.9333333 L4.6,19.9333333 L4.6,16.8666667 Z M4.6,12.2666667 L12.2666667,12.2666667 L12.2666667,15.3333333 L4.6,15.3333333 L4.6,12.2666667 Z M7.66666667,10.7333333 L4.6,10.7333333 L4.6,7.66666667 L7.66666667,7.66666667 L7.66666667,10.7333333 Z M27.6,29.1333333 L27.6,26.0666667 L36.0333333,26.0666667 L36.0333333,29.1333333 L27.6,29.1333333 Z M23,33.7333333 L23,30.6666667 L30.6666667,30.6666667 L30.6666667,33.7333333 L23,33.7333333 Z M18.4,38.3333333 L18.4,35.2666667 L26.0666667,35.2666667 L26.0666667,38.3333333 L18.4,38.3333333 Z M16.8666667,26.0666667 L16.8666667,29.1333333 L9.2,29.1333333 L9.2,26.0666667 L16.8666667,26.0666667 Z M26.0666667,26.0666667 L26.0666667,29.1333333 L18.4,29.1333333 L18.4,26.0666667 L26.0666667,26.0666667 Z M21.4666667,30.6666667 L21.4666667,33.7333333 L13.8,33.7333333 L13.8,30.6666667 L21.4666667,30.6666667 Z M30.6666667,24.5333333 L23,24.5333333 L23,21.4666667 L30.6666667,21.4666667 L30.6666667,24.5333333 Z M21.4666667,24.5333333 L13.8,24.5333333 L13.8,21.4666667 L21.4666667,21.4666667 L21.4666667,24.5333333 Z M16.8666667,19.9333333 L9.2,19.9333333 L9.2,16.8666667 L16.8666667,16.8666667 L16.8666667,19.9333333 Z M9.2,35.2666667 L16.8666667,35.2666667 L16.8666667,38.3333333 L9.2,38.3333333 L9.2,35.2666667 Z M21.4666667,39.8666667 L21.4666667,41.4 L13.8,41.4 L13.8,39.8666667 L21.4666667,39.8666667 Z M23,39.8666667 L30.6666667,39.8666667 L30.6666667,41.4 L23,41.4 L23,39.8666667 Z M27.6,38.3333333 L27.6,35.2666667 L36.0333333,35.2666667 L36.0333333,38.3333333 L27.6,38.3333333 Z M37.5666667,35.2666667 L41.4,35.2666667 L41.4,38.3333333 L37.5666667,38.3333333 L37.5666667,35.2666667 Z M32.2,33.7333333 L32.2,30.6666667 L41.4,30.6666667 L41.4,33.7333333 L32.2,33.7333333 Z M37.5666667,29.1333333 L37.5666667,26.0666667 L41.4,26.0666667 L41.4,29.1333333 L37.5666667,29.1333333 Z M4.6,39.8666667 L12.2666667,39.8666667 L12.2666667,41.4 L4.6,41.4 L4.6,39.8666667 Z M32.2,41.4 L32.2,39.8666667 L41.4,39.8666667 L41.4,41.4 L32.2,41.4 Z" id="Shape"></path>
              </g>
            </g>
          </g>
        </svg>
        <h2>Built for developers!</h2>
        <p>Giving your customers a good data import experience shouldn't require weeks of engineering and design work. Using Flatfile you can be off to the races with just a few lines of code.</p>
        <a class="btn" href="/register" title="Register For Flatfile!">Create a developer account</a>
      </div>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="installation-container row">
        <div class="code-container col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <div class="dots-container">

            <svg width="8px" height="8px" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="Truck-World" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Artboard" transform="translate(-1664.000000, -1308.000000)" fill-rule="nonzero" fill="#EB5757">
                  <path d="M1672,1312 C1672,1314.20914 1670.20914,1316 1668,1316 C1665.79086,1316 1664,1314.20914 1664,1312 C1664,1309.79086 1665.79086,1308 1668,1308 C1670.20914,1308 1672,1309.79086 1672,1312 Z" id="red"></path>
                </g>
              </g>
            </svg>

            <svg width="8px" height="8px" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Truck-World" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Artboard" transform="translate(-1679.000000, -1308.000000)" fill-rule="nonzero" fill="#EBE957">
                  <path d="M1687,1312 C1687,1314.20914 1685.20914,1316 1683,1316 C1680.79086,1316 1679,1314.20914 1679,1312 C1679,1309.79086 1680.79086,1308 1683,1308 C1685.20914,1308 1687,1309.79086 1687,1312 Z" id="yellow"></path>
                </g>
              </g>
            </svg>


            <svg width="8px" height="8px" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
                <g id="Artboard" transform="translate(-1695.000000, -1308.000000)" fill-rule="nonzero" fill="#57EB61">
                  <path d="M1703,1312 C1703,1314.20914 1701.20914,1316 1699,1316 C1696.79086,1316 1695,1314.20914 1695,1312 C1695,1309.79086 1696.79086,1308 1699,1308 C1701.20914,1308 1703,1309.79086 1703,1312 Z" id="green"></path>
                </g>
              </g>
            </svg>
          </div>
          <div class="code-body">
            <pre><code>npm install flatfile-csv-importer --save</code></pre>
          </div>
          <div class="divider-text">or</div>
          <div class="code-body">
            <pre><code>&lt;script src="https://unpkg.com/flatfile-csv-importer/build/dist/index.min.js"&gt;&lt;/script&gt;
</code></pre>
          </div>
        </div>

        <div class="blurb col-lg-5 col-md-5 col-sm-12 col-xs-12 offset-lg-1 offset-md-1">
          <h2>
            <svg width="30px" height="46px" viewBox="0 0 30 46" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Desktop-HD" transform="translate(-929.000000, -854.000000)" fill-rule="nonzero" fill="#3FDDD9">
                  <g id="quick" transform="translate(929.000000, 854.000000)">
                    <path d="M23.4631944,0.511111111 C23.2096531,0.525439869 22.9705198,0.633619189 22.7923611,0.814583333 L0.303472222,23.3034569 C0.0145989859,23.5956849 -0.0712389599,24.0324674 0.0855624606,24.4122809 C0.242363881,24.7920943 0.611328305,25.0411171 1.02222222,25.0444547 L10.8131944,25.0444547 L5.15902778,44.1791769 C5.03917252,44.6220974 5.22910495,45.090616 5.62355027,45.3250445 C6.01799559,45.559473 6.52031415,45.5023762 6.85208333,45.1854013 L29.3409722,22.6965124 C29.6298167,22.4042809 29.7156365,21.9675171 29.5588387,21.5877212 C29.4020408,21.2079254 29.0330983,20.9589091 28.6222222,20.9555556 L18.83125,20.9555556 L24.4854167,1.82083333 C24.5782991,1.50475899 24.513175,1.16329368 24.3104807,0.903591611 C24.1077864,0.643889544 23.7923637,0.497779229 23.4631944,0.511111111 Z M21.4027778,5.07916667 L16.4993056,21.6902778 C16.4091093,21.9981446 16.4686583,22.3304962 16.6601358,22.5878942 C16.8516133,22.8452922 17.1528108,22.9978823 17.4736111,23.0000102 L26.1625,23.0000102 L8.24166667,40.9208436 L13.1451389,24.3097324 C13.2353313,24.001867 13.1757804,23.6695185 12.9843034,23.4121231 C12.7928263,23.1547278 12.4916312,23.002139 12.1708333,23.0000102 L3.48194444,23.0000102 L21.4027778,5.07916667 L21.4027778,5.07916667 Z" id="Shape"></path>
                  </g>
                </g>
              </g>
            </svg>

            <span>Quick Installation</span>
          </h2>
          <p>Choose between installing as an npm package or with a single CDN url. Typescript and webpack-ready module for easy usage in modern JS frameworks.</p>
          <a href="/demo" class="link" title="Checkout Flatfile Demo!">
            Checkout our live demo

            <svg width="9px" height="9px" viewBox="0 0 9 9" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Desktop-HD" transform="translate(-1077.000000, -426.000000)" fill-rule="nonzero" fill="#3F9DF7">
                  <path d="M1077.16619,430.923172 L1080.84706,434.808578 C1081.05366,435.015853 1081.49678,435.087201 1081.73841,434.857738 C1081.98006,434.628276 1081.97855,434.192826 1081.73534,433.96504 L1079.0386,431.114906 L1085.38427,431.114906 C1085.72307,431.114906 1085.99775,430.840209 1085.99775,430.501403 C1085.99775,430.162577 1085.72307,429.887923 1085.38427,429.887923 L1079.0386,429.887923 L1081.73534,427.037789 C1081.97857,426.810003 1081.99466,426.358133 1081.73841,426.145091 C1081.50163,425.948204 1081.06198,425.939595 1080.84706,426.194251 L1077.16619,430.079634 C1077.00977,430.236502 1076.88769,430.649252 1077.16619,430.923172 Z" id="next_white_icon-copy" transform="translate(1081.498875, 430.500000) rotate(-180.000000) translate(-1081.498875, -430.500000) "></path>
                </g>
              </g>
            </svg>
          </a>
        </div>
      </div>
      <div class="installation-container row">
        <div class="blurb col-lg-5 col-md-5 col-sm-12 col-xs-12">
          <h2 class="md-mt-50">
            <svg width="38px" height="46px" viewBox="0 0 38 46" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Desktop-HD" transform="translate(-958.000000, -574.000000)" fill-rule="nonzero" fill="#3FDDD9">
                  <g id="configure" transform="translate(958.000000, 574.000000)">
                    <path d="M23,32.6451613 L19.2903226,32.6451613 L19.2903226,0.741935484 C19.2903226,0.296774194 18.9935484,0 18.5483871,0 C18.1032258,0 17.8064516,0.296774194 17.8064516,0.741935484 L17.8064516,32.6451613 L14.0967742,32.6451613 C13.6516129,32.6451613 13.3548387,32.9419355 13.3548387,33.3870968 L13.3548387,37.8387097 C13.3548387,38.283871 13.6516129,38.5806452 14.0967742,38.5806452 L17.8064516,38.5806452 L17.8064516,45.2580645 C17.8064516,45.7032258 18.1032258,46 18.5483871,46 C18.9935484,46 19.2903226,45.7032258 19.2903226,45.2580645 L19.2903226,38.5806452 L23,38.5806452 C23.4451613,38.5806452 23.7419355,38.283871 23.7419355,37.8387097 L23.7419355,33.3870968 C23.7419355,32.9419355 23.4451613,32.6451613 23,32.6451613 Z M22.2580645,37.0967742 L14.8387097,37.0967742 L14.8387097,34.1290323 L22.2580645,34.1290323 L22.2580645,37.0967742 Z M36.3548387,20.0322581 L32.6451613,20.0322581 L32.6451613,0.741935484 C32.6451613,0.296774194 32.3483871,0 31.9032258,0 C31.4580645,0 31.1612903,0.296774194 31.1612903,0.741935484 L31.1612903,20.0322581 L27.4516129,20.0322581 C27.0064516,20.0322581 26.7096774,20.3290323 26.7096774,20.7741935 L26.7096774,25.2258065 C26.7096774,25.6709677 27.0064516,25.9677419 27.4516129,25.9677419 L31.1612903,25.9677419 L31.1612903,45.2580645 C31.1612903,45.7032258 31.4580645,46 31.9032258,46 C32.3483871,46 32.6451613,45.7032258 32.6451613,45.2580645 L32.6451613,25.9677419 L36.3548387,25.9677419 C36.8,25.9677419 37.0967742,25.6709677 37.0967742,25.2258065 L37.0967742,20.7741935 C37.0967742,20.3290323 36.8,20.0322581 36.3548387,20.0322581 Z M35.6129032,24.483871 L28.1935484,24.483871 L28.1935484,21.516129 L35.6129032,21.516129 L35.6129032,24.483871 Z M9.64516129,7.41935484 L5.93548387,7.41935484 L5.93548387,0.741935484 C5.93548387,0.296774194 5.63870968,0 5.19354839,0 C4.7483871,0 4.4516129,0.296774194 4.4516129,0.741935484 L4.4516129,7.41935484 L0.741935484,7.41935484 C0.296774194,7.41935484 0,7.71612903 0,8.16129032 L0,12.6129032 C0,13.0580645 0.296774194,13.3548387 0.741935484,13.3548387 L4.4516129,13.3548387 L4.4516129,45.2580645 C4.4516129,45.7032258 4.7483871,46 5.19354839,46 C5.63870968,46 5.93548387,45.7032258 5.93548387,45.2580645 L5.93548387,13.3548387 L9.64516129,13.3548387 C10.0903226,13.3548387 10.3870968,13.0580645 10.3870968,12.6129032 L10.3870968,8.16129032 C10.3870968,7.71612903 10.0903226,7.41935484 9.64516129,7.41935484 Z M8.90322581,11.8709677 L1.48387097,11.8709677 L1.48387097,8.90322581 L8.90322581,8.90322581 L8.90322581,11.8709677 Z" id="Shape"></path>
                  </g>
                </g>
              </g>
            </svg>
            <span>Easy Configuration</span>
          </h2>
          <p>With a few lines of code, configure the fields for your target data model and add
          validation rules. Use a simple promise based async/await compatible interface for processing the finished data.</p>
          <a href="https://developers.flatfile.io/docs/field-config" class="link" title="Flatfile Documentation For CSV Importing" target="_blank">
            Read Documentation

            <svg width="9px" height="9px" viewBox="0 0 9 9" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Desktop-HD" transform="translate(-1077.000000, -426.000000)" fill-rule="nonzero" fill="#3F9DF7">
                  <path d="M1077.16619,430.923172 L1080.84706,434.808578 C1081.05366,435.015853 1081.49678,435.087201 1081.73841,434.857738 C1081.98006,434.628276 1081.97855,434.192826 1081.73534,433.96504 L1079.0386,431.114906 L1085.38427,431.114906 C1085.72307,431.114906 1085.99775,430.840209 1085.99775,430.501403 C1085.99775,430.162577 1085.72307,429.887923 1085.38427,429.887923 L1079.0386,429.887923 L1081.73534,427.037789 C1081.97857,426.810003 1081.99466,426.358133 1081.73841,426.145091 C1081.50163,425.948204 1081.06198,425.939595 1080.84706,426.194251 L1077.16619,430.079634 C1077.00977,430.236502 1076.88769,430.649252 1077.16619,430.923172 Z" id="next_white_icon-copy" transform="translate(1081.498875, 430.500000) rotate(-180.000000) translate(-1081.498875, -430.500000) "></path>
                </g>
              </g>
            </svg>
          </a>
        </div>
        <div class="code-container col-lg-6 col-md-6 col-sm-12 col-xs-12 offset-lg-1">
          <div class="dots-container">

            <svg width="8px" height="8px" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="Truck-World" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Artboard" transform="translate(-1664.000000, -1308.000000)" fill-rule="nonzero" fill="#EB5757">
                  <path d="M1672,1312 C1672,1314.20914 1670.20914,1316 1668,1316 C1665.79086,1316 1664,1314.20914 1664,1312 C1664,1309.79086 1665.79086,1308 1668,1308 C1670.20914,1308 1672,1309.79086 1672,1312 Z" id="red"></path>
                </g>
              </g>
            </svg>

            <svg width="8px" height="8px" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Truck-World" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Artboard" transform="translate(-1679.000000, -1308.000000)" fill-rule="nonzero" fill="#EBE957">
                  <path d="M1687,1312 C1687,1314.20914 1685.20914,1316 1683,1316 C1680.79086,1316 1679,1314.20914 1679,1312 C1679,1309.79086 1680.79086,1308 1683,1308 C1685.20914,1308 1687,1309.79086 1687,1312 Z" id="yellow"></path>
                </g>
              </g>
            </svg>


            <svg width="8px" height="8px" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Truck-World" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Artboard" transform="translate(-1695.000000, -1308.000000)" fill-rule="nonzero" fill="#57EB61">
                  <path d="M1703,1312 C1703,1314.20914 1701.20914,1316 1699,1316 C1696.79086,1316 1695,1314.20914 1695,1312 C1695,1309.79086 1696.79086,1308 1699,1308 C1701.20914,1308 1703,1309.79086 1703,1312 Z" id="green"></path>
                </g>
              </g>
            </svg>
          </div>
          <div class="code-body">
            <pre><code>import FlatfileImporter from 'flatfile-csv-importer'

let importer = new FlatfileImporter(LICENSE_KEY, {
  type: 'User',
  fields: [
    {
      label: 'First Name',
      key: 'fname',
      validators: ['required', 'string'],
    },
    // ...
  ]
})

let data = await importer.load()</code></pre>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section>
    <div class="diag-stripe"></div>
    <div class="container">
      <div class="align-center">
        <svg width="64px" height="60px" viewBox="0 0 64 60" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs></defs>
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Desktop-HD" transform="translate(-312.000000, -483.000000)" fill-rule="nonzero" fill="#FFFFFF">
              <g id="why1" transform="translate(312.000000, 482.000000)">
                <path d="M63.643,56.436 L58.386,50.589 C59.048,50.075 59.519,49.308 59.743,48.328 C60.124,46.668 59.324,44.983 57.864,43.97 C59.271,42.911 59.975,41.397 59.846,39.581 C59.653,36.944 57.114,34.934 53.635,34.335 C53.783,34.202 53.899,34.03 53.946,33.821 C54.484,31.47 53.342,28.936 50.731,26.686 C48.293,24.584 44.814,22.938 40.932,22.051 C37.049,21.162 33.2,21.129 30.09,21.961 C27.369,22.688 25.468,24.02 24.564,25.762 C23.538,24.553 22.002,23.741 20.106,23.438 C17.758,23.061 15.113,23.506 12.658,24.691 C7.846,27.016 5.144,31.576 6.231,35.232 C4.713,35.549 3.319,36.402 2.208,37.725 C0.812,39.391 0.03,41.602 0.009,43.951 C-0.014,46.302 0.725,48.526 2.09,50.217 C3.501,51.964 5.407,52.937 7.456,52.956 C7.459,52.956 7.462,52.956 7.466,52.956 C7.554,52.956 7.634,52.929 7.715,52.906 C8.001,54.055 8.666,55.149 9.687,56.094 C11.17,57.467 13.236,58.373 15.503,58.645 C15.966,58.7 16.423,58.727 16.873,58.727 C19.759,58.727 22.315,57.625 23.768,55.88 C24.244,57.236 25.076,58.259 26.275,58.915 C27.457,59.562 28.988,59.875 31.013,59.875 C31.562,59.875 32.148,59.853 32.771,59.807 C35.257,59.629 38.765,58.577 40.534,56.743 C40.558,56.722 41.754,55.694 43.609,54.598 C43.798,54.649 44.001,54.662 44.199,54.592 C47.151,53.537 54.92,57.737 59.174,60.658 C59.408,60.864 59.716,60.985 60.055,61.004 C60.084,61.006 60.115,61.006 60.145,61.006 C60.849,61.006 61.745,60.576 62.563,59.84 C63.418,59.073 63.954,58.188 63.991,57.469 C64.011,57.073 63.887,56.706 63.643,56.436 Z M61.226,58.353 C60.815,58.722 60.453,58.912 60.258,58.979 C58.99,58.113 52.645,53.904 47.601,52.746 C48.804,52.34 50.091,52.047 51.412,51.982 C51.965,51.955 52.39,51.486 52.363,50.933 C52.336,50.381 51.845,49.953 51.314,49.984 C44.933,50.296 39.447,55.038 39.156,55.296 C37.923,56.572 35.177,57.631 32.628,57.814 C30.132,57.997 28.369,57.783 27.235,57.162 C26.498,56.759 25.496,55.945 25.323,53.557 C25.302,53.281 25.174,53.041 24.979,52.875 C24.969,52.788 24.956,52.706 24.925,52.627 C24.881,49.728 21.821,47.07 17.571,46.4 C17.026,46.316 16.513,46.687 16.427,47.233 C16.341,47.779 16.714,48.291 17.259,48.377 C20.63,48.907 23.216,51.036 22.905,53.025 C22.888,53.13 22.903,53.23 22.919,53.331 C22.296,55.604 19.207,57.074 15.739,56.66 C13.888,56.439 12.221,55.717 11.046,54.628 C9.957,53.619 9.435,52.422 9.574,51.254 C9.618,50.885 9.444,50.549 9.165,50.342 C9.438,50.115 9.591,49.758 9.517,49.385 C9.099,47.317 10.839,45.215 13.394,44.699 C13.935,44.59 14.286,44.062 14.177,43.521 C14.068,42.98 13.543,42.631 12.998,42.738 C9.362,43.472 6.921,46.631 7.556,49.781 C7.606,50.031 7.749,50.236 7.939,50.379 C7.762,50.529 7.638,50.738 7.6,50.984 C7.557,50.978 7.519,50.958 7.475,50.957 C6.035,50.943 4.675,50.234 3.646,48.961 C2.572,47.631 1.991,45.859 2.009,43.972 C2.027,42.084 2.642,40.323 3.741,39.013 C4.794,37.758 6.212,37.089 7.604,37.089 C8.178,37.093 8.608,36.651 8.614,36.099 C8.616,35.896 8.543,35.717 8.44,35.558 C8.43,35.437 8.404,35.315 8.348,35.2 C7.01,32.425 9.334,28.52 13.528,26.494 C15.618,25.485 17.84,25.102 19.79,25.415 C20.891,25.591 21.813,25.982 22.511,26.547 C21.466,26.665 20.472,26.994 19.618,27.538 C18.358,28.343 17.498,29.541 17.196,30.913 C17.077,31.453 17.418,31.987 17.957,32.105 C18.03,32.122 18.103,32.128 18.173,32.128 C18.632,32.128 19.046,31.811 19.15,31.344 C19.339,30.481 19.875,29.748 20.695,29.224 C21.773,28.536 23.192,28.319 24.588,28.627 C25.113,28.746 25.628,28.42 25.764,27.904 C25.894,27.775 26.001,27.623 26.045,27.431 C26.409,25.839 28.029,24.583 30.607,23.894 C33.408,23.145 36.915,23.183 40.487,24.001 C44.056,24.817 47.232,26.31 49.427,28.201 C51.448,29.944 52.363,31.782 51.997,33.375 C51.932,33.662 52.003,33.943 52.159,34.167 C51.602,34.138 51.029,34.139 50.442,34.181 C49.891,34.222 49.477,34.701 49.517,35.251 C49.557,35.801 50.032,36.208 50.587,36.177 C54.361,35.9 57.69,37.527 57.851,39.726 C57.954,41.154 57.31,42.176 55.885,42.849 C55.709,42.933 55.584,43.069 55.487,43.221 C55.182,43.334 54.93,43.575 54.852,43.915 C54.729,44.454 55.065,44.99 55.603,45.114 C57.082,45.454 58.065,46.696 57.793,47.882 C57.629,48.601 57.311,48.935 57.044,49.097 L56.375,48.353 C56.006,47.944 55.373,47.908 54.963,48.279 C54.553,48.648 54.519,49.28 54.888,49.691 L61.922,57.515 C61.819,57.708 61.598,58.02 61.226,58.353 Z" id="Shape"></path>
                <path d="M36.78,38.292 C33.778,38.897 31.596,41.161 31.284,43.706 C29.757,43.286 28.013,43.223 26.249,43.578 C25.707,43.687 25.356,44.215 25.466,44.756 C25.574,45.298 26.103,45.647 26.644,45.539 C28.37,45.192 30.062,45.292 31.412,45.823 C32.611,46.296 33.371,47.046 33.549,47.936 C33.645,48.412 34.063,48.74 34.529,48.74 C34.593,48.74 34.66,48.733 34.726,48.72 C35.267,48.612 35.619,48.084 35.509,47.543 C35.263,46.313 34.478,45.273 33.271,44.528 C33.143,42.597 34.792,40.732 37.176,40.252 C37.718,40.143 38.068,39.615 37.958,39.074 C37.849,38.533 37.324,38.183 36.78,38.292 Z" id="Shape"></path>
                <path d="M40.728,28.288 C39.025,27.618 36.933,27.479 34.835,27.901 C34.293,28.01 33.942,28.538 34.052,29.079 C34.16,29.62 34.687,29.97 35.23,29.862 C36.955,29.515 38.646,29.618 39.996,30.149 C41.195,30.622 41.955,31.372 42.135,32.264 C42.231,32.739 42.647,33.067 43.114,33.067 C43.18,33.067 43.246,33.06 43.313,33.047 C43.854,32.938 44.205,32.41 44.096,31.869 C43.776,30.29 42.581,29.019 40.728,28.288 Z" id="Shape"></path>
                <path d="M42.104,15.968 C42.255,16.049 42.417,16.087 42.577,16.087 C42.934,16.087 43.278,15.896 43.46,15.561 L48.274,6.603 C48.535,6.116 48.352,5.509 47.866,5.249 C47.378,4.986 46.774,5.17 46.512,5.656 L41.698,14.614 C41.437,15.101 41.618,15.706 42.104,15.968 Z" id="Shape"></path>
                <path d="M17.265,16.993 C17.458,17.272 17.77,17.421 18.085,17.421 C18.282,17.421 18.481,17.363 18.656,17.241 C19.109,16.926 19.22,16.303 18.905,15.849 L13.087,7.502 C12.773,7.05 12.149,6.939 11.695,7.254 C11.242,7.569 11.131,8.192 11.446,8.646 L17.265,16.993 Z" id="Shape"></path>
                <path d="M28.792,14.533 C29.345,14.533 29.792,14.085 29.792,13.533 L29.792,1.993 C29.792,1.44 29.345,0.993 28.792,0.993 C28.24,0.993 27.792,1.44 27.792,1.993 L27.792,13.533 C27.792,14.085 28.24,14.533 28.792,14.533 Z" id="Shape"></path>
              </g>
            </g>
          </g>
        </svg>
        <h2 class="white">Why Flatfile?</h2>
        <p class="white">Because data import shouldn't be a barrier to entry.</p>
        <div class="tab">
          <div class="tablinks" onclick="openFeature(event, 'columnMatching')" id="defaultOpen">
            <h3>Column Matching</h3>
            <p>Using machine learning and fuzzy matching, 95% of columns are automatically connected to your specified fields and a beautiful user experience allows for quick and intuitive manual review and editing.</p>
          </div>
          <div class="tablinks" onclick="openFeature(event, 'dataValidationAndRepair')">
            <h3>Data Validation & Repair</h3>
            <p>Flatfile allows you to configure a helpful set of validators to run on imported data before it ever hits your server, allowing your customer to fix almost all data issues in advance.</p>
          </div>
          <div class="tablinks" onclick="openFeature(event, 'dashboard')">
            <h3>Support Dashboard</h3>
            <p>Review a log of all imports, resolve any outstanding issues, or fix problems for your customers. Then choose whether to send the data directly to your API, to Zapier, or to a batch processing endpoint.</p>
          </div>
        </div>

        <div id="columnMatching" class="tabcontent">
          <div class="img-container preview-img">
            <img src="img/column-matching.gif">
          </div>
        </div>
        <div id="dataValidationAndRepair" class="tabcontent">
          <div class="img-container preview-img">
            <img src="img/error-fixing.png">
          </div>
        </div>
        <div id="dashboard" class="tabcontent">
          <div class="img-container">
            <img src="img/tab_content_dashboard.png" onclick="alert('coming soon')">
          </div>
        </div>

        <a class="btn" href="/register" title="Sign Up For Flatfile">Get started with a free-forever license key</a>
      </div>
    </div>
  </section>

  <section>

    <div class="container">
      <div class="align-center">
        <svg width="37px" height="46px" viewBox="0 0 37 46" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Desktop-HD" transform="translate(-750.000000, -557.000000)" fill-rule="nonzero" fill="#3FDDD9">
              <g id="wait_icon" transform="translate(750.000000, 557.000000)">
                <path d="M36.8,25.5875 C35.8895833,17.0104167 29.1333333,10.20625 20.55625,9.34375 L20.55625,9.34375 L20.55625,5.84583333 C20.55625,5.31875 20.125,4.8875 19.5979167,4.8875 L17.7291667,4.8875 C17.2020833,4.8875 16.7708333,5.31875 16.7708333,5.84583333 L16.7708333,9.34375 C6.75625,10.3979167 -0.527083333,19.3583333 0.527083333,29.3729167 C1.58125,39.3875 10.5416667,46.6708333 20.55625,45.6166667 C30.5708333,44.5625 37.80625,35.6020833 36.8,25.5875 Z M18.6875,43.84375 C9.63125,43.84375 2.34791667,36.5125 2.34791667,27.5041667 C2.34791667,18.4958333 9.67916667,11.1166667 18.6875,11.1166667 C27.6958333,11.1166667 35.0270833,18.4479167 35.0270833,27.45625 C35.0270833,36.4645833 27.74375,43.84375 18.6875,43.84375 Z" id="Shape"></path>
                <path d="M18.6875,31.19375 C20.7,31.19375 22.3770833,29.5645833 22.3770833,27.5041667 C22.3770833,25.4916667 20.7479167,23.8145833 18.6875,23.8145833 C16.675,23.8145833 14.9979167,25.44375 14.9979167,27.5041667 C14.9979167,28.0791667 15.1416667,28.6541667 15.38125,29.1333333 L8.9125,35.65 C8.52916667,36.0333333 8.52916667,36.6083333 8.9125,36.9916667 C9.29583333,37.375 9.87083333,37.375 10.2541667,36.9916667 L16.675,30.5229167 C17.25,30.9541667 17.96875,31.19375 18.6875,31.19375 Z M16.8666667,27.5041667 C16.8666667,26.4979167 17.68125,25.73125 18.6875,25.73125 C19.69375,25.73125 20.5083333,26.5458333 20.5083333,27.5520833 C20.5083333,28.5583333 19.69375,29.3729167 18.6875,29.3729167 C17.68125,29.2770833 16.8666667,28.5104167 16.8666667,27.5041667 C16.8666667,27.5041667 16.8666667,27.5041667 16.8666667,27.5041667 Z" id="Shape"></path>
                <path d="M34.2604167,13.0333333 C34.64375,13.36875 35.21875,13.36875 35.6020833,12.9854167 C35.9375,12.6020833 35.9375,12.075 35.6020833,11.6916667 L32.5833333,8.67291667 C32.2,8.3375 31.625,8.3375 31.2416667,8.72083333 C30.90625,9.10416667 30.90625,9.63125 31.2416667,10.0145833 L34.2604167,13.0333333 Z" id="Shape"></path>
                <path d="M19.69375,14.3270833 C19.1666667,14.2791667 18.6875,14.7104167 18.6875,15.2375 C18.6875,15.2375 18.6875,15.2854167 18.6875,15.2854167 C18.6875,15.7645833 19.0229167,16.1479167 19.5020833,16.1958333 C25.73125,16.675 30.4270833,22.0895833 29.9479167,28.31875 C29.5645833,33.6854167 25.44375,37.9979167 20.125,38.7166667 C17.7770833,39.0041667 15.4291667,38.5729167 13.3208333,37.4708333 C12.8416667,37.23125 12.2666667,37.375 12.0270833,37.8541667 C11.7875,38.3333333 11.93125,38.9083333 12.4104167,39.1479167 C14.7583333,40.4416667 17.4416667,40.9208333 20.125,40.6333333 C27.3604167,39.8666667 32.63125,33.35 31.8645833,26.0666667 C31.19375,19.7416667 26.0666667,14.80625 19.69375,14.3270833 Z" id="Shape"></path>
                <path d="M12.8895833,6.80416667 C12.8895833,6.80416667 12.8895833,6.80416667 12.8895833,6.80416667 C13.4166667,6.80416667 13.8479167,6.37291667 13.8479167,5.84583333 L13.8479167,4.025 C13.8479167,2.97083333 14.7104167,2.15625 15.7166667,2.15625 L21.6104167,2.15625 C22.6645833,2.15625 23.4791667,3.01875 23.4791667,4.025 L23.4791667,5.84583333 C23.4791667,6.37291667 23.9104167,6.80416667 24.4375,6.80416667 C24.9645833,6.80416667 25.3958333,6.37291667 25.3958333,5.84583333 L25.3958333,4.025 C25.3958333,1.96458333 23.71875,0.239583333 21.6104167,0.239583333 L15.7166667,0.239583333 C13.65625,0.239583333 11.93125,1.91666667 11.93125,4.025 L11.93125,5.84583333 C11.93125,6.37291667 12.3625,6.80416667 12.8895833,6.80416667 Z" id="Shape"></path>
              </g>
            </g>
          </g>
        </svg>
        <h2>+ a growing list of features</h2>
        <p>We'd love to hear about features that would be valuable to your company.</p>
      </div>
      @include('components.features')
    </div>
  </section>

  <section>
    <div class="container">
      <div class="cta-btns row">
        <a href="/register" class="interested-card col-md col-sm-12 col-xs-12" title="Register For Flatfile Today">
          <div class="card-svg">
            <svg width="55px" height="61px" viewBox="0 0 55 61" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Desktop-HD" transform="translate(-529.000000, -693.000000)" fill-rule="nonzero" fill="#3FDDD9">
                  <g id="start_icon" transform="translate(529.000000, 693.000000)">
                    <path d="M27.2894737,60.5986842 C34.5934211,60.5986842 41.4157895,57.7092105 46.5526316,52.5723684 C57.1473684,41.8973684 57.1473684,24.4802632 46.5526316,13.725 C45.9105263,13.0828947 44.9473684,13.0828947 44.3052632,13.725 C43.6631579,14.3671053 43.6631579,15.3302632 44.3052632,15.9723684 C53.6960526,25.4434211 53.6960526,40.8539474 44.3052632,50.2447368 C39.7302632,54.9 33.7105263,57.3881579 27.2894737,57.3881579 C20.8684211,57.3881579 14.8486842,54.9 10.2736842,50.325 C0.882894737,40.8539474 0.882894737,25.4434211 10.2736842,16.0526316 C10.9157895,15.4105263 10.9157895,14.4473684 10.2736842,13.8052632 C9.63157895,13.1631579 8.58815789,13.1631579 8.02631579,13.8052632 C-2.56842105,24.4802632 -2.56842105,41.8973684 8.02631579,52.6526316 C13.1631579,57.7092105 19.9855263,60.5986842 27.2894737,60.5986842 Z" id="Shape"></path>
                    <path d="M27.2894737,33.3092105 C28.1723684,33.3092105 28.8947368,32.5868421 28.8947368,31.7039474 L28.8947368,2.00657895 C28.8947368,1.12368421 28.1723684,0.401315789 27.2894737,0.401315789 C26.4065789,0.401315789 25.6842105,1.12368421 25.6842105,2.00657895 L25.6842105,31.7039474 C25.6842105,32.5868421 26.4065789,33.3092105 27.2894737,33.3092105 Z" id="Shape"></path>
                  </g>
                </g>
              </g>
            </svg>
          </div>
          <div class="card-body">
            <h3>Ready to start?</h3>
            <small>Create an account to obtain your license key</small>
          </div>
          <div class="card-go">

            <svg width="25px" height="23px" viewBox="0 0 25 23" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Desktop-HD" transform="translate(-1156.000000, -413.000000)" fill-rule="nonzero" fill="#3FDDD9">
                  <path d="M1169.8615,412.177106 C1169.09378,411.399565 1167.84933,411.402691 1167.07794,412.18818 L1157.89561,421.538269 C1156.40374,423.033248 1158.64075,425.274924 1160.13262,423.779945 L1166.36273,417.531507 C1166.6694,417.223934 1166.918,417.331921 1166.918,417.7681 L1166.918,435.007373 C1166.918,435.885021 1167.62022,436.596494 1168.50005,436.596494 C1169.37379,436.596494 1170.08209,435.886549 1170.08209,435.007373 L1170.08209,417.7681 C1170.08209,417.32986 1170.33164,417.224873 1170.63737,417.531507 L1176.86748,423.779945 C1178.35856,425.274924 1180.59636,423.033248 1179.10449,421.538269 L1169.8615,412.177106 Z" id="next-lg_teal_icon" transform="translate(1168.500000, 424.096494) rotate(-270.000000) translate(-1168.500000, -424.096494) "></path>
                </g>
              </g>
            </svg>
          </div>
        </a>
        <a href="#" id="help-btn" class="question-card col-md col-xs-12" title="Help With Flatfile">
          <div class="card-svg">
            <svg width="37px" height="61px" viewBox="0 0 37 61" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Desktop-HD" transform="translate(-799.000000, -699.000000)" fill-rule="nonzero" fill="#3F9DF7">
                  <g id="question_icon" transform="translate(799.000000, 699.000000)">
                    <path d="M18.3080239,0 C9.20828794,0 1.80544994,6.101098 0.05426194,13.115 C-0.15679806,13.753182 0.27215394,14.5260764 0.92534194,14.6841762 C1.57852994,14.8422638 2.31309194,14.3511162 2.41703594,13.686936 C3.84846194,7.95318 10.3162919,2.44 18.3080239,2.44 C22.2807099,2.44 26.3134199,3.846416 29.2831439,6.2525 C32.2529899,8.658584 34.1609479,11.996626 34.1609479,15.86 C34.1609479,20.2452168 33.1908039,22.7126912 31.7601099,24.5525 C30.3299039,26.3923088 28.3012879,27.6452244 26.1201719,29.2037744 C23.9394219,30.7623244 21.6288639,32.6414904 19.9086639,35.8375244 C18.1884639,39.0335584 17.0886339,43.4794824 17.0886339,50.0200244 C17.0764339,50.6647944 17.6636199,51.2579584 18.3081459,51.2579584 C18.9525499,51.2579584 19.5369299,50.6647944 19.5275359,50.0200244 C19.5275359,43.7505664 20.5617299,39.7708044 22.0426879,37.0193384 C23.5236459,34.2678724 25.4810139,32.6777244 27.5684339,31.1862744 C29.6553659,29.6948244 31.8949199,28.3170784 33.6657499,26.039375 C35.4363359,23.7616838 36.5999719,20.6247832 36.5999719,15.86 C36.5999719,11.183374 34.2376859,7.16323 30.8075339,4.384436 C27.3773819,1.605276 22.8621619,0 18.3080239,0 L18.3080239,0 Z M18.3080239,56.1200244 C16.9610219,56.1200244 15.8691219,57.2124124 15.8691219,58.5600244 C15.8691219,59.9076364 16.9610219,61.0000244 18.3080239,61.0000244 C19.6550259,61.0000244 20.7469259,59.9076364 20.7469259,58.5600244 C20.7469259,57.2124124 19.6550259,56.1200244 18.3080239,56.1200244 L18.3080239,56.1200244 Z" id="Shape"></path>
                  </g>
                </g>
              </g>
            </svg>

          </div>
          <div class="card-body">
            <h3>Chat with us</h3>
            <small>We're here to answer all your questions.</small>
          </div>
          <div class="card-go">

            <svg width="25px" height="23px" viewBox="0 0 25 23" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Desktop-HD" transform="translate(-1156.000000, -381.000000)" fill-rule="nonzero" fill="#3F9DF7">
                  <path d="M1169.8615,380.177106 C1169.09378,379.399565 1167.84933,379.402691 1167.07794,380.18818 L1157.89561,389.538269 C1156.40374,391.033248 1158.64075,393.274924 1160.13262,391.779945 L1166.36273,385.531507 C1166.6694,385.223934 1166.918,385.331921 1166.918,385.7681 L1166.918,403.007373 C1166.918,403.885021 1167.62022,404.596494 1168.50005,404.596494 C1169.37379,404.596494 1170.08209,403.886549 1170.08209,403.007373 L1170.08209,385.7681 C1170.08209,385.32986 1170.33164,385.224873 1170.63737,385.531507 L1176.86748,391.779945 C1178.35856,393.274924 1180.59636,391.033248 1179.10449,389.538269 L1169.8615,380.177106 Z" id="next_lg_blue_icon" transform="translate(1168.500000, 392.096494) rotate(-270.000000) translate(-1168.500000, -392.096494) "></path>
                </g>
              </g>
            </svg>
          </div>
        </a>
      </div>
    </div>
  </section>

  <footer>
    <div class="footer-bg">
      <svg width="1440px" height="535px" viewBox="0 0 1440 535" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <linearGradient x1="-35.0361111%" y1="-55.1966324%" x2="64.9638889%" y2="-268.100281%" id="footerGradient">
            <stop stop-color="#3FDEF7" offset="0%"></stop>
            <stop stop-color="#3FA1F7" offset="53.5912%"></stop>
            <stop stop-color="#3F45F7" offset="100%"></stop>
          </linearGradient>
        </defs>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Desktop-HD-Copy" transform="translate(0.000000, -172.000000)" fill-rule="nonzero">
            <g id="next_icon" transform="translate(0.000000, 172.000000)">
              <path d="M649.169991,350.097815 C650.494991,351.305815 652.636491,351.299815 653.952591,350.085115 L662.808591,341.911015 C666.421491,338.544115 661.001591,333.493385 657.388691,336.860315 L657.352991,336.893915 C656.236791,337.946315 655.331891,337.595215 655.331891,336.116215 L655.331891,329.565345 C655.331891,327.596265 653.611791,326.000015 651.477091,326.000015 L651.521991,326.000015 C649.392991,326.000015 647.667161,327.595185 647.667161,329.565345 L647.667161,336.116215 C647.667161,337.598115 646.759451,337.943215 645.646991,336.893915 L645.611311,336.860315 C641.998361,333.493385 636.578461,338.544115 640.191411,341.911015 L649.169991,350.097815 Z" id="path0_fill" fill="#3FDDD9" transform="translate(651.499988, 338.500003) rotate(-90.000000) translate(-651.499988, -338.500003) "></path>
              <g id="footer" >
                <polygon id="path0_fill" points="0 480.667 1440 0 1440 534.5 0 534.5"></polygon>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>

    <div class="container">
      <div class="copy-logo">
        <div class="logo-container">
          <svg width="30" height="31" viewBox="0 0 30 31" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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
        </div>
        <span>&copy; 2017 Flatfile All Rights Reserved.</span>
      </div>

      <hr >
      <ul>
        <li><a href="https://developers.flatfile.io" target="_blank" title="Flatfile Documentation For CSV Importing">Documentation
          <svg width="9px" height="9px" viewBox="0 0 9 9" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
            <desc>Created with Sketch.</desc>
            <defs></defs>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Desktop-HD" transform="translate(-1077.000000, -426.000000)" fill-rule="nonzero" fill="#3F9DF7">
                <path d="M1077.16619,430.923172 L1080.84706,434.808578 C1081.05366,435.015853 1081.49678,435.087201 1081.73841,434.857738 C1081.98006,434.628276 1081.97855,434.192826 1081.73534,433.96504 L1079.0386,431.114906 L1085.38427,431.114906 C1085.72307,431.114906 1085.99775,430.840209 1085.99775,430.501403 C1085.99775,430.162577 1085.72307,429.887923 1085.38427,429.887923 L1079.0386,429.887923 L1081.73534,427.037789 C1081.97857,426.810003 1081.99466,426.358133 1081.73841,426.145091 C1081.50163,425.948204 1081.06198,425.939595 1080.84706,426.194251 L1077.16619,430.079634 C1077.00977,430.236502 1076.88769,430.649252 1077.16619,430.923172 Z" id="next_white_icon-copy" transform="translate(1081.498875, 430.500000) rotate(-180.000000) translate(-1081.498875, -430.500000) "></path>
              </g>
            </g>
          </svg></a></li>
        @if(Auth::check())
        <li><a href="/home" title="Flatfile Dashboard To Manage CSV">Dashboard
          <svg width="9px" height="9px" viewBox="0 0 9 9" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
            <desc>Created with Sketch.</desc>
            <defs></defs>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Desktop-HD" transform="translate(-1077.000000, -426.000000)" fill-rule="nonzero" fill="#3F9DF7">
                <path d="M1077.16619,430.923172 L1080.84706,434.808578 C1081.05366,435.015853 1081.49678,435.087201 1081.73841,434.857738 C1081.98006,434.628276 1081.97855,434.192826 1081.73534,433.96504 L1079.0386,431.114906 L1085.38427,431.114906 C1085.72307,431.114906 1085.99775,430.840209 1085.99775,430.501403 C1085.99775,430.162577 1085.72307,429.887923 1085.38427,429.887923 L1079.0386,429.887923 L1081.73534,427.037789 C1081.97857,426.810003 1081.99466,426.358133 1081.73841,426.145091 C1081.50163,425.948204 1081.06198,425.939595 1080.84706,426.194251 L1077.16619,430.079634 C1077.00977,430.236502 1076.88769,430.649252 1077.16619,430.923172 Z" id="next_white_icon-copy" transform="translate(1081.498875, 430.500000) rotate(-180.000000) translate(-1081.498875, -430.500000) "></path>
              </g>
            </g>
          </svg></a></li>
        @else
        <li><a href="/login" title="Login To Flatfile">Login
          <svg width="9px" height="9px" viewBox="0 0 9 9" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
            <desc>Created with Sketch.</desc>
            <defs></defs>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Desktop-HD" transform="translate(-1077.000000, -426.000000)" fill-rule="nonzero" fill="#3F9DF7">
                <path d="M1077.16619,430.923172 L1080.84706,434.808578 C1081.05366,435.015853 1081.49678,435.087201 1081.73841,434.857738 C1081.98006,434.628276 1081.97855,434.192826 1081.73534,433.96504 L1079.0386,431.114906 L1085.38427,431.114906 C1085.72307,431.114906 1085.99775,430.840209 1085.99775,430.501403 C1085.99775,430.162577 1085.72307,429.887923 1085.38427,429.887923 L1079.0386,429.887923 L1081.73534,427.037789 C1081.97857,426.810003 1081.99466,426.358133 1081.73841,426.145091 C1081.50163,425.948204 1081.06198,425.939595 1080.84706,426.194251 L1077.16619,430.079634 C1077.00977,430.236502 1076.88769,430.649252 1077.16619,430.923172 Z" id="next_white_icon-copy" transform="translate(1081.498875, 430.500000) rotate(-180.000000) translate(-1081.498875, -430.500000) "></path>
              </g>
            </g>
          </svg></a></li>
        @endif
        {{--<li><a href="javascript:">Pricing--}}
          {{--<svg width="9px" height="9px" viewBox="0 0 9 9" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">--}}
            {{--<!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->--}}
            {{--<desc>Created with Sketch.</desc>--}}
            {{--<defs></defs>--}}
            {{--<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">--}}
              {{--<g id="Desktop-HD" transform="translate(-1077.000000, -426.000000)" fill-rule="nonzero" fill="#3F9DF7">--}}
                {{--<path d="M1077.16619,430.923172 L1080.84706,434.808578 C1081.05366,435.015853 1081.49678,435.087201 1081.73841,434.857738 C1081.98006,434.628276 1081.97855,434.192826 1081.73534,433.96504 L1079.0386,431.114906 L1085.38427,431.114906 C1085.72307,431.114906 1085.99775,430.840209 1085.99775,430.501403 C1085.99775,430.162577 1085.72307,429.887923 1085.38427,429.887923 L1079.0386,429.887923 L1081.73534,427.037789 C1081.97857,426.810003 1081.99466,426.358133 1081.73841,426.145091 C1081.50163,425.948204 1081.06198,425.939595 1080.84706,426.194251 L1077.16619,430.079634 C1077.00977,430.236502 1076.88769,430.649252 1077.16619,430.923172 Z" id="next_white_icon-copy" transform="translate(1081.498875, 430.500000) rotate(-180.000000) translate(-1081.498875, -430.500000) "></path>--}}
              {{--</g>--}}
            {{--</g>--}}
          {{--</svg></a></li>--}}
        {{--<li><a href="http://help.flatfile.io">Support--}}
          {{--<svg width="9px" height="9px" viewBox="0 0 9 9" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">--}}
            {{--<!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->--}}
            {{--<desc>Created with Sketch.</desc>--}}
            {{--<defs></defs>--}}
            {{--<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">--}}
              {{--<g id="Desktop-HD" transform="translate(-1077.000000, -426.000000)" fill-rule="nonzero" fill="#3F9DF7">--}}
                {{--<path d="M1077.16619,430.923172 L1080.84706,434.808578 C1081.05366,435.015853 1081.49678,435.087201 1081.73841,434.857738 C1081.98006,434.628276 1081.97855,434.192826 1081.73534,433.96504 L1079.0386,431.114906 L1085.38427,431.114906 C1085.72307,431.114906 1085.99775,430.840209 1085.99775,430.501403 C1085.99775,430.162577 1085.72307,429.887923 1085.38427,429.887923 L1079.0386,429.887923 L1081.73534,427.037789 C1081.97857,426.810003 1081.99466,426.358133 1081.73841,426.145091 C1081.50163,425.948204 1081.06198,425.939595 1080.84706,426.194251 L1077.16619,430.079634 C1077.00977,430.236502 1076.88769,430.649252 1077.16619,430.923172 Z" id="next_white_icon-copy" transform="translate(1081.498875, 430.500000) rotate(-180.000000) translate(-1081.498875, -430.500000) "></path>--}}
              {{--</g>--}}
            {{--</g>--}}
          {{--</svg></a></li>--}}
      </ul>
    </div>


  </footer>
  <script type="text/javascript" src="{{mix('js/new-retail.js')}}"></script>
  <script>
    document.getElementById("defaultOpen").click();
    function openFeature(evt, featureName) {
      // Declare all variables
      var i, tabcontent, tablinks;

      // Get all elements with class="tabcontent" and hide them
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }

      // Get all elements with class="tablinks" and remove the class "active"
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }

      // Show the current tab, and add an "active" class to the button that opened the tab
      document.getElementById(featureName).style.display = "block";
      evt.currentTarget.className += " active";
    }
  </script>

  <div style="display:none">
   <svg id="ico-check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 12">
      <path fill="#3F9DF7" fill-rule="evenodd" d="M16.4.6l-.4.2-9.7 9.7-4.6-4.6a.6.6 0 1 0-.9.9l5 5c.3.3.7.3 1 0l10-10a.6.6 0 0 0-.4-1.2z"/>
    </svg>
  </div>

  <script>
      window.intercomSettings = {
          app_id: '{{env('INTERCOM_APP_ID')}}',
          @if(Auth::check())
          <?php
          $user = Auth::user();
          $team = $user->teams()->first();
          $user_hash = hash_hmac(
              'sha256', // hash function
              $user->id, // user's email address
              env('INTERCOM_SECRET_KEY') // secret key (keep safe!)
          );
          ?>
          user_id: {{$user->id}}, // id
          name: '{{$user->name}}', // Full name
          email: '{{$user->email}}', // Email address
          created_at: '{{$user->created_at->timestamp}}', // Signup Date
          user_hash: '{{$user_hash}}',
          company: {
            id: {{$team->id}},
            name: '{{$team->name}}',
            created_at: '{{$team->created_at->timestamp}}', // Signup Date
          }
          @endif
      };
  </script>
  <script>(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/yfuh6ea1';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()</script>
  <script type="text/javascript">
      Intercom('trackEvent', 'page-view');
      Intercom('trackEvent', 'view-home');
  </script>
</body>
</html>
