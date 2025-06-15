from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app):
    """Configure CORS with support for WebSocket"""
    origins = [
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:8000",
        "https://*.ngrok.app",
        "http://*.ngrok.app",
        "https://*.ngrok.io",
        "http://*.ngrok.io",
        "*"  # Allow all origins temporarily for testing
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
        allow_origin_regex=r"https?://.*\.ngrok\.io"
    )
