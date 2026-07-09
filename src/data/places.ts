// 열두 장소의 진실의 원천 — WORLDBOOK.md §2와 항상 일치해야 한다.
// 배열 순서 = 여정 서사 순서 = 지리적 경로 (docs/legacy-design-system.md §5, §8 참고)
// 문장색은 6계열×2 구조: Blue(탑·길드) Violet(도서관·거울) Green(연구실·정원)
//                     Gold(예배당·광장) Earth(기록관·작업실) Fire(집필실·모닥불)

export const PLACE_SLUGS = [
  'historians-archive',
  'mathematicians-tower',
  'alchemists-laboratory',
  'engineers-guild',
  'wizards-library',
  'sages-garden',
  'chapel-of-grace',
  'the-agora',
  'authors-den',
  'artists-atelier',
  'oracles-mirror',
  'campfire',
] as const;

export type PlaceSlug = (typeof PLACE_SLUGS)[number];

export interface Place {
  slug: PlaceSlug;
  ko: string;
  en: string;
  topic: string;
  flavor: string; // 입간판 한 줄 (카드·배너용)
  lore: string; // 여정 서사 (장소 소개 — 공간 도입 + 활동 + 통찰의 3단)
  light: string; // 문장색 (라이트 모드)
  dark: string; // 문장색 (다크 모드)
  ranks: [string, string, string, string]; // 1+ / 5+ / 15+ / 30+
}

