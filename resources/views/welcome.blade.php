<!DOCTYPE html>
<html>
<head>
  <title>Flatfile</title>
  <link rel="stylesheet" type="text/css" href="{{mix('css/retail.css')}}">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
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


</head>
<body>
<nav>
<div class="container">
  <div class="logo-container">
    <svg width="30" height="31" viewBox="0 0 30 31" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <title>noun_1229811</title>
      <desc>Created using Figma</desc>
      <g id="Canvas" transform="translate(-68 -66)">
      <g id="noun_1229811">
      <g id="Shape">
      <use xlink:href="#path0_fill" transform="translate(68 66)" fill="#50535B"/>
      </g>
      </g>
      </g>
      <defs>
      <path id="path0_fill" fill-rule="evenodd" d="M 0 7.06661L 14.9736 0L 30 7.09064L 30 7.10844L 14.9736 14.1994L 0 7.13248L 0 7.06661ZM 5.39823 7.0997L 14.9736 11.6185L 24.5506 7.0997L 14.9739 2.5806L 5.39823 7.0997ZM 0 21.4474L 0 24.022L 14.9736 31L 30 23.9983L 30 21.4236L 14.9736 28.4091L 0 21.4474ZM 0 15.6793L 0 13.1047L 14.9736 20.0658L 30 13.0806L 30 15.6556L 14.9736 22.6564L 0 15.6793Z"/>
      </defs>
    </svg>
    <span>Flatfile</span>
  </div>
  <ul class="display-desktop">
    {{-- <li><a href="javascript:">Features</a></li> --}}
    <li><a href="http://help.flatfile.io">Documentation</a></li>
    {{-- <li><a href="javascript:">Pricing</a></li> --}}
    @if(Auth::check())
    <li><a href="/home">Dashboard &rarr;</a></li>
    @else
    <li><a href="/login">Login</a></li>
    @endif
  </ul>
  <div class="svg-container display-mobile">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 80" version="1.1" xml:space="preserve" style="" x="0px" y="0px" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.41421"><rect x="0" y="0" width="64" height="64" style="" fill="none"/><path d="M46.127,21.505c0.112,0.015 0.141,0.015 0.251,0.043c0.288,0.075 0.551,0.237 0.748,0.461c0.112,0.128 0.203,0.274 0.266,0.432c0.063,0.157 0.099,0.326 0.107,0.495c0.023,0.561 -0.278,1.1 -0.767,1.374c-0.149,0.082 -0.311,0.14 -0.478,0.168c-0.112,0.02 -0.141,0.017 -0.254,0.022l-28,0c-0.113,-0.005 -0.142,-0.002 -0.253,-0.022c-0.294,-0.05 -0.57,-0.189 -0.785,-0.395c-0.123,-0.118 -0.225,-0.256 -0.301,-0.408c-0.077,-0.151 -0.127,-0.316 -0.149,-0.484c-0.06,-0.468 0.11,-0.948 0.45,-1.274c0.092,-0.088 0.195,-0.164 0.306,-0.227c0.149,-0.082 0.311,-0.14 0.479,-0.168c0.111,-0.02 0.14,-0.017 0.253,-0.022l28,0c0.042,0.002 0.085,0.004 0.127,0.005Z" style="" fill-rule="nonzero"/><path d="M46.127,30.505c0.112,0.015 0.141,0.015 0.251,0.043c0.288,0.075 0.551,0.237 0.748,0.461c0.112,0.128 0.203,0.274 0.266,0.432c0.209,0.52 0.104,1.129 -0.266,1.55c-0.112,0.128 -0.246,0.236 -0.394,0.319c-0.149,0.082 -0.311,0.14 -0.478,0.168c-0.112,0.02 -0.141,0.017 -0.254,0.022l-28,0c-0.113,-0.005 -0.142,-0.002 -0.253,-0.022c-0.168,-0.028 -0.33,-0.086 -0.479,-0.168c-0.411,-0.231 -0.696,-0.652 -0.756,-1.119c-0.016,-0.127 -0.016,-0.255 0,-0.382c0.022,-0.168 0.072,-0.333 0.149,-0.484c0.076,-0.152 0.178,-0.29 0.301,-0.408c0.215,-0.206 0.491,-0.345 0.785,-0.395c0.111,-0.02 0.14,-0.017 0.253,-0.022l28,0c0.042,0.002 0.085,0.004 0.127,0.005Z" style="" fill-rule="nonzero"/><path d="M46.127,39.505c0.112,0.015 0.141,0.015 0.251,0.043c0.288,0.075 0.551,0.237 0.748,0.461c0.37,0.421 0.475,1.03 0.266,1.55c-0.063,0.158 -0.154,0.304 -0.266,0.432c-0.112,0.128 -0.246,0.236 -0.394,0.319c-0.149,0.082 -0.311,0.14 -0.478,0.168c-0.112,0.02 -0.141,0.017 -0.254,0.022l-28,0c-0.113,-0.005 -0.142,-0.002 -0.253,-0.022c-0.294,-0.05 -0.57,-0.189 -0.785,-0.395c-0.092,-0.088 -0.172,-0.188 -0.239,-0.297c-0.248,-0.401 -0.291,-0.908 -0.115,-1.345c0.064,-0.158 0.154,-0.304 0.266,-0.432c0.112,-0.128 0.246,-0.236 0.394,-0.319c0.149,-0.082 0.311,-0.14 0.479,-0.168c0.111,-0.02 0.14,-0.017 0.253,-0.022l28,0c0.042,0.002 0.085,0.004 0.127,0.005Z" style="" fill-rule="nonzero"/></svg>
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
    <li><a href="javascript:">Winning</a></li>
    <li><a href="javascript:">Documentation</a></li>
    <li><a href="javascript:">Pricing</a></li>
    <li><a href="/login">Login</a></li>
  </ul>
