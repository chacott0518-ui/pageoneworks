const BASE = 'https://www.pageoneworks.com';
const SECRET = process.env.DEPLOY_SECRET;

if (!SECRET) {
  console.log('⚠️  DEPLOY_SECRET 없음 → IndexNow 건너뜀 (로컬 빌드)');
  process.exit(0);
}

async function run() {
  console.log('📡 Bing IndexNow 알림 시작...');
  try {
    const res = await fetch(`${BASE}/api/indexnow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SECRET}`,
      },
    });
    const data = await res.json();
    if (data.success) {
      console.log(`✅ Bing 알림 성공 — ${data.submittedCount}개 URL 전송`);
      data.urls?.forEach((url) => console.log(`   • ${url}`));
    } else {
      console.log(`⚠️  Bing 응답 코드: ${data.bingStatus} (빌드는 정상)`);
    }
  } catch (e) {
    console.log('⚠️  IndexNow 알림 실패 (빌드는 정상):', e.message);
  }
}

run();