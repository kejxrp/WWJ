Amplitude.init({
  songs: [
  {
    "name": "Yes I Can Actually Rap, You Fucking Idiot (Freestyle)",
    "artist": "PRXJEK",
    "url": "audios/01_Yes_I_Can_Actually_Rap_You_Fucking_Idiot_Freestyle.mp3"
  },
  {
    "name": "WhyDoesNothingseemToLast?",
    "artist": "PRXJEK",
    "url": "audios/02_WhyDoesNothingseemToLast.mp3"
  },
  {
    "name": "ONETAKE",
    "artist": "PRXJEK",
    "url": "audios/03_ONETAKE.mp3"
  },
  {
    "name": "BURY YOUR BODY (SHIT ON YOUR GRAVE)",
    "artist": "PRXJEK",
    "url": "audios/04_BURY_YOUR_BODY_SHIT_ON_YOUR_GRAVE.mp3"
  },
  {
    "name": "LostInMyhead",
    "artist": "PRXJEK",
    "url": "audios/05_LostInMyhead.mp3"
  },
  {
    "name": "BlackEyesBlackMindBlackThoughtsBlackHeart",
    "artist": "PRXJEK",
    "url": "audios/06_BlackEyesBlackMindBlackThoughtsBlackHeart.mp3"
  },
  {
    "name": "FUCKKKK! (FUCKISUP)",
    "artist": "PRXJEK",
    "url": "audios/07_FUCKKKK_FUCKISUP.mp3"
  },
  {
    "name": "BLADETUCKEDFACEFUCK",
    "artist": "PRXJEK",
    "url": "audios/08_BLADETUCKEDFACEFUCK.mp3"
  },
  {
    "name": "3 AM- IsSomebodyWatchingMe?",
    "artist": "PRXJEK",
    "url": "audios/09_3_AM-_IsSomebodyWatchingMe.mp3"
  },
  {
    "name": "Did This One For Fun",
    "artist": "PRXJEK",
    "url": "audios/10_Did_This_One_For_Fun.mp3"
  },
  {
    "name": "HATRED PAIN AND AGONY",
    "artist": "PRXJEK",
    "url": "audios/11_HATRED_PAIN_AND_AGONY.mp3"
  },
  {
    "name": "WhatTheFuckAreYouLookingAt?",
    "artist": "PRXJEK",
    "url": "audios/12_WhatTheFuckAreYouLookingAt.mp3"
  },
  {
    "name": "TheyOnlyNoticeYouWhenYoureDead",
    "artist": "PRXJEK",
    "url": "audios/13_TheyOnlyNoticeYouWhenYoureDead.mp3"
  },
  {
    "name": "I Am God's Mistake (SweetReleaseOfDeath)",
    "artist": "PRXJEK",
    "url": "audios/14_I_Am_Gods_Mistake_SweetReleaseOfDeath.mp3"
  },
  {
    "name": "THIS IS THE PART WHERE YOU RUN (YOU'RE FUCKED)",
    "artist": "PRXJEK",
    "url": "audios/15_THIS_IS_THE_PART_WHERE_YOU_RUN_YOURE_FUCKED.mp3"
  },
  {
    "name": "At Night All My Doubts Gather, And I'm Just Left Feeling Empty",
    "artist": "PRXJEK",
    "url": "audios/16_At_Night_All_My_Doubts_Gather_And_Im_Just_Left_Feeling_Empty.mp3"
  }
],
  volume: 100
});

(function initVhsIntro() {
  var intro = document.getElementById("vhs-intro");
  if (!intro) return;

  var body = document.body;
  var hasExited = false;

  function tryAutoPlayAfterIntro() {
    var playPauseBtn = document.querySelector(".amplitude-play-pause");
    try {
      if (window.Amplitude && typeof window.Amplitude.play === "function") {
        window.Amplitude.play();
      }
    } catch (err) {
      // Fallback click handles most player states.
    }
    if (playPauseBtn) {
      playPauseBtn.click();
    }
  }

  function finishIntro() {
    if (hasExited) return;
    hasExited = true;
    intro.classList.add("is-closing");

    window.setTimeout(function () {
      intro.classList.add("is-exit");
    }, 540);

    window.setTimeout(function () {
      if (intro && intro.parentNode) {
        intro.parentNode.removeChild(intro);
      }
      body.classList.remove("vhs-intro-active");
      tryAutoPlayAfterIntro();

      // Autoplay can be blocked; retry on first user interaction.
      window.addEventListener(
        "pointerdown",
        function retryPlayOnInteraction() {
          tryAutoPlayAfterIntro();
        },
        { once: true }
      );
    }, 1200);
  }

  window.setTimeout(finishIntro, 2600);
  intro.addEventListener("click", finishIntro);
})();

