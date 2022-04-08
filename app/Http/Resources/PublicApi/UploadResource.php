<?php

namespace App\Http\Resources\PublicApi;

use Illuminate\Http\Resources\Json\Resource;

class UploadResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'filename' => $this->filename,
            'filesize' => $this->filesize,
            'url' => $this->getTemporaryUrl(now()->addMinutes(5))
        ];
    }
}
