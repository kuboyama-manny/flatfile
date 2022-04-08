<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRowRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $row = Row::find($this->id);
        $team = $this->user()->teams()->where('team_id', $row->batch->team_id)->first();
        return !empty($team);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'raw' => 'string',
            'mapped' => 'json',
            'valid' => 'boolean',
        ];
    }
}
