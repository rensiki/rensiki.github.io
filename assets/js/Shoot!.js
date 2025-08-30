(() => {
  // 1. 캔버스가 없으면 동적으로 생성
  let canvas = document.getElementById("gameCanvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "gameCanvas";
    document.body.appendChild(canvas);
  }
  // 2. 스타일도 JS에서 추가
  const style = document.createElement('style');
  style.textContent = `
    #gameCanvas {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9999;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  const ctx = canvas.getContext("2d");

  // 캔버스 크기
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // 플레이어 (화면 중앙 고정)
  const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    angle: 0, // 바라보는 각도(라디안)
    speed: 4,
    vx: 0,
    vy: 0
  };

  let bullets = [];
  let enemies = [];
  let score = 0;
  let startTime = Date.now(); // 게임 시작 시간

  let bestScore = Number(localStorage.getItem('shoot_best_score') || 0);
  let bestCombo = Number(localStorage.getItem('shoot_best_combo') || 0);

  // 연속 득점 관련 변수
  let combo = 0;
  let lastScoreTime = 0;
  const comboInterval = 2500; // ms, 이 시간 내에 또 득점하면 연속

  let shootSound = new Audio("/assets/sounds/Shoot!_playerAttack.mp3");
  let hitSound = new Audio("/assets/sounds/Shoot!_enemyHit.mp3");

  // 점수/콤보 색상 배열
  const colors = [
    "white",      // 0~9
    "yellow",     // 10~19
    "lime",       // 20~29
    "cyan",       // 30~39
    "orange",     // 40~49
    "magenta",    // 50~59
    "red",        // 60~69
    "blue",       // 70~79
    "gold",       // 80~89
    "deepskyblue" // 90~
  ];

  // 키 입력 상태
  const keys = {};

  window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
    // 스페이스바로 총알 발사
    if (e.code === "Space") {
      shootBullet();
      e.preventDefault();
    }

    // 사운드 재생
    try {
      shootSound.currentTime = 0;
      shootSound.play();
    } catch (e) { console.error(e); }
  });
  window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
  });

  // 플레이어 이동 및 바라보는 각도 계산
  function updatePlayer() {
    let dx = 0, dy = 0;
    if (keys["arrowup"] || keys["w"]) dy -= 1;
    if (keys["arrowdown"] || keys["s"]) dy += 1;
    if (keys["arrowleft"] || keys["a"]) dx -= 1;
    if (keys["arrowright"] || keys["d"]) dx += 1;

    // 대각선 이동 속도 보정
    if (dx !== 0 || dy !== 0) {
      const len = Math.hypot(dx, dy);
      dx /= len;
      dy /= len;
      player.x += dx * player.speed;
      player.y += dy * player.speed;
      // 바라보는 각도 갱신
      player.angle = Math.atan2(dy, dx);
    }
  }

  // 총알 발사 (플레이어가 바라보는 방향)
  function shootBullet() {
    const velocity = {
      x: Math.cos(player.angle) * 5,
      y: Math.sin(player.angle) * 5
    };
    bullets.push({
      x: player.x,
      y: player.y,
      radius: 5,
      velocity
    });
  }

  // 적 스폰 (주기적으로 화면 외곽에서 등장)
  function spawnEnemy() {
    const radius = 20;
    let x, y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const angle = Math.atan2(player.y - y, player.x - x);
    const velocity = { x: Math.cos(angle) * 2, y: Math.sin(angle) * 2 };
    enemies.push({ x, y, radius, velocity });
  }

  setInterval(spawnEnemy, 2000);

  // 색상 선택 함수
  function getColor(val) {
    return colors[Math.min(Math.floor(val / 10), colors.length - 1)];
  }

  // 게임 루프
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();

    // 플레이어
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
    ctx.fill();
    // 바라보는 방향 표시 (삼각형)
    ctx.fillStyle = "cyan";
    ctx.beginPath();
    ctx.moveTo(player.radius, 0);
    ctx.lineTo(player.radius - 10, -7);
    ctx.lineTo(player.radius - 10, 7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 총알
    bullets.forEach((bullet, bulletIndex) => {
      bullet.x += bullet.velocity.x;
      bullet.y += bullet.velocity.y;

      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
      ctx.fill();

      // 화면 밖이면 제거
      if (
        bullet.x < 0 || bullet.x > canvas.width ||
        bullet.y < 0 || bullet.y > canvas.height
      ) {
        bullets.splice(bulletIndex, 1);
      }
    });

    // 적
    enemies.forEach((enemy, enemyIndex) => {
      enemy.x += enemy.velocity.x;
      enemy.y += enemy.velocity.y;

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
      ctx.fill();

      // 충돌 체크 (총알 vs 적)
      bullets.forEach((bullet, bulletIndex) => {
        const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
        if (dist - enemy.radius - bullet.radius < 1) {
          enemies.splice(enemyIndex, 1);
          bullets.splice(bulletIndex, 1);
          score++;

          // 연속 득점 계산
          const now = Date.now();
          if (now - lastScoreTime < comboInterval) {
            combo++;
          } else {
            combo = 1;
          }
          lastScoreTime = now;

          // 최고 점수/콤보 갱신 및 저장
          if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('shoot_best_score', bestScore);
          }
          if (combo > bestCombo) {
            bestCombo = combo;
            localStorage.setItem('shoot_best_combo', bestCombo);
          }

          // 적이 맞았을 때 사운드 재생
          try {
            hitSound.currentTime = 0;
            hitSound.play();
          } catch (e) {}
        }
      });
    });

    // 화면 크기에 따라 UI 폰트 크기와 간격 동적 조정 (최대 폰트 크기 제한)
    const baseFontSize = Math.max(10, Math.min(Math.floor(canvas.width / 50), 20)); // 최대 20px
    const baseGap = Math.floor(baseFontSize * 1.2);

    ctx.font = `${baseFontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const centerX = canvas.width / 2;
    let uiY = baseFontSize * 0.7;

    ctx.fillStyle = "white";
    ctx.fillText(`Time: ${((Date.now() - startTime) / 1000).toFixed(1)}s`, centerX, uiY);

    ctx.fillStyle = getColor(score);
    ctx.fillText(`Score: ${score} (Best: ${bestScore})`, centerX, uiY + baseGap);

    ctx.fillStyle = getColor(combo);
    ctx.fillText(`Combo: ${combo} (Best: ${bestCombo})`, centerX, uiY + baseGap * 2);

    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  }

  animate();

  // 화면 리사이즈 대응
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // 플레이어 위치를 중앙으로 재설정
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
  });
})();