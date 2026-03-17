export function usePageChanger(pageCount: number) {
  const currentPage = ref(0)
  const history = ref([0])

  const pageObjects = Array.from({ length: pageCount }, (_, index) => ({
    id: index,
    show: false,
    transitionClass: '',
    disposeNow: false
  }))

  return {
    currentPage,
    history,
  }
}


// --- 1. State Management ---
const currentPageIndex = ref(-1)
const showPage: Ref<boolean[]> = ref([]) // Tracks visibility for each page
const transitionClass: Ref<string[]> = ref([]) // Tracks CSS classes for animations
const disposeNow: Ref<boolean[]> = ref([]) // Signals a page to run its cleanup logic
const navHistory: Ref<number[]> = ref([])
const changing = ref(false)

// Internal queue to handle rapid-fire navigation clicks
const changeQueue: {
  targetPage?: number,
  relative?: number,
  transitionName?: string,
  goingBack?: boolean
}[] = []

// --- 2. Transitions Configuration ---
const transitions: Record<string, { enterClass: string, exitClass: string, duration: number }> = {
  'default': { enterClass: 'default-enter', exitClass: 'default-exit', duration: 0.5 },
  'zoom': { enterClass: 'zoom-enter', exitClass: 'zoom-exit', duration: 0.7 },
  'spin': { enterClass: 'spin-enter', exitClass: 'spin-exit', duration: 1 }
}

// --- 3. The Transition Engine ---
let disposeDoneHandler = () => { }
function onDisposeDone() { disposeDoneHandler() }

async function processNavigationQueue() {
  if (changing.value || changeQueue.length === 0) return

  changing.value = true

  while (changeQueue.length) {
    const prevPage = currentPageIndex.value
    let { targetPage, relative, transitionName, goingBack } = changeQueue.shift()!

    // Resolve target index
    if (targetPage === undefined && relative !== undefined) {
      targetPage = prevPage + relative
    }

    // Safety checks
    if (targetPage === prevPage) continue

    const config = transitions[transitionName || 'default']

    // PHASE 1: Exit Previous Page
    if (prevPage > -1) {
      // Create a promise that waits for the component to say "I am cleaned up"
      const waitForCleanup = new Promise<void>(resolve => {
        disposeDoneHandler = resolve
      })

      disposeNow.value[prevPage] = true // Signal component to cleanup
      await waitForCleanup

      transitionClass.value[prevPage] = config.exitClass
      if (!goingBack) navHistory.value.push(prevPage)
    }

    // PHASE 2: Enter New Page
    transitionClass.value[targetPage!] = config.enterClass
    showPage.value[targetPage!] = true

    // Wait for the duration of the CSS animation
    await new Promise(r => setTimeout(r, config.duration * 1000))

    // PHASE 3: Cleanup
    if (prevPage > -1) {
      disposeNow.value[prevPage] = false
      showPage.value[prevPage] = false
    }

    currentPageIndex.value = targetPage!
  }

  changing.value = false
}

// --- 4. Navigation API ---
function jumpToPage(target: number, transition?: string) {
  changeQueue.push({ targetPage: target, transitionName: transition })
  processNavigationQueue()
}

function jumpBack() {
  if (navHistory.value.length) {
    const last = navHistory.value.pop()
    changeQueue.push({ targetPage: last, goingBack: true })
    processNavigationQueue()
  }
}