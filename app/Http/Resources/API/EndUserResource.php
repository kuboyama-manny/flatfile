<?php

namespace App\Http\Resources\API;

use Illuminate\Http\Resources\Json\Resource;

class EndUserResource extends Resource
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
            'uuid' => $this->id,
            'id' => $this->user_id,
            'name' => $this->name,
            'email' => $this->email,
            'companyName' => $this->company_name,
            'companyId' => $this->company_id
        ];
    }
}
