import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const appDir = process.cwd()
const projectRoot = path.resolve(appDir, '..')
const assetsDir = path.join(projectRoot, 'assets')
const targetUrl = process.env.PAWSMATCH_URL ?? 'http://127.0.0.1:5173'

const screenshotPath = path.join(assetsDir, 'pawsmatch-landing.png')
const finalVideoPath = path.join(assetsDir, 'pawsmatch-demo.webm')

const wait = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })

const performSwipe = async (page, direction) => {
  const card = page.locator('article').first()
  const box = await card.boundingBox()

  if (!box) {
    return
  }

  const startX = box.x + box.width / 2
  const startY = box.y + box.height / 2
  const offsetX = direction === 'right' ? 230 : -230

  await page.mouse.move(startX, startY)
  await page.mouse.down()
  await page.mouse.move(startX + offsetX, startY, { steps: 12 })
  await page.mouse.up()
}

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: {
    dir: assetsDir,
    size: { width: 1280, height: 720 },
  },
})

const page = await context.newPage()

try {
  await page.goto(targetUrl, { waitUntil: 'networkidle' })
  await wait(1200)

  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  })

  await performSwipe(page, 'left')
  await wait(800)
  await performSwipe(page, 'right')
  await wait(900)

  const likeButton = page.getByRole('button', { name: 'Me encanta' }).first()
  await likeButton.click()
  await page.waitForURL('**/adopcion/**', { timeout: 7000 })
  await wait(1200)

  const scheduleButton = page.getByRole('button', { name: 'Agendar visita' })
  await scheduleButton.click()
  await wait(900)

  const keepBrowsingButton = page.getByRole('button', { name: 'Seguir buscando' })
  await keepBrowsingButton.click()
  await page.waitForURL('**/', { timeout: 7000 })
  await wait(1200)
} finally {
  const recordedVideo = page.video()
  await context.close()

  if (recordedVideo) {
    const recordedVideoPath = await recordedVideo.path()
    fs.copyFileSync(recordedVideoPath, finalVideoPath)
  }

  await browser.close()
}
