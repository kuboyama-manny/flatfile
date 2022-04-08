@extends('layouts.pre-signin')

@section('scripts')
    <script src="https://js.stripe.com/v3/"></script>
@endsection

@section('content')
    <!-- Main Content -->
    <main>
        <div class="container clearfix auth-forms">
            <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" style="padding-right: 40px;padding-bottom: 100px">
                    <h1>Create your account</h1>
                    <h2>You'll be able to create a license key, configure data processing settings,
                    and easily debug and support your customer uploads.</h2>

                    <div class="img-container">
                        <img src="img/login.png" alt="">
                    </div>

                    <h4>Key Features</h4>

                    @include('components.features')

                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" style="padding-top: 20px;">

                    <spark-register-stripe inline-template>
                        <div v-cloak>
                            <div class="spark-screen container">
                                <!-- Common Register Form Contents -->
                                @include('spark::auth.register-common')
                            </div>
                        </div>
                    </spark-register-stripe>
                </div>
            </div>
        </div>
    </main>
@endsection
