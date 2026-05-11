import { NextRequest, NextResponse } from 'next/server';
import { SupplyCategory } from '@/types';

const CATEGORY_QUERIES: Partial<Record<SupplyCategory, string>> = {
  pre_wash_foam: '세차 스노우폼 프리워시',
  iron_remover: '자동차 철분제거제',
  tar_remover: '자동차 타르제거제',
  wheel_cleaner: '자동차 휠클리너',
  tire_dressing: '타이어 코팅제 드레싱',
  car_shampoo: '카샴푸 중성 세차',
  wash_mitt: '세차 미트 극세사',
  wash_bucket: '세차 버킷 그릿가드',
  clay_bar: '세차 클레이바',
  drying_towel: '세차 드라잉타월 극세사',
  air_dryer: '차량용 에어건 송풍기',
  quick_wax: '자동차 물왁스 퀵디테일러',
  carnauba_wax: '카나우바왁스 자동차',
  sealant: '자동차 실런트 코팅',
  ceramic_coating: '자동차 세라믹코팅제',
  glass_cleaner: '자동차 유리세정제 유막',
  interior_cleaner: '자동차 실내클리너',
};

interface NaverItem {
  title: string;
  link: string;
  image: string;
  lprice: string;
  mallName: string;
  productId: string;
  brand: string;
  maker: string;
}

function stripHtml(v: string): string {
  return v.replace(/<\/?[^>]+(>|$)/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

async function fetchForCategory(cat: SupplyCategory, clientId: string, clientSecret: string) {
  const query = CATEGORY_QUERIES[cat];
  if (!query) return [];

  const url = new URL('https://openapi.naver.com/v1/search/shop.json');
  url.searchParams.set('query', query);
  url.searchParams.set('display', '4');
  url.searchParams.set('sort', 'sim');

  const res = await fetch(url, {
    headers: { 'X-Naver-Client-Id': clientId, 'X-Naver-Client-Secret': clientSecret },
    next: { revalidate: 60 * 60 },
  });
  if (!res.ok) return [];

  const data = await res.json() as { items?: NaverItem[] };
  return (data.items ?? []).map((item) => ({
    id: `naver-${item.productId}`,
    name: stripHtml(item.title),
    brand: stripHtml(item.brand || item.maker || item.mallName || ''),
    imageUrl: item.image,
    link: item.link,
    price: Number(item.lprice) || undefined,
    mallName: item.mallName,
  }));
}

export async function GET(req: NextRequest) {
  const cats = (req.nextUrl.searchParams.get('cats') ?? '').split(',').filter(Boolean) as SupplyCategory[];
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret || cats.length === 0) {
    return NextResponse.json({ products: {} });
  }

  const results = await Promise.all(
    cats.map(async (cat) => ({ cat, items: await fetchForCategory(cat, clientId, clientSecret) }))
  );

  const products = Object.fromEntries(results.map(({ cat, items }) => [cat, items]));
  return NextResponse.json({ products });
}
