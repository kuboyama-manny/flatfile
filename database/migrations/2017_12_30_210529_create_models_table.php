<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateModelsTable extends Migration
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

        Schema::create('models', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('uuid_generate_v4()'))->primary();

            $table->string('name');
            $table->text('description')->default('');

            $table->string('type');
            $table->string('type_plural')->nullable();

            $table->integer('fuzziness')->nullable();
            $table->boolean('allow_custom')->default(false);

            $table->integer('team_id')->index()->unsigned();
            $table->foreign('team_id')->references('id')->on('teams');

            $table->boolean('auto_generated')->index()->default(false);

            $table->timestamps();
            $table->softDeletes();

            $table->index('created_at');
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
        Schema::dropIfExists('models');
    }
}
