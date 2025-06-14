<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        // This defines the JSON structure for a User object
        return [
            'id' => $this->_id, // Use _id for MongoDB
            'name' => $this->name,
            'email' => $this->email,
        ];
    }
}
