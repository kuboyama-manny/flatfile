@extends('spark::layouts.app')

@section('content')
<home :user="user" inline-template>
    <div class="container">
        <!-- Application Dashboard -->
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <div class="card card-default">
                    <div class="card-header">License Keys</div>

                    <div class="table-responsive">
                        <table class="table table-valign-middle mb-0">
                            <thead>
                            <tr>
                                <th>Team</th>
                                <th>License Key</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($items as $item)
                            <tr>
                                <td>{{$item['team']->name}}</td>
                                <td><code>{{$item['license']->key}}</code></td>
                            </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</home>
@endsection
