const Telegraf = require("telegraf");
const startAction = require("./actions/start");

const inlineAction = require("./actions/inline");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

/* bot.start((ctx) => {
    return startAction(ctx);
});

bot.on("inline_query", (ctx) => {
    return inlineAction(ctx);
});
 */

bot.use(async(ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log('Response time: %sms', ms)
})

bot.on('text', (ctx) => ctx.reply('Hello World'))
bot.launch()

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