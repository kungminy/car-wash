import { NextResponse } from 'next/server';
import { CarWashProduct, StepTag } from '@/types';
import { mockProducts } from '@/lib/mockProducts';

const STEP_QUERIES: Record<StepTag, string> = {
  '1_휠/타이어': '세차 휠클리너 타이어 코팅제',
  '2_프리워시': '세차 프리워시 스노우폼 타르 제거제',
  '3_본세차': '카샴푸 워시미트 셀프세차',
  '4_드라잉': '세차 드라잉타월 차량용 송풍기',
  '5_코팅/마무리': '자동차 물왁스 퀵디테일러 코팅제',
};

interface NaverShoppingItem {
  title: string;
  link: string;
  image: string;
  lprice: string;
  mallName: string;
  productId: string;
  brand: string;
  maker: string;
}

interface NaverShoppingResponse {
  items?: NaverShoppingItem[];
}

function stripHtml(value: string): string {
  return value.replace(/<\/?[^>]+(>|$)/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

function mapItem(item: NaverShoppingItem, stepTag: StepTag): CarWashProduct {
  const brand = stripHtml(item.brand || item.maker || item.mallName || '판매처 확인');
  const price = Number(item.lprice);

  return {
    id: `naver-${item.productId}`,
    name: stripHtml(item.title),
    brand,
    stepTag,
    description: `${item.mallName}에서 판매 중인 상품입니다.${price > 0 ? ` 최저가 ${price.toLocaleString('ko-KR')}원.` : ''}`,
    recommended: false,
    imageUrl: item.image,
    link: item.link,
    price: Number.isFinite(price) ? price : undefined,
    mallName: item.mallName,
    source: 'naver',
  };
}

async function fetchNaverProducts(stepTag: StepTag): Promise<CarWashProduct[]> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) return [];

  const url = new URL('https://openapi.naver.com/v1/search/shop.json');
  url.searchParams.set('query', STEP_QUERIES[stepTag]);
  url.searchParams.set('display', '8');
  url.searchParams.set('sort', 'sim');

  const response = await fetch(url, {
    headers: {
      'X-Naver-Client-Id': clientId,
      'X-Naver-Client-Secret': clientSecret,
    },
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) return [];

  const data = (await response.json()) as NaverShoppingResponse;
  return (data.items ?? []).map((item) => mapItem(item, stepTag));
}

export async function GET() {
  const steps = Object.keys(STEP_QUERIES) as StepTag[];
  const products = (await Promise.all(steps.map(fetchNaverProducts))).flat();

  if (products.length === 0) {
    return NextResponse.json({
      source: 'fallback',
      products: mockProducts,
      message: 'NAVER_CLIENT_ID, NAVER_CLIENT_SECRET이 없어서 한국형 fallback 데이터를 표시합니다.',
    });
  }

  return NextResponse.json({
    source: 'naver',
    products,
  });
}
