import getUnicodeFlagIcon from 'country-flag-icons/unicode'

const flags = {
  GB: '🇬🇧',
  DE: '🇩🇪',
} as const

type CountryCode = keyof typeof flags

export function getFlagSvg(countryCode: CountryCode): string {
  return getUnicodeFlagIcon(countryCode)
}
