from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "CI/CD Python is running!"}

@app.get("/version")
def version():
    return {"version": "1.0"}