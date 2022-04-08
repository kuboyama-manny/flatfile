<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFieldsTable extends Migration
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

        Schema::create('fields', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('uuid_generate_v4()'))->primary();
            $table->string('label');
            $table->string('key');
            $table->string('cast')->nullable();
            $table->string('validator')->nullable();
            $table->json('hints')->default("[]");
            $table->boolean('required')->default(false);

            $table->integer('team_id')->index()->unsigned();
            $table->foreign('team_id')->references('id')->on('teams');

            $table->uuid('model_id')->index()->unsigned();
            $table->foreign('model_id')->references('id')->on('models');

            $table->timestamps();

            $table->softDeletes();
            $table->index('deleted_at');
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
        Schema::dropIfExists('fields');
    }
}
