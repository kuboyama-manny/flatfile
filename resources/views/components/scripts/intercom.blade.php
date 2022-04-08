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
    Intercom('trackEvent', 'view-dashboard');
</script>
