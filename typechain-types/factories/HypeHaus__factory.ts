/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  Overrides,
  BigNumberish,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { HypeHaus, HypeHausInterface } from "../HypeHaus";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maxSupply_",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "baseURI_",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "MintHypeHaus",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "mintHypeHaus",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalMinted",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040526000600855600060095560405180602001604052806000815250600a9080519060200190620000359291906200021f565b503480156200004357600080fd5b506040516200381c3803806200381c833981810160405281019062000069919062000358565b6040518060400160405280600881526020017f48595045686175730000000000000000000000000000000000000000000000008152506040518060400160405280600481526020017f48595045000000000000000000000000000000000000000000000000000000008152508160009080519060200190620000ed9291906200021f565b508060019080519060200190620001069291906200021f565b505050620001296200011d6200015160201b60201c565b6200015960201b60201c565b8160098190555080600a9080519060200190620001489291906200021f565b50505062000546565b600033905090565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b8280546200022d9062000451565b90600052602060002090601f0160209004810192826200025157600085556200029d565b82601f106200026c57805160ff19168380011785556200029d565b828001600101855582156200029d579182015b828111156200029c5782518255916020019190600101906200027f565b5b509050620002ac9190620002b0565b5090565b5b80821115620002cb576000816000905550600101620002b1565b5090565b6000620002e6620002e084620003db565b620003b2565b905082815260208101848484011115620002ff57600080fd5b6200030c8482856200041b565b509392505050565b600082601f8301126200032657600080fd5b815162000338848260208601620002cf565b91505092915050565b60008151905062000352816200052c565b92915050565b600080604083850312156200036c57600080fd5b60006200037c8582860162000341565b925050602083015167ffffffffffffffff8111156200039a57600080fd5b620003a88582860162000314565b9150509250929050565b6000620003be620003d1565b9050620003cc828262000487565b919050565b6000604051905090565b600067ffffffffffffffff821115620003f957620003f8620004ec565b5b62000404826200051b565b9050602081019050919050565b6000819050919050565b60005b838110156200043b5780820151818401526020810190506200041e565b838111156200044b576000848401525b50505050565b600060028204905060018216806200046a57607f821691505b60208210811415620004815762000480620004bd565b5b50919050565b62000492826200051b565b810181811067ffffffffffffffff82111715620004b457620004b3620004ec565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b620005378162000411565b81146200054357600080fd5b50565b6132c680620005566000396000f3fe6080604052600436106101145760003560e01c8063715018a6116100a0578063b88d4fde11610064578063b88d4fde146103a4578063c87b56dd146103cd578063d5abeb011461040a578063e985e9c514610435578063f2fde38b1461047257610114565b8063715018a6146102e35780638da5cb5b146102fa57806395d89b4114610325578063a22cb46514610350578063a2309ff81461037957610114565b80631197df63116100e75780631197df63146101e757806323b872dd1461021757806342842e0e146102405780636352211e1461026957806370a08231146102a657610114565b806301ffc9a71461011957806306fdde0314610156578063081812fc14610181578063095ea7b3146101be575b600080fd5b34801561012557600080fd5b50610140600480360381019061013b91906121a3565b61049b565b60405161014d9190612657565b60405180910390f35b34801561016257600080fd5b5061016b61057d565b6040516101789190612672565b60405180910390f35b34801561018d57600080fd5b506101a860048036038101906101a391906121f5565b61060f565b6040516101b591906125f0565b60405180910390f35b3480156101ca57600080fd5b506101e560048036038101906101e09190612167565b610694565b005b61020160048036038101906101fc9190611ffc565b6107ac565b60405161020e91906128f4565b60405180910390f35b34801561022357600080fd5b5061023e60048036038101906102399190612061565b610914565b005b34801561024c57600080fd5b5061026760048036038101906102629190612061565b610974565b005b34801561027557600080fd5b50610290600480360381019061028b91906121f5565b610994565b60405161029d91906125f0565b60405180910390f35b3480156102b257600080fd5b506102cd60048036038101906102c89190611ffc565b610a46565b6040516102da91906128f4565b60405180910390f35b3480156102ef57600080fd5b506102f8610afe565b005b34801561030657600080fd5b5061030f610b86565b60405161031c91906125f0565b60405180910390f35b34801561033157600080fd5b5061033a610bb0565b6040516103479190612672565b60405180910390f35b34801561035c57600080fd5b506103776004803603810190610372919061212b565b610c42565b005b34801561038557600080fd5b5061038e610c58565b60405161039b91906128f4565b60405180910390f35b3480156103b057600080fd5b506103cb60048036038101906103c691906120b0565b610c62565b005b3480156103d957600080fd5b506103f460048036038101906103ef91906121f5565b610cc4565b6040516104019190612672565b60405180910390f35b34801561041657600080fd5b5061041f610e16565b60405161042c91906128f4565b60405180910390f35b34801561044157600080fd5b5061045c60048036038101906104579190612025565b610e20565b6040516104699190612657565b60405180910390f35b34801561047e57600080fd5b5061049960048036038101906104949190611ffc565b610eb4565b005b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061056657507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b80610576575061057582610fac565b5b9050919050565b60606000805461058c90612b42565b80601f01602080910402602001604051908101604052809291908181526020018280546105b890612b42565b80156106055780601f106105da57610100808354040283529160200191610605565b820191906000526020600020905b8154815290600101906020018083116105e857829003601f168201915b5050505050905090565b600061061a82611016565b610659576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161065090612854565b60405180910390fd5b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b600061069f82610994565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610710576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610707906128b4565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff1661072f611082565b73ffffffffffffffffffffffffffffffffffffffff16148061075e575061075d81610758611082565b610e20565b5b61079d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161079490612794565b60405180910390fd5b6107a7838361108a565b505050565b60006107b6611082565b73ffffffffffffffffffffffffffffffffffffffff166107d4610b86565b73ffffffffffffffffffffffffffffffffffffffff161461082a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161082190612874565b60405180910390fd5b60095460085410610870576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161086790612774565b60405180910390fd5b60006008549050600061088282611143565b60405160200161089291906125ce565b60405160208183030381529060405290506108ad84836112f0565b6108b7828261130e565b7f7ad028dc70b4caf36db7f088f3d5c5b96706597fcc46cf7afdcfdc18d168264f82856040516108e892919061290f565b60405180910390a160016008600082825461090391906129d1565b925050819055508192505050919050565b61092561091f611082565b82611382565b610964576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161095b906128d4565b60405180910390fd5b61096f838383611460565b505050565b61098f83838360405180602001604052806000815250610c62565b505050565b6000806002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610a3d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a34906127d4565b60405180910390fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610ab7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610aae906127b4565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b610b06611082565b73ffffffffffffffffffffffffffffffffffffffff16610b24610b86565b73ffffffffffffffffffffffffffffffffffffffff1614610b7a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b7190612874565b60405180910390fd5b610b8460006116c7565b565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b606060018054610bbf90612b42565b80601f0160208091040260200160405190810160405280929190818152602001828054610beb90612b42565b8015610c385780601f10610c0d57610100808354040283529160200191610c38565b820191906000526020600020905b815481529060010190602001808311610c1b57829003601f168201915b5050505050905090565b610c54610c4d611082565b838361178d565b5050565b6000600854905090565b610c73610c6d611082565b83611382565b610cb2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ca9906128d4565b60405180910390fd5b610cbe848484846118fa565b50505050565b6060610ccf82611016565b610d0e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d0590612834565b60405180910390fd5b6000600660008481526020019081526020016000208054610d2e90612b42565b80601f0160208091040260200160405190810160405280929190818152602001828054610d5a90612b42565b8015610da75780601f10610d7c57610100808354040283529160200191610da7565b820191906000526020600020905b815481529060010190602001808311610d8a57829003601f168201915b505050505090506000610db8611956565b9050600081511415610dce578192505050610e11565b600082511115610e03578082604051602001610deb9291906125aa565b60405160208183030381529060405292505050610e11565b610e0c846119e8565b925050505b919050565b6000600954905090565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b610ebc611082565b73ffffffffffffffffffffffffffffffffffffffff16610eda610b86565b73ffffffffffffffffffffffffffffffffffffffff1614610f30576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f2790612874565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610fa0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f97906126b4565b60405180910390fd5b610fa9816116c7565b50565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60008073ffffffffffffffffffffffffffffffffffffffff166002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b600033905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff166110fd83610994565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6060600082141561118b576040518060400160405280600181526020017f300000000000000000000000000000000000000000000000000000000000000081525090506112eb565b600082905060005b600082146111bd5780806111a690612ba5565b915050600a826111b69190612a27565b9150611193565b60008167ffffffffffffffff8111156111ff577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156112315781602001600182028036833780820191505090505b5090505b600085146112e45760018261124a9190612a58565b9150600a856112599190612bee565b603061126591906129d1565b60f81b8183815181106112a1577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600a856112dd9190612a27565b9450611235565b8093505050505b919050565b61130a828260405180602001604052806000815250611a8f565b5050565b61131782611016565b611356576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161134d906127f4565b60405180910390fd5b8060066000848152602001908152602001600020908051906020019061137d929190611e88565b505050565b600061138d82611016565b6113cc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113c390612754565b60405180910390fd5b60006113d783610994565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16148061144657508373ffffffffffffffffffffffffffffffffffffffff1661142e8461060f565b73ffffffffffffffffffffffffffffffffffffffff16145b8061145757506114568185610e20565b5b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff1661148082610994565b73ffffffffffffffffffffffffffffffffffffffff16146114d6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114cd906126d4565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611546576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161153d90612714565b60405180910390fd5b611551838383611aea565b61155c60008261108a565b6001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546115ac9190612a58565b925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461160391906129d1565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a46116c2838383611aef565b505050565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156117fc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016117f390612734565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31836040516118ed9190612657565b60405180910390a3505050565b611905848484611460565b61191184848484611af4565b611950576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161194790612694565b60405180910390fd5b50505050565b6060600a805461196590612b42565b80601f016020809104026020016040519081016040528092919081815260200182805461199190612b42565b80156119de5780601f106119b3576101008083540402835291602001916119de565b820191906000526020600020905b8154815290600101906020018083116119c157829003601f168201915b5050505050905090565b60606119f382611016565b611a32576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a2990612894565b60405180910390fd5b6000611a3c611956565b90506000815111611a5c5760405180602001604052806000815250611a87565b80611a6684611143565b604051602001611a779291906125aa565b6040516020818303038152906040525b915050919050565b611a998383611c8b565b611aa66000848484611af4565b611ae5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611adc90612694565b60405180910390fd5b505050565b505050565b505050565b6000611b158473ffffffffffffffffffffffffffffffffffffffff16611e65565b15611c7e578373ffffffffffffffffffffffffffffffffffffffff1663150b7a02611b3e611082565b8786866040518563ffffffff1660e01b8152600401611b60949392919061260b565b602060405180830381600087803b158015611b7a57600080fd5b505af1925050508015611bab57506040513d601f19601f82011682018060405250810190611ba891906121cc565b60015b611c2e573d8060008114611bdb576040519150601f19603f3d011682016040523d82523d6000602084013e611be0565b606091505b50600081511415611c26576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611c1d90612694565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614915050611c83565b600190505b949350505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611cfb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611cf290612814565b60405180910390fd5b611d0481611016565b15611d44576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611d3b906126f4565b60405180910390fd5b611d5060008383611aea565b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611da091906129d1565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4611e6160008383611aef565b5050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b828054611e9490612b42565b90600052602060002090601f016020900481019282611eb65760008555611efd565b82601f10611ecf57805160ff1916838001178555611efd565b82800160010185558215611efd579182015b82811115611efc578251825591602001919060010190611ee1565b5b509050611f0a9190611f0e565b5090565b5b80821115611f27576000816000905550600101611f0f565b5090565b6000611f3e611f398461295d565b612938565b905082815260208101848484011115611f5657600080fd5b611f61848285612b00565b509392505050565b600081359050611f7881613234565b92915050565b600081359050611f8d8161324b565b92915050565b600081359050611fa281613262565b92915050565b600081519050611fb781613262565b92915050565b600082601f830112611fce57600080fd5b8135611fde848260208601611f2b565b91505092915050565b600081359050611ff681613279565b92915050565b60006020828403121561200e57600080fd5b600061201c84828501611f69565b91505092915050565b6000806040838503121561203857600080fd5b600061204685828601611f69565b925050602061205785828601611f69565b9150509250929050565b60008060006060848603121561207657600080fd5b600061208486828701611f69565b935050602061209586828701611f69565b92505060406120a686828701611fe7565b9150509250925092565b600080600080608085870312156120c657600080fd5b60006120d487828801611f69565b94505060206120e587828801611f69565b93505060406120f687828801611fe7565b925050606085013567ffffffffffffffff81111561211357600080fd5b61211f87828801611fbd565b91505092959194509250565b6000806040838503121561213e57600080fd5b600061214c85828601611f69565b925050602061215d85828601611f7e565b9150509250929050565b6000806040838503121561217a57600080fd5b600061218885828601611f69565b925050602061219985828601611fe7565b9150509250929050565b6000602082840312156121b557600080fd5b60006121c384828501611f93565b91505092915050565b6000602082840312156121de57600080fd5b60006121ec84828501611fa8565b91505092915050565b60006020828403121561220757600080fd5b600061221584828501611fe7565b91505092915050565b61222781612a8c565b82525050565b61223681612a9e565b82525050565b60006122478261298e565b61225181856129a4565b9350612261818560208601612b0f565b61226a81612cdb565b840191505092915050565b600061228082612999565b61228a81856129b5565b935061229a818560208601612b0f565b6122a381612cdb565b840191505092915050565b60006122b982612999565b6122c381856129c6565b93506122d3818560208601612b0f565b80840191505092915050565b60006122ec6032836129b5565b91506122f782612cec565b604082019050919050565b600061230f6026836129b5565b915061231a82612d3b565b604082019050919050565b60006123326025836129b5565b915061233d82612d8a565b604082019050919050565b6000612355601c836129b5565b915061236082612dd9565b602082019050919050565b60006123786024836129b5565b915061238382612e02565b604082019050919050565b600061239b6019836129b5565b91506123a682612e51565b602082019050919050565b60006123be602c836129b5565b91506123c982612e7a565b604082019050919050565b60006123e1601a836129b5565b91506123ec82612ec9565b602082019050919050565b60006124046038836129b5565b915061240f82612ef2565b604082019050919050565b6000612427602a836129b5565b915061243282612f41565b604082019050919050565b600061244a6029836129b5565b915061245582612f90565b604082019050919050565b600061246d602e836129b5565b915061247882612fdf565b604082019050919050565b60006124906020836129b5565b915061249b8261302e565b602082019050919050565b60006124b36031836129b5565b91506124be82613057565b604082019050919050565b60006124d6602c836129b5565b91506124e1826130a6565b604082019050919050565b60006124f96005836129c6565b9150612504826130f5565b600582019050919050565b600061251c6020836129b5565b91506125278261311e565b602082019050919050565b600061253f602f836129b5565b915061254a82613147565b604082019050919050565b60006125626021836129b5565b915061256d82613196565b604082019050919050565b60006125856031836129b5565b9150612590826131e5565b604082019050919050565b6125a481612af6565b82525050565b60006125b682856122ae565b91506125c282846122ae565b91508190509392505050565b60006125da82846122ae565b91506125e5826124ec565b915081905092915050565b6000602082019050612605600083018461221e565b92915050565b6000608082019050612620600083018761221e565b61262d602083018661221e565b61263a604083018561259b565b818103606083015261264c818461223c565b905095945050505050565b600060208201905061266c600083018461222d565b92915050565b6000602082019050818103600083015261268c8184612275565b905092915050565b600060208201905081810360008301526126ad816122df565b9050919050565b600060208201905081810360008301526126cd81612302565b9050919050565b600060208201905081810360008301526126ed81612325565b9050919050565b6000602082019050818103600083015261270d81612348565b9050919050565b6000602082019050818103600083015261272d8161236b565b9050919050565b6000602082019050818103600083015261274d8161238e565b9050919050565b6000602082019050818103600083015261276d816123b1565b9050919050565b6000602082019050818103600083015261278d816123d4565b9050919050565b600060208201905081810360008301526127ad816123f7565b9050919050565b600060208201905081810360008301526127cd8161241a565b9050919050565b600060208201905081810360008301526127ed8161243d565b9050919050565b6000602082019050818103600083015261280d81612460565b9050919050565b6000602082019050818103600083015261282d81612483565b9050919050565b6000602082019050818103600083015261284d816124a6565b9050919050565b6000602082019050818103600083015261286d816124c9565b9050919050565b6000602082019050818103600083015261288d8161250f565b9050919050565b600060208201905081810360008301526128ad81612532565b9050919050565b600060208201905081810360008301526128cd81612555565b9050919050565b600060208201905081810360008301526128ed81612578565b9050919050565b6000602082019050612909600083018461259b565b92915050565b6000604082019050612924600083018561259b565b612931602083018461221e565b9392505050565b6000612942612953565b905061294e8282612b74565b919050565b6000604051905090565b600067ffffffffffffffff82111561297857612977612cac565b5b61298182612cdb565b9050602081019050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b60006129dc82612af6565b91506129e783612af6565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115612a1c57612a1b612c1f565b5b828201905092915050565b6000612a3282612af6565b9150612a3d83612af6565b925082612a4d57612a4c612c4e565b5b828204905092915050565b6000612a6382612af6565b9150612a6e83612af6565b925082821015612a8157612a80612c1f565b5b828203905092915050565b6000612a9782612ad6565b9050919050565b60008115159050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b83811015612b2d578082015181840152602081019050612b12565b83811115612b3c576000848401525b50505050565b60006002820490506001821680612b5a57607f821691505b60208210811415612b6e57612b6d612c7d565b5b50919050565b612b7d82612cdb565b810181811067ffffffffffffffff82111715612b9c57612b9b612cac565b5b80604052505050565b6000612bb082612af6565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415612be357612be2612c1f565b5b600182019050919050565b6000612bf982612af6565b9150612c0483612af6565b925082612c1457612c13612c4e565b5b828206905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008201527f63656976657220696d706c656d656e7465720000000000000000000000000000602082015250565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a207472616e736665722066726f6d20696e636f72726563742060008201527f6f776e6572000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000600082015250565b7f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f766520746f2063616c6c657200000000000000600082015250565b7f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b7f48797065486175733a20537570706c7920657868617573746564000000000000600082015250565b7f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760008201527f6e6572206e6f7220617070726f76656420666f7220616c6c0000000000000000602082015250565b7f4552433732313a2062616c616e636520717565727920666f7220746865207a6560008201527f726f206164647265737300000000000000000000000000000000000000000000602082015250565b7f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460008201527f656e7420746f6b656e0000000000000000000000000000000000000000000000602082015250565b7f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60008201527f6578697374656e7420746f6b656e000000000000000000000000000000000000602082015250565b7f4552433732313a206d696e7420746f20746865207a65726f2061646472657373600082015250565b7f45524337323155524953746f726167653a2055524920717565727920666f722060008201527f6e6f6e6578697374656e7420746f6b656e000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b7f2e6a736f6e000000000000000000000000000000000000000000000000000000600082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f4552433732314d657461646174613a2055524920717565727920666f72206e6f60008201527f6e6578697374656e7420746f6b656e0000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60008201527f776e6572206e6f7220617070726f766564000000000000000000000000000000602082015250565b61323d81612a8c565b811461324857600080fd5b50565b61325481612a9e565b811461325f57600080fd5b50565b61326b81612aaa565b811461327657600080fd5b50565b61328281612af6565b811461328d57600080fd5b5056fea2646970667358221220fd5f27e60182ac953c1ea93fa81fb8afcedf9798f92ac90c1d5f0e0ecd776d3b64736f6c63430008040033";

type HypeHausConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: HypeHausConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class HypeHaus__factory extends ContractFactory {
  constructor(...args: HypeHausConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "HypeHaus";
  }

  deploy(
    maxSupply_: BigNumberish,
    baseURI_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<HypeHaus> {
    return super.deploy(
      maxSupply_,
      baseURI_,
      overrides || {}
    ) as Promise<HypeHaus>;
  }
  getDeployTransaction(
    maxSupply_: BigNumberish,
    baseURI_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(maxSupply_, baseURI_, overrides || {});
  }
  attach(address: string): HypeHaus {
    return super.attach(address) as HypeHaus;
  }
  connect(signer: Signer): HypeHaus__factory {
    return super.connect(signer) as HypeHaus__factory;
  }
  static readonly contractName: "HypeHaus";
  public readonly contractName: "HypeHaus";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): HypeHausInterface {
    return new utils.Interface(_abi) as HypeHausInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): HypeHaus {
    return new Contract(address, _abi, signerOrProvider) as HypeHaus;
  }
}
