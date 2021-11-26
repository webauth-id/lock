// TypeScript definition for navigator does not include `locks` property yet
/* eslint-disable @typescript-eslint/ban-ts-comment */
import lockPoyfill from "./_lock"
import type { MaybePromise } from "./_types"

const nav = typeof navigator === "object" ? navigator : undefined
// @ts-ignore
const supports_lock = nav?.locks?.request

async function lock<Result>(key: string, callback: () => MaybePromise<Result>) {
  let result: Result
  // @ts-ignore
  await navigator.locks.request(key, async () => {
    result = await callback()
  })
  // @ts-ignore
  return result
}

export default supports_lock ? lock : lockPoyfill
