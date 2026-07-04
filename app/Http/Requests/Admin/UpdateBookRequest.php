<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'        => ['required', 'string', 'max:255'],
            'author'       => ['required', 'string', 'max:255'],
            'publisher'    => ['required', 'string', 'max:255'],
            'description'  => ['nullable', 'string'],
            'price'        => ['required', 'integer', 'min:0'],
            'age_min'      => ['nullable', 'integer', 'min:0', 'max:99'],
            'age_max'      => ['nullable', 'integer', 'min:0', 'max:99', 'gte:age_min'],
            'stock'        => ['required', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'cover_image'  => ['nullable', 'image', 'max:5120'],
            'categories'   => ['array'],
            'categories.*' => ['integer', 'exists:categories,id'],
        ];
    }
}
