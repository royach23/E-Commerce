from fastapi import FastAPI
from routers import user_router, product_router, transaction_router
from middlewares.errorHandler import ErrorHandlerMiddleware

app = FastAPI()

app.add_middleware(ErrorHandlerMiddleware)

app.include_router(user_router)
app.include_router(product_router)
app.include_router(transaction_router)
