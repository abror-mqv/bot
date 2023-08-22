const Axios = require('axios')
const TelegramBot = require('node-telegram-bot-api');

const token = '5974390262:AAHkJtQic-zbQdS5X0WJjyQj1HaEogIi_bI';
const bot = new TelegramBot(token, { polling: true });
url_client = 'https://6b67-46-251-195-48.ngrok-free.app'
url_back = 'https://36df-146-19-220-25.ngrok-free.app'



bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});



bot.on('message', async (msg) => {
    function Ofenbach(msg) {
        const userId = msg.from.id;
        const username = msg.from.username;
        const firstName = msg.from.first_name;
        const lastName = msg.from.last_name;
        Axios.post(`${url_back}/api/add-customer/`, {
            'name': firstName+' '+lastName,
            'telegram_username': username,
            'telegram_id': userId
        })
        bot.sendMessage(chatId, `${firstName} ассалому алайкум как ты? \nна чекай бота`)
        Show__Menu();

        // console.log(msg)
    }
    function Show__Menu() {
        bot.sendMessage(chatId, '👨🏻‍💻 Меню:', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '🛒 Корзина',
                            callback_data: 'menu_cart'
                        },
                        {
                            text: '💁🏾 Как мы работаем?',
                            callback_data: 'menu_howwework'
                        }
                    ],
                    [
                        {
                            text: '👕 Каталог',
                            callback_data: 'menu_catalog'
                        },
                    ],
                    [
                        {
                            text: '👋🏻 Моментальная связь с менеджером',
                            callback_data: 'menu_contact'
                        }
                    ]
                ],
            }
        })
    }
    const chatId = msg.chat.id;
    const text = msg.text;
    if (text === '/start') {
        Ofenbach(msg)
    } else if (text === '/menu') {
        Show__Menu()
    }
});

bot.on('callback_query', async (query) => {



    const chatId = query.message.chat.id;
    const data = query.data;
    const sntMsgId = query.message.message_id
    const data_arr = data.split('_')
    const data_preffix = data_arr[0]
    const data_id = data_arr[1]
    if (data_preffix == 'subcat') {
        bot.sendMessage(chatId, 'rety', {

            reply_markup: {
                inline_keyboard: [

                    [
                        {
                            text: 'Открыть каталог',
                            web_app: { url: url_client + '/' + data_id }
                        },
                    ],
                ]
            }
        }).then(() => {
            bot.deleteMessage(chatId, sntMsgId);
        })
    } else if (data_preffix == 'cat') {
        await Axios.get(url_back + "/api/subcats/" + data_id)
            .then(res => {
                console.log(res.data.products)
                bot.sendMessage(chatId, 'Выберите подкатегорию:', {
                    reply_markup: {
                        inline_keyboard: [
                            res.data.products.map(el => {
                                return ({
                                    text: el.subcat_name,
                                    callback_data: "subcat_" + el.id
                                })
                            }),
                        ],
                    }
                }).then(() => {
                    bot.deleteMessage(chatId, sntMsgId);
                })
            })
    } else if (data_preffix == 'menu') {
        if (data_id == 'cart') {
            Show__Cart(chatId, sntMsgId)
        } else if (data_id == 'howwework') {
            Show__WhoAreWe(chatId, sntMsgId)
        } else if (data_id == 'catalog') {
            await Show__Catalog(chatId, sntMsgId)
        } else if (data_id == 'contact') {
            Show__Contact(chatId, sntMsgId)
        } else if (data_id == 'back') {
            Show__Menu(chatId, sntMsgId)
        }
    }
});





function Show__Menu(chatId, sntMsgId) {
    bot.sendMessage(chatId, '👨🏻‍💻 Меню:', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '🛒 Корзина',
                        callback_data: 'menu_cart'
                    },
                    {
                        text: '💁🏾 Как мы работаем?',
                        callback_data: 'menu_howwework'
                    }
                ],
                [
                    {
                        text: '👕 Каталог',
                        callback_data: 'menu_catalog'
                    },
                ],
                [
                    {
                        text: '👋🏻 Моментальная связь с менеджером',
                        callback_data: 'menu_contact'
                    }
                ]
            ],
        }
    }).then(() => {
        bot.deleteMessage(chatId, sntMsgId);
    })
}
function Show__Catalog(chatId, sntMsgId) {

    Axios.get(url_back + '/api/cats')
        .then((data) => {
            const array = data.data.products.map(el => {
                return ({
                    text: el.fields.cat_name,
                    callback_data: 'cat_' + el.pk
                })
            })
            const chunks = [];
            for (let i = 0; i < array.length; i += 2) {
                chunks.push(array.slice(i, i + 2));
            }
            console.log(chunks)

            bot.sendMessage(chatId, 'Выберите категорию:', {
                reply_markup: {
                    inline_keyboard: [
                        // chunks.map(el=>{
                        //     return(
                        //         [el]
                        //     )
                        // })

                        data.data.products.map(el => {
                            return ({
                                text: el.fields.cat_name,
                                callback_data: "cat_" + el.pk
                            })
                        }),

                    ],
                }
            })
        }).then(() => {
            bot.deleteMessage(chatId, sntMsgId);
        })
        .catch(err => { console.log(JSON.stringify(err)) })
}

function Show__WhoAreWe(chatId, sntMsgId) {
    const message = 'Ебать с нами у вас весь нахуй дордой нахуй на ладони ебать'
    bot.sendMessage(chatId, message, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Назад',
                        callback_data: 'menu_back'
                    }
                ]
            ]
        }
    }).then(() => {
        bot.deleteMessage(chatId, sntMsgId);
    })
}

function Show__Contact(chatId, sntMsgId) {
    const message = 'Оператор в спешке докуривает свой кастер ебаный и бежит отвечать тебе ебанько'
    bot.sendMessage(chatId, message, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Назад',
                        callback_data: 'menu_back'
                    }
                ]
            ]
        }
    }).then(() => {
        bot.deleteMessage(chatId, sntMsgId);
    })
}

function Show__Cart(chatId, sntMsgId) {
    const message = 'Корзина... ебать не сделал я еще корзину. Кто на базар с корзиной ходит ебанько'
    bot.sendMessage(chatId, message, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Назад',
                        callback_data: 'menu_back'
                    }
                ]
            ]
        }
    }).then(() => {
        bot.deleteMessage(chatId, sntMsgId);
    })
}

function splitArrayIntoChunks(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

const originalArray = [1, 2, 3, 4, 5, 6, 7, 8];
const chunkSize = 2;

