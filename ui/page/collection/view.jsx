// @flow
import * as ICONS from 'constants/icons';
import React, { useEffect } from 'react';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Button from 'component/button';
import * as PAGES from 'constants/pages';
import ShareButton from 'component/shareButton';
import ChannelThumbnail from 'component/fileThumbnail';
import { useHistory } from 'react-router-dom';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'component/common/tabs';
import CollectionEdit from 'component/collectionEdit';

export const PAGE_VIEW_QUERY = 'view';
export const PUBLISH_PAGE = 'publish';
export const EDIT_PAGE = 'edit';
const ABOUT_PAGE = `about`;

type Props = {
  collectionId: string,
  collection: Collection,
  collectionUrls: Array<string>,
  isResolvingCollection: boolean,
  title: string,
  thumbnail: string,
  // isMine: boolean,
  claim: Claim,
  pending: boolean,
  uri: string,
};

export default function CollectionPage(props: Props) {
  const { collectionId, collection, collectionUrls, title, thumbnail, pending, uri } = props;

  /*
    This page knows if published or not
    isPublishedId: publish / edit / update_publish
    if isPublished: updatePublish
   */
  const {
    push,
    replace,
    goBack,
    location: { search },
  } = useHistory();
  const { name } = collection || {};
  const shouldResolve = true; // placeholder
  // if not collection, resolve collection.
  // if collection is published, resolve collection to update it
  const urlParams = new URLSearchParams(search);
  const currentView = urlParams.get(PAGE_VIEW_QUERY) || undefined;
  const editing = urlParams.get(PAGE_VIEW_QUERY) === EDIT_PAGE;

  useEffect(() => {
    if (collectionId && shouldResolve) {
    }
  }, [collectionId, shouldResolve]);

  const tabIndex = currentView === ABOUT_PAGE ? 1 : 0;

  function onTabChange(newTabIndex) {
    let search = '?';

    if (newTabIndex === 0) {
      search = '';
    } else if (newTabIndex === 1) {
      search += `${PAGE_VIEW_QUERY}=${ABOUT_PAGE}`;
    }
    // NO, go to the page.
    // `/$/${PAGES.COLLECTION}/${id}/`
    replace(`/$/${PAGES.COLLECTION}/${collectionId}/${search}`);
  }

  if (editing) {
    return (
      <Page
        noFooter
        noSideNavigation={editing}
        backout={{
          title: __('Editing %collection%', { collection: name }),
          simpleTitle: __('Editing'),
        }}
      >
        <CollectionEdit uri={uri} onDone={() => goBack()} />
      </Page>
    );
  }

  const about = (
    <div>
      <h1>About</h1>
    </div>
  );
  // some kind of header here?
  // pass up, down, delete controls through claim list
  return (
    <Page>
      <header className="channel-cover">
        {thumbnail && <ChannelThumbnail className="channel__thumbnail--channel-page" thumbnail={thumbnail} allowGifs />}

        <div className="channel__quick-actions">
          <ShareButton uri={uri} />
        </div>
        <div className="channel__primary-info">
          <h1 className="channel__title">{title || name}</h1>
          <div className="channel__meta">
            {true && (
              <>
                {pending ? (
                  <span>{__('Your changes will be live in a few minutes')}</span>
                ) : (
                  <Button
                    button="alt"
                    title={__('Edit')}
                    onClick={() => push(`?${PAGE_VIEW_QUERY}=${EDIT_PAGE}`)}
                    icon={ICONS.PUBLISH}
                    iconSize={18}
                    disabled={pending}
                  />
                )}
              </>
            )}
          </div>
        </div>
        <div className="channel-cover__gradient" />
      </header>
      <Tabs onChange={onTabChange} index={tabIndex}>
        <TabList className="tabs__list--channel-page">
          <Tab disabled={editing}>{__('Items')}</Tab>
          <Tab>{editing ? __('Editing Your Channel') : __('About --[tab title in Channel Page]--')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ClaimList
              uris={collectionUrls}
              // loading={isSearching}
              collectionId={collectionId}
            />
          </TabPanel>
          <TabPanel>{about}</TabPanel>
        </TabPanels>
      </Tabs>
    </Page>
  );
}
