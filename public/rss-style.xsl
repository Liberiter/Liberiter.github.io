<?xml version="1.0" encoding="UTF-8"?>
<!--
  전서구 안내장 — 브라우저로 /rss.xml을 열었을 때 사람 눈에 맞게 보여 주는 XSL.
  브라우저 내장 XSLT는 1.0만 지원하므로 XSL 1.0 문법을 지킨다.
  팔레트는 v4 라이트(새벽의 양피지)를 하드코딩, 다크(칠흑의 숲)는 미디어쿼리로.
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="ko">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="/rss/channel/title"/> — RSS</title>
        <style>
          /* ── 새벽의 양피지 (라이트, 기본) ── */
          :root {
            --bg: #FAF5E9;
            --card: #F3EBD8;
            --ink: #3A3226;
            --muted: #6E6353;
            --gold: #8B6914;
            --gold-dim: #A67C1A;
            --line: #DFD3B8;
          }
          /* ── 칠흑의 숲, 황금 등불 (다크) ── */
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #15211A;
              --card: #1D2C23;
              --ink: #E5E0D1;
              --muted: #9BB0A4;
              --gold: #D4AA30;
              --gold-dim: #B8932A;
              --line: #33473B;
            }
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background: var(--bg);
            color: var(--ink);
            font-family: 'Gowun Batang', 'Nanum Myeongjo', Georgia, 'Apple SD Gothic Neo', 'Malgun Gothic', serif;
            line-height: 1.8;
            padding: 56px 20px 72px;
          }
          .sheet { max-width: 640px; margin: 0 auto; }
          .orn { text-align: center; color: var(--gold-dim); font-size: 11px; letter-spacing: 0.6em; margin-bottom: 26px; }
          h1 {
            font-size: 26px;
            font-weight: 700;
            text-align: center;
            letter-spacing: 0.02em;
            margin-bottom: 8px;
          }
          .site {
            text-align: center;
            font-size: 12px;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: var(--gold);
            margin-bottom: 30px;
          }
          .lead {
            font-size: 15px;
            color: var(--muted);
            border: 1px solid var(--line);
            border-left: 3px solid var(--gold);
            background: var(--card);
            padding: 16px 20px;
            margin-bottom: 30px;
          }
          .feed-label {
            font-size: 12px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--gold);
            margin-bottom: 8px;
          }
          .feed-url {
            display: block;
            font-family: 'Nanum Gothic Coding', ui-monospace, Consolas, monospace;
            font-size: 14px;
            color: var(--ink);
            background: var(--card);
            border: 1px solid var(--line);
            padding: 12px 16px;
            margin-bottom: 40px;
            overflow-x: auto;
            white-space: nowrap;
            user-select: all;
            -webkit-user-select: all;
          }
          h2 {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--gold);
            border-bottom: 1px solid var(--line);
            padding-bottom: 8px;
            margin-bottom: 4px;
          }
          .item {
            display: block;
            padding: 14px 4px;
            border-bottom: 1px dashed var(--line);
            text-decoration: none;
            color: var(--ink);
          }
          .item:hover .title { color: var(--gold); text-decoration: underline; }
          .item .title { font-size: 16.5px; font-weight: 700; display: block; }
          .item .date {
            font-family: 'Nanum Gothic Coding', ui-monospace, Consolas, monospace;
            font-size: 12px;
            color: var(--muted);
            display: block;
            margin-top: 2px;
          }
          .item .desc { font-size: 13.5px; color: var(--muted); display: block; margin-top: 4px; }
          .back { text-align: center; margin-top: 44px; }
          .back a { color: var(--gold); font-size: 14px; text-decoration: none; border-bottom: 1px solid var(--gold-dim); }
          .back a:hover { color: var(--gold-dim); }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="orn">&#10022; &#9472;&#9472; &#10022; &#9472;&#9472; &#10022;</div>
          <h1>전서구 (Carrier Pigeon) — RSS</h1>
          <p class="site"><xsl:value-of select="/rss/channel/title"/></p>

          <p class="lead">
            이 주소를 RSS 리더(Feedly, Inoreader 등)에 등록하면, 새 기록이 쓰일 때마다
            전서구가 물어다 준다. 이 페이지 자체는 기계가 읽는 문서를 사람 눈에 맞게
            보여준 것이다.
          </p>

          <p class="feed-label">구독 주소</p>
          <code class="feed-url">
            <xsl:choose>
              <xsl:when test="substring(/rss/channel/link, string-length(/rss/channel/link)) = '/'">
                <xsl:value-of select="concat(/rss/channel/link, 'rss.xml')"/>
              </xsl:when>
              <xsl:otherwise>
                <xsl:value-of select="concat(/rss/channel/link, '/rss.xml')"/>
              </xsl:otherwise>
            </xsl:choose>
          </code>

          <h2>최근 기록</h2>
          <xsl:for-each select="/rss/channel/item">
            <a class="item">
              <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
              <span class="title"><xsl:value-of select="title"/></span>
              <span class="date"><xsl:value-of select="substring(pubDate, 6, 11)"/></span>
              <xsl:if test="description">
                <span class="desc"><xsl:value-of select="description"/></span>
              </xsl:if>
            </a>
          </xsl:for-each>

          <p class="back">
            <a><xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>교차로로 돌아가기 &#8594;</a>
          </p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
