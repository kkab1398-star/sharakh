# دستور مشروع SHARAKH (شراكة) — v2

> وثيقة مرجعية شاملة تم توليدها بالكامل من فحص الكود الفعلي الموجود في المستودع بتاريخ 2026-07-04.
> لا تحتوي على افتراضات — كل ما هو موثّق هنا إما موجود في الكود، أو مذكور صراحة كـ "فجوة" غير موجودة بعد.

---

## 1. هوية المشروع والـ Tech Stack

**الاسم:** SHARAKH (شراكة)
**الفكرة:** نظام SaaS متعدد المستأجرين (multi-tenant) لإدارة شراكات المعدات الثقيلة بين **ملّاك المعدات (Partners)** و**السائقين/العمال (Workers)** الذين يشغّلونها، مع تسوية مالية دورية حسب نسبة ربح متفق عليها لكل سائق.

**نموذج العمل:** الشريك (المالك) يسجّل، يضيف معداته وسائقيه، يفتح "دورة مالية" لكل سائق/معدة، يُسجَّل خلالها الدخل والمصاريف والسّلف، ثم تُسوّى الدورة فتُحسب حصة كل طرف تلقائياً.

### Stack التقني (من `package.json`)

| الطبقة | التقنية | الإصدار |
|---|---|---|
| Framework | Next.js (App Router) | `16.2.9` — **تنبيه:** حسب `AGENTS.md` هذا إصدار يحتوي تغييرات جذرية مختلفة عن المعروف تدريبياً، يجب مراجعة `node_modules/next/dist/docs/` قبل أي تعديل هيكلي |
| UI Runtime | React / React DOM | `19.2.4` |
| اللغة | TypeScript | `^5` (strict mode) |
| التنسيق | Tailwind CSS | `^4` (عبر `@tailwindcss/postcss`) |
| قاعدة البيانات + Auth + Storage | Supabase (`@supabase/supabase-js` + `@supabase/ssr`) | `^2.108.2` / `^0.12.0` |
| توليد PDF | `@react-pdf/renderer`, `jspdf`, `html2canvas` | للفواتير وتقارير التسوية |
| التحقق من المدخلات | `zod` | `^4.4.3` |
| تشفير كلمات مرور السائقين | `bcryptjs` | `^3.0.3` |
| توقيع جلسات السائقين | `jose` (JWT) | `^6.2.3` |
| الرسوم البيانية | `recharts` | لتحليلات العملاء |
| إدارة الحالة/الطلبات | `@tanstack/react-query` | |
| الثيمات | `next-themes` + سياق مخصص `lib/theme-context.tsx` | فاتح/داكن |
| الأيقونات | `lucide-react` | |
| الاستضافة المستهدفة | **Vercel** | يوجد `vercel.json` بإعداد Cron |

**تعدد اللغات:** واجهة السائقين (`app/driver/*`) تدعم 6 لغات عبر `messages/driver/*.json`: العربية (ar)، الإنجليزية (en)، البنغالية (bn)، النيبالية (ne)، الفلبينية/تاغالوغ (tl)، الأردية (ur) — مناسبة لعمالة وافدة في الخليج.

**الهوية البصرية:** أصفر `#FFCD11` على أسود `#111111`، خط Cairo/Barlow Condensed، RTL افتراضي.

---

## 2. هيكل قاعدة البيانات

المصدر: `supabase/schema.sql` + 4 ملفات في `supabase/migrations/`. **كل الجداول تستخدم Row Level Security (RLS)** بسياسة موحّدة: `partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())`.

### الجداول الموجودة فعلياً في SQL

**`partners`** (الشركاء/الملاك)
`id, user_id → auth.users, company_name, logo_url, phone_primary, phone_wa, telegram_chat_id, currency (default SAR), locale (default ar), theme (default light), created_at, updated_at`

**`workers`** (السائقون)
`id, partner_id → partners, full_name, username, password_hash, phone, is_active (default true), is_frozen (default false — من migration منفصلة), created_at` — قيد فريد `(partner_id, username)`

**`equipment_types`** (أنواع المعدات)
`id, partner_id, name, name_en, icon`

**`equipment`** (المعدات)
`id, partner_id, equipment_type_id → equipment_types, assigned_worker_id → workers, plate_number, model, manufacture_year, notes, is_active, created_at`

