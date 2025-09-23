import {
  ButtonLocation,
  NotificationType,
  setStateToUrl,
  VcsPlugin,
  VcsUiApp,
  WindowSlot,
} from '@vcmap/ui';
import FallbackCreateLink from './fallbackCreateLink.vue';
import { name, version, mapVersion } from '../package.json';

type PluginConfig = {
  pathToUrlShortenerApi: string;
};

const fallBackWindowId = 'create-link-fallback-window';
function createFallbackWindow(app: VcsUiApp, link: string): void {
  app.windowManager.remove(fallBackWindowId);
  app.windowManager.add(
    {
      id: fallBackWindowId,
      component: FallbackCreateLink,
      slot: WindowSlot.DYNAMIC_RIGHT,
      state: {
        headerTitle: 'createLink.windowTitle',
        headerIcon: 'mdi-share-variant',
      },
      props: {
        link,
      },
    },
    name,
  );
}

export default function createLink(
  config: PluginConfig,
): VcsPlugin<PluginConfig, never> {
  return {
    get name(): string {
      return name;
    },
    get version(): string {
      return version;
    },
    get mapVersion(): string {
      return mapVersion;
    },
    i18n: {
      de: {
        createLink: {
          title: 'Link kopieren',
          windowTitle: 'Anwendungslink',
          createLink: 'Link erstellen',
          copyToClipboard: 'Anwendungslinks in Zwischenablage kopieren',
          refreshTooltip: 'Anwendungslinks aktualisieren',
          copied: 'Der Anwendungslink in wurde in die Zwischenablage kopiert.',
        },
      },
      en: {
        createLink: {
          title: 'Copy link',
          windowTitle: 'Application link',
          createLink: 'Create link',
          copyToClipboard: 'Copy application link to clipboard',
          refreshTooltip: 'Refresh application link',
          copied: 'Application link copied to clipboard.',
        },
      },
      fr: {
        createLink: {
          title: 'Copier le lien',
          windowTitle: 'Lien',
          createLink: 'Générer le lien',
          copyToClipboard: 'Copier le lien dans le presse-papiers',
          refreshTooltip: 'Rafraîchir le lien',
          copied: 'Le lien a bien été copié dans le presse-papiers.',
        },
      },
      lb: {
        createLink: {
          title: 'Link kopéieren',
          windowTitle: 'Applicatiouns-Link',
          createLink: 'Link erstellen',
          copyToClipboard: "Applicatiouns-Link an d'Zëschenaplag kopéieren",
          refreshTooltip: 'Applicatiouns-Link aktualiséieren',
          copied: "Applicatiouns-Link gouf an d'Zëschenaplag kopéiert.",
        },
      },
    },
    initialize(app: VcsUiApp): Promise<void> {
      const actionName = navigator.clipboard
        ? 'createLink.title'
        : 'createLink.createLink';
      const title = navigator.clipboard ? 'createLink.copyToClipboard' : '';

      app.navbarManager.add(
        {
          action: {
            name: actionName,
            title,
            icon: 'mdi-share-variant',
            async callback(): Promise<void> {
              const state = await app.getState(true);
              const url = new URL(window.location.href);
              setStateToUrl(state, url);

              const data = new URLSearchParams();
              data.set('url', url.toString());

              const response = await fetch(config.pathToUrlShortenerApi, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: data.toString(),
              });

              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur ${response.status}: ${errorText}`);
              }

              const dataResponse = await response.json();
              const shortUrl = dataResponse.short_url;

              if (navigator.clipboard) {
                await navigator.clipboard.writeText(shortUrl);
                app.notifier.add({
                  title: 'createLink.title',
                  message: 'createLink.copied',
                  type: NotificationType.SUCCESS,
                });
              } else {
                createFallbackWindow(app, shortUrl);
              }
            },
          },
        },
        name,
        ButtonLocation.SHARE,
        { desktop: true, tablet: true, mobile: true },
      );

      return Promise.resolve();
    },
    getDefaultOptions(): PluginConfig {
      return {
        pathToUrlShortenerApi: config.pathToUrlShortenerApi,
      };
    },
    toJSON(): PluginConfig {
      return {
        pathToUrlShortenerApi: config.pathToUrlShortenerApi,
      };
    },
  };
}
