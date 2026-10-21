# תוכנית – M1: הקמת הפרויקט ופריסה אוטומטית (טכני)

מקורות: `MILESTONES.md` (M1), `ARCHITECTURE.md` (סעיפים 1, 2.ו, 2.ט), `DESIGN.md` (מסך ראשי + Style Guide), `wireframes.png`, `mockups.png`, `style-guide.png`.

## 1. מטרה והיקף

שלד עובד של האפליקציה: מסך ראשי סטטי בעברית וב-RTL שנראה כמו ה-Mockup, ומתפרסם אוטומטית ל-Vercel מכל Push ל-`main`.

**בתוך ההיקף:** פרויקט Next.js, Design Tokens, מסך סטטי (Header, שדה נושא, כפתור ללא פעולה), git + GitHub, חיבור Vercel.
**מחוץ להיקף (Milestones הבאים):** `/api/joke`, OpenAI, כרטיסי בדיחה ורשימה (M2), הודעות Notice (M2–M3), שיתוף ואייקונים (M4), Manifest / Service Worker / אייקוני אפליקציה (M5).

## 2. סביבת עבודה (נבדקה)

Node 25.1.0, npm 11.6.4, git 2.55, Python 3.12.10. גרסת Next.js העדכנית ב-16: `16.4.2`. חבילת הגופן `dejavu-fonts-ttf` זמינה בגרסה `2.37.3`.
`fonttools` **אינו מותקן** – יותקן זמנית בסביבה וירטואלית (venv) בתיקיית ה-scratchpad, יחד עם `brotli` (נדרש ל-woff2), ולא ייכנס לפרויקט.

## 3. הקמת הפרויקט

1. יצירת פרויקט Next.js 16 בתיקייה זמנית (ה-scratchpad) עם `create-next-app@16`:
   TypeScript, Tailwind CSS (v4), App Router, ESLint, בלי `src/`, alias ברירת מחדל `@/*`.
   העתקת התוצר לשורש הפרויקט **בלי** לדרוס את `.gitignore`, `CLAUDE.md` ו-`spec/` (create-next-app לא מוכן לרוץ בתיקייה שאינה ריקה).
2. ניקוי ה-Boilerplate: מחיקת קובצי ה-SVG לדוגמה ב-`public/`, תוכן הדף לדוגמה וה-CSS לדוגמה.
3. `package.json`: שם `clickjoke`, סקריפטים `dev`, `build`, `start`, `lint` (כפי שנוצרו), ו-`"engines": { "node": "24.x" }` לפי ARCHITECTURE.md (כך Vercel מריץ Node 24). במחשב מותקנת Node 25, שעובדת עם אותו קוד; אין צורך להתקין גרסה אחרת.
4. `.gitignore`: הקובץ הקיים כבר מכסה את `node_modules/`, `.next/`, `.env*`, `.vercel/`, `*.tsbuildinfo`. להוסיף רק `next-env.d.ts` (קובץ שנוצר אוטומטית). אם create-next-app יוצר `.gitignore` משלו — לא להעתיק אותו; להוסיף לקובץ הקיים רק שורות חסרות (אם יש).
5. **אין `.env` ב-M1:** לאפליקציה עדיין אין משתני סביבה. `.env.example` + `.env` ייווצרו ב-M2 (עם `OPENAI_API_KEY`, `OPENAI_MODEL`).

## 4. מבנה הקבצים

```
app/
  layout.tsx        # <html lang="he" dir="rtl">, font, metadata, viewport
  page.tsx          # Main screen: Header + topic input + primary button + empty list area
  globals.css       # Tailwind import + design tokens (@theme) + dot-grid background
  fonts/
    DejaVuSans.woff2
    DejaVuSans-Bold.woff2
components/
  Header.tsx        # Yellow header with H1 "בדיחה בקליק"
  JokeForm.tsx      # Topic input + "ספר לי בדיחה" button (static in M1, no handler)
public/             # empty for now (icons arrive in M5)
```

## 5. גופן – DejaVu Sans

- מקור: חבילת npm `dejavu-fonts-ttf@2.37.3` (רישיון חופשי של Bitstream Vera / DejaVu). מורידים אותה זמנית, לוקחים את `DejaVuSans.ttf` ו-`DejaVuSans-Bold.ttf`, ולא משאירים אותה כתלות של הפרויקט.
- קובצי ה-TTF המלאים כבדים (כ-700KB כל אחד) – כבד מדי לטעינה במובייל. לכן מבצעים **Subset** חד-פעמי עם `fonttools` (Python, `pyftsubset`, מתוך ה-venv הזמני שבסעיף 2) לטווחי עברית (U+0590–05FF) ולטיני בסיסי + פיסוק (U+0020–007E, U+00A0–00FF, U+2010–2027), בפורמט `woff2`. התוצר נשמר ב-`app/fonts/`. הכלים עצמם אינם נכנסים לפרויקט.
- טעינה ב-`next/font/local` עם שני משקלים (400, 700), `display: "swap"`, כ-CSS variable `--font-dejavu`, ו-fallback ל-`Arial, sans-serif`.
- הוספת קובץ רישיון הגופן (`app/fonts/LICENSE.txt`) מתוך החבילה.

