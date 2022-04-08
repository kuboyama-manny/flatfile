<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\UuidGenerator;

class DataModel extends Model
{
    use UuidGenerator;
    public $incrementing = false;

    protected $table = "models";

    protected $fillable = [
        'name', 'description', 'type', 'type_plural', 'allow_custom', 'fuzziness', 'team_id'
    ];

    public function fields()
    {
        return $this->hasMany(Field::class, 'model_id');
    }
}