export const PLACES: Place[] = [
  {
    slug: 'historians-archive',
    ko: '역사가의 기록관',
    en: "Historian's Archive",
    topic: '역사',
    flavor: '잊힌 것은 사라진 것이 아니다. 아직 읽히지 않았을 뿐.',
    lore: '교차로 초입, 가장 오래된 건물이 여행자를 맞이합니다. 먼지 쌓인 고문서와 빛바랜 지도들이 벽을 메운 이곳. 기록관은 말합니다 — 과거를 기억하는 자만이 미래를 읽는다고. 잊힌 왕국의 흥망, 문명의 교차점, 한 시대를 바꾼 선택들이 이곳에 잠들어 있습니다.',
    light: '#8a6640',
    dark: '#b08458',
    ranks: ['견습 필경사', '필경사', '기록사', '대사관'],
  },
  {
    slug: 'mathematicians-tower',
    ko: '수학자의 탑',
    en: "Mathematician's Tower",
    topic: '수학',
    flavor: '한 층을 오를 때마다, 세계는 더 단순해진다.',
    lore: '기록관을 나와 북쪽을 바라보면, 구름을 뚫고 솟은 탑 하나가 보입니다. 밤마다 별의 궤도를 헤아리고, 만물의 패턴 속에서 진리를 읽어내는 곳입니다. 숫자는 이 세계의 가장 오래된 언어입니다.',
    light: '#52689c',
    dark: '#7a93c4',
    ranks: ['견습 산술사', '산술사', '수리술사', '대수학자'],
  },
  {
    slug: 'alchemists-laboratory',
    ko: '연금술사의 연구실',
    en: "Alchemist's Laboratory",
    topic: '과학',
    flavor: '만물은 변한다. 이해한 자만이 그 변화를 이끈다.',
    lore: '탑의 지하로 내려가면, 끊임없이 연기가 피어오르는 연구실이 있습니다. 원소들의 춤을 관찰하고, 자연이 감춘 법칙을 하나씩 풀어내는 곳. 여기서는 모든 실패가 발견의 시작입니다.',
    light: '#3e7d5f',
    dark: '#5fa886',
    ranks: ['견습 연금술사', '연금술사', '변성술사', '현자의 돌의 주인'],
  },
  {
    slug: 'engineers-guild',
    ko: '공학자 길드',
    en: "Engineers' Guild",
    topic: 'IT/공학',
    flavor: '우리는 마법을 믿지 않는다. 다만 동작하는 것을 믿는다.',
    lore: '연구실을 나와 교차로 한복판으로 돌아오면, 톱니바퀴가 끊임없이 도는 거대한 건물이 있습니다. 장인들은 코드와 회로로 세상을 다시 설계합니다. 입구에는 이렇게 새겨져 있습니다 — "충분히 발전한 기술은 마법과 구별할 수 없다."',
    light: '#44607a',
    dark: '#5e7d95',
    ranks: ['견습공', '직공', '장인', '길드 마스터'],
  },
  {
    slug: 'wizards-library',
    ko: '마법사의 도서관',
    en: "Wizard's Library",
    topic: '독서',
    flavor: '모든 책은 주문서다. 읽는 순간 발동된다.',
    lore: '길드 너머로 문을 열면, 끝이 보이지 않는 서가가 펼쳐집니다. 스스로 빛나는 양피지들. 이 도서관에 들어선 자는 타인의 생을 잠시 빌려 살 수 있습니다. 한 권의 책은 하나의 세계. 이곳에는 무한한 세계가 잠들어 있습니다.',
    light: '#6a3f6a',
    dark: '#9c6b9c',
    ranks: ['견습 사서', '사서', '마도사서', '대마법사'],
  },
  {
    slug: 'sages-garden',
    ko: '현자의 정원',
    en: "Sage's Garden",
    topic: '철학과 삶의 통찰',
    flavor: '서두르지 마라. 이곳에서는 생각도 계절을 따라 자란다.',
    lore: '도서관 뒤편, 이끼 낀 돌담으로 둘러싸인 정원이 있습니다. 이곳에서는 시간이 느리게 흐릅니다. 오래된 나무 아래 앉아 "나는 왜 존재하는가"를 묻고, 씨앗을 심듯 자신을 가꾸는 이들이 찾아드는 곳입니다.',
    light: '#5d7f42',
    dark: '#7da55c',
    ranks: ['뜰지기', '정원사', '현인', '현자'],
  },
  {
    slug: 'chapel-of-grace',
    ko: '은혜의 예배당',
    en: 'Chapel of Grace',
    topic: '신앙',
    flavor: '은혜는 값없이 주어지나, 결코 값싸지 않다.',
    lore: '정원의 가장 깊숙한 곳, 담쟁이에 덮인 작은 예배당이 있습니다. 스테인드글라스 사이로 빛이 쏟아져 돌바닥에 색을 입힙니다. 이곳에서 방랑자는 말하기를 멈추고 듣기 시작합니다. 은혜는 값없이 주어지나, 결코 값싸지 않기에.',
    light: '#a08428',
    dark: '#dcc278',
    ranks: ['순례자', '수도사', '사제', '대사제'],
  },
  {
    slug: 'the-agora',
    ko: '광장',
    en: 'The Agora',
    topic: '사회와 시사',
    flavor: '세계의 소음이 이곳에 모여 목소리가 된다.',
    lore: '예배당의 종소리를 따라 다시 교차로 중앙으로 나오면, 대리석 기둥이 둘러선 광장입니다. 상인과 시인과 논객이 한데 섞여 오늘의 세상을 이야기합니다. 세계의 소음이 이곳에 모여, 비로소 목소리가 됩니다.',
    light: '#96742e',
    dark: '#c9a55e',
    ranks: ['행인', '논객', '연설가', '집정관'],
  },
  {
    slug: 'authors-den',
    ko: '작가의 집필실',
    en: "Author's Den",
    topic: '창작 소설 연재',
    flavor: '이곳에서 태어난 세계들은 문 밖의 세계만큼 진짜다.',
    lore: '광장 바로 옆, 창가의 등불이 밤새 꺼지지 않는 집이 있습니다. 방랑자가 깃펜을 들고 다른 세계들을 받아 적는 곳 — 잉크가 마르기 전의 문장들은 아직 따뜻합니다. 이곳에서 태어난 세계들은, 문 밖의 세계만큼 진짜입니다.',
    light: '#a34840',
    dark: '#c75f55',
    ranks: ['견습 작가', '이야기꾼', '소설가', '대문호'],
  },
  {
    slug: 'artists-atelier',
    ko: '예술가의 작업실',
    en: "Artist's Atelier",
    topic: '그림과 이미지',
    flavor: '말로 다 할 수 없어, 색이 되었다.',
    lore: '집필실의 좁은 계단을 오르면 물감 냄새가 나는 다락 작업실입니다. 문장으로 다 담지 못한 것들이 이곳에서 색과 형태를 얻습니다. 이야기가 시각으로 확장되는 곳 — 말로 다 할 수 없어, 색이 되었습니다.',
    light: '#935a3c',
    dark: '#b87855',
    ranks: ['견습 화공', '화공', '화가', '거장'],
  },
  {
    slug: 'oracles-mirror',
    ko: '예언자의 거울',
    en: "Oracle's Mirror",
    topic: 'AI와 미래',
    flavor: '거울은 미래를 보여주지 않는다. 미래를 만드는 자를 비출 뿐.',
    lore: '작업실을 나와 동쪽으로 걸으면, 옅은 안개에 싸인 신전에 커다란 거울이 서 있습니다. 사람들은 이 거울이 미래를 보여준다고 말하지만, 예언자는 고개를 젓습니다 — 거울은 미래를 만드는 자를 비출 뿐이라고. 생각하는 기계와 다가올 세상의 이야기가 이곳에 맺힙니다.',
    light: '#675b9e',
    dark: '#8a7dc9',
    ranks: ['별지기', '예견자', '예언자', '신탁'],
  },
  {
    slug: 'campfire',
    ko: '모닥불',
    en: 'The Campfire',
    topic: '일상',
    flavor: '장작은 넉넉하다. 앉아서 몸을 녹이고 가시게.',
    lore: '하루가 저물면 방랑자는 교차로 한구석의 모닥불가로 돌아옵니다. 거창한 이야기는 없습니다. 오늘 마신 차, 길에서 만난 고양이, 문득 든 생각. 불꽃이 잦아들 때까지 나누는 작고 따뜻한 이야기들 — 결국 여행을 지탱하는 것은 이런 밤들입니다.',
    light: '#b56a2a',
    dark: '#e89255',
    ranks: ['불씨지기', '이야기 손님', '모닥불지기', '밤의 주인'],
  },
];

