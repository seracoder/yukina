---
title: Building Fast APIs with FastAPI
published: 2023-12-24
description: A comprehensive guide to building fast APIs using FastAPI, covering installation, features, and best practices.
tags: [fastapi]
category: Python
author: Md hamim
draft: false
cover: /covers/Fast-API-with-Python.webp
---

# Introduction to FastAPI: Build Modern, High-Performance APIs with Python

FastAPI is a modern, high-performance web framework for building APIs with Python 3.7+ based on standard Python type hints. It's rapidly gaining popularity due to its speed, ease of use, and robust features designed for building production-ready services. In this blog post, we’ll delve into the key aspects of FastAPI, exploring why it stands out and walking through the creation of a simple API.

## Table of Contents

- [Why FastAPI?](#why-fastapi)
- [Installation](#installation)
- [Your First FastAPI Application](#your-first-fastapi-application)
- [Running the Application](#running-the-application)
- [Request Parameters and Validation](#request-parameters-and-validation)
- [Query Parameters and Path Parameters](#query-parameters-and-path-parameters)
- [Request and Response Models](#request-and-response-models)
- [Dependency Injection](#dependency-injection)
- [Authentication and Authorization](#authentication-and-authorization)
- [Testing](#testing)
- [Conclusion](#conclusion)

## Why FastAPI?

<a name="why-fastapi"></a>
Before diving into code, let’s understand the compelling reasons behind FastAPI's success:

*   **🚀 Fast Execution:** FastAPI is built upon **Starlette** (for the web parts) and **Pydantic** (for the data parts). Starlette provides the asynchronous ASGI (Asynchronous Server Gateway Interface) foundation, making it incredibly fast and capable of handling concurrent requests efficiently. This performance is often comparable to NodeJS and Go frameworks.
*   **📚 Automatic Interactive Documentation:** This is a killer feature. FastAPI automatically generates interactive API documentation based on the OpenAPI standard (formerly Swagger) and ReDoc. Simply define your API endpoints with type hints and Pydantic models, and FastAPI provides browsable documentation (`/docs`) and alternative documentation (`/redoc`) out-of-the-box, drastically improving developer experience and easing API consumption.
*   **✅ Robust Type Checking & Validation:** By leveraging standard Python type hints and Pydantic models, FastAPI provides automatic request data validation, serialization (converting data to/from formats like JSON), and documentation generation. This catches errors early, reduces boilerplate validation code, and improves code clarity and maintainability.
*   **⚡ Async Support:** FastAPI is built from the ground up with `async`/`await` syntax in mind. You can define your endpoints as standard `def` functions or `async def` functions, allowing you to leverage asynchronous libraries (like databases or external APIs) for non-blocking I/O operations, leading to significant performance improvements under high load.
*   **💉 Powerful Dependency Injection:** FastAPI includes an intuitive yet powerful dependency injection system. This makes it easy to manage dependencies (like database sessions, authentication credentials, complex computations), promote code reuse, simplify testing (by mocking dependencies), and better organize your application logic.

## Installation

<a name="installation"></a>
Getting started with FastAPI requires installing it and an ASGI server, such as Uvicorn.

```bash
pip install fastapi uvicorn[standard]
```

Using `uvicorn[standard]` installs Uvicorn along with recommended dependencies like `websockets` and `httptools` for better performance and features.

## Your First FastAPI Application

<a name="your-first-fastapi-application"></a>
Let's create a minimal FastAPI application. Create a file named `main.py`:

```python
from fastapi import FastAPI
from typing import Optional

# Create a FastAPI instance
app = FastAPI(
    title="My Simple API",
    description="This is a very fancy API built with FastAPI.",
    version="0.1.0",
)

# Define a route using the @app decorator for the HTTP method (GET)
# and the path ("/")
@app.get("/")
async def read_root():
    # This function will handle GET requests to the root path
    # It can be async or sync
    return {"message": "Hello World"}

# Define another route with a path parameter {item_id}
# Type hints (item_id: int) provide automatic validation
@app.get("/items/{item_id}")
async def read_item(item_id: int, q: Optional[str] = None):
    # item_id must be an integer
    # q is an optional query parameter of type string
    return {"item_id": item_id, "q": q}
```

This code defines a FastAPI `app` instance and two endpoints:
1.  A root endpoint `/` responding with a simple JSON message.
2.  An endpoint `/items/{item_id}` that accepts an integer `item_id` as part of the path and an optional string query parameter `q`. Note the use of `async def` which is idiomatic in FastAPI, though `def` works too for synchronous code.

## Running the Application

<a name="running-the-application"></a>
To run your application locally for development, use Uvicorn:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

*   `main`: The file `main.py` (the Python module).
*   `app`: The object created inside `main.py` (`app = FastAPI()`).
*   `--reload`: Makes the server restart after code changes. Ideal for development.
*   `--host 0.0.0.0`: Makes the server accessible on your network (not just localhost).
*   `--port 8000`: Specifies the port to run on.

Navigate to [`http://127.0.0.1:8000`](http://127.0.0.1:8000) in your browser. You'll see `{"message":"Hello World"}`.
Now, check the interactive docs at [`http://127.0.0.1:8000/docs`](http://127.0.0.1:8000/docs) and the alternative docs at [`http://127.0.0.1:8000/redoc`](http://127.0.0.1:8000/redoc).

*Note: For production, you typically run Uvicorn behind a process manager like Gunicorn with multiple Uvicorn workers.*

## Request Parameters and Validation

<a name="request-parameters-and-validation"></a>
As seen above, FastAPI uses Python type hints for parameter declaration and validation. If you try accessing `/items/foo` (where `foo` is not an integer), FastAPI automatically returns a helpful JSON error response indicating the validation failure:

```json
{
  "detail": [
    {
      "loc": ["path", "item_id"],
      "msg": "value is not a valid integer",
      "type": "type_error.integer"
    }
  ]
}
```
This automatic validation, powered by Pydantic, saves you from writing repetitive validation logic.

## Query Parameters and Path Parameters

<a name="query-parameters-and-path-parameters"></a>
FastAPI distinguishes parameters based on how they are declared in the path and function signature:

*   **Path Parameters:** Defined within curly braces in the path string (e.g., `{item_id}`). Their values are extracted directly from the URL path.
*   **Query Parameters:** Function arguments *not* part of the path string. They are extracted from the key-value pairs in the URL's query string (e.g., `?q=somevalue&limit=10`).

Example combining both:
```python
@app.get("/users/{user_id}/orders/{order_id}")
async def read_user_order(user_id: int, order_id: str, page: int = 1, size: int = 10):
    # user_id (int) and order_id (str) are path parameters
    # page (int, default 1) and size (int, default 10) are query parameters
    return {"user_id": user_id, "order_id": order_id, "page": page, "size": size}
```
A request to `/users/123/orders/abc?size=5` would result in `user_id=123`, `order_id='abc'`, `page=1`, `size=5`.

## Request and Response Models

<a name="request-and-response-models"></a>
For handling complex data structures, especially in request bodies (like POST or PUT requests) or structured responses, FastAPI relies heavily on **Pydantic models**.

Define a Pydantic model:
```python
from pydantic import BaseModel, Field
from typing import Optional

class Item(BaseModel):
    name: str = Field(..., example="Cool Item") # ... means required
    description: Optional[str] = Field(None, example="A very cool item indeed") # None means optional
    price: float = Field(..., gt=0, example=35.4) # Add validation: price > 0
    tax: Optional[float] = Field(None, ge=0, example=3.2) # tax >= 0

    # You can add configurations within the model
    # class Config:
    #     orm_mode = True # Useful for mapping to ORM objects
```

Use the model in a path operation:
```python
@app.post("/items/", response_model=Item, status_code=201) # Define the response structure
async def create_item(item: Item): # Define the expected request body structure
    # 'item' is now an instance of the Item model, already validated.
    # If validation fails, FastAPI returns a 422 error automatically.
    # You would typically save the item to a database here.
    print(f"Received item: {item.name}, Price: {item.price}")
    return item # The returned object will be serialized according to response_model
```
Using Pydantic models provides:
*   Automatic data validation.
*   Data serialization/deserialization (JSON <-> Python objects).
*   Clear data structure definitions.
*   Automatic generation of JSON Schema for the OpenAPI documentation.
*   Excellent editor support (autocompletion, type checking).

The `response_model` argument ensures the response conforms to the specified structure, filtering out any extra data.

## Dependency Injection

<a name="dependency-injection"></a>
FastAPI's dependency injection system allows you to declare dependencies (callable functions or classes) that FastAPI will automatically execute and inject their results into your path operation function. This promotes **reusability**, **testability**, and **separation of concerns**.

Common use cases include:
*   Database connections/sessions.
*   Authentication/Authorization logic.
*   Fetching common parameters or objects (e.g., the current user).

```python
from fastapi import Depends, HTTPException, status, Header, Cookie

# A simple dependency (can be async or sync)
async def common_parameters(
    q: Optional[str] = None,
    limit: int = 100,
    user_agent: Optional[str] = Header(None),
    session_token: Optional[str] = Cookie(None)
):
    return {
        "q": q,
        "limit": limit,
        "User-Agent": user_agent,
        "session_token": session_token
    }

@app.get("/search/")
async def search_items(commons: dict = Depends(common_parameters)):
    # The result of common_parameters is injected into 'commons'
    # This endpoint now implicitly depends on query params 'q', 'limit',
    # the 'User-Agent' header, and the 'session_token' cookie.
    return {"message": "Search results", "params": commons}

# Dependencies can themselves depend on other dependencies
async def get_current_user(token: str = Depends(oauth2_scheme)): # Depends on auth scheme
    user = get_user_from_db(token) # Fictional function to get user
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return user

@app.get("/users/me")
async def read_current_user(current_user: User = Depends(get_current_user)): # Depends on get_current_user
    return current_user
```

## Authentication and Authorization

<a name="authentication-and-authorization"></a>
FastAPI integrates seamlessly with standard security protocols. The `fastapi.security` module provides helpers for common schemes like OAuth2 (various flows), API Keys (in headers, query params, or cookies), HTTP Basic, and HTTP Digest authentication. These are typically implemented using the dependency injection system.

Here's a simplified example using `OAuth2PasswordBearer` for token-based authentication:

```python
from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

app = FastAPI() # Assuming app is defined

# This defines the URL where the client will send username/password to get a token
# It doesn't create the endpoint, just tells security schemes where it is.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# You would need to implement the /token endpoint separately
@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # WARNING: Implement proper password hashing and user verification here!
    # This is a placeholder.
    user = authenticate_user(form_data.username, form_data.password) # Fictional auth function
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Create and return a JWT token or similar
    access_token = create_access_token(data={"sub": user.username}) # Fictional token creation
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    # The oauth2_scheme dependency attempts to extract the token from the
    # 'Authorization: Bearer <token>' header.
    # If missing or malformed, it raises a 401 error automatically.
    # You would add logic here to validate the token and fetch user data.
    user = get_current_user_from_token(token) # Fictional validation/fetch function
    return {"username": user.username, "email": user.email} # Example user data
```
Remember, FastAPI provides the tools, but you need to implement the actual user verification, password hashing, token generation, and token validation logic according to security best practices.

## Testing

<a name="testing"></a>
FastAPI is highly testable. It provides a `TestClient` (based on `httpx`) that allows you to call your API endpoints directly in your tests *without* needing a running server. This makes tests fast and reliable. It integrates perfectly with `pytest`.

```python
from fastapi.testclient import TestClient
from .main import app # Import your FastAPI app instance

# Create a client instance for your app
client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

def test_read_item():
    response = client.get("/items/5?q=somequery")
    assert response.status_code == 200
    assert response.json() == {"item_id": 5, "q": "somequery"}

def test_read_item_invalid_id():
    response = client.get("/items/foo")
    assert response.status_code == 422 # Unprocessable Entity due to validation error
    assert "value is not a valid integer" in response.text

def test_create_item():
    item_data = {"name": "Test Item", "price": 10.5, "tax": 1.0}
    response = client.post("/items/", json=item_data)
    assert response.status_code == 201 # Status code for successful creation
    response_data = response.json()
    assert response_data["name"] == item_data["name"]
    assert response_data["price"] == item_data["price"]
    assert response_data["tax"] == item_data["tax"]
    assert response_data["description"] is None # Optional field default
```
Using `TestClient` allows you to test success cases, error handling (like validation errors), authentication requirements, and more, directly against your application logic.

## Conclusion

<a name="conclusion"></a>
FastAPI offers a compelling blend of **performance**, **developer experience**, and **robustness** for building APIs in Python. Its intelligent use of Python type hints, integration with Pydantic for validation, automatic interactive documentation, built-in asynchronous support, and a simple dependency injection system streamlines the development process significantly.

Whether you're building simple microservices or complex, high-load applications, FastAPI provides the tools and performance needed for modern web development. Its focus on standards (OpenAPI, JSON Schema, OAuth2) and its active community make it an excellent choice for your next API project. Give FastAPI a try and experience the productivity boost yourself!
