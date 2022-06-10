
const PUBLIC_API_BASE_URL = 'https://api.publicapis.org';
const PUBLIC_API_CATEGORIES_PATH = '/categories';
const PUBLIC_API_ENTRIES_PATH = '/entries';

const SEVEN_TIMER_BASE_URL = 'http://www.7timer.info';
const SEVEN_TIMER_ASTRO_PATH = '/bin/astro.php';

module.exports = {
  full_name: 'fp-ts/TaskEither Exhibits',
  public_apis: {
    url: PUBLIC_API_BASE_URL,
    paths: {
      categories: PUBLIC_API_CATEGORIES_PATH,
      entries: PUBLIC_API_ENTRIES_PATH,
    },
  },
  seven_timer: {
    url: SEVEN_TIMER_BASE_URL,
    paths: {
      astro: SEVEN_TIMER_ASTRO_PATH,
    }
  }
};
