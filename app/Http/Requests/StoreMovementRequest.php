<?php

namespace App\Http\Requests;

use App\Rules\SufficientStock;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMovementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    { {
            return [
                'product_id' => 'required|exists:products,id',
                'type' => 'required|in:entree,sortie,ajustement',
                'quantity' => [
                    'required',
                    'numeric',
                    function ($attr, $value, $fail) {
                        if ($this->type === 'sortie') {
                            (new SufficientStock($this->product_id))->validate($attr, $value, $fail);
                        }
                    }
                ],
                'reason' => 'required|string'
            ];
        }
    }
}
