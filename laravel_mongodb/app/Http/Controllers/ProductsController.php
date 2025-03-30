<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use MongoDB\BSON\ObjectId;

class ProductsController extends Controller
{
    public function index()
    {
        $products = Products::all();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        try {
            // Validate input data
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:mongodb.products',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'category' => 'nullable|string',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',  // Fixed max size
            ]);

            // Store the image in the 'products' folder on the 'public' disk
            $imagePath = $request->file('image')->store('products', 'public');
            $validated['image'] = $imagePath;

            // Generate the image URL to return to the client using asset() helper
            $validated['image_url'] = asset('storage/' . $imagePath);

            // Create the product in the database with the validated data
            $product = Products::create($validated);

            return response()->json($product, 201);  // Return the created product with a 201 status

        } catch (ValidationException $e) {
            // If validation fails, return the validation error messages
            return response()->json([
                'error' => $e->errors()
            ], 422);
        }
    }

    public function show(string $id)
    {
        // Find the product by its ID (MongoDB handles this well even with string _id)
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
            // Find the product by its ID
            $product = Products::findOrFail($id);  // This works fine with string _id

            // Validate input data, marking some fields as optional (sometimes)
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255|unique:mongodb.products,name,' . $id . ',_id',
                'description' => 'nullable|string',
                'price' => 'sometimes|numeric|min:0',
                'stock' => 'sometimes|integer|min:0',
                'category' => 'nullable|string',
                'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048', // Changed to 'sometimes'
            ]);

            // Handle image update if a new image is uploaded
            if ($request->hasFile('image')) {
                // Delete the old image if it exists
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }

                // Store the new image
                $imagePath = $request->file('image')->store('products', 'public');
                $validated['image'] = $imagePath;
                $validated['image_url'] = asset('storage/' . $imagePath);
            }

            // Update the product with the validated data
            $product->update($validated);

            // Return the updated product data
            return response()->json($product->fresh()); // fresh() ensures that we return the updated model
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Handle any other potential errors (e.g., database issues)
            return response()->json(['error' => 'Something went wrong.'], 500);
        }
    }

    public function destroy(string $id)
    {
        // Find the product by its ID
        $product = Products::where('_id', $id)->first();

        if (!$product) {
            return response()->json([
                'error' => 'Product not found'
            ], 404);
        }

        // Delete the image if it exists
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        // Delete the product from the database
        $product->delete();

        return response()->json(null, 204);  // Return a 204 status indicating successful deletion
    }
}
