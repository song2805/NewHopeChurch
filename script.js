//최신 브라우저들은 사용자의 편의를 위해 새로고침 시 이전 스크롤 위치를 기억하고 자동으로 복원하는 기능을 가지고 있습니다. 
//파일 맨 위에 다음 코드를 추가하여 브라우저의 스크롤 복원 기능을 끄고, 페이지 로드가 완료되면 스크롤을 최상단으로 이동시키도록 수정하겠습니다. 
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000; // 애니메이션 시간 (1초)
            let startTime = null;

            // Easing 함수 (ease-in-quad: 천천히 시작해서 빨라짐)
            const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1); // 0과 1 사이의 값
                const easedProgress = easeInOutQuad(progress);

                window.scrollTo(0, startPosition + distance * easedProgress);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }
            //웹 브라이저에서 제공하는 Web API인 requestAnimationFrame을 사용하여 애니메이션을 구현합니다.
            //부드러운 스크롤 효과를 위해 requestAnimationFrame()을 사용하는 것은 아주 좋은 선택입니다.
            requestAnimationFrame(animation);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('header nav');

    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // #region agent log - 섹션 겹침 디버깅
    setTimeout(() => {
        const sections = ['#worship-times', '#about', '#praise', '#sermons', '#events', '#contact'];
        sections.forEach(sectionId => {
            const section = document.querySelector(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(section);
                const data = {
                    sectionId,
                    offsetTop: section.offsetTop,
                    offsetHeight: section.offsetHeight,
                    scrollHeight: section.scrollHeight,
                    clientHeight: section.clientHeight,
                    rectTop: rect.top,
                    rectBottom: rect.bottom,
                    computedHeight: computedStyle.height,
                    computedMinHeight: computedStyle.minHeight,
                    computedPaddingTop: computedStyle.paddingTop,
                    computedPaddingBottom: computedStyle.paddingBottom,
                    computedMarginTop: computedStyle.marginTop,
                    computedMarginBottom: computedStyle.marginBottom,
                    classList: section.classList.toString()
                };

                fetch('http://127.0.0.1:7242/ingest/bca272be-0ba2-4ec2-9ccc-9a5cd2cbb2bf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        location: 'script.js:debug-sections',
                        message: `Section ${sectionId} dimensions`,
                        data: data,
                        timestamp: Date.now(),
                        sessionId: 'debug-session',
                        runId: 'after-fix',
                        hypothesisId: 'overlap-debug-1'
                    })
                }).catch(() => {});
            }
        });

        // 다음 섹션 간 거리 계산
        for (let i = 0; i < sections.length - 1; i++) {
            const currentSection = document.querySelector(sections[i]);
            const nextSection = document.querySelector(sections[i + 1]);

            if (currentSection && nextSection) {
                const currentBottom = currentSection.offsetTop + currentSection.offsetHeight;
                const nextTop = nextSection.offsetTop;
                const gap = nextTop - currentBottom;

                fetch('http://127.0.0.1:7242/ingest/bca272be-0ba2-4ec2-9ccc-9a5cd2cbb2bf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        location: 'script.js:debug-gaps',
                        message: `Gap between ${sections[i]} and ${sections[i + 1]}`,
                        data: { gap, currentBottom, nextTop },
                        timestamp: Date.now(),
                        sessionId: 'debug-session',
                        runId: 'after-fix',
                        hypothesisId: 'overlap-debug-2'
                    })
                }).catch(() => {});
            }
        }
    }, 1000); // DOM이 완전히 렌더링된 후 실행
    // #endregion
});
