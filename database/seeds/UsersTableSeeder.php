<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('TRUNCATE users RESTART IDENTITY CASCADE');
        DB::statement('TRUNCATE teams RESTART IDENTITY CASCADE');
        DB::statement('TRUNCATE team_users RESTART IDENTITY CASCADE');

        $user = factory(App\User::class)->create([
            'name' => 'John Doe',
            'email' =>'john@doe.com'
        ])->each(function ($user) {
            factory(App\Models\Team::class)
                ->create(['owner_id' => $user->id])
                ->each(function ($team) use ($user) {
                    $team->users()->attach($user, ['role' => 'owner']);
                    factory(App\Models\License::class)->create(['team_id' => $team->id]);
                    factory(App\User::class, 5) // team members
                        ->create()
                        ->each(function ($user) use ($team) {
                            $team->users()->attach($user, ['role' => 'member']);
                        });
                    factory(App\Models\DataModel::class, 2) // team members
                        ->create(['team_id' => $team->id])
                        ->each(function ($model) use ($team) {
                            factory(App\Models\Field::class, 5)->create([
                                'team_id' => $team->id,
                                'model_id' => $model->id
                            ]);
                        });
                });
        });

        factory(App\Models\License::class)->create([
          'key' => '2bda9380-a84c-11e7-8243-1d92e7c67d6d',
          'team_id' => App\Models\Team::first()->id
        ]);
    }
}