## 6. Design Tokens (`app/globals.css`, Tailwind v4 `@theme`)

| Token | ערך |
|---|---|
| `--color-comic-yellow` | `#FBF801` |
| `--color-ink` | `#37232D` |
| `--color-comic-red` | `#D4283A` |
| `--color-panel-purple` | `#402080` (מוגדר, לא בשימוש) |
| `--color-sky-blue` | `#6FA8DC` |
| `--color-peach` | `#F3DEC5` |
| `--color-desk-tan` | `#C79D6D` (מוגדר, לא בשימוש) |
| `--color-warm-grey` | `#959083` (רכיבים מושבתים) |
| `--color-placeholder-grey` | `#706B60` (טקסט Placeholder) |
| `--color-paper` | `#F5F5F5` |
| `--color-white` | `#FFFFFF` |
| `--radius-sm` / `--radius-md` / `--radius-lg` | 8px / 12px / 20px |
| `--shadow-hard` | `4px 4px 0 0 var(--color-ink)` (ימינה ולמטה, ללא טשטוש) |
| `--font-sans` | `var(--font-dejavu), Arial, sans-serif` |
| טיפוגרפיה | מחלקות/Utilities: H1 32/40 Bold, H2 22/30 Bold, Body 17/26 Regular, Button 18/24 Bold, Caption 14/20 Regular |

- עובי מסגרת קבוע 3px (`border-[3px]`), בצבע Ink.
- **רקע:** `body` ברקע Paper עם רשת נקודות עדינה דרך `radial-gradient`, מרווח כ-20px.
  - ⚠️ **שאלה פתוחה (לפני הבנייה):** DESIGN.md אומר שהנקודות "בגוון בהיר מעט מ-Paper", אבל ב-Mockup הן נראות **כהות** מעט מהרקע (אפור בהיר על רקע בהיר יותר). נקודות בהירות מ-`#F5F5F5` כמעט לא ייראו. ברירת המחדל המוצעת: כמו ב-Mockup – נקודה אפורה עדינה (`#E4E4E4`). ממתין לאישור המשתמש.
- סולם ריווח: ברירת המחדל של Tailwind כבר מכסה 4/8/12/16/24/32. ריווח צדדי 16px.
- עמוד ללא מצב כהה (Dark Mode לא מוגדר ב-DESIGN.md).

## 7. המסך הראשי (סטטי)

לפי DESIGN.md §1 וה-Mockup. ה-Mockup מצויר בתוך מסגרת טלפון – המסגרת עצמה **אינה** חלק מהאפליקציה.

| אזור | מימוש |
|---|---|
| `<html>` | `lang="he"`, `dir="rtl"`, `<title>` "בדיחה בקליק", `viewport` רוחב מכשיר, `themeColor` `#FBF801` |
| Header | `<header>` לכל הרוחב, רקע Comic Yellow, גובה כ-95px, `border-b-[3px]` Ink, `<h1>` "בדיחה בקליק" במרכז בסגנון H1 בצבע Ink |
| עמודת תוכן | `<main>` עם ריווח צדדי 16px. **הנחה:** במחשב העמודה מוגבלת לרוחב מרבי של כ-480px וממורכזת (העיצוב מוגדר למובייל בלבד; ה-Header נשאר לכל הרוחב) |
| שדה נושא | `<input type="text">`, גובה כ-48px, רקע לבן, מסגרת Ink 3px, רדיוס 12px, טקסט 16px, Placeholder "על מה הבדיחה? אפשר להשאיר ריק" ב-Placeholder Grey, יישור לימין, `maxLength={100}`, `aria-label` מתאים. Focus: `outline` Sky Blue בעובי 4px עם `outline-offset` של כ-4px (לפי DESIGN.md) |
| כפתור ראשי | `<button type="button">` ברוחב השדה, גובה כ-48px, רקע Comic Yellow, מסגרת Ink 3px, רדיוס 12px, `shadow-hard`, טקסט "ספר לי בדיחה" בסגנון Button במרכז. ללא פעולה ב-M1 |
| מצבי כפתור (מוכנים מראש, נבדקים ויזואלית) | `active:` מוזז 4px ימינה ולמטה (`translate-x-1 translate-y-1`) ובלי צל; `disabled:` רקע Paper, מסגרת וטקסט Warm Grey, בלי צל |
| רשימת בדיחות | אזור ריק (`<section aria-live="polite">`) מתחת לכפתור, שימולא ב-M2 |
| פריסת גלילה | לפי DESIGN.md: Header, שדה וכפתור באזור קבוע בראש המסך; מתחתיו אזור הרשימה שגולל לבדו (גובה מסך לפי `100dvh`, כדי להתאים לסרגל הכתובת המשתנה בטלפון). כבר ב-M1 בונים את המבנה הזה, גם כשהרשימה ריקה |

