module.exports = {
  service: 'languageService',
  where: 'name',
  results: [
    {
      name: 'English',
      prefix: 'en',
      native_name: 'English',
      is_active: true,
      is_default: true,
    },
    {
      name: 'French',
      prefix: 'fr',
      native_name: 'Français',
      is_active: false,
      is_default: false,
    },
    {
      name: 'Turkish',
      prefix: 'tr',
      native_name: 'Türkçe',
      is_active: false,
      is_default: false,
    },
    {
      name: 'Turkish2',
      prefix: 'tr2',
      native_name: 'Türkçe2',
      is_active: false,
      is_default: false,
    },
  ],
};
