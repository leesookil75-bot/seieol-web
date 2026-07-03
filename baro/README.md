# 바로청소 MVP — 설치 · 배포 안내

QR 기반 시민 청소요청 + 기동반 관리자 대시보드. 기존 세얼 웹사이트(Vercel)에 `/baro` 경로로 추가됩니다.

```
baro/
├─ index.html          # 주민 청소요청 페이지  (QR 연결 대상)
├─ admin.html          # 관리자·기동반 대시보드
├─ firebase-config.js  # Firebase 설정 (← 실제 값 입력 필요)
└─ README.md
```

접속 주소(배포 후): 요청 `https://seieol-web.vercel.app/baro/` · 관리자 `https://seieol-web.vercel.app/baro/admin.html`

---

## 1. Firebase 프로젝트 준비 (최초 1회)

1. [console.firebase.google.com](https://console.firebase.google.com) → **프로젝트 추가**
2. **빌드 > Firestore Database** → 데이터베이스 만들기(프로덕션 모드)
3. **빌드 > Authentication** → 시작하기 → **이메일/비밀번호** 사용 설정
   → **Users 탭 > 사용자 추가**로 관리자 계정(이메일/비밀번호) 1개 생성
4. **프로젝트 설정(⚙️) > 내 앱 > 웹앱(</>) 추가** → 표시되는 `firebaseConfig` 6줄 값을
   `firebase-config.js`에 붙여넣기

> ℹ️ **Storage(사진 저장)는 사용하지 않습니다.** 사진은 브라우저에서 압축해 Firestore에
> 직접 저장하므로 **Blaze 유료 요금제·카드 등록이 필요 없습니다.** (완전 무료 Spark 요금제로 동작)

---

## 2. 보안 규칙 (복사해서 붙여넣기)

### Firestore 규칙  (Firestore > 규칙 탭 > 붙여넣기 > 게시)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /requests/{id} {
      allow create: if true;                                // 주민 접수(누구나)
      allow read, update, delete: if request.auth != null;  // 조회·처리·삭제(관리자만)
      match /media/{m} {
        allow create: if true;                              // 사진 저장(주민)
        allow read, delete: if request.auth != null;        // 사진 열람·삭제(관리자만)
      }
    }
  }
}
```
> 접수·사진 저장은 누구나 가능하고, **조회·처리·사진 열람은 로그인한 관리자만** 가능합니다.
> Storage를 쓰지 않으므로 **Storage 규칙은 설정하지 않아도 됩니다.**

---

## 3. 배포

기존 세얼 웹사이트와 **같은 방식(GitHub → Vercel 자동배포)** 으로 올리면 됩니다.
`baro` 폴더를 사이트 저장소에 커밋·푸시하면 Vercel이 자동으로 배포합니다.

---

## 4. QR 코드 만들기

무료 QR 생성기에 요청 페이지 주소(`https://seieol-web.vercel.app/baro/`)를 넣어 생성 →
스티커·현수막으로 상습지점·거점에 부착.

---

## 5. 운영 · 평가 증빙

- 관리자 대시보드에서 접수 → **출동 처리 → 완료 처리**, 단속성 사안은 **시청이관**.
- **CSV 내보내기**로 접수번호·유형·상태·접수시각·사진 링크를 내려받아 대행실적 평가 증빙으로 사용.

---

## 유의 (개선 예정 항목)

- 현재 사진 업로드는 누구나 가능(스팸 방지 로직 없음) — 운영 중 남용 시 reCAPTCHA/용량제한 추가.
- 개인정보 처리방침 페이지를 정식 게시하고, 실제 서비스 오픈 전 **김포시 자원순환과 협의**를 완료할 것.
- 보관기한(1년) 경과 데이터 파기 절차 수립.
