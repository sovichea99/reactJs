import React from "react";

const Register = () => {
    return (
        <div className="container">
            <h2>Register</h2>
            <form action="/register" method="POST">
                <label>Name:</label>
                <input type="text" name="name" required />
                <br />
                <label>Email:</label>
                <input type="email" name="email" required />
                <br />
                <label>Password:</label>
                <input type="password" name="password" required />
                <br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;