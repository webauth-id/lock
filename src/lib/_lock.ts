import { get, set, clear, EXPIRATION } from "./_storage"
import type { MaybePromise } from "./_types"

const OUTER_KEY_PREFIX = "lock:1::"
const INNER_KEY_PREFIX = "lock:2::"

export default async function <Result>(
  key: string,
  callback: () => MaybePromise<Result>
) {
  const id = Math.random().toString(32).slice(2)
  const outer_key = OUTER_KEY_PREFIX + key
  const inner_key = INNER_KEY_PREFIX + key

  while (!(await attemptLock(id, inner_key, outer_key))) {
    await waitForChange(inner_key)
  }

  // Maintain lock while function executes
  const renew = () => set(inner_key, id)
  const timer = setInterval(renew, Math.floor(EXPIRATION / 2))

  try {
    return await callback()
  } finally {
    clearTimeout(timer)
    clear(inner_key)
  }
}

async function attemptLock(id: string, inner_key: string, outer_key: string) {
  await waitForIdle()

  // https://medium.engineering/wait-dont-touch-that-a211832adc3a
  set(outer_key, id)
  if (get(inner_key)) {
    return false
  }

  set(inner_key, id)
  await sleep()
  if (id !== get(outer_key)) {
    // Random jitter
    await sleep()
    if (id !== get(inner_key)) {
      return false
    }
  }

  return true
}

async function sleep() {
  const time = 30 + Math.floor(20 * Math.random())
  return new Promise((resolve) => setTimeout(resolve, time))
}

async function waitForIdle() {
  return new Promise((resolve) => {
    return (window?.requestIdleCallback || setTimeout)(resolve)
  })
}

/**
 * Wait for lock to be released or for expiration time to pass
 */
async function waitForChange(key: string) {
  /** @type {undefined | ((event: StorageEvent) => void)} */
  let listener

  await new Promise((resolve) => {
    listener = (event: StorageEvent) => {
      if (event.key === key && !event.newValue) {
        resolve(true)
      }
    }
    window.addEventListener("storage", listener)
    setTimeout(resolve, EXPIRATION)
  })

  if (listener) {
    window.removeEventListener("storage", listener)
  }
}