</div>
<header class="align-center">
  <div class="container">
    <h1>The easiest way to manage CSV imports</h1>
    <a class="btn btn-primary" href="/register">Request Free Beta Access</a>
  </div>
</header>
<section class="features-section">
  <hr class="">
  <div class="container align-center">
    <div class="row clearfix">
      <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
        <div class="feature-card">
          <div class="img-container feature-image">
            <img src="img/column-matching.png">
          </div>
          <div class="number display-mobile"><span>1</span></div>
          <div class="feature-blurb display-mobile">
            <h3>Column Matching</h3>
            <p>Using machine learning and fuzzy matching, 95% of columns are automatically connected to your specified fields and a beautiful user experience allows for quick and intuitive manual review and editing.</p>
          </div>
        </div>

      </div>
      <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
        <div class="feature-card">
          <div class="img-container feature-image">
            <img src="img/data-validation.png">
          </div>
          <div class="number display-mobile"><span>1</span></div>
          <div class="feature-blurb display-mobile">
            <h3>Data Validation</h3>
            <p>Flatfile allows you to configure a helpful set of validators to run on imported data before it ever hits your server, allowing your customer to fix almost all data issues in advance.</p>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
        <div class="feature-card">
          <div class="img-container feature-image">
            <img src="img/error-recovery.png">
          </div>
          <div class="number display-mobile"><span>1</span></div>
          <div class="feature-blurb display-mobile">
            <h3>Error Recovery</h3>
            <p>When validation or import errors happen, the user is provided a beautiful, editable spreadsheet with helpful error messages and guidance for repairing the data and resubmitting it.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row clearfix">
      <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
        <div class="number display-desktop"><span>1</span></div>
      </div>
      <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
        <div class="number display-desktop"><span>2</span></div>
      </div>
      <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
        <div class="number display-desktop"><span>3</span></div>
      </div>
    </div>
    <div class="row clearfix">
      <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
        <div class="feature-blurb display-desktop">
          <h3>Column Matching</h3>
          <p>Using machine learning and fuzzy matching, 95% of columns are automatically connected to your specified fields and a beautiful user experience allows for quick and intuitive manual review and editing.</p>
        </div>
      </div>
      <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
        <div class="feature-blurb display-desktop">
          <h3>Data Validation</h3>
          <p>Flatfile allows you to configure a helpful set of validators to run on imported data before it every hits your server, allowing your customer to fix almost all data issues in advance.</p>
        </div>
      </div>
      <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
        <div class="feature-blurb display-desktop">
          <h3>Error Recovery</h3>
          <p>When validation or import errors happen, the user is provided a beautiful, editable spreadsheet with helpful error messages and guidance for repairing the data and resubmitting it.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="clients-section" >
  <div class="container align-center">
    <div style="max-width: 1400px;padding:0 50px;margin:0 auto">
      <img src="/img/preview.png" style="max-width: 100%" />
    </div>
    <div class="row clearfix" style="display:none">
      <div class="col-lg-2 col-md-3 col-sm-6 col-xs-6">
        <div class="client-logo-container">
          <img src="img/mashable-logo.png">
        </div>
      </div>
      <div class="col-lg-2 col-md-3 col-sm-6 col-xs-6">
        <div class="client-logo-container">
          <img src="img/the-verge-logo.png">
        </div>
      </div>
      <div class="col-lg-2 col-md-3 col-sm-6 col-xs-6">
        <div class="client-logo-container">
          <img src="img/Netflix.png">
        </div>
      </div>
      <div class="col-lg-2 col-md-3 col-sm-6 col-xs-6">
        <div class="client-logo-container">
          <img src="img/vine-logo.png">
        </div>
      </div>
      <div class="col-lg-2 col-md-3 col-sm-6 col-xs-6">
        <div class="client-logo-container">
          <img src="img/adult-swim-logo.png">
        </div>
      </div>
      <div class="col-lg-2 col-md-3 col-sm-6 col-xs-6">
        <div class="client-logo-container">
          <img src="img/tinder-logo.png">
        </div>
      </div>
    </div>
  </div>
