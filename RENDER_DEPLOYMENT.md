# Render 배포 가이드 (Yarn + Node 21.1.0)

이 문서는 MyPortfolio_Admin 프로젝트를 Render에 Yarn과 Node.js 21.1.0을 사용하여 배포하는 방법을 설명합니다.

## 사전 준비사항

1. **Render 계정**: [render.com](https://render.com)에서 계정 생성
2. **GitHub 저장소**: 프로젝트가 GitHub에 푸시되어 있어야 함
3. **MongoDB Atlas**: MongoDB 데이터베이스 (MongoDB Atlas 사용 권장)

## 배포 단계

### 1. GitHub에 코드 푸시

```bash
git add .
git commit -m "Configure for Yarn and Node 21.1.0 deployment"
git push origin main
```

### 2. Render에서 새 Web Service 생성

1. [Render Dashboard](https://dashboard.render.com)에 로그인
2. "New +" 버튼 클릭 → "Web Service" 선택
3. GitHub 저장소 연결
4. 다음 설정 사용:
   - **Name**: `myportfolio-admin` (또는 원하는 이름)
   - **Region**: `Ohio (US East)` (또는 가까운 지역)
   - **Branch**: `main`
   - **Root Directory**: (비워둠)
   - **Runtime**: `Node`
   - **Build Command**: `cd client && yarn && yarn build`
   - **Start Command**: `yarn && node server.js`

### 3. 환경 변수 설정

Render의 Environment 탭에서 다음 환경 변수들을 설정:

**필수 환경 변수:**
- `NODE_ENV`: `production`
- `MONGODB_URI`: `your_mongodb_atlas_connection_string`
- `JWT_SECRET`: `your_secure_jwt_secret`

**MongoDB URI 예시:**
```
mongodb+srv://username:password@cluster.mongodb.net/myportfolio?retryWrites=true&w=majority
```

### 4. 자동 배포 설정

- **Auto-Deploy**: `Yes` (GitHub에 푸시할 때마다 자동 배포)

### 5. 배포 시작

"Create Web Service" 버튼을 클릭하면 배포가 시작됩니다.

## 주요 변경사항

1. **패키지 매니저**: NPM → Yarn
2. **Node.js 버전**: 21.1.0 (.nvmrc에 명시)
3. **빌드 명령어**: `cd client && yarn && yarn build`
4. **시작 명령어**: `yarn && node server.js`

## 주의사항

1. **Yarn 사용**: 모든 종속성 관리에 Yarn 사용
2. **Node 21.1.0**: 최신 Node.js 버전 사용
3. **MongoDB 연결**: 환경 변수로 설정
4. **빌드 시간**: Yarn이 NPM보다 빠르지만 첫 배포는 5-10분 소요

## 문제 해결

### 빌드 실패 시
- Render의 "Logs" 탭에서 오류 메시지 확인
- Node.js 21.1.0 버전 호환성 확인
- Yarn 종속성 설치 문제 확인

### 런타임 오류 시
- 환경 변수가 올바르게 설정되었는지 확인
- MongoDB 연결 문자열 확인
- 서버 로그에서 오류 메시지 확인

## 로컬 테스트

프로덕션 빌드 테스트:
```bash
# 루트에서
yarn

# 클라이언트 빌드
cd client
yarn
yarn build
cd ..

# 서버 시작
node server.js
```
