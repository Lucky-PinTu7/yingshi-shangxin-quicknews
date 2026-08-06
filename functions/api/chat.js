/* ============================================================
   影视上新快讯 - DeepSeek AI 代理 API
   路径：/api/chat
   功能：智能问答、影视推荐、资讯摘要
   ============================================================ */

var CORS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function json(data, status) {
  return new Response(JSON.stringify(data), { status: status || 200, headers: CORS });
}

/* 根据模式返回不同的 system prompt */
function getSystemPrompt(mode) {
  var prompts = {
    chat: '你是一个影视资讯助手，帮助用户回答关于电影、电视剧、综艺、动漫、纪录片的问题。用中文回答，简洁友好。',
    recommend: '你是一个影视推荐专家。根据用户的喜好描述，推荐3-5部相关的影视作品，包括名称、类型、推荐理由。用中文回答。',
    summary: '你是一个影视资讯编辑。根据用户提供的关键词或信息，生成一段简洁的影视资讯摘要，100字以内。用中文回答。'
  };
  return prompts[mode] || prompts.chat;
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS });
}

/* POST /api/chat - DeepSeek AI 对话代理 */
export async function onRequestPost(context) {
  var apiKey = context.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return json({ error: 'AI 功能未配置' }, 500);
  }

  try {
    var body = await context.request.json();
    var messages = body.messages || [];
    var mode = body.mode || 'chat';

    /* 组装带 system prompt 的消息列表 */
    var fullMessages = [{ role: 'system', content: getSystemPrompt(mode) }];
    for (var i = 0; i < messages.length; i++) {
      if (messages[i].role && messages[i].content) {
        fullMessages.push({ role: messages[i].role, content: messages[i].content });
      }
    }

    var resp = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: fullMessages,
        stream: false
      })
    });

    if (!resp.ok) {
      var errText = '';
      try { errText = (await resp.json()).error?.message || ''; } catch (e) {}
      return json({ error: 'AI 服务暂时不可用，请稍后重试' + (errText ? '（' + errText + '）' : '') }, 502);
    }

    var data = await resp.json();
    var reply = '';
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      reply = data.choices[0].message.content || '';
    }
    return json({ reply: reply, mode: mode });
  } catch (e) {
    return json({ error: '请求处理失败，请稍后重试' }, 500);
  }
}
