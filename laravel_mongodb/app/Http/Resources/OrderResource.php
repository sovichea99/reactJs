<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->_id,
            'total' => $this->total,
            'status' => $this->status,
            'items' => $this->items ?? [],
            'created_at' => $this->created_at->toISOString(),
            'user' => $this->whenLoaded('user', new UserResource($this->user)), // Also use a resource for the user
        ];
    }
}
