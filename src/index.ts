import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { router } from "./routes/router";
const app = new Koa();

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.APP_PORT ?? 3000);
