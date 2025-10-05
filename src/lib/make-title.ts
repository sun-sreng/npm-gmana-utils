// ============================================================================
// TYPES
// ============================================================================
export type TextTemplate = string | ((value: string, site: string) => string)

export interface TemplateParams {
  disableSuffix?: boolean
  template?: TextTemplate
}

// ============================================================================
// HELPERS
// ============================================================================
function applyTemplate(value: string, site: string, template?: TextTemplate): string {
  if (!template) {
    // Default: append site name if not already present
    return value.toLowerCase().includes(site.toLowerCase()) ? value : `${value} | ${site}`
  }

  if (typeof template === "function") {
    return template(value, site)
  }

  if (template.includes("%s")) {
    return template.replace("%s", value)
  }

  // fallback: append site if no placeholder
  return value.toLowerCase().includes(site.toLowerCase()) ? value : `${value} | ${site}`
}

/**
 * Makes a SEO text based on a template
 * @param base - The base text to apply the template to
 * @param site - The site name to append to the base text
 * @param params - The parameters to apply the template to
 * @returns
 * @example
 * ```ts
 * const siteName = "Linkiri"
 *
 * // Title with a custom string template
 * const pageTitle = makeTitle("Jobs in Tech", siteName, {
 *   template: "%s - Powered by Linkiri"
 * })
 * // -> "Jobs in Tech - Powered by Linkiri"
 *
 * // Title with a function template
 * const fancyTitle = makeTitle("Developers", siteName, {
 *   template: (title, site) => `${title.toUpperCase()} 👨‍💻 | ${site}`
 * })
 * // -> "DEVELOPERS 👨‍💻 | Linkiri"
 *
 * // Title with no template (defaults to `base | site`)
 * const defaultTitle = makeTitle("Careers", siteName, {})
 * // -> "Careers | Linkiri"
 *
 * // Description example (reuses the same engine)
 * const description = makeTitle("Find your dream job fast.", siteName, {
 *   template: "%s 🚀"
 * })
 * // -> "Find your dream job fast. 🚀"
 *
 * // OG title example with suffix disabled
 * const ogTitle = makeTitle("Linkiri OG Preview", siteName, {
 *   disableSuffix: true
 * })
 * // -> "Linkiri OG Preview"
 * ```
 */
export function makeTitle(base: string, site: string, params: TemplateParams): string {
  if (params.disableSuffix) return base
  return applyTemplate(base, site, params.template)
}
