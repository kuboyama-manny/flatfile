@extends('spark::layouts.app')

@section('content')
<home :user="user" inline-template>
    <div class="container-fluid">
        <!-- Application Dashboard -->
        <div class="row">
            <div class="col-md-12">
                <div class="card card-default">
                    <div class="card-header">Batches</div>

                    <div class="card-body">
                        <table class="table table-bordered" style="font-size:12px" id="batches-table" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>Filename</th>
                                    {{-- <th>Memo</th> --}}
                                    <th>Uploaded At</th>
                                    <th>Status</th>
                                    <th>Rows</th>
                                    <th>Columns</th>
                                    <th>Matching Time</th>
                                    <th>Processing Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($batches as $batch)
                                <tr>
                                    <td><code>{{$batch->filename}}</code></td>
                                    {{-- <td>{{$batch->memo}}</td> --}}
                                    <td data-sort="{{$batch->created_at->timestamp}}">{{$batch->created_at->toDayDateTimeString()}}</td>
                                    <td>{{$batch->status}}</td>
                                    <td data-sort="{{$batch->count_rows}}">{{$batch->count_rows ?number_format($batch->count_rows) : null}}</td>
                                    <td>{{$batch->count_columns}}</td>
                                    <td>{{$batch->matching_time}}</td>
                                    <td>{{$batch->processing_time}}</td>
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


@section('footer-scripts')
    <script type="text/javascript">
        $(function() {
            $('#batches-table').DataTable();
        })
    </script>
@endsection
