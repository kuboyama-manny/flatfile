<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBatchesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        DB::beginTransaction();
        DB::statement('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        Schema::create('batches', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('uuid_generate_v4()'))->primary();

            $table->integer('license_id')->unsigned();
            $table->integer('team_id')->unsigned();

            $table->boolean('manual')->default(false);
            $table->string('filename')->nullable();
            $table->text('memo')->nullable();
            $table->integer('count_rows')->unsigned()->nullable();
            $table->integer('count_rows_invalid')->unsigned()->nullable();
            $table->integer('count_rows_accepted')->unsigned()->nullable();
            $table->integer('count_columns')->unsigned()->nullable();
            $table->integer('count_columns_matched')->unsigned()->nullable();
            $table->json('headers_raw')->nullable();
            $table->json('headers_matched')->nullable();

            $table->text('failure_reason')->nullable();

            $table->timestamps();
            $table->timestamp('submitted_at')->index()->nullable();
            $table->timestamp('failed_at')->index()->nullable();
            $table->timestamp('handled_at')->index()->nullable();

            $table->foreign('license_id')->references('id')->on('licenses');
            $table->foreign('team_id')->references('id')->on('teams');
        });

        DB::commit();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('batches');
    }
}