**`worker_contracts`** (نسب الشراكة — تاريخية)
`id, partner_id, worker_id, profit_percentage (0-100 حصرياً), effective_from, effective_to (nullable = ساري حالياً), created_at`

**`financial_cycles`** (الدورات المالية)
`id, partner_id, worker_id, equipment_id, title, status ('open'|'settled'), started_at, settled_at, total_income, total_expenses, net_amount, partner_share, worker_share, worker_transfers, partner_transfers, worker_net, partner_net, currency, notes, created_at, report_url (من migration)`

**`transactions`** (المعاملات)
`id, cycle_id → financial_cycles, partner_id, worker_id, type ('income'|'expense'|'transfer_to_partner'|'transfer_to_worker'), amount (>0), description, recorded_by ('partner'|'worker'), created_at, customer_id/customer_name/customer_phone (من migration)`

**`customers`** (من `add_customers_table.sql`)
`id, partner_id, full_name, phone, created_at` — قيد فريد `(partner_id, phone)`

**`invoices`** (من `add_invoices_table.sql`)
`id, partner_id, worker_id, cycle_id, transaction_id, customer_id, customer_name, customer_phone, amount, description, currency, pdf_url, created_at`

### ⚠️ فجوة حرجة: أعمدة/جداول يستخدمها الكود لكنها غير موجودة في أي ملف SQL بالمستودع

هذه ستُسبب **فشلاً فورياً عند تشغيل التطبيق على قاعدة بيانات جديدة** مبنية فقط من ملفات SQL الحالية:

- **`partners`**: `subscription_status`, `plan`, `trial_ends_at`, `subscription_ends_at` (يستخدمها `lib/subscription.ts`, `app/api/admin/partners`, `app/api/cron/daily`, `app/dashboard/layout.tsx`, `app/x7k9-panel-2024`) + `address`, `instagram`, `x_account`, `snapchat` (يستخدمها `PUT /api/partners/me`)
- **`financial_cycles`**: عمود `total_advances` (يستخدمه `recalculateCycleTotals` في مسارات المعاملات)
- **جدول `services`** بالكامل غير موجود (يستخدمه `/api/partner/services*`, `/api/worker/services`) — الأعمدة المتوقعة: `id, partner_id, name, default_price, currency, is_active, created_at`
- **جدول `expense_types`** بالكامل غير موجود (يستخدمه `/api/partner/expense-types*`, `/api/worker/expense-types`) — الأعمدة المتوقعة: `id, partner_id, name, is_default, is_active, sort_order, created_at`
- **`invoices.invoice_number`** غير موجود في migration الفواتير رغم استخدامه في `app/api/invoices/[id]/pdf/route.ts`

---

## 3. شجرة المشروع الكاملة

