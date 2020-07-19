const Telegraf = require("telegraf");
const startAction = require("./actions/start");

const inlineAction = require("./actions/inline");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
    return startAction(ctx);
});

bot.on("inline_query", (ctx) => {
    return inlineAction(ctx);
});

exports.handler = async(event) => {
    try {
        await bot.handleUpdate(JSON.parse(event.body));
        return { statusCode: 200, body: "" };
    } catch (e) {
        console.log(e);
        return {
            statusCode: 400,
            body: "This endpoint is meant for bot and telegram communication",
        };
    }
};