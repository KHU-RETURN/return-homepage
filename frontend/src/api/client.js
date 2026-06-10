// 모든 백엔드 호출은 이 파일을 거친다. 새 API가 생기면 여기에 함수를 추가할 것.
// 인증은 httpOnly 쿠키로 처리되므로 별도 토큰 헤더가 필요 없다.

export async function request(path, options = {}) {
  // FormData(파일 업로드)일 때는 브라우저가 Content-Type을 직접 정하게 둔다
  const isFormData = options.body instanceof FormData
  const response = await fetch(path, {
    ...options,
    headers: isFormData
      ? options.headers
      : { 'Content-Type': 'application/json', ...options.headers },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const detail = body?.detail
    const message =
      typeof detail === 'string'
        ? detail
        : detail?.[0]?.msg ?? `요청 실패 (${response.status})`
    const error = new Error(message)
    error.status = response.status // 호출하는 쪽에서 401 등을 구분할 수 있게
    throw error
  }
  if (response.status === 204) return null
  return response.json()
}

// ----- 인증 -----

export function signup({ username, password, name, student_id }) {
  return request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password, name, student_id }),
  })
}

export function login(username, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export function logout() {
  return request('/api/auth/logout', { method: 'POST' })
}

export function fetchMe() {
  return request('/api/auth/me')
}

export function fetchMyPosts() {
  return request('/api/auth/me/posts')
}

// ----- 활동 -----

export function fetchActivities() {
  return request('/api/activities')
}

// ----- 게시판 -----

export function fetchPosts(board) {
  return request(`/api/posts?board=${board}`)
}

export function fetchPost(id) {
  return request(`/api/posts/${id}`)
}

export function createPost({ board, title, content }) {
  return request('/api/posts', {
    method: 'POST',
    body: JSON.stringify({ board, title, content }),
  })
}

export function updatePost(id, { title, content }) {
  return request(`/api/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content }),
  })
}

export function deletePost(id) {
  return request(`/api/posts/${id}`, { method: 'DELETE' })
}

export function createComment(postId, content) {
  return request(`/api/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

export function deleteComment(commentId) {
  return request(`/api/comments/${commentId}`, { method: 'DELETE' })
}

export function uploadFile(postId, file) {
  const formData = new FormData()
  formData.append('file', file)
  return request(`/api/posts/${postId}/files`, {
    method: 'POST',
    body: formData,
  })
}

// ----- 수상 · 지원 -----

export function fetchAwards() {
  return request('/api/awards')
}

export function submitApplication(payload) {
  return request('/api/applications', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
