import 'server-only';

const dictionaries = {
  id: () => import('@/dictionaries/id.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: Locale) => {
  if (!dictionaries[locale]) {
    return dictionaries.id();
  }
  return dictionaries[locale]();
};
