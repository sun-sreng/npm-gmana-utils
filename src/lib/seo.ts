import { compactText } from "./compact-text"
import { toIso } from "./to-iso"

export type MetaTag = Partial<HTMLElementTagNameMap["meta"]> & {
  [key: string]: string | undefined
}

export type StringNumber = `${number}`

export type OgType =
  | "website"
  | "article"
  | "book"
  | "profile"
  | "music.song"
  | "music.album"
  | "video.movie"
  | "video.episode"

export type TwitterCard = "summary" | "summary_large_image" | "app" | "player"

export interface SeoImage {
  url: string
  alt?: string
  width?: number
  height?: number
  type?: string // MIME type
  secureUrl?: string
}

type ViewportWidthHeightValues = StringNumber | "device-width" | "device-height"

interface Viewport {
  width?: ViewportWidthHeightValues
  height?: ViewportWidthHeightValues
  "initial-scale"?: StringNumber
  "minimum-scale"?: StringNumber
  "maximum-scale"?: StringNumber
  "user-scalable"?: "yes" | "no" | "1" | "0"
  "viewport-fit"?: "auto" | "contain" | "cover"
  [key: string]: string | number | undefined
}

export interface SeoParams {
  // Core metadata
  title: string
  description?: string
  keywords?: string | string[]
  canonical?: string

  // Site configuration
  siteName?: string
  locale?: string
  type?: OgType

  // Indexing
  robots?: string
  noindex?: boolean
  nofollow?: boolean

  // Images
  images?: Array<SeoImage | string>

  // Article-specific
  publishedTime?: Date | string
  modifiedTime?: Date | string
  author?: string
  section?: string
  tags?: string[]

  // Twitter
  twitter?: {
    site?: string
    creator?: string
    card?: TwitterCard
  }

  // Advanced options
  viewport?: Viewport | string
  charSet?: string
  themeColor?: string
  descriptionMaxLength?: number
  disableTitleSuffix?: boolean
  titleTemplate?: string | ((base: string, site: string) => string)

  // Verification
  verification?: {
    google?: string
    yandex?: string
    bing?: string
  }

