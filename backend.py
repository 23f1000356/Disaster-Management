from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
import socketio
import os
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import bcrypt

# FastAPI and SocketIO setup
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
sio = socketio.AsyncServer(async_mode='asgi')
app.mount("/ws", socketio.ASGIApp(sio))

# Database setup
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, 'acms.db')
engine = create_engine(f'sqlite:///{DB_PATH}', connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Model
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    role = Column(String, nullable=False, default="user")  # Added role column

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Models
class SignupData(BaseModel):
    name: str
    username: str
    phone: str
    email: str
    password: str
    gender: str
    role: str = "user"  # Added role with default value

class LoginData(BaseModel):
    username: str
    password: str
    role: str = "user"

# Initialize Database
Base.metadata.create_all(bind=engine)

# Migrate initial data
def init_db():
    db = SessionLocal()
    try:
        # Admin user
        if not db.query(User).filter_by(email='admin@gmail.com').first():
            hashed_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            admin_user = User(
                name='Admin User',
                username='admin',
                phone='1234567890',
                email='admin@gmail.com',
                password=hashed_password,
                gender='other',
                role='admin'  # Set role to admin
            )
            db.add(admin_user)
            db.commit()
            print("Admin user created.")

        # Default user
        if not db.query(User).filter_by(email='user@gmail.com').first():
            hashed_password = bcrypt.hashpw('user123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            default_user = User(
                name='Default User',
                username='defaultuser',
                phone='0987654321',
                email='user@gmail.com',
                password=hashed_password,
                gender='male',
                role='user'  # Set role to user
            )
            db.add(default_user)
            db.commit()
            print("Default user created.")
    except Exception as e:
        print(f"Error during database initialization: {str(e)}")
        db.rollback()
    finally:
        db.close()

init_db()

# Signup Endpoint
@app.post("/api/signup")
async def signup(data: SignupData, db: Session = Depends(get_db)):
    if db.query(User).filter_by(email=data.email).first() or db.query(User).filter_by(username=data.username).first():
        raise HTTPException(status_code=400, detail="Username or email already exists")
    hashed_password = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = User(
        name=data.name,
        username=data.username,
        phone=data.phone,
        email=data.email,
        password=hashed_password,
        gender=data.gender,
        role=data.role  # Store role
    )
    db.add(new_user)
    db.commit()
    return JSONResponse({"message": "Account created successfully!"})

# Login Endpoint
@app.post("/api/login")
async def login(data: LoginData, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(username=data.username).first()
    if not user or not bcrypt.checkpw(data.password.encode('utf-8'), user.password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    if user.role != data.role:
        raise HTTPException(status_code=403, detail="Selected role does not match user role")
    return JSONResponse({"message": "Login successful", "user_id": user.id, "username": user.username, "role": user.role})

# Existing SocketIO and Prediction Endpoints
@sio.event
async def connect(sid, environ):
    print(f"Client {sid} connected")
    await sio.emit("disaster_update", {"status": "monitoring", "location": "California"}, to=sid)

@app.get("/api/predictions")
async def get_predictions():
    # Simulate AI prediction (replace with LSTM model logic)
    return JSONResponse({"disaster": "wildfire", "probability": 0.85, "time": "2025-08-12T08:53:00Z"}) # Corrected to 02:23 PM IST (UTC)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)