</section>
<section class="built-for align-center">
  <div class="container">
    <h2>Built for developers</h2>
    <p>Giving your customers a good data import experience shouldn't require weeks of engineering and design work. Using flatfile you can be off to the races with just a few lines of code.</p>
    <a href="/demo" class="btn btn-primary">Click here to try it out</a>
  </div>
</section>
<section class="code-section">
  <div class="container">
    <div class="row clearfix">
      <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
        <div class="included-card align-right">
          <img src="img/checkmark.png">
          <h3 class="blue">Easy Configuration</h4>
          <p>Setup your target fields, activate the import flow, and wait for the  data.</p>
        </div>
        <div class="included-card align-right">
          <img src="img/checkmark.png">
          <h3 class="blue">Debug & Support Events</h4>
          <p>Know when your customers experience an issue and make it easy for your support team to help.</p>
        </div>
        <div class="included-card align-right">
          <img src="img/checkmark.png">
          <h3 class="blue">Powerful API</h4>
          <p>Read the docs for our fully documented API and setup the process that works for you.</p>
        </div>
      </div>
      <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
        <pre><code>var userImporter = new FlatfileImporter('314159265358979323846264', {
    fields: [
        {
            label: 'First Name',
            key: 'first_name',
            alternates: ['fname', 'birth name'],
        },
        {
            label: 'Last Name',
            key: 'last_name',
            alternates: ['lname', 'surname']
        },
        {
            label: 'Email',
            key: 'email',
            validator: 'email'
        },
        {
            label: 'Phone Number',
            key: 'phone',
            alternates: ['pnum'],
            validator: /^[2-9]\d{2}-\d{3}-\d{4}$/
        }
    ],
    type: 'User',
    fuzziness: 0.4 // percent characters matched to auto match
})

/**
 * Handle the completed data mapping
 * @param users Array&lt;Object&gt;
 * @example [
 *   {
 *      first_name: 'John',
 *      last_name: 'Doe',
 *      email: 'john@doe.com',
 *      phone: null
 *   }
 * ]
 */
userImporter.on('complete', function(users) {
    userImporter.displayLoader()
    $.post({
        url: '/upload-users',
        data: users
    })
    .done(function() {
        userImporter.displaySuccess()
    })
    .fail(function(xhr, err, exception) {
        userImporter.displayError(err || exception.getMessage())
    })
})


/**
 * Bind the user import flow to a specific button
 */
$(function() {
    $("#upload-button").click(function() {
        userImporter.open()
    })
})</code></pre>
      </div>
    </div>
  </div>
</section>
</nav>
<script type="text/javascript" src="{{mix('js/retail.js')}}"></script>
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
</body>
</html>
