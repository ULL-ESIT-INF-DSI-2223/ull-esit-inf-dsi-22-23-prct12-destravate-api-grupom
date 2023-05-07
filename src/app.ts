import express from 'express';
import './db/mongoose.js';
import { userRouter } from './routers/userRouter.js'
import { trackRouter } from './routers/trackRouter.js'
import { groupRouter } from './routers/groupRouter.js'
import { challengeRouter } from './routers/challengeRouter.js'
import { defaultRouter } from './routers/defaultRouter.js';

export const app = express();
app.use(express.json());
app.use(userRouter);
app.use(trackRouter);
app.use(groupRouter);
app.use(challengeRouter);
app.use(defaultRouter);


// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log(`Server is up on port ${port}`);
// });