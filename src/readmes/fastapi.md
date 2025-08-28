# FastAPI Comprehensive Guide

FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints.

## 1. What is FastAPI and what are its key features?

FastAPI is a Python web framework for building APIs. Its key features include:

-   **Fast**: Very high performance, on par with **NodeJS** and **Go** (thanks to Starlette and Pydantic).
-   **Fast to code**: Increase the speed to develop features by about 200% to 300%.
-   **Fewer bugs**: Reduce about 40% of human-induced errors.
-   **Intuitive**: Great editor support. Completion everywhere. Less time debugging.
-   **Easy**: Designed to be easy to use and learn. Less time reading docs.
-   **Short**: Minimize code duplication. Multiple features from each parameter declaration.
-   **Robust**: Get production-ready code. With automatic interactive documentation.
-   **Standards-based**: Based on (and fully compatible with) the open standards for APIs: **OpenAPI** (previously known as Swagger) and **JSON Schema**.

## 2. How do you set up a basic FastAPI application?

To set up a basic application, you need to install `fastapi` and a web server like `uvicorn`.

```bash
pip install fastapi uvicorn
```

Then, create a file `main.py`:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
```

Run the server with:

```bash
uvicorn main:app --reload
```

## 3. What are path parameters and how do you use them?

Path parameters are parts of the URL path that are used to determine the specific resource to be retrieved. They are declared using curly braces `{}` in the path.

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"user_id": user_id}
```

In this example, `user_id` is a path parameter. FastAPI uses the type hint `int` to validate and convert the parameter.

## 4. What are query parameters and how do you use them?

Query parameters are optional key-value pairs that appear after the `?` in a URL. They are used for filtering, sorting, or pagination.

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/")
def read_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}
```

Parameters that are not part of the path are automatically interpreted as query parameters. Here, `skip` and `limit` are query parameters with default values.

## 5. How do you handle request bodies?

Request bodies are used to send data from the client to the API. You define the structure of the body using Pydantic models.

```python
from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

app = FastAPI()

@app.post("/items/")
def create_item(item: Item):
    return item
```

FastAPI automatically reads the body of the request, validates it with the `Item` model, and populates the `item` parameter.

## 6. What is Pydantic and how is it used for data validation?

Pydantic is a library for data validation and settings management using Python type annotations. FastAPI uses Pydantic models to define the shape and types of data for request bodies, query parameters, and more.

When data is received, Pydantic validates it against the model. If the data is invalid, FastAPI automatically returns a clear JSON error response.

## 7. How do you handle errors in FastAPI?

FastAPI has built-in support for handling exceptions. You can raise `HTTPException` to return an HTTP error response with a specific status code and detail message.

```python
from fastapi import FastAPI, HTTPException

app = FastAPI()

items = {"foo": "The Foo Wrestlers"}

@app.get("/items/{item_id}")
def read_item(item_id: str):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"item": items[item_id]}
```

You can also use custom exception handlers to manage errors globally.

## 8. What is dependency injection in FastAPI?

Dependency Injection is a design pattern where the dependencies of a component are provided to it rather than created by it. FastAPI has a powerful dependency injection system.

```python
from fastapi import Depends, FastAPI

app = FastAPI()

async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return commons
```

Here, `common_parameters` is a dependency. FastAPI will call it and inject the result into the `commons` parameter of `read_items`.

## 9. How do you work with forms and file uploads?

For form data, you use `Form` and for file uploads, you use `File` and `UploadFile`.

```python
from fastapi import FastAPI, File, Form, UploadFile

app = FastAPI()

@app.post("/files/")
async def create_file(file: bytes = File(...)):
    return {"file_size": len(file)}

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename, "content_type": file.content_type}
```

## 10. How do you implement authentication and authorization?

FastAPI provides security utilities to handle authentication and authorization, often using dependencies. Common schemes include OAuth2 with Bearer tokens.

```python
from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    return {"token": token}
```

This sets up a dependency that requires a Bearer token in the `Authorization` header.

## 11. How do you test a FastAPI application?

FastAPI is highly testable. You can use `TestClient` with a testing framework like `pytest`.

```python
from fastapi.testclient import TestClient
from .main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}
```

## 12. What are some best practices for structuring a FastAPI project?

A good project structure separates concerns:

-   `main.py`: The main FastAPI app instance.
-   `routers/`: A directory for API routers (endpoints).
-   `models/`: Pydantic models.
-   `schemas/`: Pydantic schemas (can be combined with models).
-   `crud/`: Functions for database operations.
-   `db/`: Database session management.
-   `core/`: Configuration and settings.

## 13. How to handle CORS?

CORS (Cross-Origin Resource Sharing) can be handled using `CORSMiddleware`.

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 14. How to use async/await?

FastAPI is built on ASGI and supports `async` functions out of the box. Use `async def` for path operation functions that perform `await`-able operations like database queries or external API calls.

```python
@app.get("/")
async def read_results():
    results = await some_async_library.do_something()
    return results
```

For regular `def` functions, FastAPI runs them in an external threadpool to avoid blocking the event loop.

## 15. How to deploy a FastAPI application?

FastAPI applications are deployed using an ASGI server like Uvicorn or Hypercorn. For production, you would typically run Uvicorn with Gunicorn managing the worker processes.

```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

This setup is often placed behind a reverse proxy like Nginx or Traefik and containerized using Docker.
