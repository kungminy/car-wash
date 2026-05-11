#!/bin/bash
# ============================================================
# Vercel 프로젝트 생성 스크립트 (new-plan 브랜치용)
# ============================================================
# 사용법:
#   export VERCEL_TOKEN=your_vercel_token
#   ./scripts/create-vercel-project.sh
#
# Vercel Token 생성 방법:
#   1. https://vercel.com/account/tokens 접속
#   2. "Create Token" 클릭
#   3. Token 이름 입력 (예: car-wash-new-plan)
#   4. Scope: 사용자 계정 선택
#   5. 생성된 토큰 복사하여 사용
# ============================================================

set -e

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 설정
PROJECT_NAME="car-wash-new-plan"
FRAMEWORK="nextjs"
REPO="kungminy/car-wash"
BRANCH="new-plan"

echo -e "${BLUE}🚀 Vercel 프로젝트 생성기${NC}"
echo "================================"
echo ""

# 1. VERCEL_TOKEN 확인
if [ -z "$VERCEL_TOKEN" ]; then
  echo -e "${RED}❌ 오류: VERCEL_TOKEN 환경변수가 설정되지 않았습니다.${NC}"
  echo ""
  echo "토큰 생성 방법:"
  echo "  1. https://vercel.com/account/tokens 접속"
  echo "  2. 'Create Token' 클릭"
  echo "  3. 토큰 이름 입력 후 생성"
  echo "  4. 아래 명령어로 환경변수 설정:"
  echo ""
  echo -e "     ${YELLOW}export VERCEL_TOKEN=your_token_here${NC}"
  echo ""
  exit 1
fi

# 2. 토큰 유효성 검증
echo -e "${BLUE}🔑 토큰 유효성 검증 중...${NC}"
user_response=$(curl -s -X GET "https://api.vercel.com/v2/user" \
  -H "Authorization: Bearer $VERCEL_TOKEN")

if echo "$user_response" | grep -q '"error"'; then
  echo -e "${RED}❌ 토큰이 유효하지 않습니다.${NC}"
  echo "Response: $user_response"
  exit 1
fi

user_name=$(echo "$user_response" | grep -o '"username":"[^"]*"' | cut -d'"' -f4)
echo -e "${GREEN}✅ 토큰 유효! 사용자: @$user_name${NC}"
echo ""

# 3. 기존 프로젝트 확인
echo -e "${BLUE}🔍 기존 프로젝트 확인 중...${NC}"
projects_response=$(curl -s -X GET "https://api.vercel.com/v9/projects?search=$PROJECT_NAME" \
  -H "Authorization: Bearer $VERCEL_TOKEN")

if echo "$projects_response" | grep -q "\"name\":\"$PROJECT_NAME\""; then
  echo -e "${YELLOW}⚠️  '$PROJECT_NAME' 프로젝트가 이미 존재합니다!${NC}"
  echo ""
  echo -e "${YELLOW}기존 프로젝트를 사용하시려면:${NC}"
  echo "  1. Vercel Dashboard에서 해당 프로젝트 열기"
  echo "  2. Settings > Git 에서 Production Branch를 '$BRANCH'로 설정"
  echo ""
  read -p "새로운 프로젝트를 생성하시겠습니까? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}기존 프로젝트를 사용합니다. 배포 가이드를 참고하세요.${NC}"
    exit 0
  fi
  
  # 타임스탬프를 붙여 새 이름 생성
  TIMESTAMP=$(date +%s)
  PROJECT_NAME="${PROJECT_NAME}-${TIMESTAMP}"
  echo -e "${YELLOW}새 프로젝트 이름: $PROJECT_NAME${NC}"
fi

# 4. 프로젝트 생성
echo ""
echo -e "${BLUE}📦 프로젝트 생성 중...${NC}"
echo "   이름: $PROJECT_NAME"
echo "   프레임워크: $FRAMEWORK"
echo "   저장소: $REPO"
echo "   브랜치: $BRANCH"
echo ""

