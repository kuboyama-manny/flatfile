<?php

namespace App\Traits;

use Webpatser\Uuid\Uuid;

trait UuidGenerator
{

    /**
     * Boot function from laravel.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $key = $model->uuidKey ?: $model->getKeyName();
            $cur = $model->{$key};
            $model->{$key} = $cur && Uuid::validate($cur) ? $cur : Uuid::generate()->string;
        });
    }
}
