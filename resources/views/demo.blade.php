<!DOCTYPE html>
<html>
<head>
    <title>Flatfile | CSV Importer (In Browser). Automatic column matching.</title>
    <!-- new-retail is forcing lots of overrides in demo-v2.scss -->
    <!-- <link rel="stylesheet" type="text/css" href="{{mix('css/new-retail.css')}}"> -->
    <!-- <link rel="stylesheet" type="text/css" href="{{mix('css/app-rtl.css')}}"> -->
    <link rel="stylesheet" type="text/css" href="{{mix('css/demo-v2.css')}}">
    <meta name="description" content="The missing CSV importer for web apps. 30 minute setup. Validate, repair, and transform data w/machine learning.">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="icon" href="/favicon.ico?v=2" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">
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
<div class="demo-v2">

    <div class="left-section p-3 float-left">
        <div class="logo"><a href="/">
            <svg width="22" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 30 31">
                <use fill="#3F9DF7" xlink:href="#path0_fill"></use>
                <defs>
                    <path id="path0_fill" fill-rule="evenodd" d="M0 7l15-7 15 7v.1l-15 7.1-15-7V7zm5.4.1l9.6 4.5 9.6-4.5L15 2.6 5.4 7zM0 21.4V24l15 7 15-7v-2.6l-15 7-15-7zm0-5.7V13l15 7 15-7v2.6l-15 7-15-7z"></path>
                </defs>
            </svg>
            <span class="logo-text">Flatfile</span></a>
        </div>
        <div class="text">
            <p>This demo is a quick and functional 'getting started' configuration to help you get familiar with Flatfile and the available options.</p>
            <p>The importer includes a few sample files to demonstrate a range of interactions with the tool. You can upload your own file, though since the demo is most likely not configured properly for your data, your results may vary.</p>
        </div>
        <div class="buttons">
            <a class="btn btn-primary w-100 open-importer">
              <span><i class="fa fa-play"></i></span>
              Run importer as configured</a>
            <a class="btn btn-outline-secondary w-100 mt-2" href="/register">Register for a license key</a>
        </div>
        <div class="menu">
            <ul>
                <li class="special">
                    <a href="#" id="help">Get in touch with us
                      <i class="fa fa-fw fa-comments" aria-hidden="true"></i></a>
                </li>
                <li>
                    <a href="/register" target="_blank">Register
                      <i class="fa fa-fw fa-sign-in-alt" aria-hidden="true"></i></a>
                </li>
                <li>
                    <a href="https://developers.flatfile.io/docs" target="_blank">Documentation
                      <i class="fa fa-fw fa-file fal" aria-hidden="true"></i></a>
                </li>
                <!-- Couldn't find links for these
                <li>
                    <a href="#" id="help">Support
                      <i class="fa fa-fw fa-life-ring" aria-hidden="true"></i></a>
                </li>
                <li>
                    <a href="#">Contact
                      <i class="fa fa-fw fa-envelope-o" aria-hidden="true"></i></a>
                </li>
                -->
                <li>
                    <a href="https://flatfile.io/" target="_blank">Go to <span class="demo-link">flatfile.io</span>
                      <i class="fa fa-external-link-alt" aria-hidden="true"></i></a>
                </li>
            </ul>
        </div>
    </div>

    <div class="big-section float-left">
      <div class="row">

        <!-- Code Editor -->
        <section class="code col-6 p-0">
          <ul class="nav nav-tabs" id="code-tabs">
            <li class="nav-item">
              <a href="#basic" role="tab" data-toggle="tab" class="nav-link active">Basic configuration</a>
            </li>
            <!-- Advanced examples are not slated for MVP release.
            <li class="nav-item">
              <a href="#email" role="tab" data-toggle="tab" class="nav-link">Email validation</a>
            </li>
            <li class="nav-item">
              <a href="#upload" role="tab" data-toggle="tab" class="nav-link">Store output with API</a>
            </li>
            -->
          </ul>
          <div class="tab-content">
            <div class="code-title">JAVASCRIPT <span>Type here...</span></div>
            <div role="tabpanel" class="tab-pane in active" id="basic"></div>
            <!-- <div role="tabpanel" class="tab-pane" id="email"></div> -->
            <!-- <div role="tabpanel" class="tab-pane" id="upload">Upload</div> -->
          </div>
          <div class="lint-error" id="error-container">
            <i class="fa fa-times"></i>
            <span id="lint-error"></span></div>
        </section>

        <section class="panels col-6 p-0" id="panels">

          <!-- Documentation -->
          <section class="panel documentation" id="documentation" onclick="toggleRightPane(this)">

            <div class="header">Documentation</div>

            <div class="content">

              <ul class="nav nav-tabs" id="doc-tabs">
                <li class="nav-item">
                  <a href="#optionDocs" role="tab" data-toggle="tab" class="nav-link active">Options</a>
                </li>
                <li class="nav-item">
                  <a href="#fieldDocs" role="tab" data-toggle="tab" class="nav-link">Fields</a>
                </li>
                <!-- Advanced examples are not slated for MVP release.
                <li class="nav-item">
                  <a href="#data" role="tab" data-toggle="tab" class="nav-link">Returned data</a>
                </li>
                <li class="nav-item">
                  <a href="#simple" role="tab" data-toggle="tab" class="nav-link">Simple usage</a>
                </li>
                <li class="nav-item">
                  <a href="#babel" role="tab" data-toggle="tab" class="nav-link">Babel + ES6</a>
                </li>
                -->
              </ul>

              <div class="tab-content">
                <div role="tabpanel" class="md tab-pane in active" id="optionDocs"></div>
                <div role="tabpanel" class="md tab-pane" id="fieldDocs"></div>
              </div>

            </div>
          </section>

          <!-- Importer output -->
          <section class="panel output code shut" id="output" onclick="toggleRightPane(this)">
            <div class="header">Output
              <a class="btn btn-primary open-importer">
                <span><i class="fa fa-play"></i></span>
                Run importer as configured</a>
            </div>
            <div class="content">
              <ul class="nav nav-tabs" id="doc-tabs">
                <li class="nav-item">
                  <a class="nav-link active">Output</a>
                </li>
              </ul>
              <div class="tab-content">
                <div class="code-title" id="file-name">JSON</div>
                <div role="tabpanel" class="tab-pane in active" id="jsonOutput"></div>
              </div>
            </div>
          </section>
        </section>

      </div>
    </div>

    <div class="example-file-container">
      <div class="example-file">
        <div class="title">Download the example file to get started <span>&rarr;</span></div>
        <div class="button"><a href="/downloads/robots.csv" download="robots.csv" id="download">
          <i class="fa fa-cloud-download-alt"></i>
          robots.csv <span>• 4kb</span></a></div>
        <div class="dismiss"><i class="fa fa-times"></i></div>
      </div>
    </div>

    <div class="mobile-preview">
      <div class="mobile-preview-content">
        <div class="logo"><a href="/">
            <svg width="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 30 31">
                <use fill="#3F9DF7" xlink:href="#path0_fill"></use>
                <defs>
                    <path id="path0_fill" fill-rule="evenodd" d="M0 7l15-7 15 7v.1l-15 7.1-15-7V7zm5.4.1l9.6 4.5 9.6-4.5L15 2.6 5.4 7zM0 21.4V24l15 7 15-7v-2.6l-15 7-15-7zm0-5.7V13l15 7 15-7v2.6l-15 7-15-7z"></path>
                </defs>
            </svg>
            <span class="logo-text">Flatfile</span></a>
        </div>
        <div class="description">This is a simple but functional demo to help you get familiar with Flatfile. Open on a computer to get started.</div>
        <div class="domain">
          <i class="fa fa-globe"></i>
          www.flatfile.io/demo</div>
        <div class="npm">npm install flatfile --save</div>
        <div class="copyright">Copyright 2018 Flatfile, Inc., All rights reserved</div>
      </div>
    </div>

