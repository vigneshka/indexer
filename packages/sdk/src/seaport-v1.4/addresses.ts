import { ChainIdToAddress, Network } from "../utils";

export const Exchange: ChainIdToAddress = {
  [Network.Ethereum]: "0x00000000000001ad428e4906ae43d8f9852d0dd6",
  [Network.EthereumGoerli]: "0x00000000000001ad428e4906ae43d8f9852d0dd6",
  [Network.Optimism]: "0x00000000000001ad428e4906ae43d8f9852d0dd6",
  [Network.Gnosis]: "0x00000000000001ad428e4906ae43d8f9852d0dd6",
  [Network.Polygon]: "0x00000000000001ad428e4906ae43d8f9852d0dd6",
  [Network.PolygonMumbai]: "0x00000000000001ad428e4906ae43d8f9852d0dd6",
  [Network.Arbitrum]: "0x00000000000001ad428e4906ae43d8f9852d0dd6",
  [Network.AvalancheFuji]: "0x00000000000001ad428e4906ae43d8f9852d0dd6",
  [Network.Avalanche]: "0x00000000000001ad428e4906ae43d8f9852d0dd6",
};

// Conduits

export const OpenseaConduitKey: ChainIdToAddress = {
  [Network.Ethereum]: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
  [Network.EthereumGoerli]: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
  [Network.Polygon]: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
  [Network.Optimism]: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
};

// Zones

export const PausableZone: ChainIdToAddress = {
  [Network.Ethereum]: "0x004c00500000ad104d7dbd00e3ae0a5c00560c00",
  [Network.Polygon]: "0x004c00500000ad104d7dbd00e3ae0a5c00560c00",
};

export const OpenSeaProtectedOffersZone: ChainIdToAddress = {
  [Network.Ethereum]: "0x000000e7ec00e7b300774b00001314b8610022b8",
  [Network.EthereumGoerli]: "0x000000e7ec00e7b300774b00001314b8610022b8",
  [Network.Polygon]: "0x000000e7ec00e7b300774b00001314b8610022b8",
  [Network.Optimism]: "0x000000e7ec00e7b300774b00001314b8610022b8",
};

export const CancellationZone: ChainIdToAddress = {
  [Network.Ethereum]: "0xaa0e012d35cf7d6ecb6c2bf861e71248501d3226",
  [Network.EthereumGoerli]: "0x49b91d1d7b9896d28d370b75b92c2c78c1ac984a",
};
