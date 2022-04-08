<?php

namespace App\Providers;

use Laravel\Spark\Spark;
use Laravel\Spark\Providers\AppServiceProvider as ServiceProvider;

class SparkServiceProvider extends ServiceProvider
{
    /**
     * Your application and company details.
     *
     * @var array
     */
    protected $details = [
        'vendor' => 'Flatfile Inc.',
        'product' => 'flatfile.io',
        'street' => '13852 Travois Trail',
        'location' => 'Parker, CO 80138',
        'phone' => '719-428-9439',
    ];

    /**
     * The address where customer support e-mails should be sent.
     *
     * @var string
     */
    protected $sendSupportEmailsTo = 'hello@flatfile.io';

    /**
     * All of the application developer e-mail addresses.
     *
     * @var array
     */
    protected $developers = [
        'john@doe.com',
        'me@david.gs',
        'david@flatfile.io'
    ];

    /**
     * Indicates if the application will expose an API.
     *
     * @var bool
     */
    protected $usesApi = false;

    public function register()
    {
        Spark::useTeamModel('App\Models\Team');
        Spark::prefixTeamsAs('company');
    }

    /**
     * Finish configuring Spark for the application.
     *
     * @return void
     */
    public function booted()
    {
        Spark::useStripe()->noCardUpFront()->teamTrialDays(30);

        Spark::chargeTeamsPerSeat('License', function ($team) {
            return $team->licenses()->count();
        });

        Spark::swap('UserRepository@search', function ($query, $excludeUser = null) {
            $search = Spark::user();
            // If a user to exclude was passed to the repository, we will exclude their User
            // ID from the list. Typically we don't want to show the current user in the
            // search results and only want to display the other users from the query.
            if ($excludeUser) {
                $search->where('id', '<>', $excludeUser->id);
            }
            return $search->where(function ($search) use ($query) {
                $search->where('email', 'ilike', "%$query%")
                    ->orWhere('name', 'ilike', "%$query%");
            })->get();
        });

        Spark::freeTeamPlan()->features([
            'CSV Upload (1000 rows per file max)'
        ]);

        Spark::teamPlan('Startup', 'startup')
            ->price(99)
            ->features([
                'CSV Upload (Unlimited)',
                'Support Dashboard',
                'Data Healing ($/op)',
                'Server processing ($/op)',
            ]);
        Spark::teamPlan('Startup', 'startup-yearly')
            ->price(1089)
            ->yearly()
            ->features([
                'CSV Upload (Unlimited)',
                'Support Dashboard',
                'Data Healing ($/op)',
                'Server processing ($/op)',
            ]);
        Spark::teamPlan('Premium', 'premium')
            ->price(299)
            ->features([
                'CSV Upload',
                'XLS/XLSX Upload',
                'Custom theming',
                'Developer API',
                'Data Healing',
                'Server processing',
            ]);
        Spark::teamPlan('Premium', 'premium-yearly')
            ->price(3289)
            ->yearly()
            ->features([
                'CSV Upload',
                'XLS/XLSX Upload',
                'Custom theming',
                'Developer API',
                'Data Healing',
                'Server processing',
            ]);

        // Spark::identifyTeamsByPath();

        // Spark::teamPlan('Basic', 'provider-id-1')
        //     ->price(499)
        //     ->features([
        //         'First', 'Second', 'Third'
        //     ]);
    }
}