```
sharakh/
├── AGENTS.md, CLAUDE.md, README.md
├── next.config.ts (فارغ تقريباً), tsconfig.json, vercel.json (cron يومي), proxy.ts (middleware)
├── package.json, eslint.config.mjs, postcss.config.mjs
├── app/
│   ├── layout.tsx, page.tsx, globals.css, favicon.ico
│   ├── login/page.tsx, register/page.tsx, trial-expired/page.tsx
│   ├── x7k9-panel-2024/page.tsx          ← لوحة السوبر أدمن (مسار مموّه)
│   ├── dashboard/                          ← واجهة الشريك/المالك
│   │   ├── layout.tsx (يتحقق من الاشتراك + Sidebar)
│   │   ├── page.tsx
│   │   ├── customers/page.tsx
│   │   ├── cycles/ (page.tsx, new/page.tsx, [id]/page.tsx)
│   │   ├── daily-operations/page.tsx
│   │   ├── drivers/ (page.tsx, new/page.tsx, [id]/page.tsx)
│   │   ├── equipment/ (page.tsx, new/page.tsx, [id]/page.tsx)
│   │   ├── services/page.tsx
│   │   └── settings/page.tsx
│   ├── driver/                             ← واجهة السائق (PWA-like، شريط تنقل سفلي)
│   │   ├── layout.tsx, page.tsx
│   │   ├── login/ (layout.tsx, page.tsx)
│   │   ├── transactions/page.tsx, invoices/page.tsx
│   └── api/
│       ├── admin/partners/route.ts                    (سوبر أدمن)
│       ├── auth/ (logout, partner/login, partner/register, worker/login, worker/logout)
│       ├── cron/daily/route.ts
│       ├── customers/ (analytics, search)
│       ├── cycles/ (route.ts, [id]/route.ts, [id]/report, [id]/settle)
│       ├── daily-operations/route.ts
│       ├── drivers/ (route.ts, [id]/route.ts, [id]/activate, deactivate, freeze, unfreeze)
│       ├── equipment/ (route.ts, [id]/route.ts), equipment-types/route.ts
│       ├── health/route.ts
│       ├── invoices/[id]/pdf/route.ts
│       ├── partner/ (expense-types + [id], services + [id])
│       ├── partners/me/ (route.ts, logo/route.ts)
│       ├── telegram/link/route.ts
│       ├── transactions/ (route.ts, [id]/route.ts)
│       ├── transfers/route.ts
│       └── worker/ (cycles, expense-types, invoices, services, transactions)
├── components/
│   ├── CustomerAutocomplete.tsx, Navbar.tsx
│   ├── SettlementReportPdf.tsx, ShareSettlementButton.tsx
│   ├── layout/Sidebar.tsx
│   └── ui/StatsCard.tsx
├── contexts/DriverLangContext.tsx
├── driver/login/page.tsx                    ← ملف يتيم خارج app/ (راجع الفجوات)
├── lib/
│   ├── auth.ts             (getAuthenticatedPartner — جلسات الشريك)
│   ├── worker-auth.ts      (signWorkerToken/getWorkerSession — JWT السائق)
│   ├── calculations.ts     (خوارزمية التسوية)
│   ├── subscription.ts     (حالة الاشتراك/التجربة)
│   ├── currency.ts, invoice.ts, telegram.ts, tenant-theme.ts
│   ├── supabase.ts (browser), supabase-server.ts (SSR), supabase-admin.ts (service role)
│   └── theme-context.tsx, driver-i18n.ts
├── messages/driver/{ar,en,bn,ne,tl,ur}.json
├── public/*.svg
├── supabase/
│   ├── schema.sql
│   └── migrations/ (add_customers_table, add_invoices_table, add_is_frozen_to_workers, add_report_url_to_cycles)
└── types/index.ts
```

> **ملاحظة:** يوجد `driver/login/page.tsx` في جذر المشروع خارج `app/` — على الأرجح ملف قديم/يتيم من قبل نقل المسار إلى `app/driver/login/page.tsx`، يستحق المراجعة والحذف إن كان غير مستخدم.

---

## 4. TypeScript Interfaces

### من `types/index.ts` (المصدر المركزي المطلوب)

```ts
type UserRole = 'partner' | 'worker';

interface Partner {
  id, user_id, company_name, logo_url,
  phone_primary, phone_wa, telegram_chat_id,
  currency: 'SAR' | 'USD' | 'AED' | 'KWD',
  locale: 'ar' | 'en', theme: 'light' | 'dark', created_at
}

interface Worker {
  id, partner_id, full_name, username, phone,
  is_active, is_frozen, created_at
}

interface EquipmentType { id, partner_id, name, name_en }

interface Equipment {
  id, partner_id, equipment_type_id, assigned_worker_id,
  plate_number, model, manufacture_year, is_active,
  equipment_type?, assigned_worker?
}

interface WorkerContract {
  id, partner_id, worker_id, profit_percentage,
  effective_from, effective_to
}

type CycleStatus = 'open' | 'settled';

interface FinancialCycle {
  id, partner_id, worker_id, equipment_id, title, status,
  started_at, settled_at,
  total_income, total_expenses, net_amount,
  partner_share, worker_share, worker_transfers, partner_transfers,
  worker_net, partner_net, currency, report_url?,
  worker?, equipment?
}

type TransactionType = 'income' | 'expense' | 'transfer_to_partner' | 'transfer_to_worker';

interface Transaction {
  id, cycle_id, partner_id, worker_id, type, amount, description,
  recorded_by: 'partner' | 'worker',
  customer_id?, customer_name?, customer_phone?, created_at
}

interface Customer { id, partner_id, full_name, phone, created_at }

interface SettlementResult {
  cycle_id, total_income, total_expenses, net_amount,
  worker_percentage, partner_percentage,
  worker_share, partner_share,
  worker_transfers, partner_transfers,
  worker_net, partner_net, currency
}
```

### أنواع إضافية معرّفة محلياً داخل ملفات `lib/` (خارج `types/index.ts`)

