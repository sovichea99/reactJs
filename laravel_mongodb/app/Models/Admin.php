<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Admin extends Model implements AuthenticatableContract, JWTSubject
{
    use Notifiable;

    // MongoDB connection settings
    protected $connection = 'mongodb'; // Explicitly use MongoDB
    protected $collection = 'admins';  // Admin collection name in MongoDB

    // Fields that can be mass-assigned
    protected $fillable = ['name', 'email', 'password'];

    // Fields to hide when serializing the model
    protected $hidden = ['password', 'remember_token'];

    // Fields to cast to native types
    protected $casts = ['password' => 'hashed'];

    /**
     * Get the identifier that will be stored in the JWT subject claim.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey(); // Return the primary key (usually `_id` in MongoDB)
    }

    /**
     * Return additional custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return []; // No custom claims by default
    }

    /**
     * Get the name of the unique identifier for the admin.
     *
     * @return string
     */
    public function getAuthIdentifierName()
    {
        return '_id'; // MongoDB uses `_id` as the primary key
    }

    /**
     * Get the unique identifier for the admin.
     *
     * @return mixed
     */
    public function getAuthIdentifier()
    {
        return $this->getKey(); // Return the primary key (usually `_id` in MongoDB)
    }

    /**
     * Get the password for the admin.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->password; // Return the hashed password
    }

    /**
     * Get the name of the password attribute for the admin.
     *
     * @return string
     */
    public function getAuthPasswordName()
    {
        return 'password'; // Return the name of the password field
    }

    /**
     * Get the "remember me" token value.
     *
     * @return string
     */
    public function getRememberToken()
    {
        return $this->remember_token;
    }

    /**
     * Set the "remember me" token value.
     *
     * @param  string  $value
     * @return void
     */
    public function setRememberToken($value)
    {
        $this->remember_token = $value;
    }

    /**
     * Get the column name for the "remember me" token.
     *
     * @return string
     */
    public function getRememberTokenName()
    {
        return 'remember_token';
    }
}
