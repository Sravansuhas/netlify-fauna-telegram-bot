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

bot.on("inline_query", async({ inlineQuery, answerInlineQuery }) => {
    const apiUrl = `http://recipepuppy.com/api/?q=${inlineQuery.query}`;
    const response = await fetch(apiUrl);
    const { results } = await response.json();
    const recipes = results
        .filter(({ thumbnail }) => thumbnail)
        .map(({ title, href, thumbnail }) => ({
            type: "article",
            id: thumbnail,
            title: title,
            description: title,
            thumb_url: thumbnail,
            input_message_content: {
                message_text: title,
            },
            reply_markup: Markup.inlineKeyboard([
                Markup.urlButton("Go to recipe", href),
            ]),
        }));
    return answerInlineQuery(recipes);
});

bot.on("chosen_inline_result", ({ chosenInlineResult }) => {
    console.log("chosen inline result", chosenInlineResult);
});

bot.launch();

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