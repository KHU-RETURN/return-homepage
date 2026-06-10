// 모든 백엔드 호출은 이 파일을 거친다. 새 API가 생기면 여기에 함수를 추가할 것.

export async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.detail?.[0]?.msg ?? `요청 실패 (${response.status})`)
  }
  return response.json()
}

export function fetchAwards() {
  return request('/api/awards')
}

export function submitApplication(payload) {
  return request('/api/applications', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
