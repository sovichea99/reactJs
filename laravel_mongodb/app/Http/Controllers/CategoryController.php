<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    //
    public function index(){
        // Fetch all categories from the database
        $categories = Category::all();

        // Return the categories as a JSON response
        return response()->json($categories);
    }

    public function store(Request $request){
        // Validate the incoming request data
        // $request->validate([
        //     'name' => 'required|string|max:255|unique:categories',
        //     'description' => 'nullable|string',
        // ]);

        // Create a new category in the database
        // $category = Category::create($request->all());
        try{
            $request->validate([
                'name' => 'required|string|max:255|unique:categories',
            ]);

            $category = Category::create($request->all());
            return response()->json($category, 200);
        }catch(\Illuminate\Database\QueryException $e){
            return response()->json([
                'error' => 'Category creation failed',
                'message' => $e->getMessage()
            ], 422);
        }catch(\Illuminate\Validation\ValidationException $e){
            return response()->json([
                'error' => $e->errors()
            ], 422);
        }
    }
}
