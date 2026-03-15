#!/usr/bin/env python3
import uvicorn
import sys
from pathlib import Path

if __name__ == "__main__":
    print("🚀 Starting UpHealth FastAPI Server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔄 Interactive API: http://localhost:8000/redoc")
    print("-" * 50)
    
    try:
        uvicorn.run(
            "fastapi_app:app",
            host="0.0.0.0",
            port=8000,
            reload=True,  # Auto-reload on code changes
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