(function initWwjCountdown() {
  var storageKey = "prxjek_wwj_countdown_target";
  var targetMs = null;

  function readStoredTarget() {
    try {
      var rawValue = window.localStorage.getItem(storageKey);
      if (!rawValue) return null;
      var parsed = Number(rawValue);
      if (!Number.isFinite(parsed) || parsed <= Date.now()) return null;
      return parsed;
    } catch (err) {
      return null;
    }
  }

  function saveTarget(value) {
    try {
      window.localStorage.setItem(storageKey, String(value));
    } catch (err) {
      // Ignore localStorage errors and still run in-memory.
    }
  }

  function makeHundredYearTarget() {
    var now = new Date();
    var future = new Date(now.getTime());
    future.setFullYear(future.getFullYear() + 100);
    return future.getTime();
  }

  function pad(value, size) {
    return String(value).padStart(size, "0");
  }

  function splitDiff(msLeft) {
    var totalSeconds = Math.max(0, Math.floor(msLeft / 1000));
    var years = Math.floor(totalSeconds / (365.2425 * 24 * 60 * 60));
    totalSeconds -= Math.floor(years * 365.2425 * 24 * 60 * 60);

    var days = Math.floor(totalSeconds / 86400);
    totalSeconds -= days * 86400;
    var hours = Math.floor(totalSeconds / 3600);
    totalSeconds -= hours * 3600;
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds - minutes * 60;

    return {
      years: years,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
  }

  function updateDom(timeParts) {
    var yearsEl = document.querySelector('[data-countdown-unit="years"]');
    var daysEl = document.querySelector('[data-countdown-unit="days"]');
    var hoursEl = document.querySelector('[data-countdown-unit="hours"]');
    var minutesEl = document.querySelector('[data-countdown-unit="minutes"]');
    var secondsEl = document.querySelector('[data-countdown-unit="seconds"]');
    if (!yearsEl || !daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    yearsEl.textContent = String(timeParts.years);
    daysEl.textContent = pad(timeParts.days, 3);
    hoursEl.textContent = pad(timeParts.hours, 2);
    minutesEl.textContent = pad(timeParts.minutes, 2);
    secondsEl.textContent = pad(timeParts.seconds, 2);
  }

  function tick() {
    var diff = targetMs - Date.now();
    if (diff <= 0) {
      targetMs = makeHundredYearTarget();
      saveTarget(targetMs);
      diff = targetMs - Date.now();
    }
    updateDom(splitDiff(diff));
  }

  targetMs = readStoredTarget();
  if (!targetMs) {
    targetMs = makeHundredYearTarget();
    saveTarget(targetMs);
  }

  tick();
  window.setInterval(tick, 1000);
})();

(function initCinematicMotion() {
  var sectionSelector = 'section[id]:not(#intro):not(#audio-player)';
  var sections = Array.prototype.slice.call(document.querySelectorAll(sectionSelector));
  if (!sections.length) return;

  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.classList.add("motion-ready");

  function tagClusters(section) {
    var clusters = section.querySelectorAll(
      ".grid > *, iframe, .locked-card, .btn-view-all, #album-stream-link, #subscribe-button, form > div, .md\\:max-w-3xl, .lg\\:w-2\\/5"
    );
    var idx = 0;
    Array.prototype.forEach.call(clusters, function (el) {
      if (el.classList.contains("motion-cluster")) return;
      el.classList.add("motion-cluster");
      el.style.setProperty("--cluster-index", String(idx));
      idx += 1;
    });
  }

  sections.forEach(function (section) {
    tagClusters(section);
  });

  if (prefersReduced || !("IntersectionObserver" in window)) {
    sections.forEach(function (section) {
      section.classList.add("in-view");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
      });
    },
    {
      root: null,
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });

  var ticking = false;
  function updateScrollLinkedDrift() {
    ticking = false;
    var vh = window.innerHeight || 1;
    sections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      var distance = (center - vh / 2) / vh;
      var clamped = Math.max(-1, Math.min(1, distance));
      var driftPx = -clamped * 10;
      section.style.setProperty("--section-drift", driftPx.toFixed(2) + "px");
    });
  }

  function requestDriftUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollLinkedDrift);
  }

  updateScrollLinkedDrift();
  window.addEventListener("scroll", requestDriftUpdate, { passive: true });
  window.addEventListener("resize", requestDriftUpdate);
})();

