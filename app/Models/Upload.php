<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\UuidGenerator;
use Storage;

class Upload extends Model
{
    use UuidGenerator;
    public $incrementing = false;

    protected $fillable = [
        'filename', 'filetype', 'filesize', 'path', 'batch_id', 'license_id'
    ];

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function license()
    {
        return $this->belongsTo(License::class);
    }

    public function getTemporaryUrl($time = false)
    {
        try {
            return Storage::disk($this->drive)->temporaryUrl($this->path, $time ?: now()->addMinutes(5));
        } catch (\Exception $e) {
            return Storage::disk($this->drive)->url($this->path);
        }
    }
}
