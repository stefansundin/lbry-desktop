// @flow
import React from 'react';
import classnames from 'classnames';
import { NavLink, withRouter } from 'react-router-dom';
import UriIndicator from 'component/uriIndicator';
import TruncatedText from 'component/common/truncated-text';
import DateTime from 'component/dateTime';
import ChannelThumbnail from 'component/channelThumbnail';
import SubscribeButton from 'component/subscribeButton';
import useGetThumbnail from 'effects/use-get-thumbnail';
import { formatLbryUrlForWeb } from 'util/url';
import ClaimRepostAuthor from 'component/claimRepostAuthor';
import ClaimPreview from 'component/claimPreview';
import * as PAGES from 'constants/pages';

type Props = {
  uri: string,
  collectionId: string,
  collectionName: string,
  claim: ?Claim,
  channelClaim: ?ChannelClaim,
  collectionItemUrls: Array<CollectionItem>,
  channel?: ?ChannelClaim,
  resolveUri: string => void,
  isResolvingUri: boolean,
  history: { push: string => void },
  thumbnail?: string,
  title?: string,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
  filteredOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
  blockedChannelUris: Array<string>,
  isMature?: boolean,
  showMature: boolean,
  collectionId: string,
};

function ClaimPreviewTile(props: Props) {
  const {
    history,
    uri,
    collectionId,
    collectionName,
    isResolvingUri,
    thumbnail,
    title,
    claim,
    channelClaim,
    collectionItemUrls,
    blackListedOutpoints,
    filteredOutpoints,
    blockedChannelUris,
    isMature,
    showMature,
  } = props;
  const isRepost = claim && claim.repost_channel_url;
  // const shouldFetch = claim === undefined;
  // const canonicalUrl = claim && claim.canonical_url; uncomment after sdk resolve fix
  const permanentUrl = claim && claim.permanent_url; // until sdk resolvefix
  const channelUrl = channelClaim && channelClaim.permanent_url;
  const navigateUrl = formatLbryUrlForWeb(permanentUrl || uri || `/$/${PAGES.COLLECTION}/${collectionId}`);

  const firstUrl = collectionItemUrls && collectionItemUrls[0];
  const isChannel = false;
  const navLinkProps = {
    to: navigateUrl,
    onClick: e => e.stopPropagation(),
  };

  const signingChannel = claim && claim.signing_channel;
  let channelThumbnail;
  if (signingChannel) {
    channelThumbnail =
      // I should be able to just pass the the uri to <ChannelThumbnail /> but it wasn't working
      // Come back to me
      (signingChannel.value && signingChannel.value.thumbnail && signingChannel.value.thumbnail.url) || undefined;
  }

  function handleClick(e) {
    // go to first url + collectionId
    if (navigateUrl) {
      history.push(navigateUrl);
    }
  }

  let shouldHide = false;

  if (isMature && !showMature) {
    // Unfortunately needed until this is resolved
    // https://github.com/lbryio/lbry-sdk/issues/2785
    shouldHide = true;
  }

  // This will be replaced once blocking is done at the wallet server level
  // if (claim && !shouldHide && blackListedOutpoints) {
  //   shouldHide = blackListedOutpoints.some(
  //     outpoint =>
  //       (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
  //       (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
  //   );
  // }
  // We're checking to see if the stream outpoint
  // or signing channel outpoint is in the filter list
  // if (claim && !shouldHide && filteredOutpoints) {
  //   shouldHide = filteredOutpoints.some(
  //     outpoint =>
  //       (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
  //       (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
  //   );
  // }

  // block stream claims
  // if (claim && !shouldHide && blockedChannelUris.length && signingChannel) {
  //   shouldHide = blockedChannelUris.some(blockedUri => blockedUri === signingChannel.permanent_url);
  // }
  // block channel claims if we can't control for them in claim search
  // e.g. fetchRecommendedSubscriptions

  if (shouldHide) {
    return null;
  }

  if (isResolvingUri) {
    return (
      <li className={classnames('claim-preview--tile', {})}>
        <div className="placeholder media__thumb" />
        <div className="placeholder__wrapper">
          <div className="placeholder claim-tile__title" />
          <div className="placeholder claim-tile__info" />
        </div>
      </li>
    );
  }

  // claim list with 2 or so urls
  // nav to actual playlist play page
  // link to playlist manage page
  // what channel
  return (
    <li
      role="link"
      onClick={handleClick}
      className={classnames('card claim-preview--tile', {
        'claim-preview__wrapper--channel': false,
      })}
    >
      <NavLink {...navLinkProps}>
        <ClaimPreview uri={firstUrl} key={firstUrl} type={'small'} />
      </NavLink>
      <NavLink {...navLinkProps}>
        <h2 className="claim-tile__title">
          <TruncatedText text={__('Collection: ') + (title || (claim && claim.name) || collectionName)} lines={2} />
        </h2>
        <h2 className="claim-tile__title">{`${collectionItemUrls.length} Items`}</h2>
      </NavLink>
      <div>
        {claim && (
          <div className="claim-tile__info">
            {isChannel ? (
              <div className="claim-tile__about--channel">
                <SubscribeButton uri={uri} />
              </div>
            ) : (
              <React.Fragment>
                <UriIndicator uri={uri} link hideAnonymous>
                  <ChannelThumbnail thumbnailPreview={channelThumbnail} />
                </UriIndicator>

                <div className="claim-tile__about">
                  <UriIndicator uri={uri} link />
                  <DateTime timeAgo uri={uri} />
                </div>
              </React.Fragment>
            )}
          </div>
        )}
        {isRepost && (
          <div className="claim-tile__repost-author">
            <ClaimRepostAuthor uri={uri} />
          </div>
        )}
      </div>
    </li>
  );
}

export default withRouter(ClaimPreviewTile);
