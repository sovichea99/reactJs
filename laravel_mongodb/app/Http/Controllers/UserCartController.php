<?php

namespace App\Http\Controllers;

use App\Models\UserCart;
use Illuminate\Http\Request;

class UserCartController extends Controller
{
    public function getCart($userId)
    {
        $cart = UserCart::where('user_id', $userId)->first();

        if (!$cart) {
            return response()->json([
                'message' => 'Cart not found for this user',
                'items' => []
            ], 200); // Use 200 so frontend doesn’t break on first login
        }

        return response()->json([
            'message' => 'Cart retrieved successfully',
            'items' => $cart->items ?? []
        ], 200);
    }

    public function addToCart(Request $request, $userId)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|string',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.image' => 'nullable|string',
        ]);

        $cart = UserCart::updateOrCreate(
            ['user_id' => $userId],
            ['items' => $validated['items']]
        );

        return response()->json([
            'message' => 'Cart synced successfully',
            'cart' => $cart
        ], 200);
    }

    public function removeItem(Request $request, $userId, $productId)
    {
        $cart = UserCart::where('user_id', $userId)->first();

        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        $items = collect($cart->items)->reject(function ($item) use ($productId) {
            return $item['id'] === $productId;
        })->values();

        $cart->items = $items;
        $cart->save();

        return response()->json([
            'message' => 'Item removed successfully',
            'items' => $cart->items
        ], 200);
    }

    public function clearCart($userId)
    {
        $cart = UserCart::where('user_id', $userId)->first();

        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        $cart->items = [];
        $cart->save();

        return response()->json([
            'message' => 'Cart cleared',
            'items' => []
        ], 200);
    }
     public function destroyCart($userId)
    {
        // Find the user's cart document.
        $cart = UserCart::where('user_id', $userId)->first();

        // If it exists, delete the entire document from the collection.
        if ($cart) {
            $cart->delete();
            return response()->json(['message' => 'Cart document deleted successfully.'], 200);
        }

        // If no cart was found, the state is already correct.
        return response()->json(['message' => 'No cart found to delete.'], 200);
    }
}