  // JSON-LD structured data
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

export interface SeoConfig {
  siteName: string
  siteUrl?: string
  locale?: string
  twitterSite?: string
  twitterCreator?: string
  titleTemplate?: string | ((base: string, site: string) => string)
  defaultRobots?: string
  defaultImage?: SeoImage | string
  descriptionMaxLength?: number
  themeColor?: string
  verification?: {
    google?: string
    yandex?: string
    bing?: string
  }
}

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: SeoConfig = {
  siteName: "My Site",
  locale: "en_US",
  titleTemplate: "%s",
  defaultRobots: "index,follow",
  descriptionMaxLength: 160,
}

let GLOBAL_CONFIG: SeoConfig = { ...DEFAULT_CONFIG }

/**
 * Configure global SEO defaults for your entire application
 * Call this once in your app entry point or root layout
 *
 * @example
 * configureSeo({
 *   siteName: "Site Name",
 *   siteUrl: "https://site.com",
 *   twitterSite: "@twitter_site_name",
 *   twitterCreator: "@twitter_creator",
 *   titleTemplate: "%s - Site Name",
 *   defaultImage: "https://site.com/og-default.jpg"
 * })
 */
export function configureSeo(config: Partial<SeoConfig>): void {
  GLOBAL_CONFIG = { ...GLOBAL_CONFIG, ...config }
}

/**
 * Get current global SEO configuration
 */
export function getSeoConfig(): SeoConfig {
  return { ...GLOBAL_CONFIG }
}

/**
 * Normalize image input to SeoImage object
 */
function normalizeImage(image: SeoImage | string): SeoImage {
  return typeof image === "string" ? { url: image } : image
}

/**
 * Generate final title with site name suffix
 */
function makeTitle(baseTitle: string, siteName: string, params: SeoParams): string {
  if (params.disableTitleSuffix) return baseTitle

  const template = params.titleTemplate ?? GLOBAL_CONFIG.titleTemplate

  // Function template
  if (typeof template === "function") {
    return template(baseTitle, siteName)
  }

  // String template with %s placeholder
  if (template && template.includes("%s")) {
    return template.replace("%s", baseTitle)
  }

  // Avoid duplicate site name
  if (baseTitle.toLowerCase().includes(siteName.toLowerCase())) {
    return baseTitle
  }

  // Default separator
  return `${baseTitle} | ${siteName}`
}

/**
 * Determine robots meta content
 */
function getRobots(params: SeoParams): string {
  if (params.robots) return params.robots

  const parts: string[] = []

  if (params.noindex) {
    parts.push("noindex")
  } else {
    parts.push("index")
  }

  if (params.nofollow) {
    parts.push("nofollow")
  } else {
    parts.push("follow")
  }

  return parts.length === 0 ? GLOBAL_CONFIG.defaultRobots || "index,follow" : parts.join(",")
}

// ============================================================================
// MAIN SEO FUNCTION
// ============================================================================

/**
 * Generate SEO meta tags from parameters
 *
 * @example
 * // Basic usage
 * export const meta = () => seo({
 *   title: "About Us",
 *   description: "Learn about our company"
 * })
 *
 * @example
 * // Article with full metadata
 * export const meta = ({ data }) => seo({
 *   title: data.post.title,
 *   description: data.post.excerpt,
 *   type: "article",
 *   images: [data.post.coverImage],
 *   publishedTime: data.post.publishedAt,
 *   author: data.post.author.name,
 *   tags: data.post.tags
 * })
 */
export function seo(params: SeoParams): MetaTag[] {
  const meta: MetaTag[] = []

  // Helper to add meta tags
  const addMeta = (tag: MetaTag): void => {
    meta.push(tag)
  }

  const addMetaIfValue = (
    keyType: "name" | "property" | "httpEquiv",
    keyName: string,
    content?: string | number
  ): void => {
    if (content !== undefined && content !== null && String(content).trim() !== "") {
      addMeta({ [keyType]: keyName, content: String(content) })
    }
  }

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  const siteName = params.siteName || GLOBAL_CONFIG.siteName
  const locale = params.locale || GLOBAL_CONFIG.locale || "en_US"
  const siteUrl = GLOBAL_CONFIG.siteUrl
  const descMaxLength = params.descriptionMaxLength ?? GLOBAL_CONFIG.descriptionMaxLength ?? 160

  // ============================================================================
  // PROCESSED VALUES
  // ============================================================================

  const title = makeTitle(params.title, siteName, params)
  const description = compactText(params.description, { maxLength: descMaxLength })
  const keywords = Array.isArray(params.keywords) ? params.keywords.join(", ") : params.keywords
  const robots = getRobots(params)

  const images: SeoImage[] = [
    ...(params.images || []).map(normalizeImage),
    ...(GLOBAL_CONFIG.defaultImage ? [normalizeImage(GLOBAL_CONFIG.defaultImage)] : []),
  ].filter(
    (img, index, arr) =>
      // Deduplicate by URL
      arr.findIndex((i) => i.url === img.url) === index
  )

  const primaryImage = images[0]
  const ogType = params.type || "website"
  const twitterCard = params.twitter?.card || (primaryImage ? "summary_large_image" : "summary")

  const publishedTime = toIso(params.publishedTime)
  const modifiedTime = toIso(params.modifiedTime)

  const twitterSite = params.twitter?.site || GLOBAL_CONFIG.twitterSite
  const twitterCreator = params.twitter?.creator || GLOBAL_CONFIG.twitterCreator

  // ============================================================================
  // CHARACTER SET & VIEWPORT
  // ============================================================================

  if (params.charSet) {
    addMeta({ charSet: params.charSet })
  }

  addMeta({ name: "" })

  if (params.viewport) {
    const viewportContent =
      typeof params.viewport === "string"
        ? params.viewport
        : Object.entries(params.viewport)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => `${key}=${value}`)
            .join(", ")

    if (viewportContent) {
      addMetaIfValue("name", "viewport", viewportContent)
    }
  }

  // ============================================================================
  // BASIC META TAGS
  // ============================================================================

  addMeta({ title })
  addMetaIfValue("name", "description", description)
  addMetaIfValue("name", "keywords", keywords)
  addMetaIfValue("name", "robots", robots)
  addMetaIfValue("name", "author", params.author)
  addMetaIfValue("name", "theme-color", params.themeColor || GLOBAL_CONFIG.themeColor)

  // Canonical URL
  if (params.canonical) {
    const canonicalUrl = params.canonical.startsWith("http")
      ? params.canonical
      : siteUrl
        ? `${siteUrl.replace(/\/$/, "")}${params.canonical.startsWith("/") ? "" : "/"}${params.canonical}`
        : params.canonical

    addMetaIfValue("name", "canonical", canonicalUrl)
  }

