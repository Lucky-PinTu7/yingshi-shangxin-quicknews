/* 一次性导入种子数据（修复编码问题） */
export async function onRequestGet(context) {
  var db = context.env.DB;
  if (!db) return new Response(JSON.stringify({ error: 'D1 not bound' }), { headers: { 'Content-Type': 'application/json' } });

  try {
    // 清空旧数据
    await db.prepare('DELETE FROM news').run();

    var now = new Date();
    var dateStr = now.toISOString().split('T')[0];

    var items = [
      ['10:00', '电影', '《逆光航行》定档国庆，发布首张概念海报', '航海题材冒险片正式锁定国庆档期，主创团队透露将以实景拍摄呈现大洋深处的风暴与人性的抉择，概念海报以一艘孤船驶向雷云震撼释出。', '光影快讯', 'https://ent.sina.com.cn/f/2026-07-24/igx-abc123.shtml'],
      ['14:30', '电视剧', '都市轻喜剧《烟火邻里》官宣主演阵容', '聚焦社区邻里日常的轻喜剧公布主演名单，讲述一条老街上六户人家在搬迁风波中互相扶持的温暖故事，预计秋季开机。', '剧集风向标', 'https://ent.qq.com/a/20260724/012.htm'],
      ['20:00', '综艺', '《周末新势力》第二季回归，赛制全新升级', '音乐竞演综艺第二季官宣回归，本季引入原创赛道与跨界合作舞台，导师阵容将在下周直播揭晓，首期定档八月初。', '综艺观察室', 'https://ent.163.com/26/0724/var-456.shtml'],
      ['09:30', '动漫', '原创动画《星海少年》定档八月暑期档', '少年星际冒险题材原创动画公布定档信息，讲述主角与机械伙伴穿越星云寻找家园的故事，画风清新热血，主题曲已同步上线。', '二次元前线', 'https://acg.163.com/26/0725/star-789.html'],
      ['12:00', '纪录片', '《荒野中国》第二季开播，聚焦高原生灵', '自然纪录片第二季正式开播，镜头深入海拔四千米以上的高原腹地，记录雪豹、藏羚羊等珍稀物种的四季生存图景。', '纪实视界', 'https://doc.sohu.com/2026/n0725/wild-321.shtml'],
      ['16:00', '电影', '《长安旧事》释出定档预告，古装悬疑引期待', '古装悬疑片发布定档预告，以一桩旧城悬案串联市井群像，导演表示将用长镜头还原盛唐街市的烟火气，影片将于中秋上映。', '银幕先知', 'https://www.1905.com/news/2026/0725/1654321.shtml'],
      ['21:00', '电视剧', '《春日迟迟》官宣杀青，发布幕后特辑', '年代情感剧正式杀青并发布幕后特辑，主演团队历经四个月辗转三地取景，讲述两代人在改革开放浪潮中的命运纠葛。', '剧透社', 'https://ent.sina.com.cn/t/2026-07-25/spring-654.shtml'],
      ['08:30', '电视剧', '古装权谋剧《破晓时分》定档七夕开播', '古装权谋剧官宣定档七夕黄金档开播，以朝堂博弈与边关战事双线并行，制作方表示服化道历时两年考据还原，定档海报今日同步释出。', '剧集风向标', 'https://ent.sina.com.cn/t/2026-07-27/dawn-001.shtml'],
      ['10:00', '电影', '《逆光航行》发布定档预告与角色海报', '航海冒险片同步释出定档预告及六张角色海报，预告中巨浪与雷暴场面震撼，主演阵容正式揭晓，影片锁定国庆档上映。', '光影快讯', 'https://ent.sina.com.cn/f/2026-07-27/igx-def456.shtml'],
      ['13:00', '动漫', '《云端物语》定档十月，治愈系原创动画来袭', '治愈系原创动画《云端物语》官宣定档十月，讲述云端邮差为天空之城居民送递心声道歉信的奇遇，首支预告温暖释出。', '二次元前线', 'https://acg.163.com/26/0727/cloud-334.html'],
      ['15:30', '综艺', '《城市探索家》第三季回归，首站定档西安', '户外探索综艺第三季官宣回归，本季以丝路沿线古城为线索，首站定档西安，嘉宾将通过任务挑战解锁城市文化密码。', '综艺观察室', 'https://ent.qq.com/a/20260727/015.htm'],
      ['18:00', '纪录片', '《深海之下》定档九月，科考纪实震撼来袭', '海洋科考纪录片定档九月上映，跟随科考船记录万米深渊生物样本采集全过程，预告中罕见深海生物影像首次曝光。', '纪实视界', 'https://doc.sohu.com/2026/n0727/deep-771.shtml'],
      ['21:00', '电视剧', '《烟火邻里》释出定妆照，群像阵容曝光', '社区轻喜剧发布全员定妆照，十二位角色的市井造型同步曝光，导演表示每集将以一个邻里小事为切口展开笑中带泪的故事。', '剧透社', 'https://ent.sina.com.cn/t/2026-07-27/hood-902.shtml']
    ];

    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      await db.prepare('INSERT INTO news (time, type, title, summary, source, sourceUrl, date) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(it[0], it[1], it[2], it[3], it[4], it[5], dateStr).run();
    }

    return new Response(JSON.stringify({ success: true, count: items.length, date: dateStr }, null, 2), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }, null, 2), {
      status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
}
