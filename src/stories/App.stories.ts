import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import App from '@/App.vue'
import { useRaceStore } from '@/stores/race'
import { seededRng } from '@/test/rng'

type Scenario = 'scheduled' | 'paused' | 'interstitial-stopped' | 'finished'

function setupScenario(scenario: Scenario): void {
  const race = useRaceStore()
  const rng = seededRng(42)

  // Force IDLE so generate() always resets prior story state cleanly.
  race.$patch({ phase: 'IDLE' })
  race.generate(rng)

  if (scenario === 'scheduled') return

  race.start()

  if (scenario === 'paused') {
    for (let step = 0; step < 18; step++) {
      race.tick(0.5, rng)
    }
    race.pause()
    return
  }

  if (scenario === 'interstitial-stopped') {
    for (let step = 0; step < 200 && race.phase === 'RUNNING'; step++) {
      race.tick(0.5, rng)
    }
    race.stopAutoAdvance()
    return
  }

  for (let step = 0; step < 2000 && race.phase !== 'FINISHED'; step++) {
    race.tick(0.5, rng)
  }
}

function renderScenario(scenario: Scenario) {
  return () => ({
    components: { App },
    setup() {
      setupScenario(scenario)
      return {}
    },
    template: '<App />',
  })
}

const meta = {
  title: 'Pages/Horse Racing',
  component: App,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof App>

export default meta
type Story = StoryObj<typeof meta>

export const Scheduled: Story = {
  render: renderScenario('scheduled'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('heading', { name: 'Horse Racing' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Start Race' })).toBeEnabled()
    await expect(canvasElement.querySelectorAll('[data-slot="horse-roster-row"]')).toHaveLength(20)
  },
}

export const MidRacePaused: Story = {
  render: renderScenario('paused'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeEnabled()
    await expect(canvasElement.querySelector('[data-phase="PAUSED"]')).not.toBeNull()
  },
}

export const InterstitialStopped: Story = {
  render: renderScenario('interstitial-stopped'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('button', { name: 'Start Race' })).toBeEnabled()
    await expect(canvas.getAllByText(/Next: 2nd Lap · 1400m/)[0]).toBeTruthy()
  },
}

export const Finished: Story = {
  render: renderScenario('finished'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('button', { name: 'Generate program' })).toBeEnabled()
    await expect(canvasElement.querySelector('[data-phase="FINISHED"]')).not.toBeNull()
  },
}
