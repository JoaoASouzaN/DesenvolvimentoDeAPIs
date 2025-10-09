import { app } from "./app";
import { userRouter } from "./routes/UserRoutes";
import { petRouter } from "./routes/PetRoutes"

app.use('/users', userRouter)
app.use('/pets', petRouter)