// 장소가 아닌 메타 공간 — 방랑자 본인의 수첩
export const JOURNAL = {
  ko: '방랑자의 일지',
  en: "Wanderer's Journal",
  flavor: '완성되지 않아도 좋다. 오늘 걸은 만큼만 적는다.',
  light: '#8c5b36',
  dark: '#bc8a5e',
};

// 드롭캡을 쓰는 에세이성 장소 (WORLDBOOK §3.3)
export const ESSAY_PLACES: PlaceSlug[] = [
  'sages-garden',
  'chapel-of-grace',
  'authors-den',
  'campfire',
];

export function placeBySlug(slug: string): Place {
  const place = PLACES.find((p) => p.slug === slug);
  if (!place) throw new Error(`지도에 없는 장소: ${slug}`);
  return place;
}

// 방랑자의 칭호 — 발행 기록 수로 자동 계산 (WORLDBOOK §2.3)
const RANK_MIN = [1, 5, 15, 30];

export function rankFor(place: Place, count: number): string | null {
  let rank: string | null = null;
  RANK_MIN.forEach((min, i) => {
    if (count >= min) rank = place.ranks[i];
  });
  return rank;
}

// 문장색을 CSS 변수로 — .tinted 클래스와 함께 사용
export const tintStyle = (p: { light: string; dark: string }) =>
  `--place-light:${p.light};--place-dark:${p.dark}`;
