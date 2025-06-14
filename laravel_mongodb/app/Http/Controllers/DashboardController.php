<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use App\Models\Products;

class DashboardController extends Controller
{
    public function getStats()
    {

        return response()->json([
            'totalOrders' => Order::count(),
            'totalRevenue' => Order::sum('total'),
            'totalProducts' => Products::count(),
            'totalCustomers' => User::count(),
            'orderStatuses' => Order::raw(function ($collection) {
                return $collection->aggregate([
                    ['$group' => [
                        '_id' => '$status',
                        'count' => ['$sum' => 1]
                    ]]
                ]);
            })
        ]);
    }

    public function getRecentOrders()
    {
        return Order::with(['user' => function ($query) {
            $query->select('_id', 'name', 'email');
        }])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    '_id' => $order->_id,
                    'total' => $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at,
                    'user' => $order->user ? [
                        'name' => $order->user->name,
                        'email' => $order->user->email
                    ] : null
                ];
            });
    }
    public function getOrders()
    {
        return Order::with(['user' => function ($query) {
            $query->select('_id', 'name', 'email');
        }])
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    '_id' => $order->_id,
                    'total' => $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at,
                    'user' => $order->user ? [
                        'name' => $order->user->name,
                        'email' => $order->user->email
                    ] : null
                ];
            });
    }
}
