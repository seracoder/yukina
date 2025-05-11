---
title: Adding RapiDoc Documentation to FastAPI
published: 2025-05-05
description: Enhance your FastAPI documentation with RapiDoc
tags: [fastapi, rapidoc]
category: Python
author: Md hamim
draft: false
cover: /covers/rapidoc-fastapi.webp
---

FastAPI is renowned for its speed, ease of use, and, importantly, its automatic interactive API documentation. Out of the box, it provides fantastic integration with Swagger UI (at `/docs`) and ReDoc (at `/redoc`), both based on the OpenAPI standard.

But what if you want a different look, feel, or set of features for your API documentation? Enter **RapiDoc**, another excellent, customizable, and modern API documentation generator that works beautifully with OpenAPI specifications.

Integrating RapiDoc into your FastAPI application is surprisingly straightforward. Let's walk through how to add a dedicated endpoint to serve RapiDoc alongside the default options.

**Why Add RapiDoc?**

While Swagger UI and ReDoc are great, RapiDoc offers:

1.  **Different UI/UX:** A clean, responsive, single-page style documentation that some users might prefer.
2.  **Customization:** Extensive options for theming (colors, fonts), layout adjustments, and feature toggling.
3.  **Rich Features:** Built-in console for trying out API calls, schema display, markdown support, and more.
4.  **Choice:** Providing multiple documentation interfaces caters to different user preferences within your team or consumer base.

**The Implementation: Serving RapiDoc via HTMLResponse**

The core idea is simple: create a FastAPI route that returns an HTML page. This HTML page will load the RapiDoc web component and point it to your FastAPI application's automatically generated OpenAPI schema (usually found at `/openapi.json`).

Here's the Python code to achieve this:

```python
# Ensure you have fastapi installed: pip install fastapi uvicorn
# Assuming your FastAPI app instance is named 'app'
# e.g., from fastapi import FastAPI
#       app = FastAPI()
# If your app is in a different file (like 'main.py'), adjust the import:
# from main import app
# Or, if this code is IN your main file where app is defined,
# you don't need the 'from api import app' line.

from fastapi import FastAPI # Or your app instance import
from fastapi.responses import HTMLResponse

# Example: Assuming your FastAPI instance is created here
app = FastAPI(title="My Awesome API")

# --- RapiDoc Integration Code ---

# Define the HTML content for the RapiDoc page
RAPIDOC_HTML = """
<!doctype html> <!-- Important: must specify -->
<html>
  <head>
    <meta charset="utf-8"> <!-- Important: rapi-doc uses utf8 characters -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>RapiDoc for My Awesome API</title>
    <!-- Load RapiDoc via CDN -->
    <script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
  </head>
  <body>
    <!-- Initialize RapiDoc pointing to your OpenAPI schema -->
    <rapi-doc
        spec-url="/openapi.json"
        render-style = "view" <!-- Options: view, read, focused -->
        show-header = "false"  <!-- Example customization -->
        theme = "dark"       <!-- Example customization: light, dark -->
        regular-font = "Inter" <!-- Example: Use a Google Font -->
     > </rapi-doc>
  </body>
</html>
"""

@app.get("/docs/rapidoc", include_in_schema=False)
async def get_rapidoc_docs():
    """Serves the RapiDoc API documentation."""
    return HTMLResponse(
        content=RAPIDOC_HTML,
        status_code=200,
        media_type="text/html",
        headers={
            # Cache aggressively as the HTML content itself rarely changes
            # The RapiDoc JS and openapi.json have their own caching mechanisms
            "Cache-Control": "public, max-age=3600" # Cache for 1 hour
        }
    )

# --- Your other API routes go here ---
@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}

# --- To run the app (save as main.py) ---
# uvicorn main:app --reload
```

**Breaking Down the Code:**

1.  **The `RAPIDOC_HTML` String:** This constant holds the necessary HTML structure. Key elements within it are:
    *   **`<script type="module" src="...">`**: This loads the RapiDoc JavaScript library, typically from a CDN like `unpkg`. This script is what renders the documentation UI.
    *   **`<rapi-doc spec-url="/openapi.json"> </rapi-doc>`**: This is the custom HTML tag provided by RapiDoc. Its `spec-url` attribute is crucial – it tells RapiDoc where to find the API's OpenAPI schema definition. FastAPI conveniently provides this at the `/openapi.json` endpoint by default. You can add various other attributes to this tag (like `theme`, `render-style`, `show-header`, etc.) to customize RapiDoc's appearance and behavior directly within the HTML.

2.  **`@app.get("/docs/rapidoc", include_in_schema=False)`**: This standard FastAPI decorator registers the function below it to handle GET requests for the `/docs/rapidoc` path.
    *   **`"/docs/rapidoc"`**: Defines the URL path where the RapiDoc interface will be accessible. You can customize this path (e.g., `/rapidocs`, `/api-docs/alternate`).
    *   **`include_in_schema=False`**: This is a vital parameter for documentation endpoints. Setting it to `False` tells FastAPI *not* to include this specific `/docs/rapidoc` endpoint itself in the generated OpenAPI schema (`/openapi.json`). This prevents the documentation page from documenting itself, keeping the API definition focused solely on the actual API operations you want to expose.

3.  **`async def get_rapidoc_docs():`**: This is the asynchronous path operation function that FastAPI calls when a request hits `/docs/rapidoc`.

4.  **`return HTMLResponse(...)`**: Instead of returning JSON or other data, this function returns an `HTMLResponse`.
    *   `content=RAPIDOC_HTML`: Specifies the HTML content defined earlier as the response body.
    *   `headers={...}`: We include a `Cache-Control` header. This instructs browsers and intermediate caches that they can store this HTML response for a specified duration (e.g., 3600 seconds), reducing load on the server for subsequent requests to the documentation page itself. The actual API schema (`openapi.json`) and the RapiDoc JavaScript might have their own separate caching behaviors.

**How It Works Under the Hood**

1.  You run your FastAPI application (e.g., using `uvicorn main:app --reload`).
2.  You navigate your browser to `http://127.0.0.1:8000/docs/rapidoc` (or your server's address).
3.  FastAPI matches the path `/docs/rapidoc` to your `get_rapidoc_docs` function.
4.  The function returns the `HTMLResponse` containing the RapiDoc setup HTML.
5.  Your browser receives the HTML and starts rendering it.
6.  The `<script>` tag fetches the RapiDoc JavaScript from the CDN.
7.  The RapiDoc script executes and finds the `<rapi-doc>` tag.
8.  It sees `spec-url="/openapi.json"` and makes a background request to `http://127.0.0.1:8000/openapi.json`.
9.  FastAPI automatically generates and returns the OpenAPI JSON schema for your API.
10. RapiDoc receives the schema, parses it, and dynamically renders the interactive API documentation within your browser.

**Conclusion**

Adding RapiDoc to your FastAPI project is a simple yet powerful way to enhance your API documentation offering. By leveraging `HTMLResponse` and RapiDoc's web component, you can provide users with another high-quality, customizable interface to explore and interact with your API, all with just a few lines of Python code. Give it a try and explore the customization options RapiDoc provides!