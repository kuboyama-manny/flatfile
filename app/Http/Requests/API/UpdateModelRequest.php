<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\DataModel;

class UpdateModelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $user = $this->user();
        $model = Model::find($this->id);
        $team = $user->teams()->where('id', $model->team_id)->first();
        if (!$team) {
            return false;
        }
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'string',
            'description' => 'nullable|string',
            'type' => 'string|required',
            'type_plural' => ' nullable|string',
            'allow_custom' => 'nullable|boolean'
        ];
    }
}
