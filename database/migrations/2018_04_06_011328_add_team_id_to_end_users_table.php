<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTeamIdToEndUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('end_users', function (Blueprint $table) {
            $table->integer('team_id')->index();
            $table->foreign('team_id')->references('id')->on('teams');
            $table->string('user_id')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('end_users', function (Blueprint $table) {
            $table->dropColumn('team_id');
            $table->string('user_id')->nullable(true)->change();
        });
    }
}
