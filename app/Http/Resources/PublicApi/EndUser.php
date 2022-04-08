<?php

namespace App\Http\Resources\PublicApi;

use Illuminate\Http\Resources\Json\Resource;

class EndUser extends Resource
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
