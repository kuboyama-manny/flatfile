<spark-api inline-template>
    <div>
        <!-- Create API Token -->
        <div>
            @include('spark::settings.licenses.create-token')
        </div>

        <!-- API Tokens -->
        <div>
            @include('spark::settings.licenses.tokens')
        </div>
    </div>
</spark-api>
