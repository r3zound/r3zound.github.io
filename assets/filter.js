/* r3zound 项目站 · 分类徽章 + 关键词筛选
 *
 * 纯前端筛选：读取每个 .filterable 元素上的 data-tag / data-hay 做过滤，
 * 筛选状态同步到 URL（?q=...&tag=...），刷新与分享都能还原。
 * 没有 JS 时页面照常可读，只是不能筛。
 */
(function () {
  'use strict';

  function initBar(bar) {
    var scope = bar.getAttribute('data-scope');
    var input = bar.querySelector('.fsearch');
    var count = document.getElementById('fcount-' + scope);
    var empty = document.getElementById('fempty-' + scope);
    var chips = Array.prototype.slice.call(bar.querySelectorAll('.fchip'));
    var list = document.querySelector('.list');

    if (!list) { return; }
    var units = Array.prototype.slice.call(list.querySelectorAll('.filterable'));
    var groups = Array.prototype.slice.call(list.querySelectorAll('.filterable-group'));
    var total = units.length;

    // 分组页里，未命中的整个分组要一起隐藏
    var groupOf = {};
    groups.forEach(function (g) {
      Array.prototype.slice.call(g.querySelectorAll('.filterable')).forEach(function (u) {
        groupOf[u] = g;
      });
    });

    var state = { q: '', tag: '' };

    function readUrl() {
      var p = new URLSearchParams(window.location.search);
      state.q = (p.get('q') || '').trim();
      state.tag = (p.get('tag') || '').trim();
    }

    function writeUrl() {
      var p = new URLSearchParams();
      if (state.q) { p.set('q', state.q); }
      if (state.tag) { p.set('tag', state.tag); }
      var s = p.toString();
      var url = window.location.pathname + (s ? '?' + s : '') + window.location.hash;
      window.history.replaceState(null, '', url);
    }

    function hit(u) {
      if (state.tag && u.getAttribute('data-tag') !== state.tag) { return false; }
      if (!state.q) { return true; }
      return (u.getAttribute('data-hay') || '').indexOf(state.q.toLowerCase()) !== -1;
    }

    function apply() {
      var shown = 0;
      var groupShown = {};

      units.forEach(function (u) {
        var ok = hit(u);
        u.hidden = !ok;
        if (ok) {
          shown++;
          var g = groupOf[u];
          if (g) { groupShown[g] = (groupShown[g] || 0) + 1; }
        }
      });

      groups.forEach(function (g) {
        g.hidden = (groupShown[g] || 0) === 0;
      });

      // 复刻页没有带 data-hay 的独立条目时，兜住「无匹配」提示
      if (empty) { empty.hidden = shown !== 0; }
      if (count) {
        count.textContent = (state.q || state.tag) ? ('匹配 ' + shown + ' / ' + total + ' 条') : (total + ' 条');
      }
      chips.forEach(function (c) {
        var on = c.getAttribute('data-tag') === state.tag;
        c.classList.toggle('active', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (input && input.value !== state.q) { input.value = state.q; }
      writeUrl();
    }

    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        state.tag = c.getAttribute('data-tag') || '';
        apply();
      });
    });

    if (input) {
      var timer = null;
      input.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          state.q = input.value.trim();
          apply();
        }, 120);
      });
    }

    readUrl();
    // URL 里的 tag 若不存在（改了分类体系），忽略它而不是筛出空列表
    if (state.tag && !chips.some(function (c) { return c.getAttribute('data-tag') === state.tag; })) {
      state.tag = '';
    }
    apply();
  }

  function boot() {
    Array.prototype.slice.call(document.querySelectorAll('.filter-bar')).forEach(initBar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
