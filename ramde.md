Ushbu qo'llanma MilliMart loyihasini yangi Windows kompyuterda PostgreSQL bazasi bilan birga sozlash va ishga tushirish qadamlarini o'z ichiga oladi.

🛠 1-bosqich: Zaruriy dasturlarni o'rnatish
Loyihani yurgizishdan oldin quyidagi dasturlar o'rnatilgan bo'lishi shart:

Node.js (v18+): nodejs.org saytidan yuklab oling.

PostgreSQL (v14+): postgresql.org saytidan yuklab oling.

Eslatma: O'rnatish paytida o'zingiz qo'ygan parolni (masalan: 0404) eslab qoling.

DBeaver (Ixtiyoriy): Bazani vizual ko'rish va boshqarish uchun qulay.

🗄 2-bosqich: Ma'lumotlar bazasini tayyorlash
DBeaver-ni oching va PostgreSQL-ga ulaning.

Yangi ma'lumotlar bazasini yarating. Nomi: millimart

Loyihaning server/ papkasiga kiring va u yerdagi .env faylini matn muharririda oching.

Quyidagi qatorlarni yangi kompyuterga moslab o'zgartiring:

Фрагмент кода
DB_USER=postgres
DB_PASSWORD=sizning_postgre_parolingiz
DB_NAME=millimart
DB_HOST=localhost
DB_PORT=5432
📦 3-bosqich: Kutubxonalarni o'rnatish
Terminalni (CMD yoki PowerShell) ochib, loyiha turgan asosiy papkaga kiring va quyidagi buyruqlarni ketma-ket bajaring:

Bash
# 1. Asosiy papkada kutubxonalarni o'rnatish
npm install

# 2. Server papkasiga o'tib, u yerdagi kutubxonalarni o'rnatish
cd server
npm install
cd ..
🚀 4-bosqich: Loyihani ishga tushirish
Loyihaning asosiy papkasida (root) turib, terminalda quyidagi buyruqni bosing:

Bash
npm run dev
Nima sodir bo'ladi?

concurrently yordamida ham Backend (Port: 5000), ham Frontend (Port: 5173) bir vaqtda yonadi.

Server ishga tushganda bazada jadvallar (users, products, reviews) yo'qligini ko'radi va ularni avtomatik yaratadi.

Boshlang'ich mahsulotlar va Admin foydalanuvchisi bazaga avtomatik qo'shiladi.

🔑 5-bosqich: Tizimga kirish (Admin)
Loyiha yongandan keyin brauzerda http://localhost:5173 manziliga kiring.
Admin panelga kirish uchun:

Telefon: 998901112233

Parol: admin123 (Yoki .env faylida nima yozilgan bo'lsa)

🖼 6-bosqich: Mediapark uslubidagi Bannerlar
Bosh sahifadagi slayderda rasmlar chiroyli chiqishi uchun:

public/hero/ papkasini yarating.

U yerga slide1.png, slide2.png, slide3.png nomli rasmlarni yuklang.