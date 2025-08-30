---
title: "games-starter"
layout: single
permalink: /games/
author_profile: true
sidebar_main: true
---
{% include js-loader.html %}

게임을 시작하면, 블로그 글을 읽으면서 게임을 할 수 있습니다!
글이 너무 눈에 안들어올 때 게임 배경화면으로써 즐기자는 마인드

<div style="margin:1em 0;">
  <label>
    <button type="button" id="game-ender" class="fancy-btn"
      onclick="localStorage.setItem('shoot_game_enabled','false'); alert('게임이 비활성화되었습니다! 새로고침하면 적용됩니다.');" checked>
    게임 종료
    </button>
  </label>
  <label>
    <button type="button" class="fancy-btn"
      onclick="localStorage.setItem('shoot_game_enabled','true'); alert('Shoot 게임이 활성화되었습니다! 새로고침하면 모든 페이지에 적용됩니다.');">
    Shoot! 게임 시작
    </button>
    <br>
    [Shoot!] wasd: player move, spacebar: shoot. 적을 잡아서 점수를 올리는 간단한 슈팅게임입니다. 
  </label>
</div>

<style>
.fancy-btn {
  background: linear-gradient(90deg, #ff9800 0%, #ff5722 100%);
  color: #fff;
  border: none;
  border-radius: 2em;
  padding: 1em 2.5em;
  font-size: 1.3em;
  font-weight: bold;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s, background 0.3s;
  outline: none;
  margin: 1em 0;
  letter-spacing: 1px;
}
.fancy-btn:hover, .fancy-btn:focus {
  background: linear-gradient(90deg, #ff5722 0%, #ff9800 100%);
  transform: scale(1.08);
  box-shadow: 0 8px 24px rgba(0,0,0,0.22);
}
.fancy-btn:active {
  transform: scale(0.97);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

/*
#game-ender{
    color
} */
</style>