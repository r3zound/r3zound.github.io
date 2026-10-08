/* r3zound.github.io · main.js 空值保护补丁
 * 必须在主题 main.js 之前加载（同一段落里放在它前面）。
 *
 * 主题 main.js 硬依赖站内搜索元素：
 *     var navSearch = document.getElementById('nav-search');
 *     navSearch.addEventListener('mouseover', ...)
 * 本站没有全文搜索（已删 search.xml），页面里不存在 #nav-search / #search，
 * navSearch 为 null → addEventListener 抛 TypeError → 该行之后的所有脚本
 * （含本站 filter.js）全部不执行，表现为筛选器完全没反应。
 *
 * 办法：在 main.js 之前同步塞入空的同名占位元素，让它能安全绑定事件。
 * 元素是隐藏的，看不到。此处同步执行即可——脚本位于 body 末尾，
 * document.body 一定已经存在。
 */
(function () {
  'use strict';
  function stub(id) {
    if (document.getElementById(id)) { return; }
    var el = document.createElement('input');
    el.id = id;
    el.type = 'text';
    el.setAttribute('aria-hidden', 'true');
    el.tabIndex = -1;
    el.style.cssText = 'position:absolute;width:0;height:0;opacity:0;pointer-events:none;left:-9999px;';
    document.body.appendChild(el);
  }
  stub('nav-search');
  stub('search');
})();