create_response=$(curl -s -X POST "https://api.vercel.com/v9/projects" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$PROJECT_NAME\",
    \"framework\": \"$FRAMEWORK\",
    \"gitRepository\": {
      \"type\": \"github\",
      \"repo\": \"$REPO\",
      \"defaultBranch\": \"$BRANCH\"
    },
    \"buildCommand\": \"npm run build\",
    \"devCommand\": \"npm run dev\",
    \"installCommand\": \"npm install\",
    \"outputDirectory\": \".next\",
    \"publicSource\": false,
    \"rootDirectory\": null
  }")

# 5. 응답 확인
if echo "$create_response" | grep -q '"error"'; then
  echo -e "${RED}❌ 프로젝트 생성 실패${NC}"
  echo ""
  echo "에러 응답:"
  echo "$create_response" | python3 -m json.tool 2>/dev/null || echo "$create_response"
  echo ""
  exit 1
fi

project_id=$(echo "$create_response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
project_url=$(echo "$create_response" | grep -o '"inspectorUrl":"[^"]*"' | head -1 | cut -d'"' -f4)

echo -e "${GREEN}✅ 프로젝트 생성 완료!${NC}"
echo ""
echo "================================"
echo -e "${GREEN}프로젝트 정보${NC}"
echo "================================"
echo "  이름: $PROJECT_NAME"
echo "  ID: $project_id"
echo "  Dashboard: $project_url"
echo ""

# 6. GitHub 연동 설정 (선택적)
echo -e "${BLUE}🔗 GitHub 연동 설정 중...${NC}"

# 프로젝트 설정 업데이트 - 프로덕션 브랜치 설정
settings_response=$(curl -s -X PATCH "https://api.vercel.com/v9/projects/$PROJECT_NAME" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"gitRepository\": {
      \"type\": \"github\",
      \"repo\": \"$REPO\",
      \"defaultBranch\": \"$BRANCH\"
    }
  }")

if echo "$settings_response" | grep -q '"error"'; then
  echo -e "${YELLOW}⚠️  GitHub 연동 설정 중 문제가 발생했습니다.${NC}"
  echo "   Vercel Dashboard에서 수동으로 설정해주세요."
else
  echo -e "${GREEN}✅ GitHub 연동 설정 완료!${NC}"
fi

echo ""
echo "================================"
echo -e "${GREEN}🎉 다음 단계${NC}"
echo "================================"
echo ""
echo "1. Vercel Dashboard에서 프로젝트 확인:"
echo "   $project_url"
echo ""
echo "2. GitHub 연동 확인:"
echo "   - Dashboard > Project Settings > Git"
echo "   - Production Branch가 '$BRANCH'로 설정되었는지 확인"
echo ""
echo "3. 환경변수 설정 (필요한 경우):"
echo "   - Dashboard > Project Settings > Environment Variables"
echo "   - main 프로젝트의 환경변수를 복사해오세요"
echo ""
echo "4. GitHub Actions 설정 (선택사항):"
echo "   - GitHub Secrets에 VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID 추가"
echo "   - .github/workflows/deploy-new-plan.yml 파일을 커밋/푸시"
echo ""
echo -e "${GREEN}✨ 이제 '$BRANCH' 브랜치에 push하면 자동으로 배포됩니다!${NC}"
echo ""

# 7. 중요 정보 저장
echo "================================"
echo "중요 정보 (복사해서 저장하세요)"
echo "================================"
echo ""
echo "PROJECT_NAME=$PROJECT_NAME"
echo "PROJECT_ID=$project_id"
echo ""

# .env 파일에 저장할지 물어보기
read -p "이 정보를 .env.vercel 파일에 저장할까요? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  cat > .env.vercel <<EOF
# Vercel new-plan 프로젝트 설정
VERCEL_PROJECT_NAME=$PROJECT_NAME
VERCEL_PROJECT_ID=$project_id
VERCEL_ORG_ID=$(echo "$user_response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
EOF
  echo -e "${GREEN}✅ .env.vercel 파일에 저장되었습니다.${NC}"
  echo "   ⚠️  이 파일은 .gitignore에 추가하는 것을 잊지 마세요!"
fi

echo ""
echo -e "${GREEN}🚀 완료!${NC}"