</div>

<div style="display:none">
    <svg id="ico-check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 12">
      <path fill="#3F9DF7" fill-rule="evenodd" d="M16.4.6l-.4.2-9.7 9.7-4.6-4.6a.6.6 0 1 0-.9.9l5 5c.3.3.7.3 1 0l10-10a.6.6 0 0 0-.4-1.2z"/>
    </svg>
    <textarea id="json-example">
/*
 * Run the importer to get an output
 */
    </textarea>
    <textarea id="example-one">
var robotImporter = new FlatfileImporter('{{$license_key}}', {
  fields: [{
    label: 'Robot Name',
    key: 'name',
    isRequired: true,
    description: 'The designation of the robot'
  }, {
    label: 'Shield Color',
    key: 'shield-color'
  }, {
    label: 'Robot Helmet Style',
    key: 'helmet-style'
  }, {
    label: 'Call Sign',
    key: 'sign',
    alternates: ['nickname', 'wave'],
    isRequired: true
  }, {
    label: 'Robot ID Code',
    key: 'id',
    description: 'Digital identity'
  }],
  type: 'Robot',
  allowCustom: true
})
</textarea>
<textarea id="example-two">
var robotImporter = new FlatfileImporter('{{$license_key}}', {
  fields: [{
    label: 'Robot Name',
    key: 'name',
    isRequired: true,
    description: 'The designation of the robot'
  }, {
    label: 'Shield Color',
    key: 'shield-color'
  }, {
    label: 'Robot Helmet Style',
    key: 'helmet-style'
  }, {
    label: 'Call Sign',
    key: 'sign',
    alternates: ['nickname', 'wave'],
    isRequired: true
  }, {
    label: 'Robot ID Code',
    key: 'id',
    description: 'Digital identity'
  }],
  type: 'Robot',
  allowCustom: true
})
    </textarea>
</div>


<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script type="text/javascript" src="{{mix('js/demo.js')}}"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
<script>
  window.intercomSettings = {
      app_id: '{{env('INTERCOM_APP_ID')}}',
      hide_default_launcher: true,
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
<script src="https://unpkg.com/flatfile-csv-importer/build/dist/index.min.js"></script>
<script>
  FlatfileImporter.setMountUrl("{!! $in_dev ? env('DEV_IMPORTER_URL', 'http://localhost:2000/theme:simple/?key=:key') : '/importer/:key' !!}")
</script>
</body>
</html>
