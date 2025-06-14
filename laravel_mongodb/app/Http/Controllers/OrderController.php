<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    /**
     * Display a listing of all orders (admin).
     */
    public function index()
    { // This query FORGETS to select the _id!
        // Simply removing the ->select() fixes it by selecting all columns (*).
        return Order::with('user')->latest()->paginate(15);
    }

    /**
     * Store a newly created order (authenticated user).
     */
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|string',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.image_url' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $items = $request->items;
        $total = $this->calculateTotal($items);

        $order = Order::create([
            'user_id' => $user->id,
            'total' => $total,
            'status' => Order::STATUS_PROCESSING,
            'items' => $items,
        ]);

        return response()->json($order->makeVisible('items'), 201);
    }

    /**
     * Display a specific order by ID.
     */
    public function show($id)
    {
        $user = Auth::user();

        $order = Order::with('user')->findOrFail($id);

        // If no user or unauthorized, you may want to handle it
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        // If admin, enrich items with product info
        if ($user->is_admin) {
            $itemsWithDetails = [];
            foreach ($order->items as $item) {
                $product = Products::find($item['product_id']);
                $itemsWithDetails[] = [
                    'product_id' => $item['product_id'],
                    'name' => $product->name ?? $item['name'], // fallback to existing
                    'image_url' => $product->image_url ?? $item['image_url'] ?? null,
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                ];
            }
            $order->items = $itemsWithDetails;
        }
        // else for normal users, just return as is (or you can add checks here)

        return response()->json($order->makeVisible('items'));
    }


    /**
     * Display all orders for a specific user.
     */
    public function userOrders($userId)
    {
        $orders = Order::with(['user' => function ($query) {
            $query->select('_id', 'name', 'email'); // Only get necessary fields
        }])
            ->where('user_id', $userId)
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->_id,
                    'user_id' => $order->user_id,
                    'total' => $order->total,
                    'status' => $order->status,
                    'items' => $order->items ?? [],
                    'created_at' => $order->created_at->toISOString(),
                    'user' => $order->user ? [
                        'name' => $order->user->name,
                        'email' => $order->user->email
                    ] : null
                ];
            });

        return response()->json($orders);
    }

    /**
     * Calculate total order amount.
     */
    private function calculateTotal($items)
    {
        return array_reduce($items, function ($sum, $item) {
            return $sum + ($item['price'] * $item['quantity']);
        }, 0);
    }
    public function updateStatus(Request $request, $id) // Using route model binding
    {
        $order = Order::findOrFail($id);
        // 1. Define the possible valid statuses
        $validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

        // 2. Validate the incoming request
        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                Rule::in($validStatuses) // Ensures status is one of the allowed values
            ],
        ]);

        // 3. Update the order's status
        $order->status = $validated['status'];
        $order->save();

        // Optional: Trigger an event to send a notification email to the customer
        // event(new OrderStatusUpdated($order));

        // Return the FULL updated order, not just status
        return response()->json([
            'success' => true,
            'order' => $order->load('user') // Include user relationship
        ]);
    }
}
