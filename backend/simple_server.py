from fastapi import FastAPI
import uvicorn

app = FastAPI(title="Kinetic AI Backend")

@app.get("/")
def read_root():
    return {"message": "Kinetic AI Backend is running!", "status": "OK"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8081)