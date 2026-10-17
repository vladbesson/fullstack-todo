from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class Task(BaseModel):
    id: int
    title: str
    completed: bool


class TaskCreate(BaseModel):
    title: str


class TaskUpdate(BaseModel):
    completed: bool


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type"],
)
next_task_id = 2
tasks = [
    {
        "id": 1,
        "title": "Изучить FastAPI",
        "completed": False,
    }
]


@app.get("/")
def root():
    return {"message": "Hello from FastAPI"}


@app.get("/tasks", response_model=list[Task])
def get_tasks():
    return tasks


@app.post("/tasks", status_code=201, response_model=Task)
def create_task(task: TaskCreate):
    global next_task_id
    new_task = {"id": next_task_id, "title": task.title, "completed": False}
    tasks.append(new_task)
    next_task_id += 1
    return new_task


@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: int):
    for task in tasks:
        if task["id"] == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")


@app.patch("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, update: TaskUpdate):
    for task in tasks:
        if task["id"] == task_id:
            task["completed"] = update.completed
            return task
    raise HTTPException(status_code=404, detail="Task not found")


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    for task in tasks:
        if task["id"] == task_id:
            tasks.remove(task)
            return Response(status_code=204)
    raise HTTPException(status_code=404, detail="Task not found")
