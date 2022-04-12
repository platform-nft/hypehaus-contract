export enum HypeHausErrorCode {
  CommunitySaleNotActive = 'HH_COMMUNITY_SALE_NOT_ACTIVE',
  PublicSaleNotActive = 'HH_PUBLIC_SALE_NOT_ACTIVE',
  SupplyExhausted = 'HH_SUPPLY_EXHAUSTED',
  InvalidMintAmount = 'HH_INVALID_MINT_AMOUNT',
  InsufficientFunds = 'HH_INSUFFICIENT_FUNDS',
  AddressAlreadyClaimed = 'HH_ADDRESS_ALREADY_CLAIMED',
  VerificationFailure = 'HH_VERIFICATION_FAILURE',
}

export enum HypeHausAccessControlErrorCode {
  CallerNotAdmin = 'HH_CALLER_NOT_ADMIN',
  CallerNotOperator = 'HH_CALLER_NOT_OPERATOR',
  CallerNotWithdrawer = 'HH_CALLER_NOT_WITHDRAWER',
}

export enum HypeHausSale {
  Closed = 0,
  Community = 1,
  Public = 2,
}

export function stringToHypeHausSale(sale: string): HypeHausSale {
  let hypeHausSale: HypeHausSale;

  switch (sale.trim().toLowerCase()) {
    case 'closed':
      hypeHausSale = HypeHausSale.Closed;
      break;
    case 'community':
      hypeHausSale = HypeHausSale.Community;
      break;
    case 'public':
      hypeHausSale = HypeHausSale.Public;
      break;
    default:
      throw new Error(`Invalid sale: "${sale}"`);
  }

  return hypeHausSale;
}
