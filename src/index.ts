import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { router } from "./routes/routes";
const app = new Koa();

app.use(bodyParser());
app.use(router.routes());

async function run() {
    app.listen(process.env.APP_PORT ?? 3000);
}
