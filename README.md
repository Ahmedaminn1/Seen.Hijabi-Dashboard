# Seen Hijabi (سين) — Admin & Operations Dashboard

<div align="center">
  <img src="public/images/logo.png" alt="Seen Hijabi Logo" width="110" />
  <p><strong>لوحة الإدارة والتحكم الفوري في المخزون والطلبات لمتجر سين حجابي</strong></p>
  <p>Dedicated Administrative Portal for Real-Time Inventory Control, Product Management, Order Processing, and Store Configuration.</p>

  [![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?style=flat&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.3.0-blue?style=flat&logo=react)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-7.10.1-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
  [![Port](https://img.shields.io/badge/Port-3001-orange?style=flat)](#)
</div>

---

## 🌟 Overview | نظرة عامة

**Seen Hijabi Dashboard** هي لوحة تحكم إدارية متكاملة ومنفصلة عن المتجر لحماية البيانات وسرعة العمليات. تتيح لإدارة المتجر ومسؤولي العمليات:
- التحكم الفوري في كميات المخزون وتفادي نفاذ المنتجات (Overselling).
- إضافة وتعديل وحذف المنتجات بجميع تفاصيلها وصورها ومتغيراتها (الألوان والمقاسات).
- مراجعة الطلبات الجديدة والتأكد من إيصالات ورقم تحويل مصاريف الشحن مسبقاً (فودافون كاش / إنستاباي).
- ضبط وتعديل أرقام التواصل وروابط تيك توك وإنستاجرام وشريط الإعلانات وقواعد الشحن المجاني في ثوانٍ دون لمس الكود.
- مزامنة حية وفورية مع المتجر عبر الـ Revalidation API.

- **مستودع المتجر الرئيسي:** [Seen.Hijabi-Webiste](https://github.com/Ahmedaminn1/Seen.Hijabi-Webiste)

---

## ✨ المميزات الرئيسية | Core Features

### 📦 1. إدارة المخزون الفوري (Real-time Inventory Management)
- **تحكم دقيق في كل متغير (Variant):** كميات مستقلة لكل تركيبة من (اللون + المقاس + SKU).
- **تحديث سريع للكميات (Quick Inline Stock Update):** تعديل كمية أي قطعة وحفظها بضغطة زر واحدة بدون فتح صفحات أخرى.
- **تسميع فوري في المتجر بدون Reload:** بمجرد تعديل الكمية في الداشبورد يتم تحديث صفحة المتجر فوراً للعملاء.
- **تنبيهات نفاذ المخزون:** فلاتر ذكية لعرض القطع المنخفضة (Low Stock) أو التي نفدت بالكامل (Sold Out).

### 🏷️ 2. إدارة كتالوج المنتجات (Products Management)
- **إضافة وتعديل المنتجات (Full CRUD):**
  - اسم المنتج، والوصف، والرابط الدائم (Slug).
  - تحديد السعر الأساسي ونسبة الخصم وتفعيل/تعطيل العروض الترويجية.
  - إضافة الألوان مع Color Picker وHex Codes مخصصة.
  - ترتيب المقاسات حسب العرض (S, M, L, Free Size...).
  - رفع وإدارة صور متعددة للمنتج بدقة عالية مع حفظها في Supabase Storage.
- **تفعيل أو إخفاء المنتج بنقرة واحدة:** زر سريع لتعطيل المنتج أو إظهاره في المتجر فوراً.
- **حذف آمن:** حماية متقدمة عند حذف المنتجات لمنع تلف بيانات الطلبات القديمة.

### 📋 3. إدارة ومتابعة الطلبات (Orders & Shipping Proof Verification)
- **جدول طلبات تفاعلي وسريع:** تصفية الطلبات حسب الحالة (معلق، مؤكد، قيد التجهيز، تم الشحن، تم التوصيل، ملغي).
- **شارة فورية لإيصال التحويل (`📸 إيصال مرفق`):** توضح للمشرف فوراً أن هذا الأوردر تم تحويل مصاريف شحنه وإرفاق إثباته.
- **فحص بيانات التحويل مسبقاً:**
  - عرض **رقم الهاتف / الحساب المحول منه** لمطابقة عملية الدفع بسهولة من محفظتك.
  - زر مباشر: **"عرض صورة الإيصال 📸"** لفتح صورة السكرين شوت والتأكد منها بدقة.
  - حساب المتبقي كاش عند الاستلام (COD) تلقائياً بعد خصم الشحن المحول.
- **تحديث حالة الطلب والدفع:** تعديل حالة الأوردر وسجل التحصيل بضغطة واحدة.

### ⚙️ 4. إعدادات المتجر والشحن والسوشيال (Store Settings)
- **بيانات المتجر والهوية:** اسم المتجر، العملة، وشعار البراند.
- **وسائل التواصل:** تعديل رابط **Instagram** ورابط **TikTok** وفيسبوك.
- **الواتساب والدفع:** رقم الواتساب الخاص بالزر العائم في الموقع والذي يظهر للعملاء لتحويل الشحن.
- **شريط الإعلانات:** تفعيل أو تعديل نص الشريط الإعلاني أعلى الموقع في ثوانٍ.
- **قواعد الشحن المجاني:** تحديد الحد الأدنى لقيمة الأوردر أو عدد القطع المطلوبة للحصول على شحن مجاني.

### 📱 5. تصميم متجاوب للهواتف (Mobile-Friendly Dashboard)
- واجهة كاملة متوافقة مع شاشات الموبايل والتابلت عبر قائمة جانبية منزلقة (Slide-Over Drawer).
- جداول أفقية سلسة التمرير لعرض تفاصيل الطلبات والمنتجات بسهولة أثناء التنقل.

---

## 🛠️ التقنيات المستخدمة | Tech Stack

| المجال | التقنية | الاستخدام |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16.4](https://nextjs.org/) (App Router) | بناء صفحات الإدارة وسيرفر أكشنز المعاملات |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | كود قوي ومحمي تماماً من أخطاء الـ Types |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | تصميم إداري أنيق وعملي بنظام الـ CSS Variables |
| **Icons** | [Lucide React](https://lucide.dev/) | أيقونات عصرية وسريعة لواجهات الإدارة |
| **Database & ORM** | [Prisma ORM 7](https://www.prisma.io/) + `@prisma/adapter-pg` | إدارة المعاملات الموزعة مع Pooler SSL |
| **Storage & Auth** | [Supabase](https://supabase.com/) | قاعدة البيانات السحابية واستضافة صور المنتجات والإيصالات |
| **Cross-Revalidation**| Custom Fetch Dispatcher | إرسال إشعارات التحديث الفوري إلى المتجر الحي |

---

## 📁 هيكل مشروع الداشبورد | Project Structure

```text
seen.hijabi dashboard/
├── prisma/
│   └── schema.prisma              # مخطط قاعدة البيانات المشترك مع المتجر
├── public/
│   ├── images/logo.png            # شعار البراند
│   └── favicon.ico                # أيقونة التبويب
├── src/
│   ├── app/
│   │   ├── (dashboard)/admin/
│   │   │   ├── layout.tsx         # تخطيط لوحة التحكم والهيدر المتجاوب
│   │   │   ├── page.tsx           # نظرة عامة وإحصائيات سريعة للطلبات والمبيعات
│   │   │   ├── inventory/page.tsx # إدارة المخزون الفوري والتعديل السريع
│   │   │   ├── orders/page.tsx    # جدول الطلبات وإثباتات تحويل الشحن
│   │   │   ├── products/
│   │   │   │   ├── page.tsx       # قائمة المنتجات والإجراءات السريعة
│   │   │   │   ├── new/page.tsx   # صفحة إضافة منتج جديد
│   │   │   │   └── [id]/page.tsx  # صفحة تعديل المنتج بالكامل
│   │   │   └── settings/page.tsx  # إعدادات المتجر والشحن وروابط السوشيال
│   │   └── auth/login/page.tsx    # بوابة تسجيل دخول الإدارة
│   ├── components/admin/          # مكونات الإدارة (ProductForm, OrdersTable, AdminSidebar...)
│   ├── lib/
│   │   ├── actions/               # Server Actions (products, orders, settings, upload...)
│   │   ├── prisma.ts              # عميل Prisma المشترك مع دعم اتصال الـ SSL
│   │   └── revalidate-store.ts    # دالة إرسال إشعار التحديث الفوري إلى المتجر
│   └── types/                     # واجهات البيانات وأنواع الموديلات
└── package.json
```

---

## ⚙️ إعداد وتشغيل لوحة التحكم محلياً | Local Development

### 1. استنساخ المشروع وتثبيت الحزم:
```bash
git clone https://github.com/Ahmedaminn1/Seen.Hijabi-Dashboard.git
cd Seen.Hijabi-Dashboard
npm install
```

### 2. إعداد المتغيرات البيئية (`.env.local`):
أنشئ ملف `.env.local` في المجلد الرئيسي وضع بداخله:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://<YOUR_PROJECT_ID>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<YOUR_ANON_KEY>"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="<YOUR_PUBLISHABLE_KEY>"
SUPABASE_SERVICE_ROLE_KEY="<YOUR_SERVICE_ROLE_KEY>"
SUPABASE_SECRET_KEY="<YOUR_SECRET_KEY>"
SUPABASE_JWKS_URL="https://<YOUR_PROJECT_ID>.supabase.co/auth/v1/.well-known/jwks.json"

# Database Connection (Supabase Pooler)
DATABASE_URL="postgresql://postgres.<ID>:<PASSWORD>@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.<ID>:<PASSWORD>@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"

# Dashboard & Store URLs
NEXT_PUBLIC_APP_URL="http://localhost:3001"
STORE_URL="http://localhost:3000"
NEXT_PUBLIC_STORE_URL="http://localhost:3000"
REVALIDATION_SECRET="seen_hijabi_secret_2026"
ADMIN_EMAIL="admin@seenhijabi.com"
```

### 3. توليد عميل Prisma:
```bash
npx prisma generate
```

### 4. تشغيل خادم لوحة التحكم (على البورت 3001):
```bash
npm run dev
```
افتح المتصفح على [http://localhost:3001/admin](http://localhost:3001/admin).

---

## 🚀 النشر على Vercel | Production Deployment

1. اربط مستودع GitHub بـ Vercel (`Seen.Hijabi-Dashboard`).
2. في قسم **Environment Variables**، أضف نفس المتغيرات مع ربط رابط المتجر الحي:
   ```env
   STORE_URL=https://seen-hijabi-webiste.vercel.app
   NEXT_PUBLIC_STORE_URL=https://seen-hijabi-webiste.vercel.app
   ```
3. اضغط **Deploy**. سيقوم Vercel ببناء ونشر لوحة التحكم برابط مباشر مثل `https://seen-hijabi-dashboard.vercel.app`.

---

## 📄 License
جميع الحقوق محفوظة لصالح علامة **Seen Hijabi (سين)** &copy; 2026.
