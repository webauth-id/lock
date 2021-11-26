# @webauthid/lock

By using this package, you can easily manage locks across tabs on modern browsers. It was developed to make handling refresh tokens and other shared, one time use tokens easier but should also solve other cases. When available, all logic is delegated to the built in [Navigator.locks](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/locks) but this should not be considered a polyfill of that interface.

## Installation

```
npm install --save @webauthid/lock
```

## Usage

```js
import lock from "@webauthid/lock"

await lock("name_of_lock", async function () {
  // Lock has been acquired.
  // Proceed with code execution
})
```

## Additional Notes

- Correct implementation of locks requires support at the browser level. For browsers that do not support `Navigator.locks`, this library provides a reasonable facsimile.
- No guarantees are made about execution order. Requesting a lock first does not necessarily mean that that code will be executed before other requests to the same lock.
- Locks will be automatically released when a browser tab is closed.
- It is your responsibility to ensure code executing while a lock is acquired does eventually return.
- It is possible to create deadlocks by acquiring locks inside of the callback function. e.g. If function 1 acquires locks on `key_1` and then `key_2` while function 2 acquires locks on `key_2` and then `key_1`. As a result, it is recommended that your callback functions do not acquire additional locks.
- This library expects to be executed in a browser environment. It will not work for a node project.
