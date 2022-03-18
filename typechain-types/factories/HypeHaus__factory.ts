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
    inputs: [],
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
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "mintHypeHausToAddress",
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
  "0x60a060405260006009553480156200001657600080fd5b50604051620039503803806200395083398181016040528101906200003c91906200032c565b6040518060400160405280600881526020017f48595045686175730000000000000000000000000000000000000000000000008152506040518060400160405280600481526020017f48595045000000000000000000000000000000000000000000000000000000008152508160009080519060200190620000c0929190620001f3565b508060019080519060200190620000d9929190620001f3565b505050620000fc620000f06200012560201b60201c565b6200012d60201b60201c565b816080818152505080600890805190602001906200011c929190620001f3565b5050506200051a565b600033905090565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b828054620002019062000425565b90600052602060002090601f01602090048101928262000225576000855562000271565b82601f106200024057805160ff191683800117855562000271565b8280016001018555821562000271579182015b828111156200027057825182559160200191906001019062000253565b5b50905062000280919062000284565b5090565b5b808211156200029f57600081600090555060010162000285565b5090565b6000620002ba620002b484620003af565b62000386565b905082815260208101848484011115620002d357600080fd5b620002e0848285620003ef565b509392505050565b600082601f830112620002fa57600080fd5b81516200030c848260208601620002a3565b91505092915050565b600081519050620003268162000500565b92915050565b600080604083850312156200034057600080fd5b6000620003508582860162000315565b925050602083015167ffffffffffffffff8111156200036e57600080fd5b6200037c85828601620002e8565b9150509250929050565b600062000392620003a5565b9050620003a082826200045b565b919050565b6000604051905090565b600067ffffffffffffffff821115620003cd57620003cc620004c0565b5b620003d882620004ef565b9050602081019050919050565b6000819050919050565b60005b838110156200040f578082015181840152602081019050620003f2565b838111156200041f576000848401525b50505050565b600060028204905060018216806200043e57607f821691505b6020821081141562000455576200045462000491565b5b50919050565b6200046682620004ef565b810181811067ffffffffffffffff82111715620004885762000487620004c0565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b6200050b81620003e5565b81146200051757600080fd5b50565b6080516134136200053d60003960008181610dc301526116f201526134136000f3fe60806040526004361061011f5760003560e01c806395d89b41116100a0578063c87b56dd11610064578063c87b56dd146103c6578063ca88aad614610403578063d5abeb0114610433578063e985e9c51461045e578063f2fde38b1461049b5761011f565b806395d89b4114610300578063a22cb4651461032b578063a2309ff814610354578063b88d4fde1461037f578063c7e8a91c146103a85761011f565b806342842e0e116100e757806342842e0e1461021b5780636352211e1461024457806370a0823114610281578063715018a6146102be5780638da5cb5b146102d55761011f565b806301ffc9a71461012457806306fdde0314610161578063081812fc1461018c578063095ea7b3146101c957806323b872dd146101f2575b600080fd5b34801561013057600080fd5b5061014b60048036038101906101469190612284565b6104c4565b604051610158919061275b565b60405180910390f35b34801561016d57600080fd5b506101766105a6565b6040516101839190612776565b60405180910390f35b34801561019857600080fd5b506101b360048036038101906101ae91906122d6565b610638565b6040516101c091906126f4565b60405180910390f35b3480156101d557600080fd5b506101f060048036038101906101eb9190612248565b6106bd565b005b3480156101fe57600080fd5b5061021960048036038101906102149190612142565b6107d5565b005b34801561022757600080fd5b50610242600480360381019061023d9190612142565b610835565b005b34801561025057600080fd5b5061026b600480360381019061026691906122d6565b610855565b60405161027891906126f4565b60405180910390f35b34801561028d57600080fd5b506102a860048036038101906102a391906120dd565b610907565b6040516102b59190612a18565b60405180910390f35b3480156102ca57600080fd5b506102d36109bf565b005b3480156102e157600080fd5b506102ea610a47565b6040516102f791906126f4565b60405180910390f35b34801561030c57600080fd5b50610315610a71565b6040516103229190612776565b60405180910390f35b34801561033757600080fd5b50610352600480360381019061034d919061220c565b610b03565b005b34801561036057600080fd5b50610369610b19565b6040516103769190612a18565b60405180910390f35b34801561038b57600080fd5b506103a660048036038101906103a19190612191565b610b23565b005b6103b0610b85565b6040516103bd9190612a18565b60405180910390f35b3480156103d257600080fd5b506103ed60048036038101906103e891906122d6565b610bdf565b6040516103fa9190612776565b60405180910390f35b61041d600480360381019061041891906120dd565b610d31565b60405161042a9190612a18565b60405180910390f35b34801561043f57600080fd5b50610448610dbf565b6040516104559190612a18565b60405180910390f35b34801561046a57600080fd5b5061048560048036038101906104809190612106565b610de7565b604051610492919061275b565b60405180910390f35b3480156104a757600080fd5b506104c260048036038101906104bd91906120dd565b610e7b565b005b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061058f57507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b8061059f575061059e82610f73565b5b9050919050565b6060600080546105b590612c66565b80601f01602080910402602001604051908101604052809291908181526020018280546105e190612c66565b801561062e5780601f106106035761010080835404028352916020019161062e565b820191906000526020600020905b81548152906001019060200180831161061157829003601f168201915b5050505050905090565b600061064382610fdd565b610682576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161067990612978565b60405180910390fd5b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60006106c882610855565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610739576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610730906129d8565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16610758611049565b73ffffffffffffffffffffffffffffffffffffffff161480610787575061078681610781611049565b610de7565b5b6107c6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107bd90612898565b60405180910390fd5b6107d08383611051565b505050565b6107e66107e0611049565b8261110a565b610825576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161081c906129f8565b60405180910390fd5b6108308383836111e8565b505050565b61085083838360405180602001604052806000815250610b23565b505050565b6000806002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156108fe576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108f5906128d8565b60405180910390fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610978576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161096f906128b8565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6109c7611049565b73ffffffffffffffffffffffffffffffffffffffff166109e5610a47565b73ffffffffffffffffffffffffffffffffffffffff1614610a3b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a3290612998565b60405180910390fd5b610a45600061144f565b565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b606060018054610a8090612c66565b80601f0160208091040260200160405190810160405280929190818152602001828054610aac90612c66565b8015610af95780601f10610ace57610100808354040283529160200191610af9565b820191906000526020600020905b815481529060010190602001808311610adc57829003601f168201915b5050505050905090565b610b15610b0e611049565b8383611515565b5050565b6000600954905090565b610b34610b2e611049565b8361110a565b610b73576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b6a906129f8565b60405180910390fd5b610b7f84848484611682565b50505050565b6000610b8f6116de565b341015610bd1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bc890612918565b60405180910390fd5b610bda336116ee565b905090565b6060610bea82610fdd565b610c29576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c2090612958565b60405180910390fd5b6000600660008481526020019081526020016000208054610c4990612c66565b80601f0160208091040260200160405190810160405280929190818152602001828054610c7590612c66565b8015610cc25780601f10610c9757610100808354040283529160200191610cc2565b820191906000526020600020905b815481529060010190602001808311610ca557829003601f168201915b505050505090506000610cd36117f8565b9050600081511415610ce9578192505050610d2c565b600082511115610d1e578082604051602001610d069291906126ae565b60405160208183030381529060405292505050610d2c565b610d278461188a565b925050505b919050565b6000610d3b611049565b73ffffffffffffffffffffffffffffffffffffffff16610d59610a47565b73ffffffffffffffffffffffffffffffffffffffff1614610daf576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610da690612998565b60405180910390fd5b610db8826116ee565b9050919050565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b610e83611049565b73ffffffffffffffffffffffffffffffffffffffff16610ea1610a47565b73ffffffffffffffffffffffffffffffffffffffff1614610ef7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610eee90612998565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610f67576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f5e906127b8565b60405180910390fd5b610f708161144f565b50565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60008073ffffffffffffffffffffffffffffffffffffffff166002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b600033905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff166110c483610855565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600061111582610fdd565b611154576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161114b90612858565b60405180910390fd5b600061115f83610855565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614806111ce57508373ffffffffffffffffffffffffffffffffffffffff166111b684610638565b73ffffffffffffffffffffffffffffffffffffffff16145b806111df57506111de8185610de7565b5b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff1661120882610855565b73ffffffffffffffffffffffffffffffffffffffff161461125e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611255906127d8565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156112ce576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112c590612818565b60405180910390fd5b6112d9838383611931565b6112e4600082611051565b6001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546113349190612b7c565b925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461138b9190612af5565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a461144a838383611936565b505050565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611584576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161157b90612838565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051611675919061275b565b60405180910390a3505050565b61168d8484846111e8565b6116998484848461193b565b6116d8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016116cf90612798565b60405180910390fd5b50505050565b600067011c37937e080000905090565b60007f000000000000000000000000000000000000000000000000000000000000000060095410611754576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161174b90612878565b60405180910390fd5b60006009549050600061176682611ad2565b60405160200161177691906126d2565b60405160208183030381529060405290506117918483611c7f565b61179b8282611c9d565b7f7ad028dc70b4caf36db7f088f3d5c5b96706597fcc46cf7afdcfdc18d168264f82856040516117cc929190612a33565b60405180910390a16001600960008282546117e79190612af5565b925050819055508192505050919050565b60606008805461180790612c66565b80601f016020809104026020016040519081016040528092919081815260200182805461183390612c66565b80156118805780601f1061185557610100808354040283529160200191611880565b820191906000526020600020905b81548152906001019060200180831161186357829003601f168201915b5050505050905090565b606061189582610fdd565b6118d4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016118cb906129b8565b60405180910390fd5b60006118de6117f8565b905060008151116118fe5760405180602001604052806000815250611929565b8061190884611ad2565b6040516020016119199291906126ae565b6040516020818303038152906040525b915050919050565b505050565b505050565b600061195c8473ffffffffffffffffffffffffffffffffffffffff16611d11565b15611ac5578373ffffffffffffffffffffffffffffffffffffffff1663150b7a02611985611049565b8786866040518563ffffffff1660e01b81526004016119a7949392919061270f565b602060405180830381600087803b1580156119c157600080fd5b505af19250505080156119f257506040513d601f19601f820116820180604052508101906119ef91906122ad565b60015b611a75573d8060008114611a22576040519150601f19603f3d011682016040523d82523d6000602084013e611a27565b606091505b50600081511415611a6d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a6490612798565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614915050611aca565b600190505b949350505050565b60606000821415611b1a576040518060400160405280600181526020017f30000000000000000000000000000000000000000000000000000000000000008152509050611c7a565b600082905060005b60008214611b4c578080611b3590612cc9565b915050600a82611b459190612b4b565b9150611b22565b60008167ffffffffffffffff811115611b8e577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015611bc05781602001600182028036833780820191505090505b5090505b60008514611c7357600182611bd99190612b7c565b9150600a85611be89190612d12565b6030611bf49190612af5565b60f81b818381518110611c30577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600a85611c6c9190612b4b565b9450611bc4565b8093505050505b919050565b611c99828260405180602001604052806000815250611d34565b5050565b611ca682610fdd565b611ce5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611cdc906128f8565b60405180910390fd5b80600660008481526020019081526020016000209080519060200190611d0c929190611f69565b505050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b611d3e8383611d8f565b611d4b600084848461193b565b611d8a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611d8190612798565b60405180910390fd5b505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611dff576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611df690612938565b60405180910390fd5b611e0881610fdd565b15611e48576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611e3f906127f8565b60405180910390fd5b611e5460008383611931565b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611ea49190612af5565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4611f6560008383611936565b5050565b828054611f7590612c66565b90600052602060002090601f016020900481019282611f975760008555611fde565b82601f10611fb057805160ff1916838001178555611fde565b82800160010185558215611fde579182015b82811115611fdd578251825591602001919060010190611fc2565b5b509050611feb9190611fef565b5090565b5b80821115612008576000816000905550600101611ff0565b5090565b600061201f61201a84612a81565b612a5c565b90508281526020810184848401111561203757600080fd5b612042848285612c24565b509392505050565b60008135905061205981613381565b92915050565b60008135905061206e81613398565b92915050565b600081359050612083816133af565b92915050565b600081519050612098816133af565b92915050565b600082601f8301126120af57600080fd5b81356120bf84826020860161200c565b91505092915050565b6000813590506120d7816133c6565b92915050565b6000602082840312156120ef57600080fd5b60006120fd8482850161204a565b91505092915050565b6000806040838503121561211957600080fd5b60006121278582860161204a565b92505060206121388582860161204a565b9150509250929050565b60008060006060848603121561215757600080fd5b60006121658682870161204a565b93505060206121768682870161204a565b9250506040612187868287016120c8565b9150509250925092565b600080600080608085870312156121a757600080fd5b60006121b58782880161204a565b94505060206121c68782880161204a565b93505060406121d7878288016120c8565b925050606085013567ffffffffffffffff8111156121f457600080fd5b6122008782880161209e565b91505092959194509250565b6000806040838503121561221f57600080fd5b600061222d8582860161204a565b925050602061223e8582860161205f565b9150509250929050565b6000806040838503121561225b57600080fd5b60006122698582860161204a565b925050602061227a858286016120c8565b9150509250929050565b60006020828403121561229657600080fd5b60006122a484828501612074565b91505092915050565b6000602082840312156122bf57600080fd5b60006122cd84828501612089565b91505092915050565b6000602082840312156122e857600080fd5b60006122f6848285016120c8565b91505092915050565b61230881612bb0565b82525050565b61231781612bc2565b82525050565b600061232882612ab2565b6123328185612ac8565b9350612342818560208601612c33565b61234b81612dff565b840191505092915050565b600061236182612abd565b61236b8185612ad9565b935061237b818560208601612c33565b61238481612dff565b840191505092915050565b600061239a82612abd565b6123a48185612aea565b93506123b4818560208601612c33565b80840191505092915050565b60006123cd603283612ad9565b91506123d882612e10565b604082019050919050565b60006123f0602683612ad9565b91506123fb82612e5f565b604082019050919050565b6000612413602583612ad9565b915061241e82612eae565b604082019050919050565b6000612436601c83612ad9565b915061244182612efd565b602082019050919050565b6000612459602483612ad9565b915061246482612f26565b604082019050919050565b600061247c601983612ad9565b915061248782612f75565b602082019050919050565b600061249f602c83612ad9565b91506124aa82612f9e565b604082019050919050565b60006124c2601a83612ad9565b91506124cd82612fed565b602082019050919050565b60006124e5603883612ad9565b91506124f082613016565b604082019050919050565b6000612508602a83612ad9565b915061251382613065565b604082019050919050565b600061252b602983612ad9565b9150612536826130b4565b604082019050919050565b600061254e602e83612ad9565b915061255982613103565b604082019050919050565b6000612571601883612ad9565b915061257c82613152565b602082019050919050565b6000612594602083612ad9565b915061259f8261317b565b602082019050919050565b60006125b7603183612ad9565b91506125c2826131a4565b604082019050919050565b60006125da602c83612ad9565b91506125e5826131f3565b604082019050919050565b60006125fd600583612aea565b915061260882613242565b600582019050919050565b6000612620602083612ad9565b915061262b8261326b565b602082019050919050565b6000612643602f83612ad9565b915061264e82613294565b604082019050919050565b6000612666602183612ad9565b9150612671826132e3565b604082019050919050565b6000612689603183612ad9565b915061269482613332565b604082019050919050565b6126a881612c1a565b82525050565b60006126ba828561238f565b91506126c6828461238f565b91508190509392505050565b60006126de828461238f565b91506126e9826125f0565b915081905092915050565b600060208201905061270960008301846122ff565b92915050565b600060808201905061272460008301876122ff565b61273160208301866122ff565b61273e604083018561269f565b8181036060830152612750818461231d565b905095945050505050565b6000602082019050612770600083018461230e565b92915050565b600060208201905081810360008301526127908184612356565b905092915050565b600060208201905081810360008301526127b1816123c0565b9050919050565b600060208201905081810360008301526127d1816123e3565b9050919050565b600060208201905081810360008301526127f181612406565b9050919050565b6000602082019050818103600083015261281181612429565b9050919050565b600060208201905081810360008301526128318161244c565b9050919050565b600060208201905081810360008301526128518161246f565b9050919050565b6000602082019050818103600083015261287181612492565b9050919050565b60006020820190508181036000830152612891816124b5565b9050919050565b600060208201905081810360008301526128b1816124d8565b9050919050565b600060208201905081810360008301526128d1816124fb565b9050919050565b600060208201905081810360008301526128f18161251e565b9050919050565b6000602082019050818103600083015261291181612541565b9050919050565b6000602082019050818103600083015261293181612564565b9050919050565b6000602082019050818103600083015261295181612587565b9050919050565b60006020820190508181036000830152612971816125aa565b9050919050565b60006020820190508181036000830152612991816125cd565b9050919050565b600060208201905081810360008301526129b181612613565b9050919050565b600060208201905081810360008301526129d181612636565b9050919050565b600060208201905081810360008301526129f181612659565b9050919050565b60006020820190508181036000830152612a118161267c565b9050919050565b6000602082019050612a2d600083018461269f565b92915050565b6000604082019050612a48600083018561269f565b612a5560208301846122ff565b9392505050565b6000612a66612a77565b9050612a728282612c98565b919050565b6000604051905090565b600067ffffffffffffffff821115612a9c57612a9b612dd0565b5b612aa582612dff565b9050602081019050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b6000612b0082612c1a565b9150612b0b83612c1a565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115612b4057612b3f612d43565b5b828201905092915050565b6000612b5682612c1a565b9150612b6183612c1a565b925082612b7157612b70612d72565b5b828204905092915050565b6000612b8782612c1a565b9150612b9283612c1a565b925082821015612ba557612ba4612d43565b5b828203905092915050565b6000612bbb82612bfa565b9050919050565b60008115159050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b83811015612c51578082015181840152602081019050612c36565b83811115612c60576000848401525b50505050565b60006002820490506001821680612c7e57607f821691505b60208210811415612c9257612c91612da1565b5b50919050565b612ca182612dff565b810181811067ffffffffffffffff82111715612cc057612cbf612dd0565b5b80604052505050565b6000612cd482612c1a565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415612d0757612d06612d43565b5b600182019050919050565b6000612d1d82612c1a565b9150612d2883612c1a565b925082612d3857612d37612d72565b5b828206905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008201527f63656976657220696d706c656d656e7465720000000000000000000000000000602082015250565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a207472616e736665722066726f6d20696e636f72726563742060008201527f6f776e6572000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000600082015250565b7f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f766520746f2063616c6c657200000000000000600082015250565b7f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b7f48797065486175733a20537570706c7920657868617573746564000000000000600082015250565b7f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760008201527f6e6572206e6f7220617070726f76656420666f7220616c6c0000000000000000602082015250565b7f4552433732313a2062616c616e636520717565727920666f7220746865207a6560008201527f726f206164647265737300000000000000000000000000000000000000000000602082015250565b7f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460008201527f656e7420746f6b656e0000000000000000000000000000000000000000000000602082015250565b7f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60008201527f6578697374656e7420746f6b656e000000000000000000000000000000000000602082015250565b7f48797065486175733a204e6f7420656e6f756768204554480000000000000000600082015250565b7f4552433732313a206d696e7420746f20746865207a65726f2061646472657373600082015250565b7f45524337323155524953746f726167653a2055524920717565727920666f722060008201527f6e6f6e6578697374656e7420746f6b656e000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b7f2e6a736f6e000000000000000000000000000000000000000000000000000000600082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f4552433732314d657461646174613a2055524920717565727920666f72206e6f60008201527f6e6578697374656e7420746f6b656e0000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60008201527f776e6572206e6f7220617070726f766564000000000000000000000000000000602082015250565b61338a81612bb0565b811461339557600080fd5b50565b6133a181612bc2565b81146133ac57600080fd5b50565b6133b881612bce565b81146133c357600080fd5b50565b6133cf81612c1a565b81146133da57600080fd5b5056fea2646970667358221220e0340fc16b44bc077e27fcece2705ca9492a4a61ddd58793ae4bf49e8c299c0d64736f6c63430008040033";

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
