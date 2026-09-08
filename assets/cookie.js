/* ============================================================
   Cookie: баннер согласия и подключение аналитики.
   Подключается на всех страницах сайта.
   ============================================================ */
(function(){
  'use strict';

  /* ---------- Cookie: согласие и подключение аналитики ----------
     Аналитика загружается ТОЛЬКО после явного согласия посетителя.
     Подставьте номер счётчика Яндекс.Метрики в METRIKA_ID, и он начнёт
     работать сам — трогать остальной код не нужно. */
  var METRIKA_ID = 0;            /* ← номер счётчика, например 12345678 */
  var CONSENT_KEY = 'fr-cookie-consent-v1';
  var cookieBox = document.getElementById('cookie');
  var cookieSettings = document.getElementById('cookie-settings');
  var analyticsBox = document.getElementById('cookie-analytics');
  var saveBtn = cookieBox.querySelector('[data-cookie="save"]');

  function readConsent(){
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch (e) { return null; }
  }
  function writeConsent(analytics){
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({
        analytics: !!analytics, date: new Date().toISOString()
      }));
    } catch (e) {}
  }

  function startAnalytics(){
    if (!METRIKA_ID || window.__metrikaStarted) return;
    window.__metrikaStarted = true;
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0];
    k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})
    (window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
    ym(METRIKA_ID, 'init', { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
  }

  function openBanner(showSettings){
    cookieBox.hidden = false;
    var saved = readConsent();
    analyticsBox.checked = saved ? !!saved.analytics : true;
    cookieSettings.hidden = !showSettings;
    saveBtn.hidden = !showSettings;
  }
  function closeBanner(){ cookieBox.hidden = true; }

  function apply(analytics){
    writeConsent(analytics);
    if (analytics) startAnalytics();
    closeBanner();
  }

  document.addEventListener('click', function(e){
    var b = e.target.closest('[data-cookie]');
    if (!b) return;
    var act = b.getAttribute('data-cookie');
    if (act === 'all') apply(true);
    else if (act === 'necessary') apply(false);
    else if (act === 'save') apply(analyticsBox.checked);
    else if (act === 'settings') {
      if (cookieBox.hidden) openBanner(true);
      else { cookieSettings.hidden = false; saveBtn.hidden = false; }
    }
  });

  var consent = readConsent();
  if (!consent) openBanner(false);
  else if (consent.analytics) startAnalytics();
})();
