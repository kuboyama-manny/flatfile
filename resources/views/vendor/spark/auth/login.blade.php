@extends('layouts.pre-signin')
@section('page-class', 'login-page')
@section('content')
<main class="login-form">
  <div class="container auth-forms">
    <div class="login-card">
      <div class="card card-default">
        <h1>Login to your dashboard</h1>
        <div class="card-body">
          @include('spark::shared.errors')

          <form class="form-horizontal" role="form" method="POST" action="/login">
            {{ csrf_field() }}

            <!-- E-Mail Address -->
            <div class="form-group">
              <label>E-Mail Address</label>

              <div>
                <input type="email" class="form-control" name="email" value="{{ old('email') }}" autofocus>
              </div>
            </div>

            <!-- Password -->
            <div class="form-group">
              <label>Password</label>

              <div>
                <input type="password" class="form-control" name="password">
              </div>
            </div>

            <!-- Remember Me -->
            <div class="form-group">
              <div>
                <div class="checkbox">
                  <label>
                    <input type="checkbox" name="remember"> Remember Me
                  </label>
                </div>
              </div>
            </div>

            <!-- Login Button -->
            <div class="form-group">
              <div class="align-center">
                <button type="submit" class="btn btn-primary">
                  <i class="fa m-r-xs fa-sign-in"></i> Login
                </button>

                <a style="margin-left: 20px" href="{{ url('/password/reset') }}">Forgot Your Password?</a>
              </div>
            </div>

            <div class="align-center">
              <a href="/register" class="login-register-link">Don't have an account? Register Here</a>
              <svg width="9px" height="9px" viewBox="0 0 9 9" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Desktop-HD" transform="translate(-1077.000000, -426.000000)" fill-rule="nonzero" fill="#3F9DF7">
                    <path d="M1077.16619,430.923172 L1080.84706,434.808578 C1081.05366,435.015853 1081.49678,435.087201 1081.73841,434.857738 C1081.98006,434.628276 1081.97855,434.192826 1081.73534,433.96504 L1079.0386,431.114906 L1085.38427,431.114906 C1085.72307,431.114906 1085.99775,430.840209 1085.99775,430.501403 C1085.99775,430.162577 1085.72307,429.887923 1085.38427,429.887923 L1079.0386,429.887923 L1081.73534,427.037789 C1081.97857,426.810003 1081.99466,426.358133 1081.73841,426.145091 C1081.50163,425.948204 1081.06198,425.939595 1080.84706,426.194251 L1077.16619,430.079634 C1077.00977,430.236502 1076.88769,430.649252 1077.16619,430.923172 Z"
                    id="next_white_icon-copy" transform="translate(1081.498875, 430.500000) rotate(-180.000000) translate(-1081.498875, -430.500000) "></path>
                  </g>
                </g>
              </svg>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>


</main>

@endsection
