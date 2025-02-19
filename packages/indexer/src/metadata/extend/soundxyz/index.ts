/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import _ from "lodash";
import ArtistContracts from "./ArtistContracts.json";
import ReleaseContracts from "./ReleaseContracts.json";
import { logger } from "@/common/logger";
import { CollectionMetadata, TokenMetadata } from "@/metadata/types";
import { config } from "@/config/index";

export const SoundxyzArtistContracts = ArtistContracts.map((c) => c.toLowerCase());
export const SoundxyzReleaseContracts = ReleaseContracts.map((c) => c.toLowerCase());

export const getContractSlug = async (contract: string, _tokenId: string) => {
  const apiUrl = ![4, 5].includes(config.chainId)
    ? "https://api.sound.xyz/graphql?x-sound-client-name=firstmate"
    : "https://staging.api.sound.xyz/graphql";

  const query = `
        query ContractSlug {
          releaseFromToken(
            input: { contractAddress: "${contract}", tokenId: "${_tokenId}" }
          ) {
            baseMetadataAttributes {
              traitType
              value
            }
            id
            title
            titleSlug
            behindTheMusic
            externalUrl
            behindTheMusic
            fundingAddress
            royaltyBps
            artist {
              id
              name
              soundHandle
              user {
                publicAddress
              }
            }
            coverImage {
              url
            }
            staticCoverImage {
               url
            }
            animatedCoverImage {
               url
            }
            eggGame {
              id
              goldenEggImage {
                url
              }
              animatedGoldenEggImageOptimized {
                 url
              }
              nft {
                id
                tokenId
                openSeaMetadataAttributes {
                  traitType
                  value
                }
              }
            }
            track {
              id
              revealedAudio {
                id
                url
              }
            }
          }
        }
    `;

  try {
    return axios.post(
      apiUrl,
      { query },
      {
        headers: {
          "x-sound-client-key": config.soundxyzApiKey,
          "CONTENT-TYPE": "application/json",
          "user-agent": config.soundxyzUserAgent,
        },
      }
    );
  } catch (error) {
    logger.error(
      "soundxyz-fetcher",
      `fetchCollection error. contract:${contract}, message:${error}`
    );

    throw error;
  }
};

export const extend = async (metadata: TokenMetadata) => {
  const {
    data: {
      data: { releaseFromToken },
    },
  } = await getContractSlug(metadata.contract, metadata.tokenId);
  const isGoldenEgg = releaseFromToken.eggGame?.nft.tokenId === metadata.tokenId;
  let imageUrl =
    releaseFromToken.animatedCoverImage?.url ??
    releaseFromToken.coverImage?.url ??
    releaseFromToken.staticCoverImage?.url;
  if (isGoldenEgg) {
    imageUrl =
      releaseFromToken.eggGame.animatedGoldenEggImageOptimized?.url ??
      releaseFromToken.eggGame.goldenEggImage?.url;
  }

  metadata.name = releaseFromToken.title;
  metadata.collection = `${metadata.contract}:soundxyz-${releaseFromToken.id}`;
  metadata.description = releaseFromToken.behindTheMusic;
  metadata.imageUrl = imageUrl;
  metadata.attributes = (
    (isGoldenEgg
      ? releaseFromToken.eggGame.nft.openSeaMetadataAttributes
      : releaseFromToken.baseMetadataAttributes) || []
  ).map((trait: any) => ({
    key: trait.traitType ?? "property",
    value: trait.value,
    kind: typeof trait.value == "number" ? "number" : "string",
    rank: 1,
  }));

  return { ...metadata };
};

export const extendCollection = async (metadata: CollectionMetadata, _tokenId = null) => {
  if (isNaN(Number(_tokenId)) || !_tokenId) {
    throw new Error(`Invalid tokenId ${_tokenId}`);
  }

  const {
    data: {
      data: { releaseFromToken },
    },
  } = await getContractSlug(metadata.contract, _tokenId);

  const royalties = [];

  if (releaseFromToken.fundingAddress && releaseFromToken.royaltyBps) {
    royalties.push({
      recipient: _.toLower(releaseFromToken.fundingAddress),
      bps: releaseFromToken.royaltyBps,
    });
  }

  if (!metadata.metadata) {
    metadata.metadata = {};
  }

  metadata.metadata.imageUrl = releaseFromToken.coverImage.url;
  metadata.metadata.description = releaseFromToken.description;
  metadata.metadata.externalUrl = `https://sound.xyz/${releaseFromToken.artist.soundHandle}/${releaseFromToken.titleSlug}`;

  return {
    ...metadata,
    id: `${metadata.contract}:soundxyz-${releaseFromToken.id}`,
    name: `${releaseFromToken.artist.name} - ${releaseFromToken.title}`,
    community: "sound.xyz",
    royalties,
    tokenSetId: null,
    isFallback: undefined,
  };
};
