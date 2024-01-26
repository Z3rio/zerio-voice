/* eslint sort-keys: error */
import { useRouter } from 'next/router'
import type { DocsThemeConfig } from 'nextra-theme-docs'
import { LocaleSwitch, useConfig } from 'nextra-theme-docs'
import type { ComponentProps, ReactElement } from 'react'

const ZVLogo = (props: ComponentProps<'svg'>): ReactElement => (
  <svg fill="#fff" viewBox="0 0 29 29" {...props}>
    <path d="M12.5 7.5a.5.5 0 00-.5.5v13a.5.5 0 001 0V8a.5.5 0 00-.5-.5zM8.5 9.5a.5.5 0 00-.5.5v9a.5.5 0 001 0v-9a.5.5 0 00-.5-.5zM4.5 12a.5.5 0 00-.5.5v4a.5.5 0 001 0v-4a.5.5 0 00-.5-.5zM2.5 13a.5.5 0 00-.5.5v2a.5.5 0 001 0v-2a.5.5 0 00-.5-.5zM16.5 11.5a.5.5 0 00-.5.5v5a.5.5 0 001 0v-5a.5.5 0 00-.5-.5zM14.5 10a.5.5 0 00-.5.5v8a.5.5 0 001 0v-8a.5.5 0 00-.5-.5zM10.5 6a.5.5 0 00-.5.5v16a.5.5 0 001 0v-16a.5.5 0 00-.5-.5zM6.5 11.5a.5.5 0 00-.5.5v5a.5.5 0 001 0v-5a.5.5 0 00-.5-.5zM18.5 10a.5.5 0 00-.5.5v8a.5.5 0 001 0v-8a.5.5 0 00-.5-.5zM20.5 9a.5.5 0 00-.5.5v10a.5.5 0 001 0v-10a.5.5 0 00-.5-.5zM24.5 12a.5.5 0 00-.5.5v4a.5.5 0 001 0v-4a.5.5 0 00-.5-.5zM22.5 10.5a.5.5 0 00-.5.5v7a.5.5 0 001 0v-7a.5.5 0 00-.5-.5zM26.5 13a.5.5 0 00-.5.5v2a.5.5 0 001 0v-2a.5.5 0 00-.5-.5z" />
  </svg>
)

const EDIT_TEXT = {
  'en-US': 'Edit this page on GitHub →'
}

const FOOTER_LINK = {
  'en-US': 'https://vercel.com/?utm_source=swr'
}

const FOOTER_LINK_TEXT = {
  'en-US': <>© 2021-2024 Zerio-AB. All rights reserved.</>
}

const config: DocsThemeConfig = {
  darkMode: true,
  docsRepositoryBase: 'https://github.com/Z3rio/zerio-voice/blob/apps/docs',
  editLink: {
    text: function useText() {
      const { locale } = useRouter()
      return EDIT_TEXT[locale]
    }
  },
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback',
    useLink: () => 'https://github.com/Z3rio/zerio-voice/discussions'
  },
  footer: {
    text: function useText() {
      const { locale } = useRouter()
      return (
        <a
          rel="noreferrer"
          target="_blank"
          className="flex items-center gap-2 font-semibold"
          href={FOOTER_LINK[locale]}
        >
          {FOOTER_LINK_TEXT[locale]}
        </a>
      )
    }
  },
  head: function useHead() {
    const config = useConfig<{ description?: string; image?: string }>()
    const description =
      config.frontMatter.description ||
      'SWR is a React Hooks library for data fetching. SWR first returns the data from cache (stale), then sends the fetch request (revalidate), and finally comes with the up-to-date data again.'
    const image =
      config.frontMatter.image ||
      'https://assets.vercel.com/image/upload/v1572282926/swr/twitter-card.jpg'
    return (
      <>
        {/* Favicons, meta */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="description" content={description} />
        <meta name="og:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:image" content={image} />
        <meta name="og:title" content={`${config.title} – SWR`} />
        <meta name="og:image" content={image} />
        <meta name="apple-mobile-web-app-title" content="SWR" />
      </>
    )
  },
  i18n: [{ locale: 'en-US', text: 'English' }],
  logo: function Logo() {
    return (
      <>
        <ZVLogo className="h-10" />
        <span className="hidden select-none font-extrabold ltr:ml-2 rtl:mr-2 md:inline">
          Zerio-Voice
        </span>
      </>
    )
  },
  navbar: {
    extraContent: LocaleSwitch
  },
  nextThemes: {
    defaultTheme: 'dark'
  },
  project: {
    link: 'https://github.com/Z3rio/zerio-voice'
  },
  sidebar: {
    autoCollapse: true,
    defaultMenuCollapseLevel: 1,
    titleComponent: ({ title, type }) =>
      type === 'separator' ? (
        <div className="flex items-center gap-2">
          <ZVLogo className="h-1.5 shrink-0" />
          {title}
        </div>
      ) : (
        <>{title}</>
      ),
    toggleButton: true
  },
  toc: {
    backToTop: true,
    float: true,
    headingComponent: function Heading({ id, children }) {
      return (
        <>
          {children}
          {id === 'installation' && ' 💿'}
        </>
      )
    }
  },
  useNextSeoProps() {
    return {
      titleTemplate: `%s`
    }
  }
}

export default config
