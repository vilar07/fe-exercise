'use client';
import { ChangeEvent, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const locale = useLocale();

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      const currentPath = window.location.pathname.split('/').slice(2).join('/'); // Preserve path after locale
      router.replace(`/${nextLocale}/${currentPath}`);
    });
  };

  return (
    <label className="border-2 border-gray-200 rounded-xl text-black z-30">
      <p className="sr-only">Change Language</p>
      <select
        defaultValue={locale}
        className="bg-transparent py-2 px-2 text-black flex items-center"
        onChange={onSelectChange}
        disabled={isPending}
      >
        <option value="en" className="text-black flex items-center justify-center">
          🇬🇧 En
        </option>
        <option value="pt" className="text-black flex items-center justify-center">
          🇵🇹 Pt
        </option>
      </select>
    </label>
  );
}