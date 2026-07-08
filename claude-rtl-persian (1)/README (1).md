# Persian RTL Fixer for Chrome

**Auto-detects Persian/Arabic text and right-aligns it — everywhere — while keeping English, code, and mixed-language content perfectly readable.**

> 🇮🇷 برای مطالعه‌ی راهنمای فارسی به بخش [«فارسی»](#فارسی) در پایین همین صفحه بروید.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/manifest-v3-brightgreen.svg)](manifest.json)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)](#contributing)

---

## Why this exists

Most "RTL fix" extensions work by slapping `dir: rtl` on an entire page or a hardcoded list of CSS classes. That breaks the moment a site redesigns its UI, or the moment a Persian paragraph contains an English sentence, a code snippet, or a bullet list — the whole block flips the wrong way.

This extension takes a different approach: **it reads the actual text**, not class names. Every text-bearing element is checked for Persian/Arabic characters at the content level, and its direction is set explicitly — Persian → RTL, everything else → LTR — so nothing is left to inherit the wrong direction from a parent container. Code blocks stay LTR no matter where they're nested. Live editors (contenteditable areas, textareas) update direction in real time as you type.

## Features

- **Content-based detection** — no fragile reliance on a site's CSS classes or DOM structure
- **Mixed-language safe** — a fully English paragraph inside a Persian article stays left-aligned, and vice versa
- **Code stays code** — `<pre>` blocks and inline `<code>` always render LTR, including mid-sentence in an RTL paragraph
- **Live typing support** — direction updates instantly in chat boxes, rich-text editors, and `<textarea>` fields
- **Bullet & numbered lists** — markers and padding flip correctly based on the list's own language
- **Zero permissions** — no `permissions` requested in the manifest; it only touches the DOM/CSS of the pages it's injected into

## Supported sites

| Site | Status |
|---|---|
| [claude.ai](https://claude.ai) | ✅ Supported |
| [linkedin.com](https://linkedin.com) | ✅ Supported |
| Your favorite site | 🙌 [Open an issue or PR](#contributing) |

Adding a new site is usually a **one-line change** — see [Contributing](#contributing).

## Installation

### Option A — Chrome Web Store (recommended)
> 🔗 *Coming soon — link will be added here once the listing is published.*

### Option B — Manual install (for testing / development)
1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the project folder.

## How it works (technical overview)

| File | Responsibility |
|---|---|
| `manifest.json` | Manifest V3 config — declares which sites the content script runs on |
| `content.js` | Core logic: Persian/Arabic detection, direction assignment, MutationObserver for live updates |
| `rtl.css` | Baseline rules that guarantee code blocks stay LTR |
| `popup.html` | Toolbar popup UI |

The detection logic lives entirely in `content.js` and is intentionally framework-agnostic — it works on plain HTML, ProseMirror-based editors, and any `contenteditable` region.

## Contributing

This project is built for the Persian-speaking web, and it gets better with every contributor. **All skill levels and all kinds of contributions are welcome** — you don't need to be a JavaScript expert to help.

Ways to contribute:

- 🌐 **Add support for a new site** — update the `matches` array in `manifest.json` and test that Persian/English blocks render correctly there
- 🐛 **Report a bug** — screenshots of misaligned text are extremely helpful; open an [issue](../../issues) with the URL and a screenshot
- 🧠 **Improve detection logic** — edge cases (mixed-script inline elements, RTL numerals, Kurdish/Arabic dialect ranges, etc.) in `content.js`
- 🎨 **Design real icons** — the current `icon16/48/128.png` files are placeholders and could use a proper logo
- 🌍 **Localization** — help translate `popup.html` and this README into other languages
- 🦊 **Port to Firefox** — the codebase has no Chrome-specific APIs beyond the manifest, so a Manifest V2/V3-compatible Firefox build is very achievable
- 🏪 **Help publish to the Chrome Web Store** — assist with the listing, screenshots, and privacy disclosure

### Submitting changes

1. Fork the repository
2. Create a branch: `git checkout -b feature/add-site-support`
3. Make your changes and test them locally (see [Manual install](#option-b--manual-install-for-testing--development))
4. Commit with a clear message: `git commit -m "Add support for example.com"`
5. Push and open a Pull Request describing what you changed and why

### Code style

- Keep `content.js` dependency-free (no build step, no bundler) — it should stay a plain script anyone can read top to bottom
- Prefer explicit direction assignment over relying on CSS inheritance (see the reasoning in [Why this exists](#why-this-exists))
- Comment non-obvious logic, especially anything touching bidi/Unicode edge cases

## Roadmap / ideas

- [ ] Publish to the Chrome Web Store
- [ ] Firefox Add-ons port
- [ ] Options page to let users add custom sites without editing the manifest
- [ ] Support for additional RTL languages (Arabic-first sites, Kurdish, Urdu)

Have an idea not listed here? Open an issue — this list is driven by the community.

## License

Distributed under the [MIT License](LICENSE). Free to use, modify, and redistribute.

## Acknowledgments

Built and maintained by the community, for the Persian-speaking web. Thank you to everyone who files an issue, tests a fix, or opens a PR — this project only exists because of that.

---

<a id="فارسی"></a>
## فارسی

**تشخیص خودکار متن فارسی/عربی و راست‌چین کردن آن — همه‌جا — بدون به‌هم‌ریختن متن انگلیسی، کد، یا محتوای ترکیبی.**

### چرا این پروژه ساخته شد

بیشتر افزونه‌های «راست‌چین‌کننده» با تحمیل `dir: rtl` روی کل صفحه یا با تکیه بر یک لیست ثابت از کلاس‌های CSS کار می‌کنند. این روش با هر تغییر جزئی در طراحی سایت، یا وقتی یک پاراگراف فارسی حاوی یک جمله انگلیسی یا یک قطعه کد باشد، از هم می‌پاشد.

این افزونه رویکرد متفاوتی دارد: **محتوای واقعی متن را می‌خواند**، نه نام کلاس‌ها. جهت هر عنصر متنی صراحتاً بر اساس زبان خودش تعیین می‌شود — فارسی → راست‌چین، غیر آن → چپ‌چین — بدون اینکه چیزی از والدینش به ارث برده شود. بلوک‌های کد همیشه چپ‌چین می‌مانند، حتی وسط یک جمله فارسی. ادیتورهای زنده (کادرهای قابل‌ویرایش، textarea) هم حین تایپ جهت‌شان به‌صورت آنی به‌روزرسانی می‌شود.

### امکانات

- **تشخیص بر پایه محتوا** — بدون وابستگی شکننده به کلاس‌ها یا ساختار DOM هر سایت
- **ایمن در برابر محتوای ترکیبی** — پاراگراف کاملاً انگلیسی وسط یک مقاله فارسی، چپ‌چین باقی می‌ماند و برعکس
- **کد همیشه کد می‌ماند** — `<pre>` و `<code>` درون‌خطی، حتی وسط جمله فارسی، چپ‌چین رندر می‌شوند
- **پشتیبانی از تایپ زنده** — جهت متن در کادرهای چت، ادیتورهای متنی و `<textarea>` بلافاصله به‌روز می‌شود
- **لیست‌های بولت و شماره‌دار** — علامت‌ها و padding بر اساس زبان خود لیست درست تنظیم می‌شوند
- **بدون درخواست هیچ دسترسی خاصی** — در manifest هیچ `permissions`ی درخواست نشده

### سایت‌های پشتیبانی‌شده

| سایت | وضعیت |
|---|---|
| claude.ai | ✅ پشتیبانی می‌شود |
| linkedin.com | ✅ پشتیبانی می‌شود |
| سایت مورد علاقه شما | 🙌 [یک issue یا PR باز کنید](#مشارکت) |

اضافه کردن یک سایت جدید معمولاً فقط **یک خط تغییر** در `manifest.json` نیاز دارد.

### نصب

**روش الف — فروشگاه کروم (توصیه‌شده):** به‌زودی لینک اینجا قرار می‌گیرد.

**روش ب — نصب دستی (برای تست/توسعه):**
۱. ریپازیتوری را کلون یا دانلود کنید.
۲. آدرس `chrome://extensions` را باز کنید.
۳. «Developer mode» را روشن کنید.
۴. روی «Load unpacked» کلیک کرده و پوشه پروژه را انتخاب کنید.

### مشارکت

این پروژه برای وب فارسی‌زبان ساخته شده و با هر مشارکتی بهتر می‌شود. **هر سطح مهارتی خوش‌آمد است** — لازم نیست متخصص جاوااسکریپت باشید تا کمک کنید.

راه‌های مشارکت:
- 🌐 افزودن پشتیبانی از یک سایت جدید (`manifest.json`)
- 🐛 گزارش باگ همراه با اسکرین‌شات و آدرس صفحه، در بخش Issues
- 🧠 بهبود منطق تشخیص در `content.js` (حالت‌های خاص، اعداد فارسی/عربی، زبان‌های دیگر مثل کردی)
- 🎨 طراحی آیکون واقعی (آیکون‌های فعلی صرفاً جای‌گذار هستند)
- 🌍 ترجمه رابط کاربری و همین README
- 🦊 پورت به فایرفاکس
- 🏪 کمک برای انتشار نهایی در فروشگاه کروم

**فرآیند ارسال تغییرات:** فورک کنید → یک شاخه بسازید → تغییرات را اعمال و تست کنید → کامیت با پیام واضح → Pull Request باز کنید با توضیح تغییر و دلیل آن.

### لایسنس

تحت [مجوز MIT](LICENSE) منتشر شده است — استفاده، تغییر و بازنشر آزاد است.
