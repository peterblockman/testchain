package keeper_test

import (
	"context"
	"testing"

	keepertest "testchain/testutil/keeper"
	"testchain/x/testchain/keeper"
	"testchain/x/testchain/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

func setupMsgServer(t testing.TB) (types.MsgServer, context.Context) {
	k, ctx := keepertest.TestchainKeeper(t)
	return keeper.NewMsgServerImpl(*k), sdk.WrapSDKContext(ctx)
}
