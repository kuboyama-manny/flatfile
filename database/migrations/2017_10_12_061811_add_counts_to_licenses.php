<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCountsToLicenses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('licenses', function (Blueprint $table) {
            $table->integer('count_views')->unsigned()->default(0);
            $table->integer('count_batches')->unsigned()->default(0);
            $table->integer('count_success')->unsigned()->default(0);
            $table->integer('count_errors')->unsigned()->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('licenses', function (Blueprint $table) {
            $table->dropColumn(['count_views', 'count_uploads', 'count_success', 'count_errors']);
        });
    }
}
