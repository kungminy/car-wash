# new-plan 브랜치 Vercel 배포 가이드

## 요약

이 가이드는 `kungminy/car-wash` 저장소의 `new-plan` 브랜치를 새로운 Vercel 프로젝트에 배포하는 방법을 설명합니다.

## 방법 1: Vercel Dashboard에서 직접 생성 (가장 쉬움, 2분)

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. "Add New..." → "Project" 클릭
3. `kungminy/car-wash` 저장소 선택
4. 설정:
   - Project Name: `car-wash-new-plan`
   - Framework Preset: `Next.js`
   - Production Branch: `new-plan`으로 변경 (기본값은 `main`)
5. "Deploy" 클릭

**완료!** 이제 `new-plan` 브랜치에 push할 때마다 자동으로 배포됩니다.

## 방법 2: 자동화 스크립트 사용 (권장)

### 1. Vercel Token 생성

```bash
# 브라우저에서 https://vercel.com/account/tokens 접속
# "Create Token" 클릭 → 이름 입력 → 생성 → 토큰 복사
```

### 2. 스크립트 실행

```bash
export VERCEL_TOKEN=your_token_here
./scripts/create-vercel-project.sh
```

스크립트가 자동으로:
- Vercel 프로젝트 생성
- GitHub 저장소 연동
- 프로덕션 브랜치를 `new-plan`으로 설정

### 3. 환경변수 복사

main 프로젝트에 설정된 환경변수가 있다면 복사:
- Vercel Dashboard > car-wash-new-plan > Settings > Environment Variables

## 방법 3: GitHub Actions 사용 (고급)

Vercel Git 연동 대신 GitHub Actions를 사용하여 배포하려면:

### 1. GitHub Secrets 설정

GitHub Repository > Settings > Secrets and variables > Actions:

| Secret | 값 |
|--------|-----|
| `VERCEL_TOKEN` | Vercel Account Token |
| `VERCEL_ORG_ID` | Vercel Dashboard > Project Settings > General |
| `VERCEL_PROJECT_ID` | Vercel Dashboard > Project Settings > General |

### 2. 워크플로우 파일 커밋

`.github/workflows/deploy-new-plan.yml` 파일이 이미 생성되어 있습니다.

```bash
git add .github/workflows/deploy-new-plan.yml
git commit -m "ci: add new-plan vercel deployment"
git push origin new-plan
```

## 주의사항

- **두 프로젝트 모두 GitHub에 연결**되어 있으므로, 환경변수는 각 프로젝트별로 따로 관리됩니다
- main 프로젝트의 환경변수를 new-plan 프로젝트에도 동일하게 설정해야 할 수 있습니다
- 데이터베이스나 API 연결 시 브랜치별로 다른 설정이 필요할 수 있습니다

## 문제 해결

### 프로젝트 생성 실패
- Vercel Token이 유효한지 확인
- 토큰에 프로젝트 생성 권한이 있는지 확인

### 배포 실패
- `new-plan` 브랜치에서 `npm run build`가 로컬에서 성공하는지 확인
- Vercel Dashboard의 빌드 로그 확인

### GitHub 연동 문제
- Vercel Dashboard > Project Settings > Git 에서 연결 상태 확인
- GitHub 권한 재부여: Settings > Git > "Disconnect" 후 "Connect Git Repository"
