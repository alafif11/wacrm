'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLocaleChange = (locale: string) => {
    // 1. حفظ خيار اللغة في ملفات تعريف الارتباط لمدة سنة كاملة
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // 2. تحديث الصفحة فوراً لتطبيق اللغة الجديدة
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-1 rounded-md border border-border bg-card p-1 text-xs text-foreground">
      <button
        type="button"
        onClick={() => handleLocaleChange('ar')}
        disabled={isPending}
        className="rounded px-2 py-1 font-medium transition-colors hover:bg-muted focus:outline-none"
      >
        العربية
      </button>
      <span className="text-muted-foreground">|</span>
      <button
        type="button"
        onClick={() => handleLocaleChange('en')}
        disabled={isPending}
        className="rounded px-2 py-1 font-medium transition-colors hover:bg-muted focus:outline-none"
      >
        English
      </button>
    </div>
  );
}