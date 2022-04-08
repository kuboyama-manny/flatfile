<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class StoreModelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        if (!$this->team_id) {
            return true;
        }
        $team = $this->user()->teams()->where('team_id', $this->team_id)->first();
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
            'team_id' => 'exists:teams,id',
            'name' => 'string',
            'description' => 'nullable|string',
            'type' => 'string|required',
            'type_plural' => ' nullable|string',
            'allow_custom' => 'nullable|boolean',

            'fields.*.key' => 'string|distinct',
            'fields.*.label' => 'string',
            'fields.*.hints' => 'array',
            'fields.*.validator' => 'string',
            'fields.*.cast' => 'string',
            'fields.*.required' => 'boolean',
        ];
    }
}
