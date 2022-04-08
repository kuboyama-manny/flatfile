<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUploads extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('uploads', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('uuid_generate_v4()'))->primary();

            $table->string('filename');
            $table->string('filetype');
            $table->integer('filesize');
            $table->string('path');

            $table->uuid('batch_id')->index();
            $table->integer('license_id')->index();

            $table->foreign('batch_id')->references('id')->on('batches');
            $table->foreign('license_id')->references('id')->on('licenses');

            $table->timestamps();
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('uploads');
    }
}