מרווחים: כ-24px בין ה-Header לשדה, כ-16–20px בין השדה לכפתור ובין הכפתור לרשימה (נגזר מה-Mockup).

## 8. Git ו-GitHub

1. ה-repo המקומי כבר קיים (Branch `main`) ומחובר ל-`https://github.com/amitaiga/clickAjoke.git`.
2. בדיקה שאין סודות ושאין `.env` בקבצים שיתווספו (`git status` + חיפוש מחרוזות כמו `sk-`, `TOKEN`).
3. **לפי CLAUDE.md – אין commit/push בלי בקשה.** בסיום הבנייה המקומית עוצרים ומבקשים אישור ל-push.

## 9. Vercel (המשתמש מבצע, בהדרכה צעד אחר צעד)

1. כניסה ל-vercel.com עם חשבון GitHub (תוכנית Hobby).
2. Add New → Project → Import של ה-repo. Framework: Next.js (מזוהה אוטומטית). בלי משתני סביבה בשלב זה. Deploy.
3. וידוא: Production Branch = `main` (ברירת מחדל). Preview נוצר אוטומטית לכל Branch אחר / PR.
4. בדיקת פריסה אוטומטית: שינוי קטן (למשל עדכון סימון ב-MILESTONES.md) → push נוסף (באישור) → לוודא שנוצרה פריסה חדשה ב-Vercel בלי פעולה ידנית.

## 10. בדיקות שאני מריץ בעצמי (שלב הבנייה)

1. `npm run lint` ו-`npm run build` עוברים ללא שגיאות.
2. הרצת `npm run dev`, פתיחה בדפדפן המובנה ברוחב 390px וברוחב מחשב:
   - צילום מסך והשוואה ל-Mockup: צבעים, גופן DejaVu Sans (גם בעברית), Header צהוב עם קו תחתון, שדה עם Placeholder, כפתור צהוב עם צל קשיח, רקע נקודות.
   - בדיקת `dir="rtl"` ו-`lang="he"`, יישור לימין, הקלדה מתחילה מימין, הגבלת 100 תווים.
   - בדיקת מצב Focus של השדה ומצב לחוץ של הכפתור.
   - Network: קובצי הגופן נטענים ובגודל סביר (subset).
3. חיפוש סודות בקבצים שנכנסים ל-git.
4. סגירת שרת ה-dev בסיום.

## 11. סדר הבנייה וסימון התקדמות

1. סעיפים 3–7 + בדיקות סעיף 10 (מקומי).
2. עדכון `CLAUDE.md` → "פקודות הרצה": dev = `npm run dev`, בדיקות = `npm run lint && npm run build` (אין בדיקות אוטומטיות).
3. עצירה: הצגת התוצאה המקומית ובקשת אישור ל-push (סעיף 8).
4. לאחר push: הדרכה ל-Vercel (סעיף 9) ובדיקת הכתובת החיה.
5. בדיקת כל ה-Definition of Done → סימון 🟡 ליד M1 ב-MILESTONES.md.

**הערה:** ה-DoD של M1 כולל פריסה, שדורשת push. לפי CLAUDE.md, ה-push נעשה רק באישור מפורש של המשתמש – לכן הבנייה נעצרת אחרי שלב 2 ומבקשת אישור, ורק אחריו ממשיכים לשלבים 4–5.

## 12. Definition of Done – איך כל תנאי ייבדק

| תנאי | בדיקה |
|---|---|
| Push ל-`main` גורם לפריסה אוטומטית מוצלחת | push שני (באישור) יוצר פריסה חדשה ב-Vercel בסטטוס Ready, בלי לחיצה ידנית |
| המסך נפתח בטלפון ובמחשב, עברית ו-RTL, תואם Mockup | אני – בדפדפן המובנה ב-390px ובמחשב; המשתמש – בטלפון שלו בכתובת Vercel |
| אין סודות ב-Repository | חיפוש בקבצים שב-git; אין `.env` ב-repo |

## 13. החלטות והנחות לתיעוד

- **ADR-2 (יתווסף ל-ARCHITECTURE.md בבנייה):** הגופן DejaVu Sans מתארח בתוך הפרויקט כ-subset בפורמט woff2 (עברית + לטינית) דרך `next/font/local`, כי אינו זמין ב-Google Fonts והקובץ המלא כבד מדי למובייל.
- **הנחה:** רוחב מרבי של כ-480px לעמודת התוכן במחשב (העיצוב מוגדר למובייל בלבד).