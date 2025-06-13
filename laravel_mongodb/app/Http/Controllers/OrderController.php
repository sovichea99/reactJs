<?php

namespace App\Http\Controllers;

use App\Models\Order;
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
        $order = Order::with('user')->findOrFail($id);
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
    public function updateStatus(Request $request, $orderId) // Using route model binding
    {
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
        $order = Order::findOrFail($orderId);
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
