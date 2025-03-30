<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    //
    public function index()
    {
        // Fetch all categories from the database
        $categories = Category::all();

        // Return the categories as a JSON response
        return response()->json($categories);
    }

    public function store(Request $request)
    {

        try {
            $request->validate([
                'name' => 'required|string|max:255',
            ]);

            if (Category::where('name',$request->name)->exists()) {
                return response()->json([
                    'error' => 'Category already exists'
                ], 422);
            }

            $category = Category::create([
                'name' => $request->name,
            ]);

            $category->save();

            return response()->json($category, 200);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'error' => 'Category creation failed',
                'message' => $e->getMessage()
            ], 422);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => $e->errors()
            ], 422);
        }
    }

    public function update(Request $request, $id){
        try{
            $category = Category::find($id);

            if(!$category){
                return response()->json([
                    'error' => 'Category not found',
                ], 404);
            }

            $request->validate([
                'name' => 'required|string|max:255',
            ]);

            if (Category::where('name', $request->name)->exists()) {
                return response()->json([
                    'error' => 'Category already exists'
                ], 422);
            }

            $category->name = $request->name;

            $category->save();

            return response()->json($category, 200);

        }catch(\Illuminate\Database\QueryException $e){
            return response()->json([
                'error' => 'Category update failed',
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function destroy($id){
        try{
            $category = Category::find($id);

            if(!$category){
                return response()->json([
                    'error' => 'Category not found',
                ], 404);
            }

            $category->delete();

            return response()->json([
                'message' => 'Category deleted successfully'
            ], 200);

        }catch(\Illuminate\Database\QueryException $e){
            return response()->json([
                'error' => 'Category deletion failed',
                'message' => $e->getMessage()
            ], 422);
        }
    }
}
