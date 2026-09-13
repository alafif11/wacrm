import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

const SUPPORTED_LOCALES = ['ar', 'en', 'ko'] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];
const DEFAULT_LOCALE: Locale = 'ar';

export default getRequestConfig(async () => {
  // 1. فحص ملفات تعريف الارتباط (Cookie) في حال تم تغيير اللغة من الواجهة
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined;

  // 2. فحص متغير البيئة إن وجد
  const envLocale = process.env.NEXT_PUBLIC_APP_LOCALE as Locale | undefined;

  // 3. تحديد اللغة المستهدفة (الأولوية للـ Cookie ثم المتغير ثم الافتراضية 'ar')
  let targetLocale: Locale = DEFAULT_LOCALE;

  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    targetLocale = cookieLocale;
  } else if (envLocale && SUPPORTED_LOCALES.includes(envLocale)) {
    targetLocale = envLocale;
  }

  let messages;
  try {
    // محاولة جلب ملف اللغة المطلوبة (مثل ar.json)
    messages = (await import(`../../messages/${targetLocale}.json`)).default;
  } catch (error) {
    // Fallback: الرجوع إلى العربية أولاً ثم الإنجليزية في حال حدوث أي خطأ
    try {
      messages = (await import(`../../messages/ar.json`)).default;
      targetLocale = 'ar';
    } catch {
      messages = (await import(`../../messages/en.json`)).default;
      targetLocale = 'en';
    }
  }

  return {
    locale: targetLocale,
    messages
  };
});