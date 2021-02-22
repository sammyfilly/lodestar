/* eslint-disable @typescript-eslint/naming-convention */

export interface ILightclientParams {
  SYNC_COMMITTEE_SIZE: number;
  SYNC_COMMITTEE_PUBKEY_AGGREGATES_SIZE: number;
  EPOCHS_PER_SYNC_COMMITTEE_PERIOD: number;
  DOMAIN_SYNC_COMMITTEE: Buffer;
  LIGHTCLIENT_PATCH_FORK_VERSION: Buffer;
  LIGHTCLIENT_PATCH_FORK_SLOT: number;
}
