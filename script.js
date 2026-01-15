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

});
