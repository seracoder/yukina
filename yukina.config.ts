import I18nKeys from "./src/locales/keys";
import type { Configuration } from "./src/types/config";

const YukinaConfig: Configuration = {
  title: "Hamim's Blog",
  subTitle: "Thoughts, Code & Creativity",
  brandTitle: "Home",

  description: "Personal blog by Hamim – covering code, backend architecture, frontend ideas, and tech insights.",

  site: "https://seracoder.com",

  locale: "en",

  navigators: [
    {
      nameKey: I18nKeys.nav_bar_home,
      href: "/",
    },
    {
      nameKey: I18nKeys.nav_bar_archive,
      href: "/archive",
    },
    {
      nameKey: I18nKeys.nav_bar_about,
      href: "/about",
    },
    {
      nameKey: I18nKeys.nav_bar_github,
      href: "https://github.com/seracoder",
    },
  ],

  username: "Hamim",
  sign: "Solo Developer | Python & JS | FastAPI, Django, Next.js, Svelte",
  avatarUrl: "/avater-2.png", // You can replace this with your own avatar

  socialLinks: [
    {
      icon: "line-md:github-loop",
      link: "https://github.com/seracoder",
    },
    {
      icon: "mingcute:linkedin-line",
      link: "https://www.linkedin.com/in/md-hamim/",
    },
    {
      icon: "mingcute:world-2-line",
      link: "https://mdhamim.com",
    },
  ],

  maxSidebarCategoryChip: 6,
  maxSidebarTagChip: 12,
  maxFooterCategoryChip: 6,
  maxFooterTagChip: 24,

  banners: [
    "https://s2.loli.net/2025/01/25/PBvHFjr5yDu6t4a.webp",
    "https://s2.loli.net/2025/01/25/6bKcwHZigzlM4mJ.webp",
    "https://s2.loli.net/2025/01/25/H9WgEK6qNTcpFiS.webp",
    "https://s2.loli.net/2025/01/25/njNVtuUMzxs81RI.webp",
    "https://s2.loli.net/2025/01/25/tozsJ8QHAjFN3Mm.webp",
    "https://s2.loli.net/2025/01/25/Pm89OveZq7NWUxF.webp",
    "https://s2.loli.net/2025/01/25/UCYKvc1ZhgPHB9m.webp",
    "https://s2.loli.net/2025/01/25/JjpLOW8VSmufzlA.webp",
  ],

  slugMode: "RAW",   // 'RAW' | 'HASH'

  license: {
    name: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  },

  bannerStyle: "LOOP",   // 'loop' | 'static' | 'hidden'
};

export default YukinaConfig;
