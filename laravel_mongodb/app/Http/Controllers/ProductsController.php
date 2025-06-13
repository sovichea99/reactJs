<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use MongoDB\BSON\ObjectId;

class ProductsController extends Controller
{
    public function index()
    {
        try {
            $products = Products::all();
            return response()->json($products);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:mongodb.products',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'category' => 'nullable|string',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Upload image to Cloudinary
            $uploadedImage = Cloudinary::uploadApi()->upload($request->file('image')->getRealPath());

            // stores the image URL and Cloudinary ID 
            $validated['image'] = $uploadedImage['secure_url'];
            $validated['cloudinary_id'] = $uploadedImage['public_id'];
            $product = Products::create($validated);

            return response()->json($product, 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'An unexpected error occurred during the upload process.',
                'message' => $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
                'cloud_name' => config('cloudinary.cloud_name'),
                'api_key' => config('cloudinary.api_key'),
                'api_secret' => config('cloudinary.api_secret') ? '***' : 'MISSING' 
            ], 500);
        }
    }

    public function show(string $id)
    {
        $product = Products::where('_id', $id)->first();

        if (!$product) {
            return response()->json([
                'error' => 'Product not found'
            ], 404);
        }

        return response()->json($product);
    }

    public function update(Request $request, string $id)
    {
        try {
            $product = Products::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255|unique:mongodb.products,name,' . $id . ',_id',
                'description' => 'nullable|string',
                'price' => 'sometimes|numeric|min:0',
                'stock' => 'sometimes|integer|min:0',
                'category' => 'nullable|string',
                'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($request->hasFile('image')) {
                if ($product->cloudinary_id) {
                    Cloudinary::uploadApi()->destroy($product->cloudinary_id);
                }

                $uploadedImage = Cloudinary::uploadApi()->upload($request->file('image')->getRealPath());

                $validated['image'] = $uploadedImage['secure_url'];
                $validated['cloudinary_id'] = $uploadedImage['public_id'];
            }

            $product->update($validated);

            return response()->json($product->fresh());
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong.', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        $product = Products::where('_id', $id)->first();

        if (!$product) {
            return response()->json([
                'error' => 'Product not found'
            ], 404);
        }

        if ($product->cloudinary_id) {
            Cloudinary::uploadApi()->destroy($product->cloudinary_id);
        }

        $product->delete();

        return response()->json(null, 204);
    }
}
