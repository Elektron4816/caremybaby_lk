import {
  Callbacks,
  Language,
  Options,
  StoryItem,
  Templates,
  TimelineItem,
  ZuckObject
} from './types';
import { safeNum, timeAgo } from './utils';

export const optionsDefault = (option?: ZuckObject['option']): Options => ({
  rtl: false, // enable/disable RTL
  skin: 'snapgram', // container class
  avatars: true, // shows user photo instead of last story item preview
  stories: [], // array of story data
  backButton: true, // adds a back button to close the story viewer
  backNative: false, // uses window history to enable back button on browsers/android
  paginationArrows: false, // add pagination arrows
  previousTap: true, // use 1/3 of the screen to navigate to previous item when tap the story
  autoFullScreen: false, // enables fullscreen on mobile browsers
  openEffect: true, // enables effect when opening story
  cubeEffect: false, // enables the 3d cube effect when sliding story
  list: false, // displays a timeline instead of carousel
  localStorage: true, // set true to save "seen" position. Element must have a id to save properly.
  callbacks: {
    onOpen: function (storyId, callback) {
      // on open story viewer
      callback();
    },
    onView: function (storyId, callback) {
      // on view story
      callback?.();
    },
    onEnd: function (storyId, callback) {
      // on end story
      callback();
    },
    onClose: function (storyId, callback) {
      // on close story viewer
      callback();
    },
    onNextItem: function (storyId, nextStoryId, callback) {
      // on navigate item of story
      callback();
    },
    onNavigateItem: function (storyId, nextStoryId, callback) {
      // use to update state on your reactive framework
      callback();
    },
    onDataUpdate: function (data, callback) {
      // use to update state on your reactive framework
      callback();
    }
  },
  template: {
    timelineItem(itemData: TimelineItem) {
      let name = "";
      if (itemData['name'] !== undefined) {
        name = itemData['name'];
      }
      return `
        <div class="story ${itemData['seen'] === true ? 'seen' : ''}" data-grand-id="${itemData['clientId']}">
          <a class="item-link" ${
            itemData['link'] ? `href="${itemData['link'] || ''}"` : ''
          }>
            <span class="item-preview">
              <div lazy="eager" class="div-image" style="background-image: url(${
                option('avatars') || !itemData['currentPreview']
                  ? itemData['photo']
                  : itemData['currentPreview']
              })">
              <strong class="name tooltip" itemProp="name">${name}</strong>
              </div>
            </span>
          </a>

          <ul class="items"></ul>
        </div>`;
    },

    timelineStoryItem(itemData: StoryItem) {
      const reserved = [
        'id',
        'seen',
        'src',
        'link',
        'linkText',
        'loop',
        'time',
        'type',
        'length',
        'preview'
      ];

      let attributes = ``;

      for (const dataKey in itemData) {
        if (reserved.indexOf(dataKey) === -1) {
          if (itemData[dataKey] !== undefined && itemData[dataKey] !== false) {
            attributes += ` data-${dataKey}="${itemData[dataKey]}"`;
          }
        }
      }

      reserved.forEach((dataKey) => {
        if (itemData[dataKey] !== undefined && itemData[dataKey] !== false) {
          attributes += ` data-${dataKey}="${itemData[dataKey]}"`;
        }
      });

      return `<a href="${itemData['src']}" ${attributes}>
                <img loading="auto" src="${itemData['preview']}" />
              </a>`;
    },

    viewerItem(storyData: StoryItem, currentStoryItem: StoryItem) {
      return `<div class="story-viewer">
                <div class="head">
                  <div class="slides-pointers">
                    <div class="wrap"></div>
                  </div>
                  <div class="head-direction">
                    <div class="left">
                      ${
                        option('backButton') ? '<a class="back">&lsaquo;</a>' : ''
                      }
                      <div class="info">
                        <p class="name">${storyData['name']}</p>
                      </div>
                    </div>
                    <div class="right">
                      <span class="loading"></span>
                      <a class="close close-container" tabIndex="2">
                        <svg width="15" height="15" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.146447 0.853554C-0.0488156 0.658291 -0.0488156 0.341709 0.146447 0.146447C0.341709 -0.0488155 0.658292 -0.0488155 0.853554 0.146447L6 5.29289L11.1464 0.146447C11.3417 -0.0488155 11.6583 -0.0488155 11.8536 0.146447C12.0488 0.341709 12.0488 0.658291 11.8536 0.853554L6.70711 6L11.8536 11.1464C12.0488 11.3417 12.0488 11.6583 11.8536 11.8536C11.6583 12.0488 11.3417 12.0488 11.1464 11.8536L6 6.70711L0.853554 11.8536C0.658292 12.0488 0.341709 12.0488 0.146447 11.8536C-0.048815 11.6583 -0.048815 11.3417 0.146447 11.1464L5.29289 6L0.146447 0.853554Z" fill="black"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                ${
                  option('paginationArrows')
                    ? `
                    <div class="slides-pagination">
                      <span class="previous">&lsaquo;</span>
                      <span class="next">&rsaquo;</span>
                    </div>`
                    : ''
                }
              </div>`;
    },

    viewerItemPointerProgress(style: string) {
      return `<span class="progress" style="${style}"></span>`;
    },

    viewerItemPointer(index: number, currentIndex: number, item: StoryItem) {
      return `<span
                class="
                  ${currentIndex === index ? 'active' : ''}
                  ${item['seen'] === true ? 'seen' : ''}
                "
                data-index="${index}" data-item-id="${item['id']}">
                  ${option('template')['viewerItemPointerProgress'](
                    `animation-duration:${
                      safeNum(item['length']) ? item['length'] : '3'
                    }s`
                  )}
              </span>`;
    },

    viewerItemBody(index: number, currentIndex: number, item: StoryItem) {
      return `<div class="item ${item['seen'] === true ? 'seen' : ''}
                  ${currentIndex === index ? 'active' : ''}"
                data-time="${item['time']}"
                data-type="${item['type']}"
                data-index="${index}"
                data-item-id="${item['id']}">
                ${
                  item['type'] === 'video'
                    ? `<video class="media" data-length="${item.length}" ${
                        item.loop ? 'loop' : ''
                      } muted webkit-playsinline playsinline preload="auto" src="${
                        item['src']
                      }" ${item['type']}></video>`
                    : `<img loading="auto" class="media" src="${item['src']}" ${item['type']} />`
                }

                ${
                  item['link']
                    ? `<a class="tip link" href="${
                        item['link']
                      }" rel="noopener" target="${item['redirect']}">
                        <button>${item['linkText'] || option('language')['visitLink']}</button>
                      </a>`
                    : ''
                }
              </div>`;
    }
  },
  language: {
    unmute: 'Touch to unmute',
    keyboardTip: 'Press space to see next',
    visitLink: 'Visit link',
    time: {
      ago: 'ago',
      hour: 'hour ago',
      hours: 'hours ago',
      minute: 'minute ago',
      minutes: 'minutes ago',
      fromnow: 'from now',
      seconds: 'seconds ago',
      yesterday: 'yesterday',
      tomorrow: 'tomorrow',
      days: 'days ago'
    }
  }
});

export const option = <T extends keyof Options>(
  options?: Options,
  _name?: T
): Options[T] => {
  const self = (name: keyof Options) => {
    return typeof options?.[name] !== 'undefined'
      ? options?.[name]
      : optionsDefault(self)[name];
  };

  return self(_name);
};

export const loadOptions = function (options?: Options) {
  return {
    option: <T extends keyof Options>(name: T): Options[T] => {
      return option(options, name);
    },
    callback: <C extends keyof Callbacks>(name: C): Callbacks[C] => {
      const customOpts = option(options, 'callbacks');

      return typeof customOpts[name] !== undefined
        ? customOpts[name]
        : option(undefined, 'callbacks')[name];
    },
    template: <T extends keyof Templates>(name: T): Templates[T] => {
      const customOpts = option(options, 'template');

      return typeof customOpts[name] !== undefined
        ? customOpts[name]
        : option(undefined, 'template')[name];
    },
    language: <L extends keyof Language>(name: L): Language[L] => {
      const customOpts = option(options, 'language');

      return typeof customOpts[name] !== undefined
        ? customOpts[name]
        : option(undefined, 'language')[name];
    }
  };
};
