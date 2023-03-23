import {
  TG_API_KEY,
  TG_CHANNEL_ID,
  TG_CHANNEL_NAME,
  TG_INVITE_LINK,
} from "./config.mjs";
import { Telegraf, Markup } from "telegraf";

const bot = new Telegraf(TG_API_KEY);

bot.start(async (ctx) => {
  const startMessage =
    "Привет!" +
    "\n\n" +
    `Бот является администратором приватного канала ${TG_CHANNEL_NAME}.` +
    "\n\n" +
    "Бот автоматически принимает все заявки на вступление в канал.";

  await ctx.reply(
    startMessage,
    Markup.inlineKeyboard([
      Markup.button.url("Подать заявку на вступление в канал", TG_INVITE_LINK),
    ])
  );
});

bot.on("chat_join_request", async (ctx) => {
  if (ctx.chat.id.toString() !== TG_CHANNEL_ID) {
    await ctx.declineChatJoinRequest(ctx.chatJoinRequest.from.id);
    await bot.telegram.sendMessage(
      ctx.chatJoinRequest.user_chat_id,
      `Этот канал не может быть обслужен ботом: ${ctx.chat.title}.` +
        "\n\n" +
        `Удалите бот из списка администраторов канала либо свяжитесь с администратором бота ${ctx.chat.title}.`
    );
  }
  await ctx.approveChatJoinRequest(ctx.chatJoinRequest.from.id);
  console.log("user invated: " + ctx.chatJoinRequest.from.username);
  await bot.telegram.sendMessage(
    ctx.chatJoinRequest.user_chat_id,
    "Поздравляю! Вы только что подписались на приватный канал.",
    Markup.inlineKeyboard([
      Markup.button.url(
        "Перейти в приватный канал",
        `https://t.me/c/${TG_CHANNEL_ID.slice(4)}/1`
      ),
    ])
  );
});

if (process.env.NODE_ENV === "production") {
  bot
    .launch({
      allowedUpdates: ["callback_query", "chat_join_request", "message"],
      webhook: {
        domain: process.env.URL,
        hookPath: `/bot${process.env.TG_API_KEY}`,
        port: process.env.PORT || 3000,
      },
    })
    .then(console.info("Bot is started and listening on webhook..."))
    .catch((err) => {
      console.info(
        "Unable to start the bot on webhook. Please check the error logs..."
      );
      console.error(err);
    });
} else {
  bot
    .launch({
      allowedUpdates: ["callback_query", "chat_join_request", "message"],
    })
    .then(console.info("Bot is started and listening..."))
    .catch((err) => {
      console.info("Unable to start the bot. Please check the error logs...");
      console.error(err);
    });
}

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// https://t.me/c/1985335112/6
