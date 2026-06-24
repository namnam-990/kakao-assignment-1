import os

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, func
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from pydantic import BaseModel, ConfigDict

# ---------------------------------------------------------------------------
# DB 설정
# ---------------------------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ---------------------------------------------------------------------------
# DB 모델 (테이블 구조)
# ---------------------------------------------------------------------------
class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    date = Column(String, nullable=False, index=True)  # "YYYY-MM-DD"


# ---------------------------------------------------------------------------
# Pydantic 스키마 (요청/응답 구조)
# ---------------------------------------------------------------------------
class TodoCreate(BaseModel):
    text: str
    date: str


class TodoUpdate(BaseModel):
    text: str | None = None
    completed: bool | None = None


class TodoResponse(BaseModel):
    id: int
    text: str
    completed: bool
    date: str

    model_config = ConfigDict(from_attributes=True)


# 테이블 생성
Base.metadata.create_all(bind=engine)

# ---------------------------------------------------------------------------
# FastAPI 앱
# ---------------------------------------------------------------------------
app = FastAPI(title="Todo API")

origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# DB 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------------------------
# 엔드포인트
# ---------------------------------------------------------------------------
@app.get("/")
def root():
    return {"message": "Todo API"}


@app.get("/todos", response_model=list[TodoResponse])
def list_todos(
    date: str | None = None,
    filter: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    """날짜(date)별 조회 + 서버 기반 필터(filter) / 검색(search)."""
    query = db.query(Todo)

    if date:
        query = query.filter(Todo.date == date)

    if filter == "active":
        query = query.filter(Todo.completed.is_(False))
    elif filter == "completed":
        query = query.filter(Todo.completed.is_(True))

    if search:
        query = query.filter(Todo.text.contains(search))

    return query.order_by(Todo.id.desc()).all()


@app.get("/todos/counts")
def todo_counts(start: str, end: str, db: Session = Depends(get_db)):
    """start~end 기간의 날짜별 Todo 개수 (주간 네비게이터용)."""
    rows = (
        db.query(Todo.date, func.count(Todo.id))
        .filter(Todo.date >= start, Todo.date <= end)
        .group_by(Todo.date)
        .all()
    )
    return {date: count for date, count in rows}


@app.get("/todos/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@app.post("/todos", response_model=TodoResponse, status_code=201)
def create_todo(payload: TodoCreate, db: Session = Depends(get_db)):
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    if not payload.date:
        raise HTTPException(status_code=400, detail="date is required")

    todo = Todo(text=text, completed=False, date=payload.date)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, payload: TodoUpdate, db: Session = Depends(get_db)):
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    if payload.text is not None:
        text = payload.text.strip()
        if not text:
            raise HTTPException(status_code=400, detail="text cannot be empty")
        todo.text = text

    if payload.completed is not None:
        todo.completed = payload.completed

    db.commit()
    db.refresh(todo)
    return todo


@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(todo)
    db.commit()
    return None
