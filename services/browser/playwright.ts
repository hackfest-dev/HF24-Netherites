import { chromium } from 'playwright';

import { Browser, BrowserContext, Page } from 'playwright';

let MAX_BROWSER_CONTEXTS = 5;
let MAX_PAGES_PER_CONTEXT = 5;

let browser: Browser;

type PageOptions = {
  page: Page;
  timer: NodeJS.Timeout;
  isLocked: boolean;
};

type AcquiredPage = {
  page: Page;
  browserContextId: number;
  pageId: number;
};

type PageMap = Map<number, PageOptions>;

type BrowserContextOptions = {
  browserContext: BrowserContext;
  pages: PageMap;
};

type BrowserContextMap = Map<number, BrowserContextOptions>;

let browserContexts: BrowserContextMap = new Map();

export async function launchBrowser() {
  browser = await chromium.launch({
    headless: false,
  });
}

export async function closeBrowser() {
  await browser.close();
}

async function createPage(
  browserContext: BrowserContext
): Promise<PageOptions> {
  const page = await browserContext.newPage();
  const timer = setTimeout(() => {}, 0);
  return {
    page,
    timer,
    isLocked: false,
  };
}

export async function createBrowserContext() {
  const size = browserContexts.size;
  if (size >= MAX_BROWSER_CONTEXTS) {
    throw new Error('Maximum number of browser contexts reached');
  }
  const browserContext = await browser.newContext();

  const pages: PageMap = new Map();
  for (let i = 0; i < MAX_PAGES_PER_CONTEXT; i++) {
    pages.set(i, await createPage(browserContext));
  }
  browserContexts.set(size, { browserContext, pages });

  console.log(browserContexts.size);
}

export function getPage(
  timeout: number,
  retries: number = 100
): Promise<AcquiredPage | null> {
  return new Promise(resolve => {
    const findPage = async () => {
      if (retries <= 0) {
        resolve(null);
        return;
      }

      for (let [browserContextId, browserContextOptions] of browserContexts) {
        for (let [pageId, pageOptions] of browserContextOptions.pages) {
          if (!pageOptions.isLocked) {
            pageOptions.isLocked = true;
            pageOptions.timer = setTimeout(() => {
              pageOptions.isLocked = false;
            }, timeout * 1000);
            resolve({
              page: pageOptions.page,
              browserContextId: browserContextId,
              pageId: pageId,
            });
            return;
          }
        }
      }

      if (browserContexts.size < MAX_BROWSER_CONTEXTS) {
        await createBrowserContext();
        console.log(
          'Browser context created',
          browserContexts.size,
          MAX_BROWSER_CONTEXTS
        );
        findPage();
      } else {
        setTimeout(() => {
          findPage();
        }, 100);
      }
    };

    findPage();
  });
}

export function releasePage(page: AcquiredPage): boolean {
  const browserContextOptions = browserContexts.get(page.browserContextId);
  if (!browserContextOptions) {
    return false;
  }

  const pageOptions = browserContextOptions.pages.get(page.pageId);
  if (!pageOptions) {
    return false;
  }

  pageOptions.isLocked = false;
  clearTimeout(pageOptions.timer);

  browserContextOptions.pages.set(page.pageId, pageOptions);

  let minContextEmptyId = browserContexts.size - 1;

  for (let [browserContextId, browserContextOptions] of browserContexts) {
    let pagesInActiveCount = 0;
    for (let [_, pageOptions] of browserContextOptions.pages) {
      if (!pageOptions.isLocked) {
        pagesInActiveCount++;
      }
    }

    if (pagesInActiveCount === MAX_PAGES_PER_CONTEXT) {
      minContextEmptyId = Math.min(minContextEmptyId, browserContextId);
    } else {
      minContextEmptyId = browserContextId;
    }
  }

  for (let i = minContextEmptyId + 1; i < MAX_BROWSER_CONTEXTS; i++) {
    const browserContextOptions = browserContexts.get(i);
    if (!browserContextOptions) {
      continue;
    }

    browserContextOptions.browserContext.close();
    console.log(browserContexts.delete(i));
  }

  return true;
}