- `lib/worker-auth.ts` → `WorkerSession { worker_id, partner_id, full_name }`
- `lib/subscription.ts` → `SubscriptionStatus`, `SubscriptionPlan`, `SubscriptionState`
- `lib/tenant-theme.ts` → `TenantTheme`
- `lib/invoice.ts` → `InvoiceData`

> **ملاحظة تنظيمية:** هذه الأنواع منطقياً يجب أن تُدمج في `types/index.ts` مستقبلاً لتفادي تشتت مصدر الحقيقة (source of truth) الخاص بالـ types.

---

## 5. خوارزمية التسوية المالية

المصدر: [lib/calculations.ts](lib/calculations.ts) — دالة `calculateSettlement(transactions, contract, cycleId, currency)`، تُستدعى من `POST /api/cycles/:id/settle`.

**خطوات الحساب:**

1. **إجمالي الدخل** = مجموع كل معاملات `type = 'income'`
2. **إجمالي المصاريف** = مجموع كل معاملات `type = 'expense'`
3. **الصافي** = الدخل − المصاريف
4. **نسبة السائق** = `worker_contracts.profit_percentage` الساري وقت التسوية (يُختار العقد بـ `effective_from <= اليوم` و `effective_to` فارغ أو مستقبلي، الأحدث أولاً)
5. **نسبة الشريك** = `100 - نسبة السائق`
6. **حصة السائق** = الصافي × نسبة السائق ÷ 100
7. **حصة الشريك** = الصافي × نسبة الشريك ÷ 100
8. **سلف السائق (المسحوبة خلال الدورة)** = مجموع معاملات `transfer_to_worker`
9. **تحويلات للشريك خلال الدورة** = مجموع معاملات `transfer_to_partner`
10. **الصافي النهائي للسائق** = حصة السائق − سلف السائق
11. **الصافي النهائي للشريك** = حصة الشريك − تحويلات الشريك
12. كل الأرقام تُقرَّب لمنزلتين عشريتين (`round()`)

بعد الحساب، `POST /api/cycles/:id/settle` يحدّث `financial_cycles` بالنتائج ويضبط `status = 'settled'` و`settled_at = now()` — **الدورة المُسوّاة لا يمكن تعديل معاملاتها بعدها** (كل مسارات إضافة/حذف المعاملات تتحقق من `status !== 'settled'`).

> **تنبيه اتساق:** خوارزمية `calculateSettlement` لا تُدرج `transfer_to_worker` ضمن حساب الصافي (`net_amount`) نفسه، بينما دالة `recalculateCycleTotals` المُستخدمة أثناء إضافة/حذف المعاملات (في مسارات `worker/transactions`, `transactions`, `transactions/[id]`) **تطرح** السلف (`total_advances`) من `net_amount` مباشرة. أي أن هناك تعريفين مختلفين لـ"الصافي" يُستخدمان في نقاط مختلفة من النظام (صافي التسوية النهائي مقابل صافي العرض الحي أثناء الدورة المفتوحة) — يستحق توضيحاً للمنتج قبل الإطلاق حتى لا يلتبس على المستخدم.

---

## 6. API Routes الموجودة

### مصادقة (`/api/auth`)
| المسار | Method | الوصف |
|---|---|---|
| `/api/auth/partner/register` | POST | تسجيل شريك جديد (ينشئ Supabase Auth user + صف partners عبر service role) |
| `/api/auth/partner/login` | POST | دخول شريك (Supabase Auth signInWithPassword) |
| `/api/auth/worker/login` | POST | دخول سائق (username+password محلي، يصدر JWT في كوكي `worker_token`) |
| `/api/auth/worker/logout` | POST | يمسح كوكي `worker_token` |
| `/api/auth/logout` | POST | تسجيل خروج شريك (Supabase signOut) |

### السوبر أدمن
| `/api/admin/partners` | GET, PUT | قائمة كل الشركاء + تعديل حالة/خطة الاشتراك — محمي بـ `SUPER_ADMIN_EMAILS` |

