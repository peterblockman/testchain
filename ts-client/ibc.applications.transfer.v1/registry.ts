import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryDenomHashResponse } from "./types/ibc/applications/transfer/v1/query";
import { QueryEscrowAddressResponse } from "./types/ibc/applications/transfer/v1/query";
import { TransferAuthorization } from "./types/ibc/applications/transfer/v1/authz";
import { QueryParamsResponse } from "./types/ibc/applications/transfer/v1/query";
import { QueryDenomsRequest } from "./types/ibc/applications/transfer/v1/query";
import { QueryDenomsResponse } from "./types/ibc/applications/transfer/v1/query";
import { MsgTransferResponse } from "./types/ibc/applications/transfer/v1/tx";
import { MsgUpdateParamsResponse } from "./types/ibc/applications/transfer/v1/tx";
import { QueryDenomHashRequest } from "./types/ibc/applications/transfer/v1/query";
import { QueryTotalEscrowForDenomRequest } from "./types/ibc/applications/transfer/v1/query";
import { QueryTotalEscrowForDenomResponse } from "./types/ibc/applications/transfer/v1/query";
import { Token } from "./types/ibc/applications/transfer/v1/token";
import { GenesisState } from "./types/ibc/applications/transfer/v1/genesis";
import { QueryDenomResponse } from "./types/ibc/applications/transfer/v1/query";
import { MsgTransfer } from "./types/ibc/applications/transfer/v1/tx";
import { Denom } from "./types/ibc/applications/transfer/v1/token";
import { Hop } from "./types/ibc/applications/transfer/v1/token";
import { Allocation } from "./types/ibc/applications/transfer/v1/authz";
import { QueryParamsRequest } from "./types/ibc/applications/transfer/v1/query";
import { QueryDenomRequest } from "./types/ibc/applications/transfer/v1/query";
import { FungibleTokenPacketData } from "./types/ibc/applications/transfer/v1/packet";
import { QueryEscrowAddressRequest } from "./types/ibc/applications/transfer/v1/query";
import { Params } from "./types/ibc/applications/transfer/v1/transfer";
import { MsgUpdateParams } from "./types/ibc/applications/transfer/v1/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/ibc.applications.transfer.v1.QueryDenomHashResponse", QueryDenomHashResponse],
    ["/ibc.applications.transfer.v1.QueryEscrowAddressResponse", QueryEscrowAddressResponse],
    ["/ibc.applications.transfer.v1.TransferAuthorization", TransferAuthorization],
    ["/ibc.applications.transfer.v1.QueryParamsResponse", QueryParamsResponse],
    ["/ibc.applications.transfer.v1.QueryDenomsRequest", QueryDenomsRequest],
    ["/ibc.applications.transfer.v1.QueryDenomsResponse", QueryDenomsResponse],
    ["/ibc.applications.transfer.v1.MsgTransferResponse", MsgTransferResponse],
    ["/ibc.applications.transfer.v1.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/ibc.applications.transfer.v1.QueryDenomHashRequest", QueryDenomHashRequest],
    ["/ibc.applications.transfer.v1.QueryTotalEscrowForDenomRequest", QueryTotalEscrowForDenomRequest],
    ["/ibc.applications.transfer.v1.QueryTotalEscrowForDenomResponse", QueryTotalEscrowForDenomResponse],
    ["/ibc.applications.transfer.v1.Token", Token],
    ["/ibc.applications.transfer.v1.GenesisState", GenesisState],
    ["/ibc.applications.transfer.v1.QueryDenomResponse", QueryDenomResponse],
    ["/ibc.applications.transfer.v1.MsgTransfer", MsgTransfer],
    ["/ibc.applications.transfer.v1.Denom", Denom],
    ["/ibc.applications.transfer.v1.Hop", Hop],
    ["/ibc.applications.transfer.v1.Allocation", Allocation],
    ["/ibc.applications.transfer.v1.QueryParamsRequest", QueryParamsRequest],
    ["/ibc.applications.transfer.v1.QueryDenomRequest", QueryDenomRequest],
    ["/ibc.applications.transfer.v1.FungibleTokenPacketData", FungibleTokenPacketData],
    ["/ibc.applications.transfer.v1.QueryEscrowAddressRequest", QueryEscrowAddressRequest],
    ["/ibc.applications.transfer.v1.Params", Params],
    ["/ibc.applications.transfer.v1.MsgUpdateParams", MsgUpdateParams],
    
];

export { msgTypes }