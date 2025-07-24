# Render 배포 가이드

이 문서는 MyPortfolio_Admin 프로젝트를 Render에 배포하는 방법을 설명합니다.

## 사전 준비사항

1. **Render 계정**: [render.com](https://render.com)에서 계정 생성
2. **GitHub 저장소**: 프로젝트가 GitHub에 푸시되어 있어야 함
3. **MongoDB Atlas**: MongoDB 데이터베이스 (MongoDB Atlas 사용 권장)

## 배포 단계

### 1. GitHub에 코드 푸시

```bash
git add .
git commit -m "Prepare for Render deployment"
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
   - **Build Command**: `chmod +x build.sh && ./build.sh`
   - **Start Command**: `npm start`

### 3. 환경 변수 설정

Render의 Environment 탭에서 다음 환경 변수들을 설정:

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

## 주의사항

1. **MongoDB 연결**: config/config.js에 있는 하드코딩된 MongoDB URI를 환경 변수로 대체해야 함
2. **CORS 설정**: 필요에 따라 프로덕션 도메인을 CORS 허용 목록에 추가
3. **빌드 시간**: 첫 번째 배포는 시간이 걸릴 수 있음 (5-10분)

## 문제 해결

### 빌드 실패 시
- Render의 "Logs" 탭에서 오류 메시지 확인
- Node.js 버전 호환성 확인 (.nvmrc 파일)
- 종속성 설치 문제 확인

### 런타임 오류 시
- 환경 변수가 올바르게 설정되었는지 확인
- MongoDB 연결 문자열 확인
- 서버 로그에서 오류 메시지 확인

## 유용한 명령어

로컬에서 프로덕션 빌드 테스트:
```bash
npm run build
npm start
```

## 지원 및 도움말

- [Render 문서](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