### الشريك — الموارد الأساسية (تتطلب `getAuthenticatedPartner`)
| المسار | Methods |
|---|---|
| `/api/partners/me` | GET, PUT |
| `/api/partners/me/logo` | POST, DELETE |
| `/api/drivers` | GET, POST |
| `/api/drivers/[id]` | GET, PUT |
| `/api/drivers/[id]/activate` `/deactivate` `/freeze` `/unfreeze` | POST |
| `/api/equipment` | GET, POST |
| `/api/equipment/[id]` | GET, PUT |
| `/api/equipment-types` | GET, POST |
| `/api/cycles` | GET, POST |
| `/api/cycles/[id]` | GET |
| `/api/cycles/[id]/settle` | POST (تشغيل خوارزمية التسوية) |
| `/api/cycles/[id]/report` | POST (رفع PDF تقرير للتخزين) |
| `/api/transactions` | GET, POST |
| `/api/transactions/[id]` | DELETE |
| `/api/transfers` | POST (سلفة/تحويل بين الطرفين) |
| `/api/partner/services` | GET, POST |
| `/api/partner/services/[id]` | PATCH, DELETE |
| `/api/partner/expense-types` | GET, POST |
| `/api/partner/expense-types/[id]` | PATCH, DELETE |
| `/api/daily-operations` | GET (ملخص العمليات اليومية حسب فترة) |
| `/api/customers/analytics` | GET (تحليلات العملاء والفواتير) |
| `/api/telegram/link` | POST, DELETE (ربط/فك ربط تيليجرام) |

### مشترك بين الشريك والسائق (يدعم كلا نوعي الجلسات)
| `/api/customers/search` | GET |
| `/api/invoices/[id]/pdf` | GET (يولّد/يرجع رابط PDF + رابط واتساب) |

### السائق (`getWorkerSession` — JWT محلي)
| `/api/worker/cycles` | GET |
| `/api/worker/transactions` | GET, POST |
| `/api/worker/services` | GET |
| `/api/worker/expense-types` | GET |
| `/api/worker/invoices` | GET |

### أخرى
| `/api/health` | GET (فحص اتصال قاعدة البيانات) |
| `/api/cron/daily` | GET (تنبيهات انتهاء التجربة/الاشتراك عبر تيليجرام — محمي بـ `CRON_SECRET`، مُجدول عبر `vercel.json` يومياً الساعة 08:00 UTC) |

---

## 7. نظام الصلاحيات

النظام يحتوي **ثلاث طبقات صلاحيات منفصلة تماماً** بآليات مختلفة (لا يوجد جدول `roles` موحّد):

### أ) المالك/الشريك (Partner)
- مصادقة عبر **Supabase Auth** (بريد + كلمة مرور)، جلسة بكوكيز مُدارة بـ `@supabase/ssr`.
- الحماية على مستوى **قاعدة البيانات** عبر RLS: كل سياسة تربط الصف بـ `partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())`.
- الحماية على مستوى **API** عبر `getAuthenticatedPartner()` في `lib/auth.ts` (يُستدعى في بداية كل route خاص بالشريك، يُرجع 401 إن لم توجد جلسة، 404 إن لم يوجد صف partner مطابق).

### ب) السائق (Worker/Driver)
- **لا حساب Supabase Auth** — نظام مستقل بالكامل: `username` + `password_hash` (bcrypt، cost 12) مُقيّدان بـ `partner_id` (قيد فريد `(partner_id, username)`).
- عند الدخول (`/api/auth/worker/login`) يُصدر JWT موقّع بـ `JWT_SECRET` (عبر `jose`) يحوي `{worker_id, partner_id, full_name}`، صلاحية 30 يوم، يُخزَّن في كوكي `worker_token` (`httpOnly`, `sameSite: lax`).
- التحقق يتم بـ `getWorkerSession(req)` في `lib/worker-auth.ts`.
- **جميع** مسارات `/api/worker/*` تستخدم `createAdminClient()` (service role، **يتجاوز RLS بالكامل**) وتُصفّي يدوياً بـ `.eq('worker_id', ...).eq('partner_id', ...)` من محتوى الـ JWT — أي أن الأمان هنا **منطق تطبيقي بحت وليس على مستوى قاعدة البيانات**.
- حالتان تحكمان الوصول عند الدخول: `is_active` (تعطيل دائم من المالك) و`is_frozen` (تجميد مؤقت) — كلاهما يُرفضان بـ 403 عند تسجيل الدخول.