  // ============================================================================
  // VERIFICATION
  // ============================================================================

  const verification = params.verification || GLOBAL_CONFIG.verification
  if (verification) {
    addMetaIfValue("name", "google-site-verification", verification.google)
    addMetaIfValue("name", "yandex-verification", verification.yandex)
    addMetaIfValue("name", "msvalidate.01", verification.bing)
  }

  // ============================================================================
  // OPEN GRAPH
  // ============================================================================

  addMetaIfValue("property", "og:type", ogType)
  addMetaIfValue("property", "og:title", title)
  addMetaIfValue("property", "og:description", description)
  addMetaIfValue("property", "og:site_name", siteName)
  addMetaIfValue("property", "og:locale", locale)

  // OG URL
  if (params.canonical && siteUrl) {
    const ogUrl = params.canonical.startsWith("http")
      ? params.canonical
      : `${siteUrl.replace(/\/$/, "")}${params.canonical.startsWith("/") ? "" : "/"}${params.canonical}`
    addMetaIfValue("property", "og:url", ogUrl)
  }

  // OG Images
  images.forEach((image) => {
    addMetaIfValue("property", "og:image", image.url)
    addMetaIfValue("property", "og:image:secure_url", image.secureUrl)
    addMetaIfValue("property", "og:image:alt", image.alt)
    addMetaIfValue("property", "og:image:type", image.type)
    addMetaIfValue("property", "og:image:width", image.width)
    addMetaIfValue("property", "og:image:height", image.height)
  })

  // Article-specific OG tags
  if (ogType === "article") {
    addMetaIfValue("property", "article:published_time", publishedTime)
    addMetaIfValue("property", "article:modified_time", modifiedTime)
    addMetaIfValue("property", "article:author", params.author)
    addMetaIfValue("property", "article:section", params.section)

    if (params.tags) {
      params.tags.forEach((tag) => {
        addMetaIfValue("property", "article:tag", tag)
      })
    }
  }

  // ============================================================================
  // TWITTER CARD
  // ============================================================================

  addMetaIfValue("name", "twitter:card", twitterCard)
  addMetaIfValue("name", "twitter:title", title)
  addMetaIfValue("name", "twitter:description", description)
  addMetaIfValue("name", "twitter:site", twitterSite)
  addMetaIfValue("name", "twitter:creator", twitterCreator)

  // Twitter image (only first image)
  if (primaryImage) {
    addMetaIfValue("name", "twitter:image", primaryImage.url)
    addMetaIfValue("name", "twitter:image:alt", primaryImage.alt)
  }

  return meta
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Create SEO metadata for a basic page
 */
export function createPageSeo(title: string, description?: string, overrides?: Partial<SeoParams>): MetaTag[] {
  return seo({
    title,
    description,
    ...overrides,
  })
}

/**
 * Create SEO metadata for an article/blog post
 */
export function createArticleSeo(params: {
  title: string
  description?: string
  author?: string
  publishedTime: Date | string
  modifiedTime?: Date | string
  image?: SeoImage | string
  tags?: string[]
  section?: string
  canonical?: string
}): MetaTag[] {
  return seo({
    ...params,
    type: "article",
    images: params.image ? [params.image] : undefined,
  })
}

/**
 * Create SEO metadata for a profile page
 */
export function createProfileSeo(params: {
  title: string
  description?: string
  username?: string
  image?: SeoImage | string
  canonical?: string
}): MetaTag[] {
  return seo({
    ...params,
    type: "profile",
    images: params.image ? [params.image] : undefined,
    twitter: {
      card: params.image ? "summary" : "summary",
      creator: params.username,
    },
  })
}

/**
 * Merge multiple SEO param objects (useful for layouts + pages)
 */
export function mergeSeoParams(...params: Partial<SeoParams>[]): SeoParams {
  const merged: SeoParams = { title: "" }

  for (const param of params) {
    Object.assign(merged, param)

    // Merge arrays
    if (param.images) {
      merged.images = [...(merged.images || []), ...param.images]
    }
    if (param.tags) {
      merged.tags = [...(merged.tags || []), ...param.tags]
    }
    if (param.keywords && typeof param.keywords !== "string") {
      const existing = merged.keywords
      merged.keywords = [...(Array.isArray(existing) ? existing : existing ? [existing] : []), ...param.keywords]
    }
  }

  return merged
}
