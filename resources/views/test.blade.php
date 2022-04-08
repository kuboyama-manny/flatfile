<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta Information -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>@yield('title', config('app.name'))</title>
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="{{$adapter_url}}"></script>

    <style>
        body, html {
            font-family: "Avenir Next", sans-serif;
            height: 100%;
            margin: 0;
            overflow: hidden;
        }

        .content {
            padding: 20px;
        }

        .full-height {
            min-height: 100%;
        }

        .flex-column {
            display: flex;
            flex-direction: column;
        }

        .flex-fill {
            flex: 1;
        }

        .flex-center {
            align-items: center;
            display: flex;
            justify-content: center;
        }


        .text-center {
            text-align: center;
        }

        .links {
            padding: 1em;
            text-align: right;
        }

        .links a {
            text-decoration: none;
        }

        button {
            background-color: #3097D1;
            border: 0;
            border-radius: 4px;
            color: white;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            padding: 15px;
        }
        iframe  {
            height: 100%;
        }
    </style>
</head>
<body>
    <div class="content">
      <h1>Import your robots!</h1>
      <a href="/downloads/robots.csv">Click here to download a sample CSV file of robots.</a><hr>
      <button id="import-button">Import Robots</button>
      <hr>
      <input type="text" id="filename" />
￼      <hr>
      <textarea id="output" cols="80" rows="20"></textarea>
    </div>
    <script>
        FlatfileImporter.setMountUrl("{!! $in_dev ? env('DEV_IMPORTER_URL', 'http://localhost:2000/theme:simple/?key=:key') : '/importer/:key' !!}")
    </script>

    @if ($config)
      <script>
        var robotImporter = new FlatfileImporter('{{$license_key}}', {!! $config !!})
      </script>

    @else
      <script type="text/javascript">
        var robotImporter = new FlatfileImporter('{{$license_key}}', {
          fields: [{
            label: 'Robot Name',
            key: 'name',
            isRequired: true,
            description: 'The designation of the robot',
            validators: [
              {validate: 'required_without', fields: ['id', 'shield-color'], error: 'must be present if no id or shield color'}
            ],
          }, {
            label: 'Shield Color',
            key: 'shield-color',
            description: 'Chromatic value',
            validator: {
              validate: 'regex_matches',
              regex: /^[a-zA-Z]+$/,
              error: 'Not alphabet only'
            }
          }, {
            label: 'Robot Helmet Style',
            key: 'helmet-style'
          }, {
            label: 'Call Sign',
            key: 'sign',
            alternates: ['nickname', 'wave'],
            validators: [
              {validate: 'regex_matches', regex: /^[a-zA-Z]{4}$/, error: 'must be 4 characters exactly'},
              {validate: 'regex_excludes', regex: /test/, error: 'must not include the word "test"'},
            ],
            isRequired: true
          }, {
            label: 'Robot ID Code',
            key: 'id',
            description: 'Digital identity',
            validators: [
              {validate: 'regex_matches', regex: 'numeric', error: 'must be numeric'},
              {validate: 'required_without', fields: ['name'], error: 'ID must be present if name is absent'}
            ]
          }],
          type: 'Robot',
          // allowInvalidSubmit: true,
          managed: true,
          allowCustom: true
        })
      </script>
    @endif
      <script>
        $(function() {
            // robotImporter.setCustomer({'userId': 'my new user', 'name': 'r2d2'})
            robotImporter.requestDataFromUser().then(function (result) {
                robotImporter.displayLoader()
                setTimeout(function() {
                    robotImporter.displaySuccess()
                    console.log('complete.callback', result)
                    $("#output").val(JSON.stringify(result.validData, null, 2));
                    $("#filename").val(result.filename);
                }, 1500)
            }).catch(function (error) { console.info(error || 'window close') })
            $("#import-button").click(() => {
                robotImporter.requestDataFromUser().then(function (result) {
                    robotImporter.displayLoader()
                    console.log(robotImporter.getMeta())
                    setTimeout(function() {
                        robotImporter.displaySuccess()
                        console.log('complete.callback', result.validData)
                        $("#output").val(JSON.stringify(result.validData, null, 2));
                        $("#filename").val(result.filename);
                    }, 1500)
                }).catch(function (error) { console.info(error || 'window close') })
            })
        })
    </script>
</body>
</html>