### ج) السوبر أدمن (Super Admin)
- **لا يوجد دور/جدول مخصص له** — بريد المستخدم (نفس حساب Supabase Auth الخاص بشريك عادي) يُقارن ضد قائمة مفصولة بفواصل في متغيّر بيئة `SUPER_ADMIN_EMAILS`.
- نقطتا تطبيق منفصلتان (يجب إبقاؤهما متطابقتين يدوياً):
  1. `proxy.ts` (middleware) — يحمي `/x7k9-panel-2024/:path*` كصفحة.
  2. `assertSuperAdmin()` داخل `app/api/admin/partners/route.ts` — يحمي الـ API المقابل.
- الوصول عبر مسار مموّه غير موثّق `/x7k9-panel-2024` (أمان بالغموض فقط — بلا معدل طلبات أو 2FA).
- يستخدم اللوحة لتعديل `subscription_status` و`plan` و`trial_ends_at`/`subscription_ends_at` لأي شريك يدوياً.

### د) بوابة الاشتراك (Subscription Gate)
- `lib/subscription.ts` يحسب الحالة (`trial | active | expired | cancelled`) و`is_active`/`days_remaining` من حقول partner.
- تُفرض فقط في `app/dashboard/layout.tsx` (تحويل إلى `/trial-expired` إن لم يكن نشطاً) — **غير مفروضة على مستوى الـ API routes نفسها** (باستثناء استخدامها في cron)، أي أن استدعاءات API مباشرة قد تعمل حتى لو انتهت الفترة التجريبية.

---

## 8. متغيرات البيئة المطلوبة

`.env.local` الحالي **فارغ تماماً (0 بايت)** ولا يوجد ملف `.env.example` في المستودع. المتغيرات المُستخرجة من الكود فعلياً:

