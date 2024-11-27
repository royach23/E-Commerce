from fastapi import FastAPI
from .routers import user_router, product_router, transaction_router
from .middlewares.errorHandler import ErrorHandlerMiddleware
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(ErrorHandlerMiddleware)

app.include_router(user_router)
app.include_router(product_router)
app.include_router(transaction_router)
