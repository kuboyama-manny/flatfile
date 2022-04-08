<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Flatfile Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <script src="https://js.stripe.com/v3/"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    @if ($in_dev)
    <script src="http://localhost:4000/flatfile-dashboard/index.js"></script>
    @else
    <script src="/flatfile-dashboard/index.js?cachebust={{time()}}"></script>
    @endif

    <script type="text/javascript">
        window.Spark = <?php echo json_encode(array_merge(
            Spark::scriptVariables(), []
        )); ?>;
    </script>
    <script src="//cdn.headwayapp.co/widget.js"></script>

    <script>
        (function(d) {
        var config = {
            kitId: 'xbq5tas',
            scriptTimeout: 3000,
            async: true
        },
        h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
        })(document);
    </script>
</head>
<body>
    <noscript>Please enable JavaScript to use the Flatfile dashboard.</noscript>
    <div id="app-container"></div>
</body>
</html>