| المتغيّر | إلزامي؟ | أين يُستخدم | ملاحظة |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | `lib/supabase*.ts`, `proxy.ts` | عام (client-side) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | نفس الملفات أعلاه | عام (client-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | `lib/supabase-admin.ts` | **سرّي — خادم فقط** |
| `JWT_SECRET` | ✅ | `lib/worker-auth.ts` | يُستخدم مباشرة بدون قيمة افتراضية (`process.env.JWT_SECRET!`) — سيتعطل التطبيق إن غاب |
| `SUPER_ADMIN_EMAILS` | ✅ للوحة الأدمن | `proxy.ts`, `app/api/admin/partners` | قائمة بريد مفصولة بفواصل |
| `NEXT_PUBLIC_APP_URL` | ✅ | `app/api/auth/logout` | رابط إعادة التوجيه بعد الخروج |
| `TELEGRAM_BOT_TOKEN` | اختياري (feature flag) | `lib/telegram.ts`, `telegram/link` | الميزة تُعطَّل بلطف إن غاب |
| `CRON_SECRET` | موصى به | `app/api/cron/daily` | إن غاب، الـ endpoint يبقى **مفتوحاً بدون حماية** |

---

## 9. ما تم إنجازه، وما ينقص للنشر

### ✅ منجَز
- النموذج البياني الأساسي الكامل (شركاء، سائقون، معدات، عقود، دورات، معاملات، عملاء، فواتير) مع RLS.
- خوارزمية التسوية المالية منفّذة ومربوطة بمسار التسوية.
- نظامَا مصادقة مزدوجان يعملان (شريك عبر Supabase Auth، سائق عبر JWT محلي).
- لوحة سوبر أدمن أساسية لإدارة الاشتراكات.
- توليد فواتير/تقارير PDF + روابط مشاركة واتساب.
- تكامل بوت تيليجرام للإشعارات + تدفّق ربط الحساب.
- واجهة سائق متعددة اللغات (6 لغات) مع شريط تنقل سفلي.
- Cron يومي لتنبيهات انتهاء الاشتراك/التجربة.
- واجهات لوحة تحكم كاملة: السائقون، المعدات، الدورات، العملاء، العمليات اليومية، الخدمات، الإعدادات.

### ⛔ الفجوات الحرجة قبل النشر

1. **مخطط قاعدة البيانات غير مكتمل** — أعمدة/جداول يستخدمها الكود غير معرّفة في أي ملف SQL بالمستودع (تفصيل كامل في القسم 2). التطبيق **سيفشل فعلياً** على أي قاعدة بيانات جديدة تُبنى من `schema.sql` + migrations الحالية فقط.
2. **لا يوجد migration/سياسات RLS لجدولي `services` و`expense_types`** الجديدين (يجب أن يتبعا نفس نمط `partner_id` + RLS الموجود في بقية الجداول).
3. **حاويات Supabase Storage غير مُعرَّفة في المستودع** — الكود يفترض وجود 3 buckets باسم `documents` (فواتير)، `reports` (تقارير التسوية)، `logos` (شعارات) بصلاحية قراءة عامة (`getPublicUrl`) — يجب إنشاؤها يدوياً في لوحة Supabase قبل أول نشر، لا يوجد سكربت آلي لذلك.
4. **لا بيئة مُهيَّأة إطلاقاً** — `.env.local` فارغ، ولا يوجد `.env.example` كمرجع لمن يُعِدّ البيئة لأول مرة.
5. **لا اختبارات آلية** — لا يوجد إطار اختبار (jest/vitest/playwright) في `package.json`، فلا شيء يتحقق تلقائياً من صحة خوارزمية التسوية أو تدفقات المصادقة.
6. **رقم واتساب دعم وهمي (`966500000000`)** مكتوب صراحة في `app/trial-expired/page.tsx` — يجب استبداله برقم حقيقي قبل الإطلاق.
7. **`CRON_SECRET` اختياري فعلياً** — إن لم يُضبط، مسار `/api/cron/daily` يبقى بلا حماية ويمكن لأي طرف استدعاءه.
8. **تضارب في تعريف "الصافي"** بين خوارزمية التسوية النهائية وحساب العرض الحي أثناء الدورة المفتوحة (تفصيل في القسم 5) — قرار منتج يحتاج توضيحاً.
9. **ملف يتيم** `driver/login/page.tsx` خارج `app/` — يستحق تأكيد أنه غير مستخدم وحذفه لتفادي الالتباس.
10. **تسجيل شريك جديد لا يضبط حقول الاشتراك** — `POST /api/auth/partner/register` لا يُنشئ `subscription_status`/`trial_ends_at` صراحةً، فبمجرد إضافة هذه الأعمدة (الفجوة #1) يجب إما ضبط قيم `DEFAULT` في SQL أو تحديث كود التسجيل ليبدأ فترة تجريبية صريحة (14 يوماً، حسب النص الظاهر في `trial-expired/page.tsx`).

---

## 10. خطوات النشر على Vercel

1. **تجهيز قاعدة البيانات:** أنشئ مشروع Supabase، نفّذ `supabase/schema.sql` ثم كل ملفات `supabase/migrations/` بالترتيب، **ثم أضف migration جديدة** تُغلق الفجوات في القسم 2 (أعمدة الاشتراك على `partners`، `total_advances` على `financial_cycles`، جدولا `services` و`expense_types` بسياسات RLS مطابقة للنمط الحالي، عمود `invoice_number`).
2. **إنشاء Storage Buckets:** `documents`, `reports`, `logos` — بصلاحية قراءة عامة (public) لأن الكود يستخدم `getPublicUrl` مباشرة.
3. **ضبط متغيرات البيئة في Vercel** (Production + Preview) حسب جدول القسم 8: مفاتيح Supabase الثلاثة، `JWT_SECRET` (سلسلة عشوائية طويلة)، `SUPER_ADMIN_EMAILS`، `NEXT_PUBLIC_APP_URL` (نطاق الإنتاج)، `CRON_SECRET`، و`TELEGRAM_BOT_TOKEN` إن كانت الميزة مطلوبة عند الإطلاق.
4. **ربط المستودع بـ Vercel** — استيراد المشروع من GitHub، يُكتشف Next.js تلقائياً كإطار العمل.
5. **التحقق من Cron:** تأكد أن `vercel.json` (`/api/cron/daily` الساعة 08:00 UTC) مفعّل على خطة Vercel المستخدمة، وأن `CRON_SECRET` مطابق للقيمة في الطلب.
6. **فحص ما بعد النشر:** زيارة `/api/health` للتأكد من اتصال قاعدة البيانات.
7. **اختبار الأدوار الثلاثة:** تسجيل شريك تجريبي عبر `/register`، تسجيل دخول سائق تجريبي، وإضافة بريد اختباري إلى `SUPER_ADMIN_EMAILS` لزيارة `/x7k9-panel-2024` والتأكد من عمل التحكم بالوصول.
8. **استبدال البيانات الوهمية:** رقم واتساب الدعم في `trial-expired/page.tsx`.
9. **ربط نطاق مخصص** إن وُجد، وتحديث `NEXT_PUBLIC_APP_URL` ليطابقه.
