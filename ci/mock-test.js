// ci/mock-test.js
// 用法：FORCE_FAIL=1 npm test -> 強制失敗（方便截圖）
// 未設定時：30% 機率失敗，70% 成功（示範用）
const fail = process.env.FORCE_FAIL === '1' ? true : Math.random() < 0.3;
console.log('Running mock tests...');
if (fail) {
  console.error('❌ Mock tests failed');
  process.exit(1);
}
console.log('✅ Mock tests passed');
