export const EXPIRATION = 200

/**
 * Remove key from storage
 */
export function clear(key: string) {
  localStorage.removeItem(key)
}

/**
 * Get item from local storage, ignoring entries that have expired
 */
export function get(key: string) {
  const data = localStorage.getItem(key)
  if (!data) return null

  const { id, expires } = JSON.parse(data)
  if (expires < Date.now()) {
    return null
  } else {
    return id
  }
}

/**
 * Set item to local storage, including an expiration time
 */
export function set(key: string, id: string) {
  const data = JSON.stringify({
    id,
    expires: Date.now() + EXPIRATION
  })
  localStorage.setItem(key, data)
}
