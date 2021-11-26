<script>
import acquireLock from "$lib"

/**
 * @param {number} time
 */
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

/**
 * @param {number} max
 */
function rand(max) {
  return Math.floor(Math.random() * max)
}

const hue = rand(255)
let active = false

async function partyTime() {
  await acquireLock("party", async () => {
    active = true
    await sleep(250 + rand(1000))
    active = false
  })

  setTimeout(partyTime, rand(2000))
}

partyTime()
</script>

<div class:active style="--hue: {hue}" />

<style>
div {
  background-color: hsl(var(--hue), 60%, 95%);
  display: inline-block;
  margin: 1em;
  height: 100px;
  width: 100px;
}
div.active {
  background-color: hsl(var(--hue), 80%, 60%);
}
</style>
